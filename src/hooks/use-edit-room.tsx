import { z } from "zod";
import { updateRoomSchema } from "~/server/api/schema/room";
import { api } from "~/trpc/react";

export const useEditRoom = (id: string) => {
	const utils = api.useUtils();

	const editMutation = api.room.update.useMutation({
		onMutate: (data) => {
			const prevData = utils.room.search.getData({});

			utils.room.search.setData(
				{},
				prevData
					? [...prevData, { ...data, img: URL.createObjectURL(data.image) }]
					: [{ ...data, img: URL.createObjectURL(data.image) }],
			);
		},
		onError: () => {},
	});

	const edit = (data: z.infer<typeof updateRoomSchema>) => {};
};
