import { relations, sql } from 'drizzle-orm';
import {
  index,
  int,
  integer,
  primaryKey,
  real,
  sqliteTableCreator,
  text,
} from 'drizzle-orm/sqlite-core';
import { type AdapterAccount } from 'next-auth/adapters';

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
  name: text().notNull(),
  description: text().notNull(),
  size: integer().notNull(),
  price: real().notNull(),
  type: text({ enum: ROOM_TYPES }).notNull(),
});

export type RoomType = typeof room.$inferSelect;
export type InsertRoomType = typeof room.$inferInsert;

export const device = createTable('device', {
  id: text('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text().notNull(),
  price: real().notNull(),
  amount: integer().notNull(),
  type: text({ enum: DEVICE_TYPES }),
});

export type DeviceType = typeof device.$inferSelect;
export type InsertDeviceType = typeof device.$inferInsert;

export const booking = createTable('booking', {
  id: text('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  date: integer({ mode: 'timestamp' }).notNull(),
  guestCount: integer().notNull(),
  slot: text({ enum: TIME_SLOTS }).notNull(),
  roomId: text('room_id', { length: 255 })
    .notNull().references(() => room.id),
  userId: text('user_id', { length: 255 })
    .notNull().references(() => users.id),
});

export type BookingType = typeof booking.$inferSelect;
export type InsertBookingType = typeof booking.$inferInsert;

export const bookingDevice = createTable('booking_device', {
  bookingId: text('booking_id', { length: 255 })
    .notNull(),
  deviceId: text('device_id', { length: 255 })
    .notNull().references(() => device.id),
  amount: integer().notNull(),
}, (t) => [
  primaryKey({ columns: [t.deviceId, t.bookingId] }),
]);

export type BookingDeviceType = typeof bookingDevice.$inferSelect;
export type InsertBookingDeviceType = typeof bookingDevice.$inferInsert;

export const roomDisabled = createTable('room_disabled', {
  roomId: text('room_id', { length: 255 }).notNull(),
  date: integer({ mode: 'timestamp' }).notNull(),
  slot: text({ enum: ['matin', 'apres-midi', 'journée'] }).notNull(),
});

export type RoomDisabledType = typeof roomDisabled.$inferSelect;
export type InsertRoomDisabledType = typeof roomDisabled.$inferInsert;

// Authentification
export const users = createTable('user', {
  id: text('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name', { length: 255 }),
  email: text('email', { length: 255 }).notNull(),
  emailVerified: int('email_verified', {
    mode: 'timestamp',
  }).default(sql`(unixepoch())`),
  image: text('image', { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  'account',
  {
    userId: text('user_id', { length: 255 })
      .notNull()
      .references(() => users.id),
    type: text('type', { length: 255 })
      .$type<AdapterAccount['type']>()
      .notNull(),
    provider: text('provider', { length: 255 }).notNull(),
    providerAccountId: text('provider_account_id', { length: 255 }).notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: int('expires_at'),
    token_type: text('token_type', { length: 255 }),
    scope: text('scope', { length: 255 }),
    id_token: text('id_token'),
    session_state: text('session_state', { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index('account_user_id_idx').on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  'session',
  {
    sessionToken: text('session_token', { length: 255 }).notNull().primaryKey(),
    userId: text('userId', { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: int('expires', { mode: 'timestamp' }).notNull(),
  },
  (session) => ({
    userIdIdx: index('session_userId_idx').on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  'verification_token',
  {
    identifier: text('identifier', { length: 255 }).notNull(),
    token: text('token', { length: 255 }).notNull(),
    expires: int('expires', { mode: 'timestamp' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
