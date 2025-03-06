import dayjs from 'dayjs';
import { warn } from 'console';
import { z } from 'zod';
import { TIME_SLOTS } from '~/server/db/schema';

export const bookingCheckoutSchema = z.object({
  name: z.string(),
  slot: z.enum(TIME_SLOTS),
  date: z.date(),

  guestCount: z.number(),
  devices: z.array(z.object({
    deviceId: z.string(),
    amount: z.number(),
  })),

  id: z.string(),
});

export const metadataCheckoutSchema = z.object({
  roomId: z.string(),
  slot: z.enum(TIME_SLOTS),
  date: z.string().transform((str, ctx) => {
    const date = dayjs(str).toDate();
    return date;
  }),
  userId: z.string(),
  devices: z.string().transform((str, ctx) => {
    try {
      const parsed = JSON.parse(str); // Convertir la chaîne JSON en objet JavaScript
      return z.array(z.object({
        deviceId: z.string(),
        amount: z.number(),
      })).parse(parsed);
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Le champ "devices" doit être une chaîne JSON valide',
      });
      return z.NEVER; // Retourne une valeur invalide
    }
  }),
  price: z.string().transform((str, ctx) => {
    const number = Number(str);
    if (isNaN(number)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Price isn't a number",
      });
    }
    return number;
  }),
  guestCount: z.string().transform((str, ctx) => {
    const number = Number(str);
    if (isNaN(number)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "GuestCount isn't a number",
      });
    }
    return number;
  }),
});

export const cancelBookingSchema = z.object({ bookingId: z.string() });
