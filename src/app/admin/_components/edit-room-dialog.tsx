import { zodResolver } from "@hookform/resolvers/zod";
import { LucideEdit, LucideSave } from "lucide-react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { FileInput } from "~/components/file-input";
import { FormItem } from "~/components/form-item";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { updateRoomSchema } from "~/server/api/schema/room";
import { RoomType } from "~/server/db/schema";

export function EditRoomDialog({ roomData }: { roomData: RoomType }) {
	const [isOpen, setIsOpen] = React.useState(false);

	const {
		register,
		handleSubmit,
		control,
		formState: { isSubmitting, errors },
	} = useForm<z.infer<typeof updateRoomSchema>>({
		resolver: zodResolver(updateRoomSchema),
	});
	async function onSubmit(formData: typeof updateRoomSchema._type) {
		//
	}
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button size="icon" variant="ghost">
					<LucideEdit />
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Modifier la salle</DialogTitle>
					<DialogDescription>
						Modifiez les informations de la salle que vous souhaitez mettre à
						jour puis cliquez sur enregister.
					</DialogDescription>
				</DialogHeader>
				<form
					className="grid grid-cols-2 gap-2"
					onSubmit={handleSubmit(onSubmit)}
				>
					<FormItem
						{...register("name")}
						label="Nom"
						id="name"
						containerClassName="col-span-2"
						error={errors.name?.message}
					/>

					<FormItem
						{...register("description")}
						label="Description"
						id="descriptin"
						itemType="textarea"
						containerClassName="col-span-2"
						rows={4}
						error={errors.description?.message}
					/>
					<FormItem
						label="Taille"
						id="size"
						{
							// type='number'
							...register("size", {
								setValueAs: (v) => (v === "" ? undefined : Number(v)),
							})
						}
						error={errors.size?.message}
					/>
					<FormItem
						label="Prix"
						id="price"
						{
							// type='number'
							...register("price", {
								setValueAs: (v) => (v === "" ? undefined : Number(v)),
							})
						}
						error={errors.price?.message}
					/>
					<Controller
						{...register("type")}
						control={control}
						render={({ field: { onChange, value } }) => (
							<div className="col-span-2">
								<label className="text-sm font-medium leading-none">Type</label>
								<div className="w-full flex gap-2">
									<Button
										className={`flex-1 ${
											value == "bureau" ? "bg-accent" : ""
										} `}
										variant="outline"
										onClick={(e) => {
											e.preventDefault();
											onChange("bureau");
										}}
									>
										Bureau
									</Button>
									<Button
										className={`flex-1 ${
											value == "studio" ? "bg-accent" : ""
										} `}
										variant="outline"
										onClick={(e) => {
											e.preventDefault();
											onChange("studio");
										}}
									>
										Studio
									</Button>
								</div>
							</div>
						)}
					/>
					{errors.type?.message && <p>{errors.type.message}</p>}
					<Controller
						{...register("image")}
						control={control}
						render={({ field: { onChange, value } }) => (
							<FileInput
								placeholder="Cliquez pour ajouter une image"
								className="col-span-2"
								onChange={onChange}
								image={value}
							/>
						)}
					/>
					{errors.image?.message && <p>{errors.image.message}</p>}

					<Button className="col-span-2">Creer</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
