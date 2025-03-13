import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { env } from '~/env';
import { adminPlugin } from '~/lib/auth/server/plugin';
import { db } from '~/server/db';

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      isAdmin: {
        type: 'boolean',
        defaultValue: false,
        required: false,
        input: false,
        returned: true,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
