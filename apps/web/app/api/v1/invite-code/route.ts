import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getCurrentUser } from '@/lib/api/user';

/*
    Get Today's Invite Code (Admin only)
    GET /api/v1/invite-code
*/
export async function GET(req: Request) {
  // Check if user is authenticated
  const { data: user, error: userError } = await getCurrentUser('route');

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Create Supabase client with service role for admin operations
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
    .select('code, valid_date, created_at')
    .eq('valid_date', today)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch invite code' }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

/*
    Refresh Today's Invite Code (Admin only)
    POST /api/v1/invite-code
*/
export async function POST(req: Request) {
  // Check if user is authenticated
  const { data: user, error: userError } = await getCurrentUser('route');

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

  // Call the function to generate new invite code
  const { error } = await supabase.rpc('generate_daily_invite_code');

  if (error) {
    return NextResponse.json({ error: error.message || 'Failed to generate invite code' }, { status: 500 });
  }

  // Get the newly generated invite code
  const today = new Date().toISOString().slice(0, 10);
  const { data: newCode, error: fetchError } = await supabase
    .from('invite_codes')
    .select('code, valid_date, created_at')
    .eq('valid_date', today)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: 'Failed to fetch new invite code' }, { status: 500 });
  }

  return NextResponse.json(newCode, { status: 200 });
}

