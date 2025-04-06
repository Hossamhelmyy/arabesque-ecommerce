import { useTranslation } from "react-i18next";
import {
	useParams,
	Link,
	useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import {
	useQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import {
	Heart,
	Share2,
	ShoppingCart,
	Minus,
	Plus,
	ArrowLeft,
	ChevronLeft,
	ChevronRight,
	Check,
} from "lucide-react";
import { useSwipeable } from "react-swipeable";

type Product = {
	id: string;
	name: string;
	name_ar: string;
	description: string | null;
	description_ar: string | null;
	price: number;
	original_price: number | null;
	image: string;
	images: string[] | null;
	stock_quantity: number;
	is_new: boolean;
	is_on_sale: boolean;
	category_id: string | null;
	slug: string;
};

type Category = {
	id: string;
	name: string;
	name_ar: string;
	slug: string;
};

const ProductDetailPage = () => {
	const { t } = useTranslation();
	const { i18n } = useTranslation();
	const { isRTL } = useLanguage();
	const { slug } = useParams();
	const { addToCart } = useCart();
	const { user } = useAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [quantity, setQuantity] = useState(1);
	const [selectedImageIndex, setSelectedImageIndex] =
		useState(0);
	const [isZoomed, setIsZoomed] = useState(false);
	const [zoomPosition, setZoomPosition] = useState({
		x: 0,
		y: 0,
	});
	const [addedToCart, setAddedToCart] = useState(false);

	const {
		data: product,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["product", slug],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("products")
				.select(
					`
          *,
          categories:category_id (
            id, name, name_ar, slug
          )
        `,
				)
				.eq("slug", slug)
				.single();

			if (error) {
				toast({
					title: t("common.error"),
					description: error.message,
					variant: "destructive",
				});
				throw error;
			}

			return data as Product & { categories: Category };
		},
	});

	const { data: wishlistItem } = useQuery({
		queryKey: ["wishlist", user?.id, product?.id],
		queryFn: async () => {
			if (!user || !product) return null;

			const { data, error } = await supabase
				.from("wish_list")
				.select("id")
				.eq("user_id", user.id)
				.eq("product_id", product.id)
				.single();

			if (error && error.code !== "PGRST116") {
				console.error(
					"Error fetching wishlist status:",
					error,
				);
				return null;
			}

			return data;
		},
		enabled: !!user && !!product,
	});

	// Add to wishlist mutation
	const addToWishlistMutation = useMutation({
		mutationFn: async () => {
			if (!user || !product)
				throw new Error("User or product not available");

			const { data, error } = await supabase
				.from("wish_list")
				.insert({
					user_id: user.id,
					product_id: product.id,
					name: product.name,
					name_ar: product.name_ar,
					price: product.price,
					image: product.image,
					category_id: product.category_id,
				})
				.select()
				.single();

			if (error) throw error;
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["wishlist", user?.id, product?.id],
			});
			queryClient.invalidateQueries({
				queryKey: ["favorites", user?.id],
			});
			toast({
				title: t("product.addedToWishlist"),
				description: t(
					"product.addedToWishlistDescription",
				),
				action: (
					<Button
						size="sm"
						variant="outline"
						onClick={() => navigate("/favorites")}>
						{t("favorites.title")}
					</Button>
				),
			});
		},
		onError: (error) => {
			toast({
				title: t("common.error"),
				description:
					error instanceof Error
						? error.message
						: t("common.unknownError"),
				variant: "destructive",
			});
		},
	});

	// Remove from wishlist mutation
	const removeFromWishlistMutation = useMutation({
		mutationFn: async () => {
			if (!user || !product || !wishlistItem)
				throw new Error("Cannot remove from wishlist");

			const { error } = await supabase
				.from("wish_list")
				.delete()
				.eq("user_id", user.id)
				.eq("product_id", product.id);

			if (error) throw error;
			return true;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["wishlist", user?.id, product?.id],
			});
			queryClient.invalidateQueries({
				queryKey: ["favorites", user?.id],
			});
			toast({
				title: t("product.removedFromWishlist"),
				description: t(
					"product.removedFromWishlistDescription",
				),
			});
		},
		onError: (error) => {
			toast({
				title: t("common.error"),
				description:
					error instanceof Error
						? error.message
						: t("common.unknownError"),
				variant: "destructive",
			});
		},
	});

	// Toggle wishlist function
	const handleToggleWishlist = () => {
		if (!user) {
			toast({
				title: t("auth.required"),
				description: t("auth.requiredToAddToWishlist"),
				action: (
					<Button
						size="sm"
						variant="outline"
						onClick={() => navigate("/auth")}>
						{t("auth.signIn")}
					</Button>
				),
			});
			return;
		}

		if (wishlistItem) {
			removeFromWishlistMutation.mutate();
		} else {
			addToWishlistMutation.mutate();
		}
	};

	useEffect(() => {
		// Reset selected image index and quantity when product changes
		setSelectedImageIndex(0);
		setQuantity(1);
	}, [slug]);

	const handleQuantityChange = (amount: number) => {
		const newQuantity = quantity + amount;
		if (
			newQuantity >= 1 &&
			(!product || newQuantity <= product.stock_quantity)
		) {
			setQuantity(newQuantity);
		}
	};

	const handleAddToCart = () => {
		if (!product) return;

		addToCart({
			id: product.id,
			product_id: product.id,
			quantity,
			name: product.name,
			name_ar: product.name_ar,
			price: product.price,
			image: product.image,
		});

		setAddedToCart(true);
		setTimeout(() => setAddedToCart(false), 2000);

		toast({
			title: t("product.addedToCart"),
			description: t("product.addedToCartDescription"),
			action: (
				<Button
					size="sm"
					variant="outline"
					onClick={() => navigate("/cart")}>
					{t("cart.title")}
				</Button>
			),
		});
	};

	// Share product functionality
	const handleShareProduct = async () => {
		if (!product) return;

		try {
			const shareUrl = window.location.href;
			const shareTitle =
				i18n.language === "ar"
					? product.name_ar
					: product.name;
			const shareText = `${shareTitle} - ${t(
				"product.price",
			)}: $${product.price}`;

			if (navigator.share) {
				await navigator.share({
					title: shareTitle,
					text: shareText,
					url: shareUrl,
				});
			} else {
				// Fallback for browsers that don't support Web Share API
				await navigator.clipboard.writeText(
					`${shareTitle}\n${shareText}\n${shareUrl}`,
				);
				toast({
					title: t("common.success"),
					description: t("product.copiedToClipboard"),
				});
			}
		} catch (error) {
			console.error("Error sharing product:", error);
			// User probably canceled share dialog, no need for error toast
		}
	};

	const getImageArray = (product: Product | undefined) => {
		if (!product) return [];
		const mainImage = product.image;
		const additionalImages = product.images || [];
		return [mainImage, ...additionalImages];
	};

	// Handle image swipe
	const handlers = useSwipeable({
		onSwipedLeft: () => (isRTL ? prevImage() : nextImage()),
		onSwipedRight: () =>
			isRTL ? nextImage() : prevImage(),
		trackMouse: true,
	});

	const nextImage = () => {
		if (!product) return;
		const images = getImageArray(product);
		setSelectedImageIndex((prev) =>
			prev === images.length - 1 ? 0 : prev + 1,
		);
	};

	const prevImage = () => {
		if (!product) return;
		const images = getImageArray(product);
		setSelectedImageIndex((prev) =>
			prev === 0 ? images.length - 1 : prev - 1,
		);
	};

	// Image zoom functionality
	const handleImageZoom = (
		e: React.MouseEvent<HTMLDivElement>,
	) => {
		if (!isZoomed) return;

		const { left, top, width, height } =
			e.currentTarget.getBoundingClientRect();
		const x = ((e.clientX - left) / width) * 100;
		const y = ((e.clientY - top) / height) * 100;

		setZoomPosition({ x, y });
	};

	if (isLoading) {
		return (
			<div className="container py-12">
				<div className="animate-pulse">
					<div
						className={`h-8 w-1/3 bg-muted rounded mb-8 ${
							isRTL ? "mr-auto" : "ml-0"
						}`}></div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="space-y-4">
							<div className="h-[500px] bg-muted rounded-xl"></div>
							<div className="flex gap-2 overflow-hidden">
								{[1, 2, 3, 4].map((_, index) => (
									<div
										key={index}
										className="w-20 h-20 bg-muted rounded-md flex-shrink-0"></div>
								))}
							</div>
						</div>
						<div
							className={
								isRTL ? "text-right" : "text-left"
							}>
							<div
								className={`h-8 w-3/4 bg-muted rounded mb-4 ${
									isRTL ? "mr-0" : "ml-0"
								}`}></div>
							<div
								className={`h-6 w-1/4 bg-muted rounded mb-6 ${
									isRTL ? "mr-0" : "ml-0"
								}`}></div>
							<div className="h-4 w-full bg-muted rounded mb-2"></div>
							<div className="h-4 w-full bg-muted rounded mb-2"></div>
							<div
								className={`h-4 w-3/4 bg-muted rounded mb-6 ${
									isRTL ? "mr-0" : "ml-0"
								}`}></div>
							<div className="h-10 w-full bg-muted rounded"></div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error || !product) {
		return (
			<div className="container py-12">
				<div
					className={`text-center py-12 ${
						isRTL ? "rtl" : "ltr"
					}`}>
					<h1 className="text-2xl font-bold mb-4">
						{t("product.notFound")}
					</h1>
					<p className="text-muted-foreground mb-6">
						{t("product.notFoundDescription")}
					</p>
					<Button asChild>
						<Link to="/products">
							{t("product.browseProducts")}
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	const images = getImageArray(product);
	const isOutOfStock = product.stock_quantity <= 0;
	const displayName =
		i18n.language === "ar" ? product.name_ar : product.name;
	const displayDescription =
		i18n.language === "ar"
			? product.description_ar
			: product.description;
	const categoryName = product.categories
		? i18n.language === "ar"
			? product.categories.name_ar
			: product.categories.name
		: "";
	const categoryLink = product.categories
		? `/category/${product.categories.slug}`
		: "";

	const discountPercentage = product.original_price
		? Math.round(
				(1 - product.price / product.original_price) * 100,
		  )
		: 0;

	return (
		<div className="container py-8 md:py-12">
			<div className="mb-6">
				<Button
					variant="ghost"
					size="sm"
					asChild
					className="mb-4">
					<Link
						to="/products"
						className="flex items-center gap-1">
						<ArrowLeft
							className={`h-4 w-4 ${
								isRTL ? "rotate-180" : ""
							}`}
						/>
						{t("common.backToProducts")}
					</Link>
				</Button>

				{categoryName && (
					<div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
						<Link
							to="/categories"
							className="hover:underline">
							{t("common.categories")}
						</Link>
						<span>/</span>
						{categoryLink ? (
							<Link
								to={categoryLink}
								className="hover:underline">
								{categoryName}
							</Link>
						) : (
							<span>{categoryName}</span>
						)}
					</div>
				)}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
				<div className="space-y-4">
					{/* Main Image with zoom and navigation */}
					<div
						className="relative rounded-xl overflow-hidden border group"
						{...handlers}
						onClick={() => setIsZoomed(!isZoomed)}
						onMouseMove={handleImageZoom}
						onMouseLeave={() => setIsZoomed(false)}>
						<div
							className={`relative overflow-hidden ${
								isZoomed
									? "cursor-zoom-out"
									: "cursor-zoom-in"
							}`}
							style={{ aspectRatio: "1/1" }}>
							<div
								className={`w-full h-full transition-transform duration-500 ${
									isZoomed ? "scale-150" : "scale-100"
								}`}
								style={
									isZoomed
										? {
												transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
										  }
										: undefined
								}>
								<img
									src={images[selectedImageIndex]}
									alt={displayName}
									className="w-full h-full object-cover"
									onError={(e) => {
										(e.target as HTMLImageElement).src =
											"/placeholder.svg";
									}}
								/>
							</div>
						</div>

						{/* Image navigation buttons */}
						<div
							className={`absolute inset-y-0 ${
								isRTL ? "right-0" : "left-0"
							} flex items-center opacity-0 group-hover:opacity-100 transition-opacity`}>
							<Button
								variant="ghost"
								size="icon"
								className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm text-foreground m-2 shadow-md hover:bg-background"
								onClick={(e) => {
									e.stopPropagation();
									prevImage();
								}}>
								{isRTL ? (
									<ChevronRight className="h-6 w-6" />
								) : (
									<ChevronLeft className="h-6 w-6" />
								)}
								<span className="sr-only">
									{t("product.previousImage")}
								</span>
							</Button>
						</div>

						<div
							className={`absolute inset-y-0 ${
								isRTL ? "left-0" : "right-0"
							} flex items-center opacity-0 group-hover:opacity-100 transition-opacity`}>
							<Button
								variant="ghost"
								size="icon"
								className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm text-foreground m-2 shadow-md hover:bg-background"
								onClick={(e) => {
									e.stopPropagation();
									nextImage();
								}}>
								{isRTL ? (
									<ChevronLeft className="h-6 w-6" />
								) : (
									<ChevronRight className="h-6 w-6" />
								)}
								<span className="sr-only">
									{t("product.nextImage")}
								</span>
							</Button>
						</div>

						{/* Badges */}
						<div
							className={`absolute top-4 ${
								isRTL ? "right-4" : "left-4"
							} z-10 flex gap-2`}>
							{product.is_new && (
								<Badge className="bg-emerald-500 text-white shadow-lg px-3 py-1 text-sm font-medium">
									{t("product.new")}
								</Badge>
							)}

							{product.is_on_sale &&
								product.original_price && (
									<Badge
										variant="destructive"
										className="px-3 py-1 text-sm shadow-lg font-medium">
										-{discountPercentage}%
									</Badge>
								)}
						</div>

						{/* Image counter */}
						<div
							className={`absolute bottom-4 ${
								isRTL ? "left-4" : "right-4"
							} z-10`}>
							<div className="bg-background/80 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-sm shadow-lg">
								{selectedImageIndex + 1} / {images.length}
							</div>
						</div>
					</div>

					{/* Thumbnail gallery */}
					{images.length > 1 && (
						<div className="grid grid-cols-5 gap-2">
							{images.map((image, index) => (
								<div
									key={index}
									onClick={() =>
										setSelectedImageIndex(index)
									}
									className={`relative cursor-pointer h-20 rounded-md overflow-hidden border-2 transition-all ${
										selectedImageIndex === index
											? "border-primary ring-2 ring-primary/25"
											: "border-muted hover:border-muted-foreground"
									}`}>
									<img
										src={image}
										alt={`${displayName} - ${index + 1}`}
										className="h-full w-full object-cover"
										onError={(e) => {
											(e.target as HTMLImageElement).src =
												"/placeholder.svg";
										}}
									/>
									{selectedImageIndex === index && (
										<div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
											<div className="w-5 h-5 rounded-full bg-primary/90 flex items-center justify-center">
												<Check className="h-3 w-3 text-white" />
											</div>
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</div>

				<div className="space-y-8">
					<div className="space-y-4">
						<div className="space-y-2">
							{/* Tags/Badges */}
							<div className="flex flex-wrap gap-2 mb-2">
								{product.is_new && (
									<Badge
										variant="outline"
										className="bg-background text-foreground border border-primary/20">
										{t("product.new")}
									</Badge>
								)}
								{!isOutOfStock ? (
									<Badge
										variant="outline"
										className="bg-background text-foreground border border-green-500/20 text-green-600">
										{t("product.inStock")}
									</Badge>
								) : (
									<Badge
										variant="outline"
										className="bg-background text-foreground border border-red-500/20 text-red-500">
										{t("product.outOfStock")}
									</Badge>
								)}
							</div>

							{/* Product title */}
							<h1 className="text-3xl md:text-4xl font-bold">
								{displayName}
							</h1>

							{/* Pricing section */}
							<div className="mt-4 flex items-baseline gap-2">
								{product.original_price ? (
									<>
										<span className="text-3xl font-bold text-red-500">
											${product.price.toFixed(2)}
										</span>
										<span className="text-muted-foreground line-through text-lg">
											${product.original_price.toFixed(2)}
										</span>
										<span
											className={`${
												isRTL ? "mr-2" : "ml-2"
											} text-sm text-green-600 font-medium`}>
											{t("product.saveAmount", {
												amount: (
													product.original_price -
													product.price
												).toFixed(2),
											})}
										</span>
									</>
								) : (
									<span className="text-3xl font-bold">
										${product.price.toFixed(2)}
									</span>
								)}
							</div>
						</div>

						{displayDescription && (
							<div className="prose prose-sm dark:prose-invert max-w-none">
								<p className="text-muted-foreground leading-relaxed">
									{displayDescription}
								</p>
							</div>
						)}

						<Separator className="my-6" />

						{/* Quantity selector and buttons */}
						<div className="space-y-6">
							<div className="flex flex-wrap items-center gap-4">
								<span className="font-medium">
									{t("product.quantity")}:
								</span>
								<div className="flex items-center border rounded-full overflow-hidden bg-muted/30">
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => handleQuantityChange(-1)}
										disabled={quantity <= 1}
										className="h-10 w-10 rounded-none">
										<Minus className="h-4 w-4" />
										<span className="sr-only">
											{t("product.decreaseQuantity")}
										</span>
									</Button>
									<span className="w-12 text-center font-medium">
										{quantity}
									</span>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => handleQuantityChange(1)}
										disabled={
											isOutOfStock ||
											quantity >= product.stock_quantity
										}
										className="h-10 w-10 rounded-none">
										<Plus className="h-4 w-4" />
										<span className="sr-only">
											{t("product.increaseQuantity")}
										</span>
									</Button>
								</div>

								{product.stock_quantity > 0 && (
									<span className="text-sm text-muted-foreground">
										{product.stock_quantity}{" "}
										{t("product.itemsLeft")}
									</span>
								)}
							</div>

							<div className="flex flex-col sm:flex-row gap-4">
								<Button
									onClick={handleAddToCart}
									disabled={isOutOfStock}
									size="lg"
									className={`flex-1 gap-2 transition-all ${
										addedToCart
											? "bg-green-600 hover:bg-green-700"
											: ""
									}`}>
									{addedToCart ? (
										<>
											<Check className="h-5 w-5 animate-fadeIn" />
											{t("product.addedToCart")}
										</>
									) : (
										<>
											<ShoppingCart className="h-5 w-5" />
											{t("product.addToCart")}
										</>
									)}
								</Button>

								<div className="flex gap-2">
									<Button
										variant="outline"
										size="icon"
										onClick={handleToggleWishlist}
										className={`h-12 w-12 rounded-full ${
											wishlistItem
												? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100 hover:text-red-600"
												: ""
										}`}>
										<Heart
											className={`h-5 w-5 transition-all duration-300 ${
												wishlistItem
													? "fill-current text-red-500"
													: ""
											}`}
										/>
										<span className="sr-only">
											{wishlistItem
												? t("product.removeFromWishlist")
												: t("product.addToWishlist")}
										</span>
									</Button>

									<Button
										variant="outline"
										size="icon"
										onClick={handleShareProduct}
										className="h-12 w-12 rounded-full">
										<Share2 className="h-5 w-5" />
										<span className="sr-only">
											{t("product.share")}
										</span>
									</Button>
								</div>
							</div>
						</div>

						{/* Product metadata */}
						<div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-y-4 text-sm bg-muted/30 p-4 rounded-lg">
							<div
								className={
									isRTL ? "text-right" : "text-left"
								}>
								<span className="font-medium text-muted-foreground">
									{t("product.sku")}:{" "}
								</span>
								<span>
									{product.id.substring(0, 8).toUpperCase()}
								</span>
							</div>
							<div
								className={
									isRTL ? "text-right" : "text-left"
								}>
								<span className="font-medium text-muted-foreground">
									{t("product.category")}:{" "}
								</span>
								<span>
									{categoryName ||
										t("product.uncategorized")}
								</span>
							</div>
							<div
								className={
									isRTL ? "text-right" : "text-left"
								}>
								<span className="font-medium text-muted-foreground">
									{t("product.availability")}:{" "}
								</span>
								<span
									className={
										isOutOfStock
											? "text-red-500"
											: "text-green-600"
									}>
									{isOutOfStock
										? t("product.outOfStock")
										: t("product.inStock")}
								</span>
							</div>
						</div>

						<Separator className="my-6" />

						{/* Product tabs */}
						<Tabs defaultValue="details" className="mt-8">
							<TabsList className="grid grid-cols-2 w-full">
								<TabsTrigger value="details">
									{t("product.details")}
								</TabsTrigger>
								<TabsTrigger value="shipping">
									{t("product.shipping")}
								</TabsTrigger>
							</TabsList>
							<TabsContent value="details" className="pt-6">
								<div className="space-y-4">
									<p
										className={`text-muted-foreground ${
											isRTL ? "text-right" : "text-left"
										}`}>
										{displayDescription}
									</p>
								</div>
							</TabsContent>
							<TabsContent
								value="shipping"
								className="pt-6">
								<div className="space-y-4">
									<p
										className={`text-muted-foreground ${
											isRTL ? "text-right" : "text-left"
										}`}>
										{t("product.shippingDescription")}
									</p>
									<ul
										className={`list-disc ${
											isRTL
												? "rtl:list-inside text-right pr-4"
												: "list-inside text-left ml-4"
										} text-muted-foreground space-y-2`}>
										<li>{t("product.shippingPoint1")}</li>
										<li>{t("product.shippingPoint2")}</li>
										<li>{t("product.shippingPoint3")}</li>
									</ul>
								</div>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductDetailPage;
