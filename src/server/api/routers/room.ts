import { and, eq, inArray, like, lt } from 'drizzle-orm';
import { z } from 'zod';
import {
  addRatingSchema,
  addRatingSchemaClient,
  createRoomSchema,
  getRoomDataSchema,
  searchRoomSchema,
  updateRoomSchema,
} from '~/server/api/schema/room';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  sudoProcedure,
} from '~/server/api/trpc';
import {
  booking,
  bookingDevice,
  device,
  room,
  roomRates,
  TIME_SLOTS,
  user,
} from '~/server/db/schema';

export const roomRouter = createTRPCRouter({
  search: publicProcedure.input(searchRoomSchema).query(
    async ({ ctx: { db }, input }) => {
      console.log(input.search);
      const result = await db.select().from(room).where(
        and(
          input.search ? like(room.name, `%${input.search}%`) : undefined,
          input.maxPrice ? lt(room.price, input.maxPrice) : undefined,
          input.roomType ? inArray(room.type, input.roomType) : undefined,
        ),
      );
      return result;
    },
  ),
  getRoomData: publicProcedure.input(getRoomDataSchema).query(
    async ({ ctx: { db }, input: { id, date } }) => {
      const [currentRoom] = await db.select().from(room).where(
        eq(room.id, id),
      );
      const everyDevices = await db.select().from(device);

      if (!currentRoom) return;
      if (!date) {
        return {
          room: currentRoom,
          availabilities: TIME_SLOTS,
          availableDivices: everyDevices,
        };
      }
      const usedTimeSlot = await db.select({ slot: booking.slot }).from(booking)
        .where(
          eq(booking.date, date),
        ).then((data) => data.map((d) => d.slot));

      const usedDivices = await db.select().from(bookingDevice).leftJoin(
        booking,
        eq(booking.id, bookingDevice.bookingId),
      ).where(
        eq(booking.date, date),
      ).leftJoin(device, eq(device.id, bookingDevice.deviceId));

      const availableDivices = everyDevices.map((device) => {
        const usedDivice = usedDivices.find((d) =>
          d.device && d.device.id == device.id
        );
        if (!usedDivice?.device || usedDivice.device.amount == device.amount) {
          return device;
        }
        return {
          ...device,
          amount: device.amount - usedDivice.device.amount,
        };
      });

      const ratings = await db.select().from(roomRates).where(
        eq(roomRates.roomId, id),
      );

      return {
        room: currentRoom,
        availabilities: TIME_SLOTS.filter((timeslot) =>
          !usedTimeSlot.includes(timeslot)
        ),
        availableDivices,
        ratings,
      };
    },
  ),

  addRating: protectedProcedure.input(addRatingSchema).mutation(
    async ({ ctx: { db, session: { user: u } }, input }) => {
      const canWrite = await db.select().from(booking).innerJoin(
        user,
        eq(booking.userId, u.id),
      ).innerJoin(room, eq(booking.roomId, input.roomId)).then((data) =>
        data.length > 0
      );
      if (!canWrite) {
        return {
          data: null,
          error: "Vous n'avez pas effectué de reservation dans cette salle",
        };
      }
      await db.insert(roomRates).values({ ...input, userId: u.id });
    },
  ),
  create: sudoProcedure.input(createRoomSchema).mutation(
    async ({ ctx: { db }, input: { ...roomData } }) => {
      await db.insert(room).values(roomData);
    },
  ),

  update: sudoProcedure.input(updateRoomSchema).mutation(
    async ({ ctx: { db }, input }) => {
      await db.update(room).set(input);
    },
  ),
  delete: sudoProcedure.input(z.object({ roomId: z.string() })).mutation(
    async ({ ctx: { db }, input: { roomId } }) => {
      await db.delete(room).where(eq(room.id, roomId));
    },
  ),
});
