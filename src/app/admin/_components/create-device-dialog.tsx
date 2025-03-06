'use client';
import { LucidePlusCircle } from 'lucide-react';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { DeviceForm } from '~/app/admin/_components/device-form';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { createDeviceSchema } from '~/server/api/schema/device';
import { api } from '~/trpc/react';

export const CreateDeviceDialog = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const utils = api.useUtils();
  const createDeviceMutation = api.device.create.useMutation({
    onMutate: async (values) => {
      const prevData = utils.device.getAll.getData();

      const id = uuid();
      await utils.device.getAll.cancel();
      utils.device.getAll.setData(
        undefined,
        prevData ? [...prevData, { ...values, id }] : [{ ...values, id }],
      );
      setIsOpen(false);
      return { prevData };
    },
    onError: async (err, _, ctx) => {
      console.error(err);
      if (!ctx?.prevData) return;
      utils.device.getAll.setData(undefined, ctx.prevData);
    },
    onSettled: () => {
      utils.device.getAll.invalidate();
    },
  });

  const onSubmit = (data: typeof createDeviceSchema._type) => {
    createDeviceMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='w-fit'>
          Ajouter un appareil <LucidePlusCircle />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajoutez un nouvel appareil</DialogTitle>
        </DialogHeader>
        <DeviceForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};
