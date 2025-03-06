'use client';
import { api } from '~/trpc/react';

export const useCancelBooking = (bookingId: string, userId: string) => {
  const utils = api.useUtils();
  const cancelBookingMutation = api.booking.cancel.useMutation({
    onMutate: async () => {
      const prevGlobalBookings = utils.booking.getAll.getData();
      const prevUserBookings = utils.booking.getForUser.getData({ userId });
      await Promise.all([
        await utils.booking.getAll.cancel(),
        await utils.booking.getForUser.cancel(),
      ]);
      console.log(prevGlobalBookings, prevUserBookings);
      if (prevGlobalBookings) {
        utils.booking.getAll.setData(
          undefined,
          prevGlobalBookings.map((b) => {
            if (b.booking.id == bookingId) {
              return {
                ...b,
                booking: {
                  ...b.booking,
                  isCancel: true,
                },
              };
            }
            return b;
          }),
        );
      }
      if (prevUserBookings) {
        utils.booking.getForUser.setData(
          { userId },
          prevUserBookings.map((b) => {
            if (b.booking.id == bookingId) {
              return { ...b, booking: { ...b.booking, isCancel: true } };
            }
            return b;
          }),
        );
      }
      return { prevGlobalBookings, prevUserBookings };
    },
    onError: (err, _, ctx) => {
      console.error(err);
      if (ctx?.prevUserBookings) {
        utils.booking.getForUser.setData({ userId }, ctx.prevUserBookings);
      }
      if (ctx?.prevGlobalBookings) {
        utils.booking.getAll.setData(undefined, ctx.prevGlobalBookings);
      }
    },
  });

  const cancel = async () => {
    const data = utils.booking.getForUser.getData({ userId });
    console.log(data);
    cancelBookingMutation.mutate({ bookingId });
  };

  return cancel;
};
