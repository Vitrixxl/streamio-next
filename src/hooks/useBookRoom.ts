import { bookingCheckoutSchema } from '~/server/api/schema/booking';
import { api } from '~/trpc/react';

export const useBookRoom = (id: string) => {
  const bookingMutation = api.booking.checkout.useMutation({
    onError: (err) => {
      console.error(err);
    },
    onSuccess: (data) => {
      if (!data || !data.url) return;
      window.location.href = data.url;
    },
  });
  const launchBookingProccess = async (
    data: Omit<typeof bookingCheckoutSchema._type, 'id'>,
  ) => {
    console.log(data);
    const { error } = bookingCheckoutSchema.safeParse({ ...data, id });
    console.log(error);
    await bookingMutation.mutateAsync({ ...data, id });
  };

  return launchBookingProccess;
};
