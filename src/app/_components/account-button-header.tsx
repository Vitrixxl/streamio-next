import { Button } from '~/components/ui/button';
import { auth } from '~/server/auth';

export const AccountButtonHeader = async () => {
  const session = await auth();

  if (!session) {
    return (
      <div className='flex gap-2'>
        <Button variant={'outline'}>
          S'inscrire
        </Button>
        <Button>
          Se connecter
        </Button>
      </div>
    );
  }
};
