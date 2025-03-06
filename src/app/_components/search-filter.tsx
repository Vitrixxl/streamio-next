'use client';

import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Slider } from '~/components/ui/slider';
import { SearchRoomSchemaType } from '~/server/api/schema/room';

export const SearchFilter = () => {
  const [searchFilters, setSearchFilters] = React.useState<
    SearchRoomSchemaType
  >({});
  const [priceValue, setPriceValue] = React.useState<number>(0);
  const router = useRouter();
  const pathName = usePathname();

  React.useEffect(() => {
    const searchParams = new URLSearchParams();
    searchParams.set(
      'roomType',
      searchFilters.roomType ? searchFilters.roomType.join(',') : '',
    );
    searchParams.set('search', searchFilters.search || '');
    searchParams.set('maxPrice', searchFilters.maxPrice?.toString() || '');
    router.replace(`${pathName}?${searchParams.toString()}`);
  }, [searchFilters]);
  return (
    <div className='flex gap-3 items-center'>
      <Button
        variant={'outline'}
        className={`transition-colors ${
          searchFilters.roomType?.includes('studio') ? 'bg-accent' : ''
        }`}
        onClick={() =>
          setSearchFilters((prev) => ({
            ...prev,
            roomType: prev.roomType && prev.roomType.includes('studio')
              ? prev.roomType.filter((type) => type != 'studio')
              : prev.roomType
              ? [...prev.roomType, 'studio']
              : ['studio'],
          }))}
      >
        Studio
      </Button>
      <Button
        variant={'outline'}
        onClick={() =>
          setSearchFilters((prev) => ({
            ...prev,
            roomType: prev.roomType && prev.roomType.includes('bureau')
              ? prev.roomType.filter((type) => type != 'bureau')
              : prev.roomType
              ? [...prev.roomType, 'bureau']
              : ['bureau'],
          }))}
        className={`transition-colors ${
          searchFilters.roomType?.includes('bureau') ? 'bg-accent' : ''
        }`}
      >
        Bureau
      </Button>
      <Input
        className='w-[350px]'
        placeholder='Rechercher le nom de la salle'
        onChange={(e) =>
          setSearchFilters((prev) => ({
            ...prev,
            search: e.currentTarget?.value,
          }))}
      />
      <Slider
        className='max-w-40'
        max={1000}
        min={0}
        value={[priceValue]}
        onValueChange={(v) => setPriceValue(v[0] || 0)}
        onValueCommit={(value) =>
          setSearchFilters((prev) => ({
            ...prev,
            maxPrice: value[0],
          }))}
      />
      <span>{priceValue} €</span>
    </div>
  );
};
