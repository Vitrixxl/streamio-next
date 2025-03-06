import { TRPCError } from '@trpc/server';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z, ZodError } from 'zod';
import { room, ROOM_TYPES } from '~/server/db/schema';

export const searchRoomSchema = z.object({
  search: z.string().optional().nullable(),
  roomType: z.array(z.enum(ROOM_TYPES)).optional().nullable(),
  maxPrice: z.number().optional().nullable(),
  date: z.date().optional().nullable(),
});
export type SearchRoomSchemaType = typeof searchRoomSchema._type;

export const getRoomDataSchema = z.object({
  id: z.string(),
  date: z.date().default(() => new Date()),
});

export const createRoomSchema = createSelectSchema(room);
export const createRoomSchemaClient = createRoomSchema.omit({
  id: true,
  img: true,
})
  .extend({
    image: z.instanceof(File, { message: '' }).refine((file) => {
      console.log(file);
      const isImg = file.type.startsWith('image/');
      console.log(isImg);
      if (!isImg) {
        throw new TRPCError({
          message: "This file isn't an image",
          code: 'PARSE_ERROR',
        });
      }
      return file;
    }),
  });
export const updateRoomSchema = createSelectSchema(room).omit({ img: true })
  .extend({
    image: z.instanceof(File, { message: '' }).refine((file) => {
      const isImg = file.type.startsWith('image/');
      if (!isImg) throw new Error('');
    }),
  });
