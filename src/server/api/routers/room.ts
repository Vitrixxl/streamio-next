import { and, eq, inArray, like, lt } from 'drizzle-orm';
import { getRoomDataSchema, searchRoomSchema } from '~/server/api/schema/room';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { booking, room, TIME_SLOTS } from '~/server/db/schema';

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
      const [currentRoom] = await db.select().from(room).where(eq(room.id, id));
      if (!currentRoom) return;
      if (!date) {
        return {
          room: currentRoom,
          availability: TIME_SLOTS,
        };
      }
      const usedTimeSlot = await db.select().from(booking).where(
        eq(booking.date, date),
      ).then((data) => data.map((b) => b.slot));
      return {
        room: currentRoom,
        availability: TIME_SLOTS.filter((timeslot) =>
          !usedTimeSlot.includes(timeslot)
        ),
      };
    },
  ),
  // editRoom: publicProcedure.input().mutation(async (TIME_SLOTS) => {
  //   //
  // }),
});
