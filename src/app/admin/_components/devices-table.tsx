'use client';
import { DeviceType } from '~/server/db/schema';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { api } from '~/trpc/react';
import { EditDeviceDialog } from '~/app/admin/_components/edit-device-dialog';
import { DeleteDeviceDialog } from '~/app/admin/_components/delete-device-dialog';
export const AdminDevicesTable = ({ devices }: { devices: DeviceType[] }) => {
  const { data } = api.device.getAll.useQuery(undefined, {
    initialData: devices,
  });
  return (
    <div className=' overflow-auto relative rounded-lg border'>
      <Table className='h-full'>
        <TableHeader className='sticky top-0 bg-background'>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Quantité</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead className='w-0 text-end'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((d) => (
            <TableRow key={d.id}>
              <TableCell>{d.name}</TableCell>
              <TableCell>{d.type}</TableCell>
              <TableCell>{d.amount}</TableCell>
              <TableCell>{d.price}</TableCell>
              <TableCell>
                <div className='flex gap-2'>
                  <EditDeviceDialog {...d} />
                  <DeleteDeviceDialog deviceId={d.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
