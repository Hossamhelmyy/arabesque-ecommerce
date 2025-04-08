import { useState, useCallback, useEffect } from "react";
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
import {
	validateFile,
	UploadValidationError,
} from "@/utils/supabase-uploads";
import {
	MAX_FILE_SIZE,
	ALLOWED_FILE_TYPES,
} from "@/utils/env";

// Define the FileUpload component props
export interface FileUploadProps {
	value: string[];
	onChange?: (value: string[]) => void;
	onFilesAdded?: (files: File[]) => Promise<string[]>;
	maxFiles?: number;
	maxSize?: number;
	accept?: Record<string, string[]>;
	className?: string;
	error?: string;
	disabled?: boolean;
	multiple?: boolean;
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
export function FileUpload({
	value = [],
	onChange,
	onFilesAdded,
	maxFiles = 5,
	maxSize = MAX_FILE_SIZE,
	accept = {
		"image/*": ALLOWED_FILE_TYPES,
	},
	className,
	error,
	disabled = false,
	multiple = false,
}: FileUploadProps) {
	const { toast } = useToast();
	const [isUploading, setIsUploading] = useState(false);

	// Make sure value is always an array
	const valueArray = value || [];

	// Define the drop handler
	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			if (disabled) return;

			// Check if exceeding maxFiles
			if (
				valueArray.length + acceptedFiles.length >
				maxFiles
			) {
				toast({
					title: "Upload limit reached",
					description: `You can only upload up to ${maxFiles} file${
						maxFiles === 1 ? "" : "s"
					}`,
					variant: "destructive",
				});
				return;
			}

			try {
				setIsUploading(true);

				// Validate each file using our utility
				for (const file of acceptedFiles) {
					try {
						validateFile(file, maxSize, accept["image/*"]);
					} catch (error) {
						if (error instanceof UploadValidationError) {
							toast({
								title: "Invalid file",
								description: error.message,
								variant: "destructive",
							});
						}
						return;
					}
				}

				// Use the provided handler or create object URLs
				let urls: string[] = [];
				if (onFilesAdded) {
					urls = await onFilesAdded(acceptedFiles);
				} else {
					urls = acceptedFiles.map((file) =>
						URL.createObjectURL(file),
					);
				}

				// Update value with new URLs
				const newValue = [...valueArray, ...urls];
				onChange?.(newValue);
			} catch (error) {
				console.error("Error uploading files:", error);
				toast({
					title: "Upload failed",
					description:
						"There was an error uploading your file(s)",
					variant: "destructive",
				});
			} finally {
				setIsUploading(false);
			}
		},
		[
			disabled,
			maxFiles,
			valueArray,
			toast,
			onChange,
			onFilesAdded,
			maxSize,
			accept,
		],
	);

	// Configure dropzone
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

	// Remove a file
	const removeFile = useCallback(
		(index: number) => {
			if (isUploading || disabled) return;

			const newValueArray = [...valueArray];
			newValueArray.splice(index, 1);
			onChange?.(newValueArray);
		},
		[isUploading, disabled, valueArray, onChange],
	);

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
								? "Drop files here"
								: multiple
								? "Drag & drop files or click to browse"
								: "Drag & drop a file or click to browse"}
						</p>
						<p className="text-xs text-muted-foreground mt-1">
							{multiple
								? `Upload up to ${maxFiles} file${
										maxFiles === 1 ? "" : "s"
								  } (max ${Math.round(
										maxSize / 1024 / 1024,
								  )}MB each)`
								: `Upload a file (max ${Math.round(
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
										? "Select Files"
										: "Select File"}
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
								? "Uploading your file..."
								: "Your uploaded file"}
						</p>
					</div>
				)}

				{valueArray.length > 0 && multiple && (
					<div className="flex flex-col items-center">
						<p className="text-sm text-muted-foreground mb-2">
							{isUploading
								? "Uploading your files..."
								: `${valueArray.length} of ${maxFiles} files uploaded`}
						</p>

						{!disabled && valueArray.length < maxFiles && (
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="mt-2 rounded-full flex gap-2 px-4"
								disabled={isUploading || disabled}>
								<ImagePlus className="h-4 w-4" />
								Add More Files
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
									alt={`Uploaded file ${index + 1}`}
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

			{/* Display error if provided */}
			{error && (
				<p className="text-sm text-destructive mt-2">
					{error}
				</p>
			)}
		</div>
	);
}
