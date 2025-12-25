'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'sonner';
import { Button } from 'ui/components/ui/button';
import { Input } from 'ui/components/ui/input';
import { Label } from 'ui/components/ui/label';
import { Icons } from '@/components/shared/icons/icons-static';

export function UserAuthForm({
  authType,
  successRedirect,
  buttonsClassname,
}: {
  authType: 'sign-in' | 'sign-up';
  successRedirect?: string;
  buttonsClassname?: string;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [inviteCode, setInviteCode] = useState<string>('');
  // TODO: Figure out issue with cookieOptions setting and set at root level instead of individually like rn
  // {
  //   cookieOptions: {
  //     path: '/',
  //     domain: 'localhost',
  //     sameSite: 'lax',
  //     secure: false,
  //   }
  // }
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleMailSignIn(event: React.SyntheticEvent) {
    setIsLoading(true);

    event.preventDefault();

    if (!name && authType === 'sign-up') {
      toast.error('Please enter your name!');
      setIsLoading(false);
      return;
    } else if (!email) {
      toast.error('Please enter your email!');
      setIsLoading(false);
      return;
    }

    // Validate invite code for sign-up
    if (authType === 'sign-up') {
      if (!inviteCode) {
        toast.error('Please enter your invite code!');
        setIsLoading(false);
        return;
      }

      // Verify invite code
      try {
        const response = await fetch('/api/v1/invite-code/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: inviteCode }),
        });

        const data = await response.json();

        if (!response.ok || !data.valid) {
          toast.error(data.error || '邀请码无效或已过期');
          setIsLoading(false);
          return;
        }
      } catch (error) {
        toast.error('验证邀请码时出错，请稍后重试');
        setIsLoading(false);
        return;
      }
    }

    // Check if user exists
    const { data: user } = await supabase.from('profiles').select('*').eq('email', email).single();

    if (user && authType === 'sign-up') {
      toast.error('An account with this email address already exists.');
      setIsLoading(false);
      return;
    } else if (!user && authType === 'sign-in') {
      toast.error('No account found with this email address.');
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback?successRedirect=${
          successRedirect || location.origin
        }`,
        data: {
          full_name: name || user?.full_name,
        },
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Magic link has been sent to your email!');
    }

    setIsLoading(false);
  }

  return (
    <div className='grid gap-4'>
      <form onSubmit={handleMailSignIn}>
        <div className='grid gap-3'>
          <div className='gap- grid gap-2'>
            {authType === 'sign-up' && (
              <>
                <Label className='sr-only' htmlFor='name'>
                  Full Name
                </Label>
                <Input
                  id='name'
                  placeholder='Full Name'
                  type='name'
                  autoCapitalize='none'
                  autoComplete='name'
                  autoCorrect='off'
                  disabled={isLoading}
                  onChange={(event) => {
                    setName(event.currentTarget.value);
                  }}
                  className={buttonsClassname}
                />
                <Label className='sr-only' htmlFor='invite-code'>
                  Invite Code
                </Label>
                <Input
                  id='invite-code'
                  placeholder='Invite Code'
                  type='text'
                  autoCapitalize='characters'
                  autoComplete='off'
                  autoCorrect='off'
                  disabled={isLoading}
                  onChange={(event) => {
                    setInviteCode(event.currentTarget.value.toUpperCase());
                  }}
                  value={inviteCode}
                  className={buttonsClassname}
                />
              </>
            )}

            <Label className='sr-only' htmlFor='email'>
              Email
            </Label>
            <Input
              id='email'
              placeholder='name@example.com'
              type='email'
              autoCapitalize='none'
              autoComplete='email'
              autoCorrect='off'
              disabled={isLoading}
              onChange={(event) => {
                setEmail(event.currentTarget.value);
              }}
              className={buttonsClassname}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading ? <Icons.Spinner className='mr-2 h-4 w-4 animate-spin' /> : null}
            Continue with Email
          </Button>
        </div>
      </form>
    </div>
  );
}
