'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormItem } from '~/components/form-item';
import { Button } from '~/components/ui/button';
import { useRouter } from 'next/navigation';
import { registerSchema } from '~/server/api/schema/auth';
import { authClient } from '~/lib/auth/client/auth-client';

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const router = useRouter();

  const onSubmit = async (formData: typeof registerSchema._type) => {
    const { data, error } = await authClient.signUp.email({
      email: formData.email,
      password: formData.password,
      name: formData.name,
    });

    if (!error) {
      return router.push('/');
    }
    console.error(error);
  };

  return (
    <div className='flex gap-2 flex-col'>
      <h2 className='text-lg font-semibold'>Inscrivez-vous !</h2>
      <form
        className='w-72 flex flex-col gap-2'
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormItem
          label='Nom'
          id='name'
          {...register('name')}
          className='autofill:bg-accent'
          error={errors.name?.message}
        />
        <FormItem
          label='Email'
          id='email'
          {...register('email')}
          error={errors.email?.message}
        />
        <FormItem
          label='Mot de passe'
          id='password'
          {...register('password')}
          type='password'
          error={errors.password?.message}
        />
        <FormItem
          label='Confirmer votre mot de passe'
          id='confPassword'
          {...register('confPassword')}
          type='password'
          error={errors.confPassword?.message}
        />
        <Button type='submit' className='mt-2'>S'inscrire</Button>
      </form>
    </div>
  );
}
