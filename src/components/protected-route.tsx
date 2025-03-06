import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '~/lib/auth/server/auth';

export async function ProtectedRoute(
  { children }: { children: React.ReactNode },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect('/');
  return children;
}

export async function SudoRoute(
  { children }: { children: React.ReactNode },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user.isAdmin) redirect('/');
  return <>{children}</>;
}
