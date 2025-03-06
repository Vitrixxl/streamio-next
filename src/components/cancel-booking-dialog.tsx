'use client';
import { DialogDescription } from '@radix-ui/react-dialog';
import { LucideTrash } from 'lucide-react';
import React from 'react';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { useCancelBooking } from '~/hooks/useCancelBooking';

export const CancelBookingDialog = (
  { bookingId, userId, disabled }: {
    bookingId: string;
    userId: string;
    disabled: boolean;
  },
) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const cancel = useCancelBooking(bookingId, userId);
  const handleConfirm = () => {
    setIsOpen(false);
    cancel();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled}>
          Annuler
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Annuler ma reservation</DialogTitle>
          <DialogDescription>
            Cette action est irréverssible vous allez être remboursé entierement
          </DialogDescription>
        </DialogHeader>
        <div className='ml-auto flex gap-2'>
          <Button variant='outline' onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleConfirm}>
            Confirmer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
