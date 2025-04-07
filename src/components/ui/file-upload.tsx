import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import {
	UploadCloud,
	X,
	Image as ImageIcon,
	File,
	ImagePlus,
	Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

export interface FileUploadProps {
	value: string | string[];
	onChange: (value: string | string[]) => void;
	onFilesAdded?: (files: File[]) => Promise<string[]>;
	maxFiles?: number;
	maxSize?: number;
	multiple?: boolean;
	className?: string;
	disabled?: boolean;
	accept?: Record<string, string[]>;
}

/**
 * A component for handling file uploads with preview capabilities.
 *
 * This component creates a dropzone area where users can:
 * - Drag and drop files
 * - Click to select files from their device
 * - See previews of uploaded images
 * - Remove uploaded files
 */
export const FileUpload = ({
	value,
	onChange,
	onFilesAdded,
	maxFiles = 1,
	maxSize = 5 * 1024 * 1024, // 5MB
	multiple = false,
	className,
	disabled = false,
	accept = {
		"image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
	},
}: FileUploadProps) => {
	const { toast } = useToast();
	const [isUploading, setIsUploading] = useState(false);

	// Convert value to array for consistent handling
	const valueArray = Array.isArray(value)
		? value
		: value
		? [value]
		: [];

	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			if (disabled) return;

			if (!onFilesAdded) {
				console.error("Missing onFilesAdded prop");
				return;
			}

			// Check if exceeding maxFiles
			if (
				valueArray.length + acceptedFiles.length >
				maxFiles
			) {
				toast({
					title: "Upload limit reached",
					description: `You can only upload up to ${maxFiles} image${
						maxFiles === 1 ? "" : "s"
					}`,
					variant: "destructive",
				});
				return;
			}

			// Validate if all files are images
			const allImages = acceptedFiles.every((file) =>
				file.type.startsWith("image/"),
			);

			if (!allImages) {
				toast({
					title: "Invalid file type",
					description: "Please upload image files only",
					variant: "destructive",
				});
				return;
			}

			try {
				setIsUploading(true);
				const urls = await onFilesAdded(acceptedFiles);

				// Update value based on whether it's multiple or single
				if (multiple) {
					onChange([...valueArray, ...urls]);
				} else {
					onChange(urls[0]);
				}
			} catch (error) {
				console.error("Error uploading files:", error);
				toast({
					title: "Upload failed",
					description:
						"There was an error uploading your image(s)",
					variant: "destructive",
				});
			} finally {
				setIsUploading(false);
			}
		},
		[
			disabled,
			maxFiles,
			multiple,
			onChange,
			onFilesAdded,
			toast,
			valueArray,
		],
	);

	const { getRootProps, getInputProps, isDragActive } =
		useDropzone({
			onDrop,
			maxSize,
			maxFiles: multiple ? maxFiles : 1,
			multiple,
			accept,
			disabled:
				disabled ||
				isUploading ||
				(!multiple && valueArray.length >= 1),
		});

	const removeFile = (index: number) => {
		if (isUploading || disabled) return;

		const newValueArray = [...valueArray];
		newValueArray.splice(index, 1);

		if (multiple) {
			onChange(newValueArray);
		} else {
			onChange("");
		}
	};

	return (
		<div className={cn("space-y-4", className)}>
			<div
				{...getRootProps()}
				className={cn(
					"border-2 border-dashed rounded-xl transition-all duration-200 overflow-hidden",
					isDragActive
						? "border-primary bg-primary/5 scale-[1.02]"
						: "border-muted-foreground/20 bg-background hover:bg-muted/10 hover:border-muted-foreground/30",
					(disabled ||
						isUploading ||
						(!multiple && valueArray.length >= 1)) &&
						"opacity-60 cursor-not-allowed hover:bg-background hover:border-muted-foreground/20",
					"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
					valueArray.length === 0 ? "p-6" : "p-4",
				)}>
				<input {...getInputProps()} />

				{valueArray.length === 0 && (
					<div className="flex flex-col items-center justify-center gap-2 text-center p-4">
						<div className="bg-primary/10 p-3 rounded-full mb-2">
							<ImagePlus className="h-8 w-8 text-primary" />
						</div>
						<p className="text-base font-medium">
							{isDragActive
								? "Drop images here"
								: multiple
								? "Drag & drop images or click to browse"
								: "Drag & drop an image or click to browse"}
						</p>
						<p className="text-xs text-muted-foreground mt-1">
							{multiple
								? `Upload up to ${maxFiles} image${
										maxFiles === 1 ? "" : "s"
								  } (max ${Math.round(
										maxSize / 1024 / 1024,
								  )}MB each)`
								: `Upload an image (max ${Math.round(
										maxSize / 1024 / 1024,
								  )}MB)`}
						</p>

						{!disabled &&
							(valueArray.length < maxFiles ||
								(!multiple && valueArray.length === 0)) && (
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="mt-4 rounded-full flex gap-2 px-4"
									disabled={isUploading || disabled}>
									<Camera className="h-4 w-4" />
									{multiple
										? "Select Images"
										: "Select Image"}
								</Button>
							)}

						{isUploading && (
							<div className="flex items-center gap-2 mt-4 text-primary">
								<div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
								<p className="text-sm">Uploading...</p>
							</div>
						)}
					</div>
				)}

				{valueArray.length > 0 && !multiple && (
					<div className="flex flex-col items-center">
						<p className="text-sm text-muted-foreground mb-2">
							{isUploading
								? "Uploading your image..."
								: "Your uploaded image"}
						</p>
					</div>
				)}

				{valueArray.length > 0 && multiple && (
					<div className="flex flex-col items-center">
						<p className="text-sm text-muted-foreground mb-2">
							{isUploading
								? "Uploading your images..."
								: `${valueArray.length} of ${maxFiles} images uploaded`}
						</p>

						{!disabled && valueArray.length < maxFiles && (
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="mt-2 rounded-full flex gap-2 px-4"
								disabled={isUploading || disabled}>
								<ImagePlus className="h-4 w-4" />
								Add More Images
							</Button>
						)}
					</div>
				)}
			</div>

			{valueArray.length > 0 && (
				<div
					className={cn(
						"grid gap-4",
						multiple
							? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
							: "grid-cols-1",
					)}>
					{valueArray.map((file, index) => (
						<div
							key={`${file}-${index}`}
							className="relative group rounded-lg overflow-hidden bg-background border shadow-sm transition-all hover:shadow-md">
							<div className="aspect-square w-full relative bg-muted/20">
								<img
									src={file}
									alt={`Uploaded image ${index + 1}`}
									className="h-full w-full object-cover transition-transform group-hover:scale-105"
									onError={(e) => {
										(e.target as HTMLImageElement).src =
											"/placeholder.svg";
									}}
								/>

								{!disabled && (
									<Button
										type="button"
										variant="destructive"
										size="icon"
										className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
										onClick={(e) => {
											e.stopPropagation();
											removeFile(index);
										}}>
										<X className="h-4 w-4" />
										<span className="sr-only">Remove</span>
									</Button>
								)}

								<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
