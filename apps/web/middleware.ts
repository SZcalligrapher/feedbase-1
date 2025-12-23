import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { PostgrestError } from '@supabase/supabase-js';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     * 5. /auth/callback (Supabase Auth callback)
     */
    '/((?!api/|auth/callback|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};

export default async function middleware(req: NextRequest) {
  // Create a mutable response object that will be used to store cookies
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Set cookie on the request for immediate access
          req.cookies.set({
            name,
            value,
            ...options,
          });
          // Set cookie on the response to persist it
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          // Remove cookie from request
          req.cookies.set({
            name,
            value: '',
            ...options,
          });
          // Remove cookie from response
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  const session = await supabase.auth.getSession();

  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = req.headers
    .get('host')!
    .replace('.localhost:3000', `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = url.pathname;

  // Get root domain
  const rootDomain = hostname.includes('localhost')
    ? hostname.split('.').slice(-1)[0]
    : hostname.split('.').length >= 2
    ? `${hostname.split('.').slice(-2).join('.')}`
    : null;

  // If the request is for a custom domain, rewrite to project paths
  if (
    rootDomain !== process.env.NEXT_PUBLIC_ROOT_DOMAIN ||
    process.env.CUSTOM_DOMAIN_WHITELIST?.split(',').includes(hostname)
  ) {
    // Retrieve the project from the database
    const { data, error } = (await supabase
      .from('project_configs')
      .select('project:project_id (slug)')
      .eq('custom_domain', hostname)
      .eq('custom_domain_verified', true)
      .single()) as { data: { project: { slug: string } } | null; error: PostgrestError | null };

    // If the project doesn't exist, return 404
    if (error || !data) {
      return NextResponse.next();
    }

    // If the project exists, rewrite the request to the project's folder
    const rewriteUrl = new URL(
      `/${data?.project?.slug}${path}${
        req.nextUrl.searchParams ? `?${req.nextUrl.searchParams.toString()}` : ''
      }`,
      req.url
    );
    // Create rewrite response and copy cookies from our response object
    const rewriteResponse = NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: req.headers,
      },
    });
    // Copy cookies from response to rewriteResponse
    response.cookies.getAll().forEach((cookie) => {
      rewriteResponse.cookies.set(cookie);
    });
    rewriteResponse.headers.set('x-pathname', path);
    rewriteResponse.headers.set('x-project', data?.project?.slug);
    rewriteResponse.headers.set('x-powered-by', 'Feedbase');
    return rewriteResponse;
  }

  // rewrites for dash pages
  if (
    hostname === `dash.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` ||
    (process.env.SUBDOMAIN_HOSTING === 'true' &&
      hostname === `${process.env.DASHBOARD_SUBDOMAIN}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
  ) {
    // protect all app pages with authentication except for /login, /signup and /invite/*
    if (!session.data.session && path !== '/login' && path !== '/signup' && !path.startsWith('/invite/')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // rewrite / to /dash
    const dashRewriteUrl = new URL(`/dash${path === '/' ? '' : path}`, req.url);
    const dashRewriteResponse = NextResponse.rewrite(dashRewriteUrl, {
      request: {
        headers: req.headers,
      },
    });
    // Copy cookies from response to dashRewriteResponse
    response.cookies.getAll().forEach((cookie) => {
      dashRewriteResponse.cookies.set(cookie);
    });
    dashRewriteResponse.headers.set('x-pathname', path);
    dashRewriteResponse.headers.set('x-project', path.split('/')[1]);
    return dashRewriteResponse;
  }

  // rewrite root application to `/home` folder
  if (hostname === 'localhost:3000' || hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
    const homeRewriteUrl = new URL(`/home${path === '/' ? '' : path}`, req.url);
    const homeRewriteResponse = NextResponse.rewrite(homeRewriteUrl, {
      request: {
        headers: req.headers,
      },
    });
    // Copy cookies from response to homeRewriteResponse
    response.cookies.getAll().forEach((cookie) => {
      homeRewriteResponse.cookies.set(cookie);
    });
    homeRewriteResponse.headers.set('x-pathname', path);
    homeRewriteResponse.headers.set('x-project', path.split('/')[1]);
    return homeRewriteResponse;
  }

  // rewrite /api to `/api` folder
  if (hostname === `api.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    const apiRewriteUrl = new URL(`/api${path}`, req.url);
    const apiRewriteResponse = NextResponse.rewrite(apiRewriteUrl, {
      request: {
        headers: req.headers,
      },
    });
    // Copy cookies from response to apiRewriteResponse
    response.cookies.getAll().forEach((cookie) => {
      apiRewriteResponse.cookies.set(cookie);
    });
    apiRewriteResponse.headers.set('x-pathname', path);
    apiRewriteResponse.headers.set('x-project', path.split('/')[1]);
    return apiRewriteResponse;
  }

  // rewrite everything else to `/[sub-domain]/[path] dynamic route
  const subdomainRewriteUrl = new URL(
    `/${hostname.split('.')[0]}${path}${
      req.nextUrl.searchParams ? `?${req.nextUrl.searchParams.toString()}` : ''
    }`,
    req.url
  );
  const subdomainRewriteResponse = NextResponse.rewrite(subdomainRewriteUrl, {
    request: {
      headers: req.headers,
    },
  });
  // Copy cookies from response to subdomainRewriteResponse
  response.cookies.getAll().forEach((cookie) => {
    subdomainRewriteResponse.cookies.set(cookie);
  });
  subdomainRewriteResponse.headers.set('x-pathname', path);
  subdomainRewriteResponse.headers.set('x-project', hostname.split('.')[0]);
  subdomainRewriteResponse.headers.set('x-powered-by', 'Feedbase');
  return subdomainRewriteResponse;
}
