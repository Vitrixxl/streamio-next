import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { RoomType } from "~/server/db/schema";

export const RoomCard = (room: RoomType) => {
	return (
		<div
			className="border-border max-w-[650px] h-56 p-4 border rounded-lg flex gap-4"
			key={room.id}
		>
			<div className="aspect-square h-full relative overflow-hidden rounded-lg">
				<img src={room.img} className="h-full object-cover" />
			</div>
			<div className="flex-1 py-2 flex flex-col">
				<CardHeader className="border-b-border px-0 py-0">
					<CardTitle>{room.name}</CardTitle>
					<CardDescription>{room.type}</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col px-0 py-0 mt-auto">
					<p className="line-clamp-2 font-medium">{room.description}</p>
					<p className="text-sm text-muted-foreground">Capacité: {room.size}</p>
					<Button asChild className="ml-auto mt-auto">
						<Link href={`room/${room.id}`}>Réserver</Link>
					</Button>
				</CardContent>
			</div>
			{/* <CardFooter className="flex items-center justify-between"> */}
			{/* 	<p>Prix : {room.price}€</p> */}
			{/* </CardFooter> */}
		</div>
	);
};
