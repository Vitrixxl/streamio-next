import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { DeviceType } from '~/server/db/schema';

export const DeviceListDialog = (
  { devices, children }: { children: React.ReactNode; devices: DeviceType[] },
) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Appareils de la reservation</DialogTitle>
          <DialogDescription>
            Voici la liste des appareils qui seront a votre disposition lors de
            votre reservation
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-4'>
          {devices.map((d) => (
            <div className='w-full flex px-2 justify-between' key={d.id}>
              <p>{d.name}</p>
              <p>{d.amount}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
