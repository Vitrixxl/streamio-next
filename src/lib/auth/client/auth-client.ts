import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import { auth } from '~/lib/auth/server/auth';
export const authClient = createAuthClient({
  baseURL: 'http://localhost:3000',
  plugins: [inferAdditionalFields({
    user: {
      role: {
        type: 'string',
      },
    },
  })],
});
