import { LucideUpload, LucideX } from "lucide-react";
import React, { InputHTMLAttributes } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type FileInputProps = InputHTMLAttributes<HTMLInputElement> & {
	onChange?: (file: File | null) => void;
	image: File | null;
};

export const FileInput = ({
	onChange,
	placeholder,
	className,
	value,
}: FileInputProps) => {
	const [file, setFile] = React.useState<File | null>(value);
	const inputRef = React.useRef<HTMLInputElement | null>(null);

	let fileUrl!: string;
	if (file) fileUrl = URL.createObjectURL(file);
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const currentFile = e.currentTarget?.files
			? e.currentTarget.files[0]
			: null;
		if (!currentFile) {
			setFile(null);
			onChange && onChange(null);
			return;
		}
		setFile(currentFile);
		onChange && onChange(currentFile);
	};
	const handleRemoveFile = (e: React.MouseEvent) => {
		e.stopPropagation();
		setFile(null);
		onChange && onChange(null);
	};

	return (
		<div
			className={cn(
				"rounded-lg border p-4 cursor-pointer hover:bg-accent flex gap-2 w-full justify-center items-center",
				className,
			)}
			onClick={() => inputRef.current?.click()}
		>
			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={handleChange}
			/>
			{file ? (
				<div className="w-full flex gap-2 items-center justify-between">
					<div className="flex gap-2 items-center">
						<div className="relative size-10 rounded-xl border overflow-hidden">
							<img src={fileUrl} className="object-cover absolute size-full" />
						</div>
						<p className="text-muted-foreground text-sm">{file.name}</p>
					</div>

					<Button size="icon" variant="ghost" onClick={handleRemoveFile}>
						<LucideX />
					</Button>
				</div>
			) : (
				<div className="text-muted-foreground text-sm flex items-center gap-2">
					<LucideUpload className="" />
					<p className="">{placeholder}</p>
				</div>
			)}
			{/* {value ? <></> : <></>} */}
		</div>
	);
};
