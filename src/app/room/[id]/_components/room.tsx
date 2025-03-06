'use client';
import { DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';
import { LucideImage, LucideMinus, LucidePlus } from 'lucide-react';
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from '~/components/ui/dialog';
import { Slider } from '~/components/ui/slider';
import { useBookRoom } from '~/hooks/useBookRoom';
import { DeviceType, TIME_SLOTS } from '~/server/db/schema';
import { api } from '~/trpc/react';

export const Room = ({ id }: { id: string }) => {
  const [localData, setLocalData] = React.useState<typeof data>();
  const launchBookingProcess = useBookRoom(id);
  const [date, setDate] = React.useState<Date>(new Date());
  const [slot, setSlot] = React.useState<typeof TIME_SLOTS[number]>();
  const [isImgLoaded, setIsImageLoaded] = React.useState(false);
  const [guestCount, setGuestCount] = React.useState(1);
  const [devices, setDevices] = React.useState<
    { deviceId: string; amount: number }[]
  >([]);

  const { data } = api.room.getRoomData.useQuery({
    id,
    date,
  });

  const { room, availabilities, availableDivices } = localData || {
    room: null,
    availabilities: [],
    availableDivices: [],
  };

  const addDevice = (device: DeviceType) => {
    setDevices((prev) => {
      const prevAmount = prev.find((d) => d.deviceId == device.id)?.amount;
      if (prevAmount == undefined) {
        return [...prev, { deviceId: device.id, amount: 1 }];
      }
      console.log(prevAmount);
      return [
        ...prev.filter((d) => d.deviceId != device.id),
        { deviceId: device.id, amount: prevAmount + 1 },
      ];
    });
  };

  const removeDevice = (device: DeviceType) => {
    setDevices((prev) => {
      const prevAmount = prev.find((d) => d.deviceId == device.id)?.amount;
      if (prevAmount == undefined) return prev;
      if (prevAmount == 1) return prev.filter((d) => d.deviceId == device.id);
      return [
        ...prev.filter((d) => d.deviceId != device.id),
        { deviceId: device.id, amount: prevAmount - 1 },
      ];
    });
  };

  const handleSubmit = () => {
    if (!date || !slot || !room) return;
    launchBookingProcess({
      date,
      slot,
      devices,
      guestCount,
      name: room.name,
    });
  };

  React.useEffect(() => {
    setSlot(undefined);
    setDevices([]);
  }, [date]);

  React.useEffect(() => {
    data && setLocalData(data);
  }, [data]);
  if (!room) return;

  return (
    <div className='grid grid-cols-[1fr_auto] gap-4'>
      <div className='flex flex-col gap-4'>
        <div className='aspect-video relative border rounded-2xl overflow-hidden'>
          {!isImgLoaded && (
            <LucideImage className='size-16 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2' />
          )}
          <img
            src={room.img}
            className={`size-full absolute object-cover ${
              isImgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsImageLoaded(true)}
          />
        </div>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-semibold'>{room.name}</h1>
          <h2 className='text-2xl font-semibold'>{room.price} €</h2>
        </div>
        <p className='text-muted-foreground'>{room.description}</p>
      </div>
      <div className='h-fit rounded-2xl border p-2 flex flex-col gap-2 pb-4'>
        <Calendar
          mode='single'
          onSelect={(day) => setDate(day)}
          selected={date}
          disabled={{ before: new Date() }}
        />

        <div className='flex gap-2 w-full px-2'>
          {availabilities.map((a) => (
            <Button
              size='sm'
              variant='outline'
              key={a}
              className={`flex-1 ${slot == a ? 'bg-accent' : ''}`}
              onClick={() => setSlot(a)}
            >
              {a}
            </Button>
          ))}
        </div>
        <div className='px-2 grid'>
          <Dialog>
            <DialogTrigger asChild>
              <Button size='sm' variant='outline'>
                Appareils{' '}
                {devices.length > 0 && (`(${
                  devices.reduce((acc, cur) => {
                    return acc + cur.amount;
                  }, 0)
                })`)}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Besoin d'un appareil ? Ajoutez le !</DialogTitle>
                <DialogDescription>
                  Choissisez les appareils que vous souhaitez dans la limite des
                  stocks disponibles
                </DialogDescription>
              </DialogHeader>
              <Accordion type='multiple'>
                <AccordionItem value='camera'>
                  <AccordionTrigger>Cameras</AccordionTrigger>
                  <AccordionContent>
                    <div className='flex flex-col gap-1'>
                      {availableDivices.map((d) =>
                        d.type == 'camera' && (
                          <div
                            className='flex justify-between items-center'
                            key={d.id}
                          >
                            <p>{d.name} - {d.price}€</p>
                            <div className='flex gap-2'>
                              <Button
                                variant={'outline'}
                                size={'icon'}
                                onClick={() => removeDevice(d)}
                              >
                                <LucideMinus />
                              </Button>
                              <Button
                                variant={'outline'}
                                size={'icon'}
                                onClick={() => addDevice(d)}
                              >
                                <LucidePlus />
                              </Button>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value='micro'>
                  <AccordionTrigger>Micros</AccordionTrigger>
                  <AccordionContent>
                    <div className='flex flex-col gap-1'>
                      {availableDivices.map((d) =>
                        d.type == 'micro' && (
                          <div
                            className='flex justify-between items-center'
                            key={d.id}
                          >
                            <p>{d.name} - {d.price}€</p>
                            <div className='flex gap-2'>
                              <Button
                                variant={'outline'}
                                size={'icon'}
                                onClick={() => removeDevice(d)}
                              >
                                <LucideMinus />
                              </Button>
                              <Button
                                variant={'outline'}
                                size={'icon'}
                                onClick={() => addDevice(d)}
                              >
                                <LucidePlus />
                              </Button>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value='casque'>
                  <AccordionTrigger>Casques</AccordionTrigger>
                  <AccordionContent>
                    <div className='flex flex-col gap-1'>
                      {availableDivices.map((d) =>
                        d.type == 'casque' && (
                          <div
                            className='flex justify-between items-center'
                            key={d.id}
                          >
                            <p>{d.name} - {d.price}€</p>
                            <div className='flex gap-2'>
                              <Button
                                variant={'outline'}
                                size={'icon'}
                                onClick={() => removeDevice(d)}
                              >
                                <LucideMinus />
                              </Button>
                              <Button
                                variant={'outline'}
                                size={'icon'}
                                onClick={() => addDevice(d)}
                              >
                                <LucidePlus />
                              </Button>
                            </div>
                          </div>
                        )
                      )}
                      <div className='flex justify-between items-center'>
                        <p>Gode - 1€</p>
                        <div className='flex gap-2'>
                          <Button
                            variant={'outline'}
                            size={'icon'}
                            // onClick={() => removeDevice(d)}
                          >
                            <LucideMinus />
                          </Button>
                          <Button
                            variant={'outline'}
                            size={'icon'}
                            // onClick={() => addDevice(d)}
                          >
                            <LucidePlus />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </DialogContent>
          </Dialog>
        </div>
        <div className='px-2 space-y-2'>
          <p className='text-sm'>Nombre de personne : {guestCount}</p>
          <Slider
            onValueChange={([v]) => setGuestCount(v || 1)}
            min={1}
            max={room.size}
          />
        </div>
        <div className='grid px-2'>
          <Button size='sm' disabled={!slot || !date} onClick={handleSubmit}>
            Reserver
          </Button>
        </div>
      </div>
    </div>
  );
};
