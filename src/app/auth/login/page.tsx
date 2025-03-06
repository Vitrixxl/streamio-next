'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { FormItem } from '~/components/form-item';
import { Button } from '~/components/ui/button';
import { authClient } from '~/lib/auth/client/auth-client';
import { loginSchema } from '~/server/api/schema/auth';
import { api } from '~/trpc/react';

export default function LoginPage() {
  const utils = api.useUtils();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async ({ email, password }: typeof loginSchema._type) => {
    const result = await authClient.signIn.email({
      email,
      password,
      rememberMe: true,
    });
    if (result.error) {
      setError('root', {
        message: result.error.message || 'Erreur lors de la connexion',
      });
      return;
    }
    utils.account.getSession.invalidate();
    router.push('/');
  };
  return (
    <div className='flex gap-2 flex-col'>
      <h2 className='text-lg font-semibold'>Connectez vous !</h2>
      <form
        className='w-72 flex flex-col gap-2 '
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormItem
          label='Email'
          id='email'
          className=''
          {...register('email')}
          error={errors.email?.message}
        />
        <FormItem
          label='Mot de passe'
          id='password'
          type='password'
          {...register('password')}
          error={errors.email?.message}
        />
        <Button className='mt-2'>Connexion</Button>
      </form>
    </div>
  );
}
