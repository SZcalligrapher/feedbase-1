'use client';

import Link from 'next/link';
import { DASH_DOMAIN } from '@/lib/constants';

export default function AuthModal({
  projectSlug,
  children,
  disabled,
}: {
  projectSlug: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  // If disabled is true, user is logged in or action is allowed, show children directly
  if (disabled === true) {
    return <>{children}</>;
  }

  // If disabled is false or undefined, user needs to login, redirect to signup page instead of showing modal
  return (
    <Link href={`${DASH_DOMAIN}/signup`} className='contents'>
      {children}
    </Link>
  );
}
