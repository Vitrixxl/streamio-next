import { DialogTitle } from '@radix-ui/react-dialog';
import { LucideTrash } from 'lucide-react';
import React from 'react';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from '~/components/ui/dialog';
import { api } from '~/trpc/react';

export const DeleteDeviceDialog = ({ deviceId }: { deviceId: string }) => {
  const utils = api.useUtils();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const deleteDeviceMutation = api.device.delete.useMutation({
    onMutate: async ({ deviceId }) => {
      const prevData = utils.device.getAll.getData();
      await utils.device.getAll.cancel();
      prevData &&
        utils.device.getAll.setData(
          undefined,
          prevData.filter((d) => d.id != deviceId),
        );
      setIsOpen(false);
      return { prevData };
    },
    onError: (err, _, ctx) => {
      console.error(err);
      if (!ctx?.prevData) return;
      utils.device.getAll.setData(undefined, ctx.prevData);
    },
    onSettled: () => {
      utils.device.getAll.invalidate();
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={'destructive'} size='icon'>
          <LucideTrash />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Etes vous sur de vouloir supprimer cet appareil
          </DialogTitle>
          <DialogDescription>
            Attention cette action est irréversible
          </DialogDescription>
        </DialogHeader>
        <div className='flex gap-2 ml-auto'>
          <Button variant='ghost' onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
          <Button onClick={() => deleteDeviceMutation.mutate({ deviceId })}>
            Confirmer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
