import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { User } from 'better-auth';
import { BookingType, DeviceType, RoomType } from '~/server/db/schema';
import Link from 'next/link';
import dayjs from 'dayjs';
import { DeviceListDialog } from '~/app/account/_component/device-list-dialog';
import { Button } from '~/components/ui/button';
import { UserInfoDialog } from '~/app/account/_component/user-info-dialog';
import { CancelBookingDialog } from '~/components/cancel-booking-dialog';

export const AdminBookingTable = (
  { bookings }: {
    bookings: {
      booking: BookingType;
      user: User;
      devices?: DeviceType[];
      room: RoomType;
    }[];
  },
) => {
  return (
    <div className=' overflow-hidden rounded-lg border'>
      <Table className=''>
        <TableHeader className='sticky top-0'>
          <TableRow>
            <TableHead>Salle</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Liste des appareils</TableHead>
            <TableHead>Reservateur</TableHead>
            <TableHead className=''>Nb de personnes</TableHead>
            <TableHead className='w-0'>Prix</TableHead>
            <TableHead className='w-0'>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings && bookings.map((b) => (
            <TableRow key={b.booking.id}>
              <TableCell>
                <Link href={`/room/${b.room.id}`}>{b.room.name}</Link>
              </TableCell>
              <TableCell>
                {dayjs(b.booking.date).format('DD/MM/YYYY')}
              </TableCell>
              <TableCell>
                {b.devices
                  ? (
                    <DeviceListDialog devices={b.devices}>
                      <Button variant='link' className='text-start px-0'>
                        Voir les appareils ({b.devices.length})
                      </Button>
                    </DeviceListDialog>
                  )
                  : <></>}
              </TableCell>
              <TableCell>
                <UserInfoDialog user={b.user} />
              </TableCell>
              <TableCell>{b.booking.guestCount}</TableCell>
              <TableCell>
                {b.booking.price}€
              </TableCell>
              <TableCell>
                <CancelBookingDialog
                  bookingId={b.booking.id}
                  userId={b.user.id}
                  disabled={b.booking.isCancel}
                />
                {/* <Button>Annuler</Button> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
