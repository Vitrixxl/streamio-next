import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { device } from '~/server/db/schema';
export const createDeviceSchema = createInsertSchema(device).omit({
  id: true,
  createdAt: true,
});
export const updateDeviceSchema = createSelectSchema(device).omit({
  createdAt: true,
});
