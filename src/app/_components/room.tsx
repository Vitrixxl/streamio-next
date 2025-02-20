import Link from 'next/link';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { RoomType } from '~/server/db/schema';

export const RoomCard = (room: RoomType) => {
  return (
    <Card className='border-border' key={room.id}>
      <CardHeader className='border-b-border'>
        <CardTitle>{room.name}</CardTitle>
        <CardDescription>{room.type}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className='line-clamp-2 font-medium'>{room.description}</p>
        <p className='text-sm text-muted-foreground'>
          Capacité: {room.size}
        </p>
      </CardContent>
      <CardFooter className='flex items-center justify-between'>
        <p>Prix : {room.price}€</p>
        <Button asChild>
          <Link href={`room/${room.id}`}>Réserver</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
