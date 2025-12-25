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
          req.cookies.set({
            name,
            value,
            ...options,
          });
          NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          });
          NextResponse.next({
            request: {
              headers: req.headers,
            },
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
    return NextResponse.rewrite(
      new URL(
        `/${data?.project?.slug}${path}${
          req.nextUrl.searchParams ? `?${req.nextUrl.searchParams.toString()}` : ''
        }`,
        req.url
      ),
      {
        headers: {
          'x-pathname': path,
          'x-project': data?.project?.slug,
          'x-powered-by': 'Feedbase',
        },
      }
    );
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
    return NextResponse.rewrite(new URL(`/dash${path === '/' ? '' : path}`, req.url), {
      headers: {
        'x-pathname': path,
        'x-project': path.split('/')[1],
      },
    });
  }

  // rewrite root application to `/home` folder
  if (hostname === 'localhost:3000' || hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
    // Exclude /auth/callback from rewriting (it's handled directly by Next.js)
    if (path === '/auth/callback' || path.startsWith('/auth/callback')) {
      return NextResponse.next({
        request: {
          headers: req.headers,
        },
      });
    }
    
    // Check if path starts with a project slug (not /home, /dash, /api, etc.)
    const pathSegments = path.split('/').filter(Boolean);
    const firstSegment = pathSegments[0];
    
    // If path starts with known routes, rewrite to /home
    if (firstSegment === 'home' || firstSegment === 'dash' || firstSegment === 'api' || firstSegment === 'auth') {
      return NextResponse.rewrite(new URL(`/home${path === '/' ? '' : path}`, req.url), {
        headers: {
          'x-pathname': path,
          'x-project': path.split('/')[1],
        },
      });
    }
    
    // Otherwise, let it pass through to [project] dynamic route
    // The path will be like /achiva/feedback, which matches [project]/feedback
    // Extract project slug from path for header
    const projectSlug = pathSegments[0];
    const res = NextResponse.next({
      request: {
        headers: req.headers,
      },
    });
    res.headers.set('x-pathname', path);
    res.headers.set('x-project', projectSlug || '');
    return res;
  }

  // rewrite /api to `/api` folder
  if (hostname === `api.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    return NextResponse.rewrite(new URL(`/api${path}`, req.url), {
      headers: {
        'x-pathname': path,
        'x-project': path.split('/')[1],
      },
    });
  }

  // For other subdomains (like dash.inhau.co), handle them separately
  // But for project subdomains, we no longer support them - redirect to path-based URLs
  // This allows Vercel to handle routing without nameserver configuration
  return NextResponse.next({
    request: {
      headers: req.headers,
    },
  });
}
