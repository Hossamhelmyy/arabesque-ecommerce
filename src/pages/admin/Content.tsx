import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Pencil,
	Trash2,
	Plus,
	LayoutTemplate,
	Image as ImageIcon,
	Megaphone,
	Newspaper,
	MessageSquareText,
	File,
	Loader2,
	ArrowUpDown,
} from "lucide-react";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
	useContent,
	Banner,
	Promotion,
	Page,
} from "@/features/admin/hooks/useContent";

// SortableItem component
const SortableItem = ({
	id,
	title,
	image,
	active,
	position,
}: {
	id: string;
	title: string;
	image: string;
	active: boolean;
	position: number;
}) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
	} = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="flex items-center space-x-4 p-4 border rounded-md bg-white dark:bg-gray-800 cursor-move"
			{...attributes}
			{...listeners}>
			<div className="flex-none">
				<ArrowUpDown className="h-5 w-5 text-muted-foreground" />
			</div>
			<div className="flex-none w-16 h-16 rounded-md overflow-hidden">
				<img
					src={image}
					alt={title}
					className="w-full h-full object-cover"
					onError={(e) => {
						(e.target as HTMLImageElement).src =
							"https://placehold.co/400?text=Error+Loading";
					}}
				/>
			</div>
			<div className="flex-1">
				<h3 className="font-medium">{title}</h3>
				<p className="text-sm text-muted-foreground">
					Position: {position}
				</p>
			</div>
			<div className="flex-none">
				<span
					className={`px-2 py-1 text-xs rounded-full ${
						active
							? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
							: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
					}`}>
					{active ? "Active" : "Inactive"}
				</span>
			</div>
			<div className="flex-none">
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8">
					<Pencil className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
};

const Content = () => {
	const {
		banners,
		promotions,
		pages,
		isLoading,
		isSubmitting,
		updateBannerOrder,
	} = useContent();

	const { toast } = useToast();

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (active.id !== over?.id) {
			const oldIndex = banners.findIndex(
				(item) => item.id === active.id,
			);
			const newIndex = banners.findIndex(
				(item) => item.id === over?.id,
			);

			// Create a new array with updated positions
			const newItems = arrayMove(
				banners,
				oldIndex,
				newIndex,
			).map((item, index) => ({
				...item,
				position: index + 1,
			}));

			// Update banner order through the hook
			updateBannerOrder(newItems);
		}
	};

	if (isLoading) {
		return (
			<div className="p-6 flex justify-center items-center h-[calc(100vh-100px)]">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Content Management
				</h1>
				<p className="text-muted-foreground">
					Manage your store's content and marketing
					materials
				</p>
			</div>

			<Tabs defaultValue="banners" className="space-y-4">
				<TabsList>
					<TabsTrigger
						value="banners"
						className="flex items-center gap-2">
						<LayoutTemplate className="h-4 w-4" />
						<span>Banners</span>
					</TabsTrigger>
					<TabsTrigger
						value="promotions"
						className="flex items-center gap-2">
						<Megaphone className="h-4 w-4" />
						<span>Promotions</span>
					</TabsTrigger>
					<TabsTrigger
						value="pages"
						className="flex items-center gap-2">
						<File className="h-4 w-4" />
						<span>Pages</span>
					</TabsTrigger>
				</TabsList>

				<TabsContent value="banners" className="space-y-4">
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-semibold">
							Homepage Banners
						</h2>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Add Banner
						</Button>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Manage Banners</CardTitle>
							<CardDescription>
								Drag and drop to reorder banners. Click on a
								banner to edit it.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<DndContext
								sensors={sensors}
								collisionDetection={closestCenter}
								onDragEnd={handleDragEnd}>
								<SortableContext
									items={banners.map((item) => item.id)}
									strategy={verticalListSortingStrategy}>
									<div className="space-y-2">
										{banners.map((item) => (
											<SortableItem
												key={item.id}
												{...item}
											/>
										))}
									</div>
								</SortableContext>
							</DndContext>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent
					value="promotions"
					className="space-y-4">
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-semibold">
							Promotional Campaigns
						</h2>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Add Promotion
						</Button>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Active Promotions</CardTitle>
							<CardDescription>
								Manage promotional campaigns and discount
								codes
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Title</TableHead>
											<TableHead>Code</TableHead>
											<TableHead>Start Date</TableHead>
											<TableHead>End Date</TableHead>
											<TableHead>Status</TableHead>
											<TableHead className="text-right">
												Actions
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{promotions.map((promo) => (
											<TableRow key={promo.id}>
												<TableCell className="font-medium">
													{promo.title}
												</TableCell>
												<TableCell>
													<code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
														{promo.code}
													</code>
												</TableCell>
												<TableCell>
													{promo.startDate}
												</TableCell>
												<TableCell>
													{promo.endDate}
												</TableCell>
												<TableCell>
													<span
														className={`px-2 py-1 text-xs rounded-full ${
															promo.active
																? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
																: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
														}`}>
														{promo.active
															? "Active"
															: "Inactive"}
													</span>
												</TableCell>
												<TableCell className="text-right">
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8">
														<Pencil className="h-4 w-4" />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8 text-red-500">
														<Trash2 className="h-4 w-4" />
													</Button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="pages" className="space-y-4">
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-semibold">
							Static Pages
						</h2>
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							Add Page
						</Button>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Content Pages</CardTitle>
							<CardDescription>
								Manage static pages like About Us, Terms of
								Service, etc.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Accordion
								type="single"
								collapsible
								className="w-full">
								{pages.map((page) => (
									<AccordionItem
										key={page.id}
										value={page.slug}>
										<AccordionTrigger className="hover:bg-gray-50 dark:hover:bg-gray-800 px-4 rounded-md">
											<div className="flex items-center gap-2">
												<File className="h-4 w-4" />
												<span>{page.title}</span>
											</div>
										</AccordionTrigger>
										<AccordionContent className="px-4">
											<div className="flex justify-between items-center py-2">
												<p className="text-sm text-muted-foreground">
													Last updated: {page.lastUpdated}
												</p>
												<div>
													<Button
														variant="outline"
														size="sm">
														Preview
													</Button>
													<Button
														className="ml-2"
														size="sm">
														Edit
													</Button>
												</div>
											</div>
										</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default Content;
