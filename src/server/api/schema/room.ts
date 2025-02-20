import { z } from 'zod';
import { ROOM_TYPES } from '~/server/db/schema';

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
