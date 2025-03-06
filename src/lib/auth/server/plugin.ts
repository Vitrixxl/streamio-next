import { BetterAuthPlugin } from 'better-auth';

export const adminPlugin = () => {
  return {
    id: 'admin-plugin',
    schema: {
      user: {
        fields: {
          isAdmin: {
            type: 'boolean',
            defaultValue: false,
            required: true,
            input: false,
            returned: true,
          },
        },
      },
    },
  } satisfies BetterAuthPlugin;
};
