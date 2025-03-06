import { eq } from 'drizzle-orm';
import { z } from 'zod';
import {
  createDeviceSchema,
  updateDeviceSchema,
} from '~/server/api/schema/device';
import {
  createTRPCRouter,
  publicProcedure,
  sudoProcedure,
} from '~/server/api/trpc';
import { device } from '~/server/db/schema';

export const deviceRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx: { db } }) => {
    return await db.select().from(device);
  }),

  create: sudoProcedure.input(createDeviceSchema).mutation(
    async ({ ctx: { db }, input }) => {
      await db.insert(device).values(input);
    },
  ),

  update: sudoProcedure.input(updateDeviceSchema).mutation(
    async ({ ctx: { db }, input }) => {
      await db.update(device).set(input).where(eq(device.id, input.id));
    },
  ),

  delete: sudoProcedure.input(z.object({ deviceId: z.string() })).mutation(
    async ({ ctx: { db }, input: { deviceId } }) => {
      await db.delete(device).where(eq(device.id, deviceId));
    },
  ),
});
