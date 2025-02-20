import { RoomList } from '~/app/_components/room-list';
import { SearchFilter } from '~/app/_components/search-filter';
import { HydrateClient } from '~/trpc/server';

export default async function Home() {
  return (
    <HydrateClient>
      <div className='mt-10 space-y-4'>
        <h1 className='text-3xl font-semibold'>
          Besoin d'un <span className='text-primary'>studio</span> ou <br />de
          {' '}
          <span className='text-primary'>materiel</span> pour vos stream ?
        </h1>
        <p className=' text-muted-foreground my-2'>
          Faites confiance aux prefessionnels de streamio pour vous permettre
          d'augmenter la qualité de vos streams
        </p>
        <div>
          <SearchFilter />
        </div>

        <RoomList />
      </div>
    </HydrateClient>
  );
}
