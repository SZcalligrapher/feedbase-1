import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/*
    Verify Invite Code
    POST /api/v1/invite-code/verify
    {
        "code": "A9F3D2C8"
    }
*/
export async function POST(req: Request) {
  const { code } = (await req.json()) as { code: string };

  // Validate request body
  if (!code) {
    return NextResponse.json({ error: '邀请码不能为空' }, { status: 400 });
  }

  // Create Supabase client
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // Get today's date in Beijing timezone (YYYY-MM-DD format)
  // Convert to Beijing timezone to match the database function
  const beijingDate = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' })
  );
  const today = beijingDate.toISOString().slice(0, 10);

  // Query today's invite code
  const { data, error } = await supabase
    .from('invite_codes')
    .select('code')
    .eq('valid_date', today)
    .single();

  // Check if invite code exists and matches
  if (error || !data || data.code !== code.toUpperCase()) {
    return NextResponse.json({ error: '邀请码无效或已过期' }, { status: 400 });
  }

  return NextResponse.json({ valid: true }, { status: 200 });
}

