'use client';
import { authClient } from '~/lib/auth/client/auth-client';
import Link from 'next/link';
import React from 'react';
import { Button } from '~/components/ui/button';
import { Session } from '~/lib/auth/server/auth';

export const AccountButtonHeader = (
  { session }: { session?: Session | null },
) => {
  const [user, setUser] = React.useState(session?.user || undefined);
  const { data } = authClient.useSession();

  React.useEffect(() => {
    if (data?.user) {
      setUser(data.user);
    }
  }, [data]);

  if (!user) {
    return (
      <div className='flex gap-2'>
        <Button variant={'outline'} asChild>
          <Link href='/auth/register'>
            S'inscrire
          </Link>
        </Button>
        <Button asChild>
          <Link href='/auth/login'>
            Se connecter
          </Link>
        </Button>
      </div>
    );
  }
  const { isAdmin } = user;
  return (
    <div className='flex gap-2'>
      {isAdmin && (
        <Button asChild variant='outline'>
          <Link href='/admin'>
            Administration
          </Link>
        </Button>
      )}
      <Button asChild>
        <Link href='/account'>
          Mon compte
        </Link>
      </Button>
    </div>
  );
};
