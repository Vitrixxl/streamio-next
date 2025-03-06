import { User } from 'better-auth';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

export const UserInfoDialog = ({ user }: { user: User }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='link' className='text-start px-0'>
          {user.name}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Information de {user.name}</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
