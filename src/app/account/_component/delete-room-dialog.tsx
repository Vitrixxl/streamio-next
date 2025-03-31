"use client";

import { LucideTrash } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";

export const DeleteRoomDialog = ({ roomId }: { roomId: string }) => {
	const [isOpen, setIsOpen] = React.useState(false);
	const utils = api.useUtils();
	const deleteRoomMutation = api.room.delete.useMutation({
		onMutate({ roomId }) {
			console.log(roomId);
			setIsOpen(false);
			const prevData = utils.room.search.getData({});
			console.log(prevData);
			utils.room.search.setData(
				{},
				prevData?.filter((r) => r.id != roomId),
			);
			return { prevData };
		},
		onError(err, __, context) {
			console.log(err);
			if (context?.prevData) utils.room.search.setData({}, context?.prevData);
		},
	});

	const handleConfirm = () => {
		deleteRoomMutation.mutate({ roomId });
	};
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button size="icon" variant="destructive">
					<LucideTrash />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Etes vous sur ?</DialogTitle>
					<DialogDescription>
						Apres avoir supprimer cette salle vous ne pourrez pas revenir en
						arriere
					</DialogDescription>
				</DialogHeader>
				<div className="w-full flex justify-end gap-2">
					<Button variant={"outline"}>Annuler</Button>
					<Button variant={"destructive"} onClick={handleConfirm}>
						Confirmer
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
