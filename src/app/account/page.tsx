import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { UserBookingTable } from '~/app/account/_component/user-booking-table';
import { UserInfoCard } from '~/app/account/_component/user-info-card';
import { auth } from '~/lib/auth/server/auth';
import { api } from '~/trpc/server';

export default async function AccountPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect('/');
  const { user } = session;
  const { bookings } = await api.booking.getForUser({ userId: user.id });
  return (
    <div className='grid grid-cols-8 grid-rows-[auto_repeat(2,minmax(0,1fr))] gap-4 h-full min-h-0 pb-4 '>
      <div className='row-span-1 col-span-full'>
        <h1 className='text-4xl font-semibold'>
          <span className='text-primary'>WELCOME</span>{' '}
          <span>
            {user.name[0]?.toUpperCase() + user.name.slice(1, user.name.length)}
          </span>
        </h1>
      </div>
      <div className=' gap-4 flex-1 col-span-full row-span-1 grid grid-cols-8'>
        <UserInfoCard {...user} />
        <UserBookingTable initialBookings={bookings} userId={user.id} />
      </div>
    </div>
  );
}
