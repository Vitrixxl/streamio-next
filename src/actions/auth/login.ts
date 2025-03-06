'use server';
import { warn } from 'console';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '~/server/auth';

export const loginAction = async (email: string, password: string) => {
  // return auth.api.signInEmail({
  //   body: {
  //     email,
  //     password,
  //   },
  //   asResponse: true,
  // });
};
