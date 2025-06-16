'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogTitle } from '@radix-ui/react-dialog';
import { v4 as uuid } from 'uuid';
import { LucidePlusCircle } from 'lucide-react';
import React from 'react';
import { Controller, Form, useForm } from 'react-hook-form';
import { FileInput } from '~/components/file-input';
import { FormItem } from '~/components/form-item';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '~/components/ui/dialog';
import { createRoomSchemaClient } from '~/server/api/schema/room';
import { RoomType } from '~/server/db/schema';
import { api } from '~/trpc/react';
import { safeFetch } from '~/lib/utils';
import { extension } from 'mime-types';

export const CreateRoomDialog = () => {
  const utils = api.useUtils();
  const [isOpen, setIsOpen] = React.useState(false);
  const createRoomMutation = api.room.create.useMutation({
    onMutate: async (values) => {
      const prevData = utils.room.search.getData({});
      console.log(values);

      utils.room.search.setData(
        {},
        prevData ? [...prevData, values] : [values],
      );
      setIsOpen(false);
      return { prevData };
    },

    onError: async (err, data, ctx) => {
      console.log(data);
      console.error(err);
      if (!ctx?.prevData) return;
      utils.room.search.setData({}, ctx.prevData);
    },
  });
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createRoomSchemaClient),
  });
  const onSubmit = async (data: typeof createRoomSchemaClient._type) => {
    const formData = new FormData();
    formData.set('img', data.image);
    const result = await safeFetch<{ id: string; ext: string }>(
      '/api/admin/upload/room-img',
      { body: formData, method: 'POST' },
    );
    if (!result.success) {
      console.error(result.message);
      return;
    }
    const { id, ext } = result.data;
    console.log(ext);
    const completedData: RoomType = {
      id: result.data.id,
      name: data.name,
      description: data.description,
      img: `http://localhost:3000/api/files/room-img/${id}.${ext}`,
      type: data.type,
      price: data.price,
      size: data.size,
    };
    createRoomMutation.mutate(completedData);
  };
  console.log(errors);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='w-fit'>
          Ajouter une salle <LucidePlusCircle />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Creer une nouvelle salle</DialogTitle>
        </DialogHeader>
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
            {...register('description')}
            label='Description'
            id='descriptin'
            itemType='textarea'
            containerClassName='col-span-2'
            rows={4}
            error={errors.description?.message}
          />
          <FormItem
            label='Taille'
            id='size'
            {
              // type='number'
              ...register('size', {
                setValueAs: (v) => (v === '' ? undefined : Number(v)),
              })
            }
            error={errors.size?.message}
          />
          <FormItem
            label='Prix'
            id='price'
            {
              // type='number'
              ...register('price', {
                setValueAs: (v) => (v === '' ? undefined : Number(v)),
              })
            }
            error={errors.price?.message}
          />
          <Controller
            {...register('type')}
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className='col-span-2'>
                <label className='text-sm font-medium leading-none'>Type</label>
                <div className='w-full flex gap-2'>
                  <Button
                    className={`flex-1 ${
                      value == 'bureau' ? 'bg-accent' : ''
                    } `}
                    variant='outline'
                    onClick={(e) => {
                      e.preventDefault();
                      onChange('bureau');
                    }}
                  >
                    Bureau
                  </Button>
                  <Button
                    className={`flex-1 ${
                      value == 'studio' ? 'bg-accent' : ''
                    } `}
                    variant='outline'
                    onClick={(e) => {
                      e.preventDefault();
                      onChange('studio');
                    }}
                  >
                    Studio
                  </Button>
                </div>
              </div>
            )}
          />
          {errors.type?.message && <p>{errors.type.message}</p>}
          <Controller
            {...register('image')}
            control={control}
            render={({ field: { onChange, value } }) => (
              <FileInput
                placeholder='Cliquez pour ajouter une image'
                className='col-span-2'
                onChange={onChange}
                image={value}
              />
            )}
          />
          {errors.image?.message && <p>{errors.image.message}</p>}

          <Button className='col-span-2'>Creer</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
