'use client';

import { useSearchParams } from 'next/navigation';
import { ROOM_TYPES } from '~/server/db/schema';
import { api } from '~/trpc/react';

export default function Page() {
  const params = useSearchParams();
  const search = params.get('search');
  const roomType = params.get('roomType') as typeof ROOM_TYPES[number];
  const maxPrice = params.get('maxPrice');
  const date = params.get('date');

  const { data, isLoading, error } = api.room.search.useQuery({
    search,
    roomType,
    maxPrice: maxPrice && !isNaN(Number(maxPrice))
      ? Number(maxPrice)
      : undefined,
    date: date ? new Date(date) : undefined,
  });

  return <></>;
}
