'use client';
import { LucideEdit, LucidePlusCircle, LucideTrash } from 'lucide-react';
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
import { DeviceType } from '~/server/db/schema';
import { api } from '~/trpc/react';

export const EditDeviceDialog = (device: DeviceType) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const utils = api.useUtils();
  const editDeviceMutation = api.device.update.useMutation({
    onMutate: async (values) => {
      const prevData = utils.device.getAll.getData();

      await utils.device.getAll.cancel();
      utils.device.getAll.setData(
        undefined,
        prevData
          ? prevData.map((d) => {
            if (d.id != device.id) return d;
            return values;
          })
          : [values],
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
    editDeviceMutation.mutate({ ...data, id: device.id });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='' variant='ghost' size='icon'>
          <LucideEdit />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajoutez un nouvel appareil</DialogTitle>
        </DialogHeader>
        <DeviceForm onSubmit={onSubmit} defaultValues={device} />
      </DialogContent>
    </Dialog>
  );
};
