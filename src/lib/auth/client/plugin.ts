import { BetterAuthClientPlugin } from 'better-auth';
import { adminPlugin } from '~/lib/auth/server/plugin';

type AdminPlugin = typeof adminPlugin;

export const adminClientPlugin = () => {
  return {
    id: 'birthdayPlugin',
    $InferServerPlugin: {} as ReturnType<AdminPlugin>,
  } satisfies BetterAuthClientPlugin;
};
