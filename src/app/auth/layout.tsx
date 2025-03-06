import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Button } from '~/components/ui/button';
import { auth } from '~/lib/auth/server/auth';

export default async function AuthLayout(
  { children }: { children: React.ReactNode },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  console.log(session);

  if (session) redirect('/');
  return (
    <div className='h-full w-full inset-0 grid place-content-center'>
      <div className='p-6 rounded-2xl border flex flex-col gap-4'>
        {children}
        <div className='h-px w-2/3 mx-auto bg-border' />
        <Button variant={'outline'}>Se connecter avec google</Button>
      </div>
    </div>
  );
}
