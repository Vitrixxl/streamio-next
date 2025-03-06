import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { FormItem } from '~/components/form-item';
import { Button } from '~/components/ui/button';
import { createDeviceSchema } from '~/server/api/schema/device';
import { DeviceType } from '~/server/db/schema';

export const DeviceForm = (
  { defaultValues, onSubmit }: {
    defaultValues?: DeviceType;
    onSubmit: (values: typeof createDeviceSchema._type) => void;
  },
) => {
  const { register, handleSubmit, formState: { errors }, control } = useForm({
    resolver: zodResolver(createDeviceSchema),
    defaultValues,
  });

  return (
    <form
      className='grid grid-cols-2 gap-2'
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormItem
        {...register('name')}
        label='Nom'
        id='name'
        containerClassName='col-span-2'
        error={errors.name?.message}
      />
      <FormItem
        {...register('price', {
          setValueAs: (v) => v === '' ? undefined : Number(v),
        })}
        label='Prix'
        id='price'
        error={errors.price?.message}
      />
      <FormItem
        {...register('amount', {
          setValueAs: (v) => v === '' ? undefined : Number(v),
        })}
        label='Quantité'
        id='amount'
        error={errors.amount?.message}
      />
      <Controller
        {...register('type')}
        control={control}
        render={({ field: { onChange, value } }) => (
          <div className='col-span-2'>
            <label className='text-sm font-medium leading-none col-span-3'>
              Type
            </label>
            <div className='w-full flex gap-2 '>
              <Button
                className={`flex-1 ${value == 'micro' ? 'bg-accent' : ''} `}
                variant='outline'
                onClick={(e) => {
                  e.preventDefault();
                  onChange('micro');
                }}
              >
                Micro
              </Button>
              <Button
                className={`flex-1 ${value == 'casque' ? 'bg-accent' : ''} `}
                variant='outline'
                onClick={(e) => {
                  e.preventDefault();
                  onChange('casque');
                }}
              >
                Casque
              </Button>
              <Button
                className={`flex-1 ${value == 'camera' ? 'bg-accent' : ''} `}
                variant='outline'
                onClick={(e) => {
                  e.preventDefault();
                  onChange('camera');
                }}
              >
                Camera
              </Button>
            </div>
            {errors.type && (
              <p className='text-sm text-destructive'>
                {errors.type.message}
              </p>
            )}
          </div>
        )}
      />
      <Button className='col-span-2'>Creer</Button>
    </form>
  );
};
