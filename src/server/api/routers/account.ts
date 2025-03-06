import { headers } from 'next/headers';
import { auth } from '~/lib/auth/server/auth';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const accountRouter = createTRPCRouter({
  getSession: publicProcedure.query(async () => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return { session };
  }),
});
