'use client';
import dayjs from 'dayjs';
import Link from 'next/link';
import { DeviceListDialog } from '~/app/account/_component/device-list-dialog';
import { CancelBookingDialog } from '~/components/cancel-booking-dialog';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { BookingType, DeviceType, RoomType } from '~/server/db/schema';
import { api } from '~/trpc/react';

export const UserBookingTable = (
  { initialBookings, userId }: {
    userId: string;
    initialBookings: {
      booking: BookingType;
      room: RoomType;
      devices?: DeviceType[];
    }[];
  },
) => {
  const { data: { bookings } } = api.booking.getForUser.useQuery({ userId }, {
    initialData: { bookings: initialBookings },
  });
  return (
    <Card className='col-span-6'>
      <CardHeader>
        <CardTitle>Mes reserversation</CardTitle>
        <CardDescription>
          Retrouver la list des vos précedentes reserversation
        </CardDescription>
      </CardHeader>
      <CardContent className='max-h-96 '>
        <div className='rounded-lg overflow-hidden border relative'>
          <Table className=''>
            <TableHeader className='sticky top-0'>
              <TableRow>
                <TableHead>Salle</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Liste des appareils</TableHead>
                <TableHead>Nb de personne</TableHead>
                <TableHead className='w-0'>Prix</TableHead>
                <TableHead className='w-0 text-end'>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b.booking.id}>
                  <TableCell>
                    <Link href={`/room/${b.room.id}`}>{b.room.name}</Link>
                  </TableCell>
                  <TableCell>
                    {dayjs(b.booking.date).format('DD:MM:YYYY')}
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
                  <TableCell>{b.booking.guestCount}</TableCell>
                  <TableCell>{b.booking.price}€</TableCell>
                  <TableCell>
                    <CancelBookingDialog
                      bookingId={b.booking.id}
                      userId={b.booking.userId}
                      disabled={b.booking.isCancel}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
