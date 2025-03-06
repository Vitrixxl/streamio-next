import dayjs from 'dayjs';

import {
  bookingCheckoutSchema,
  cancelBookingSchema,
} from '~/server/api/schema/booking';
import {
  createTRPCRouter,
  protectedProcedure,
  sudoProcedure,
} from '~/server/api/trpc';
import Stripe from 'stripe';
import { env } from '~/env';
import {
  booking,
  bookingDevice,
  BookingType,
  device,
  DeviceType,
  room,
  RoomType,
  user as userTable,
} from '~/server/db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { Session } from '~/lib/auth/server/auth';

const stripe = new Stripe(env.STRIPE_API_KEY);
export const bookingRouter = createTRPCRouter({
  checkout: protectedProcedure.input(bookingCheckoutSchema).mutation(
    async (
      {
        ctx: { db, session: { user } },
        input: { slot, date, guestCount, devices, name, id },
      },
    ) => {
      console.log('passed');
      const [currentRoom] = await db.select().from(room).where(eq(room.id, id));
      if (!currentRoom) return;
      const dbDevices = await db.select().from(device).where(
        inArray(device.id, devices.map((d) => d.deviceId)),
      );
      const devicesWithPrices = dbDevices.map((d) => {
        const curDeviceAmount = devices.find((de) => de.deviceId == d.id)
          ?.amount;
        if (!curDeviceAmount) return undefined;
        return {
          id: d.id,
          name: d.name,
          price: d.price,
          amout: curDeviceAmount,
          totalPrice: d.price * curDeviceAmount,
        };
      }).filter((d) => d != undefined);

      const session = await stripe.checkout.sessions.create({
        //@ts-ignore
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: `${name} le ${
                  dayjs(date).format('DD/MM/YYYY')
                } pendant ${slot}`,
              },
              unit_amount: currentRoom.price * 100,
            },
            quantity: 1,
          },
          ...devicesWithPrices.map((d) => ({
            price_data: {
              currency: 'eur',
              product_data: {
                name: d.name,
              },
              unit_amount: (d.price * 100).toFixed(0),
            },
            quantity: d.amout,
          })),
        ],
        metadata: {
          roomId: id,
          slot,
          date,
          userId: user.id,
          devices: JSON.stringify(devices),
          price: currentRoom.price +
            devicesWithPrices.reduce(
              (acc, device) => acc + device.totalPrice,
              0,
            ),
          guestCount,
        },
        mode: 'payment',
        success_url:
          `http://localhost:3000/api/checkout/callback/booking?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:3000/room/${id}`,
      });
      return session;
    },
  ),
  getForUser: protectedProcedure.input(z.object({ userId: z.string() })).query(
    async ({ ctx: { session: { user }, db }, input: { userId } }) => {
      if (user.id != userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      const bookings = await db.select().from(booking)
        .leftJoin(
          room,
          eq(room.id, booking.roomId),
        ).leftJoin(bookingDevice, eq(booking.id, bookingDevice.bookingId))
        .leftJoin(
          device,
          eq(bookingDevice.deviceId, device.id),
        ).where(
          eq(booking.userId, user.id),
        ).then((data) => {
          const rows: {
            booking: BookingType;
            room: RoomType;
            devices?: DeviceType[];
          }[] = [];

          data.forEach(({ booking, room, device, booking_device }) => {
            const existingBooking = rows.find((r) =>
              r.booking.id == booking.id
            );
            if (!existingBooking) {
              if (!room) return;
              if (device && booking_device) {
                rows.push({
                  booking,
                  room: room,
                  devices: [{ ...device, amount: booking_device.amount }],
                });
              } else rows.push({ booking, room: room });
            } else {
              if (existingBooking.devices && device && booking_device) {
                existingBooking.devices.push({
                  ...device,
                  amount: booking_device.amount,
                });
              }
            }
          });
          console.log(rows);
          return rows;
        });
      return { bookings };
    },
  ),
  getAll: sudoProcedure.query(
    async ({ ctx: { db } }) => {
      return await db.select().from(booking)
        .leftJoin(
          room,
          eq(room.id, booking.roomId),
        ).leftJoin(bookingDevice, eq(booking.id, bookingDevice.bookingId))
        .leftJoin(
          device,
          eq(bookingDevice.deviceId, device.id),
        ).leftJoin(userTable, eq(userTable.id, booking.userId)).then((data) => {
          const rows: {
            booking: BookingType;
            room: RoomType;
            devices?: DeviceType[];
            user: Session['user'];
          }[] = [];

          data.forEach(({ booking, room, device, booking_device, user }) => {
            const existingBooking = rows.find((r) =>
              r.booking.id == booking.id
            );
            if (!existingBooking) {
              if (!room || !user) return;
              if (device && booking_device) {
                rows.push({
                  user,
                  booking,
                  room: room,
                  devices: [{ ...device, amount: booking_device.amount }],
                });
              } else rows.push({ user, booking, room: room });
            } else {
              if (existingBooking.devices && device && booking_device) {
                existingBooking.devices.push({
                  ...device,
                  amount: booking_device.amount,
                });
              }
            }
          });
          console.log(rows);
          return rows;
        });
    },
  ),
  cancel: protectedProcedure.input(cancelBookingSchema).mutation(
    async ({ ctx: { db, session: { user } }, input: { bookingId } }) => {
      try {
        const [currentBooking] = await db.select().from(booking).where(
          and(eq(booking.id, bookingId), eq(booking.userId, user.id)),
        );
        if (
          !currentBooking ||
          (!(currentBooking.userId == user.id) && !user.isAdmin)
        ) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'You do not have this booking',
          });
        }
        await stripe.refunds.create({
          payment_intent: currentBooking.paymentIntent,
        });
        await db.update(booking).set({ isCancel: true }).where(
          eq(booking.id, bookingId),
        );
      } catch (err) {
        console.error(err);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong when processing the cancelation',
          cause: (err as Error).cause,
        });
      }
    },
  ),
});
