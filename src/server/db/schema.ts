import { boolean } from 'drizzle-orm/mysql-core';
import {
  integer,
  primaryKey,
  real,
  sqliteTableCreator,
  text,
} from 'drizzle-orm/sqlite-core';

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `streamio_${name}`);

export const ROOM_TYPES = ['bureau', 'studio'] as const;
export const TIME_SLOTS = ['matin', 'apres-midi', 'journée'] as const;
export const DEVICE_TYPES = ['camera', 'micro', 'casque'] as const;

export const room = createTable('room', {
  id: text('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  description: text('description').notNull(),
  img: text('img').notNull(),
  size: integer('size').notNull(),
  price: real('price').notNull(),
  type: text('type', { enum: ROOM_TYPES }).notNull(),
});

export type RoomType = typeof room.$inferSelect;
export type InsertRoomType = typeof room.$inferInsert;

export const device = createTable('device', {
  id: text('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  price: real('price').notNull(),
  amount: integer('amount').notNull(),
  type: text('type', { enum: DEVICE_TYPES }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(
    () => new Date(),
  ),
});

export type DeviceType = typeof device.$inferSelect;
export type InsertDeviceType = typeof device.$inferInsert;

export const booking = createTable('booking', {
  id: text('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  guestCount: integer('guest_count').notNull(),
  slot: text('slot', { enum: TIME_SLOTS }).notNull(),
  price: integer('price').notNull(),
  roomId: text('room_id', { length: 255 })
    .notNull().references(() => room.id, { onDelete: 'cascade' }),
  userId: text('user_id', { length: 255 })
    .notNull().references(() => user.id, { onDelete: 'cascade' }),
  // status : text("status",{enum:["cancel"]})
  isCancel: integer('is_cancel', { mode: 'boolean' }).notNull().default(false),
  paymentIntent: text('payment_intent', { length: 255 }).notNull(),
});

export type BookingType = typeof booking.$inferSelect;
export type InsertBookingType = typeof booking.$inferInsert;

export const bookingDevice = createTable('booking_device', {
  bookingId: text('booking_id', { length: 255 })
    .notNull().references(() => booking.id, { onDelete: 'cascade' }),
  deviceId: text('device_id', { length: 255 })
    .notNull().references(() => device.id, { onDelete: 'cascade' }),
  amount: integer('amount').notNull(),
}, (t) => ({
  primaryKey: primaryKey({
    columns: [t.bookingId, t.deviceId], // Définition de la clé composite
  }),
}));

export type BookingDeviceType = typeof bookingDevice.$inferSelect;
export type InsertBookingDeviceType = typeof bookingDevice.$inferInsert;

export const roomDisabled = createTable('room_disabled', {
  roomId: text('room_id', { length: 255 }).notNull().references(() => room.id, {
    onDelete: 'cascade',
  }),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  slot: text('slot', { enum: ['matin', 'apres-midi', 'journée'] }).notNull(),
});

export type RoomDisabledType = typeof roomDisabled.$inferSelect;
export type InsertRoomDisabledType = typeof roomDisabled.$inferInsert;

// Authentification

export const user = createTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull(),
  image: text('image'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  isAdmin: integer('is_admin', { mode: 'boolean' }).notNull(),
});

export const session = createTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, {
    onDelete: 'cascade',
  }),
});

export const account = createTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, {
    onDelete: 'cascade',
  }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: integer('access_token_expires_at', {
    mode: 'timestamp',
  }),
  refreshTokenExpiresAt: integer('refresh_token_expires_at', {
    mode: 'timestamp',
  }),
  scope: text('scope'),
  password: text('password'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const verification = createTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});
