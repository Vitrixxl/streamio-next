import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { api } from '~/trpc/server';
import { AdminBookingTable } from '~/app/admin/_components/bookings-table';
import { CreateRoomDialog } from '~/app/admin/_components/create-room-dialog';
import { AdminDevicesTable } from '~/app/admin/_components/devices-table';
import { AdminRoomsTable } from '~/app/admin/_components/rooms-table';
import { CreateDeviceDialog } from '~/app/admin/_components/create-device-dialog';

export default async function AdminPage() {
  const [bookings, rooms, devices] = await Promise.all([
    api.booking.getAll(),
    api.room.search({}),
    api.device.getAll(),
  ]);
  return (
    <div className='h-full pb-4'>
      <Card className='col-span-full grid-rows-[auto_minmax(0,1fr)] grid max-h-full'>
        <CardHeader>
          <CardTitle>Administration</CardTitle>
          <CardDescription>
            Gerer vos salles, vos materiel et vos reservation
          </CardDescription>
        </CardHeader>
        <CardContent className='min-h-0 h-full'>
          <Tabs
            defaultValue={'bookings'}
            className='h-full grid grid-rows-[auto_minmax(0,1fr)]'
          >
            <TabsList className='w-fit h-full'>
              <TabsTrigger value='bookings'>Reservations</TabsTrigger>
              <TabsTrigger value='rooms'>Salles</TabsTrigger>
              <TabsTrigger value='devices'>Appareils</TabsTrigger>
            </TabsList>
            <TabsContent value='bookings' // className='h-full space-y-2 grid grid-rows-[auto_minmax(0,1fr)]'
            >
              <div className='h-full space-y-2 grid grid-rows-[auto_minmax(0,1fr)]'>
                <AdminBookingTable bookings={bookings} />
              </div>
            </TabsContent>
            <TabsContent value='rooms' // className='h-full space-y-2 grid grid-rows-[auto_minmax(0,1fr)]'
            >
              <div className='h-full space-y-2 grid grid-rows-[auto_minmax(0,1fr)]'>
                <CreateRoomDialog />
                <AdminRoomsTable rooms={rooms} />
              </div>
            </TabsContent>
            <TabsContent value='devices' // className='h-full space-y-2 grid grid-rows-[auto_minmax(0,1fr)]'
            >
              <div className='h-full space-y-2 grid grid-rows-[auto_minmax(0,1fr)]'>
                <CreateDeviceDialog />
                <AdminDevicesTable devices={devices} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
