'use client';
import { useSearchParams } from 'next/navigation';
import { RoomCard } from '~/app/_components/room';
import { ROOM_TYPES } from '~/server/db/schema';
import { api } from '~/trpc/react';

export const RoomList = () => {
  const params = useSearchParams();
  const search = params.get('search');
  const roomType = params.get('roomType');
  const maxPrice = params.get('maxPrice');
  const date = params.get('date');

  const { data } = api.room.search.useQuery({
    search,
    roomType: roomType
      ? roomType.split(',') as typeof ROOM_TYPES[number][]
      : undefined,
    maxPrice: maxPrice && !isNaN(Number(maxPrice))
      ? Number(maxPrice)
      : undefined,
    date: date ? new Date(date) : undefined,
  });
  if (!data) return;

  return (
    <div className='max-w-full space-y-2 '>
      {data.map((m) => <RoomCard {...m} key={m.id} />)}
    </div>
  );
};
