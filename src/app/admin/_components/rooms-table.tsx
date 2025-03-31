"use client";
import { RoomType } from "~/server/db/schema";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { LucideEdit, LucideTrash } from "lucide-react";
import { DeleteRoomDialog } from "~/app/account/_component/delete-room-dialog";
import { api } from "~/trpc/react";
export const AdminRoomsTable = ({ rooms }: { rooms: RoomType[] }) => {
	const { data } = api.room.search.useQuery({}, { initialData: rooms });
	return (
		<div className="overflow-hidden rounded-lg border">
			<Table className="">
				<TableHeader className="sticky top-0">
					<TableRow>
						<TableHead>Nom</TableHead>
						<TableHead>Type</TableHead>
						<TableHead>Taille</TableHead>
						<TableHead>Prix</TableHead>
						<TableHead className="w-0 text-end">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((r) => (
						<TableRow key={r.id}>
							<TableCell>{r.name}</TableCell>
							<TableCell>{r.type}</TableCell>
							<TableCell>{r.size}</TableCell>
							<TableCell>{r.price}</TableCell>
							<TableCell>
								<div className="flex gap-2">
									<Button variant="ghost" size="icon">
										<LucideEdit />
									</Button>
									<DeleteRoomDialog roomId={r.id} />
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			{data.length == 0 && (
				<p className="text-muted-foreground text-center py-4">Aucune salle</p>
			)}
		</div>
	);
};
