import React, { useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeable } from "react-swipeable";
import { cn } from "@/lib/utils";
import type { Product } from "@/features/products/types";

interface ProductGalleryProps {
	product: Product;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
	product,
}) => {
	const [selectedImageIndex, setSelectedImageIndex] =
		useState(0);
	const [isZoomed, setIsZoomed] = useState(false);
	const [zoomPosition, setZoomPosition] = useState({
		x: 0,
		y: 0,
	});

	const getImageArray = (product: Product) => {
		const mainImage = product.image ? [product.image] : [];
		const additionalImages = product.images || [];
		return [...mainImage, ...additionalImages].filter(
			Boolean,
		);
	};

	const images = getImageArray(product);
	const selectedImage =
		images[selectedImageIndex] || "/placeholder.png";

	const nextImage = () => {
		if (images.length <= 1) return;
		setSelectedImageIndex((prevIndex) =>
			prevIndex === images.length - 1 ? 0 : prevIndex + 1,
		);
	};

	const prevImage = () => {
		if (images.length <= 1) return;
		setSelectedImageIndex((prevIndex) =>
			prevIndex === 0 ? images.length - 1 : prevIndex - 1,
		);
	};

	const handleImageZoom = (
		e: React.MouseEvent<HTMLDivElement>,
	) => {
		if (!isZoomed) return;

		const container = e.currentTarget;
		const rect = container.getBoundingClientRect();

		// Calculate position as percentage
		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;

		setZoomPosition({ x, y });
	};

	const swipeHandlers = useSwipeable({
		onSwipedLeft: nextImage,
		onSwipedRight: prevImage,
		swipeDuration: 500,
		trackMouse: true,
	});

	return (
		<div className="md:sticky md:top-20 space-y-4">
			<div
				className="relative overflow-hidden rounded-lg border bg-background"
				{...swipeHandlers}>
				<div
					onClick={() => setIsZoomed(!isZoomed)}
					onMouseMove={handleImageZoom}
					className={cn(
						"relative w-full h-full cursor-zoom-in transition-all duration-500 ease-in-out",
						isZoomed ? "scale-150" : "scale-100",
					)}
					style={
						isZoomed
							? {
								transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
							}
							: undefined
					}>
					<AspectRatio ratio={1}>
						<img
							key={selectedImage}
							src={selectedImage}
							alt={product.name}
							className="object-cover w-full h-full transition-opacity duration-300"
							onLoad={(e) => {
								(e.target as HTMLImageElement).classList.remove(
									"opacity-0",
								);
							}}
							onError={(e) => {
								(e.target as HTMLImageElement).src =
									"/placeholder.svg";
							}}
						/>
					</AspectRatio>
				</div>

				{images.length > 1 && (
					<>
						<Button
							variant="ghost"
							size="icon"
							className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 text-foreground"
							onClick={prevImage}>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 text-foreground"
							onClick={nextImage}>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</>
				)}
			</div>

			{images.length > 1 && (
				<div className="flex items-center gap-2 overflow-auto pb-2">
					{images.map((image, idx) => (
						<div
							key={idx}
							onClick={() => setSelectedImageIndex(idx)}
							className={`cursor-pointer rounded-md border-2 overflow-hidden flex-shrink-0 w-20 h-20 ${selectedImageIndex === idx
								? "border-primary"
								: "border-transparent"
								}`}>
							<img
								src={image}
								alt={`Product thumbnail ${idx + 1}`}
								className="w-full h-full object-cover"
								onError={(e) => {
									(e.target as HTMLImageElement).src =
										"/placeholder.svg";
								}}
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default ProductGallery;
