import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Search,
	ExternalLink,
	Calendar,
	Clock,
	User,
	MapPin,
	Phone,
	Mail,
	Truck,
	Package,
	CreditCard,
	Loader2,
	Eye,
} from "lucide-react";
import { useOrders } from "@/features/admin/hooks/useOrders";
import { ORDER_STATUS } from "@/features/admin/constants";

const Orders = () => {
	const {
		filteredOrders,
		selectedOrder,
		orderItems,
		isLoading,
		isSubmitting,
		isItemsLoading,
		statusFilter,
		searchQuery,
		handleSearch,
		handleStatusFilter,
		viewOrderDetails,
		updateOrderStatus,
		getShippingAddressProperty,
		formatDate,
		formatTime,
		getStatusBadge,
		formatCurrency,
	} = useOrders();

	return (
		<div className="space-y-6 animate-in fade-in">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Orders
					</h1>
					<p className="text-muted-foreground mt-1">
						Manage your orders and tracking information
					</p>
				</div>

				<div className="flex flex-col sm:flex-row gap-3">
					<div className="relative">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search orders..."
							className="pl-8 w-full sm:w-[250px]"
							value={searchQuery}
							onChange={(e) => handleSearch(e.target.value)}
						/>
					</div>
					<Select
						value={statusFilter}
						onValueChange={handleStatusFilter}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Filter by status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">
								All Statuses
							</SelectItem>
							{ORDER_STATUS.map((status) => (
								<SelectItem
									key={status.value}
									value={status.value}>
									{status.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Orders Table */}
			<div className="rounded-md border shadow-sm bg-card">
				<div className="relative w-full overflow-auto">
					<Table>
						<TableHeader className="bg-muted/50">
							<TableRow>
								<TableHead className="text-start">
									Order
								</TableHead>
								<TableHead className="text-start">
									Date
								</TableHead>
								<TableHead className="text-start">
									Customer
								</TableHead>
								<TableHead className="text-start">
									Status
								</TableHead>
								<TableHead className="text-start">
									Amount
								</TableHead>
								<TableHead className="text-right">
									Actions
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								Array.from({ length: 5 }).map(
									(_, index) => (
										<TableRow key={index}>
											<TableCell>
												<Skeleton className="h-4 w-[80px]" />
											</TableCell>
											<TableCell>
												<div className="flex flex-col space-y-1">
													<Skeleton className="h-4 w-[120px]" />
													<Skeleton className="h-3 w-[100px]" />
												</div>
											</TableCell>
											<TableCell>
												<Skeleton className="h-4 w-[150px]" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-5 w-[70px]" />
											</TableCell>
											<TableCell className="text-right">
												<Skeleton className="h-4 w-[80px] ml-auto" />
											</TableCell>
											<TableCell className="text-right">
												<Skeleton className="h-8 w-8 rounded-md ml-auto" />
											</TableCell>
										</TableRow>
									),
								)
							) : filteredOrders.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={6}
										className="h-24 text-center">
										No orders found.
									</TableCell>
								</TableRow>
							) : (
								filteredOrders.map((order) => (
									<TableRow
										key={order.id}
										className="group hover:bg-muted/50">
										<TableCell className="font-medium text-sm">
											#{order.id.substring(0, 8)}...
										</TableCell>
										<TableCell>
											<div className="flex flex-col space-y-1">
												<div className="flex items-center">
													<Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
													<span className="text-sm">
														{formatDate(order.created_at)}
													</span>
												</div>
												<div className="flex items-center">
													<Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
													<span className="text-xs text-muted-foreground">
														{formatTime(order.created_at)}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="text-sm">
											{order.user?.email ? (
												<div className="flex items-center">
													<User className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
													<span>{order.user.email}</span>
												</div>
											) : (
												<span className="text-muted-foreground italic flex items-center">
													<User className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
													Guest
												</span>
											)}
										</TableCell>
										<TableCell>
											{getStatusBadge(order.status)}
										</TableCell>
										<TableCell className="text-right font-medium text-sm">
											{formatCurrency(order.total)}
										</TableCell>
										<TableCell className="text-right">
											<Dialog>
												<DialogTrigger asChild>
													<Button
														variant="outline"
														size="sm"
														className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
														onClick={() =>
															viewOrderDetails(order)
														}>
														<Eye className="h-4 w-4 mr-2" />
														View
													</Button>
												</DialogTrigger>

												{selectedOrder && (
													<DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
														<DialogHeader>
															<DialogTitle className="text-xl">
																Order Details
															</DialogTitle>
															<DialogDescription>
																Viewing order #
																{selectedOrder.id.substring(
																	0,
																	8,
																)}
																...
															</DialogDescription>
														</DialogHeader>

														<div className="flex-1 overflow-auto py-4">
															<Tabs
																defaultValue="summary"
																className="w-full">
																<TabsList className="grid w-full grid-cols-3 mb-4">
																	<TabsTrigger
																		value="summary"
																		className="text-sm">
																		Summary
																	</TabsTrigger>
																	<TabsTrigger
																		value="items"
																		className="text-sm">
																		Items
																	</TabsTrigger>
																	<TabsTrigger
																		value="shipping"
																		className="text-sm">
																		Shipping
																	</TabsTrigger>
																</TabsList>

																<TabsContent
																	value="summary"
																	className="space-y-4">
																	<Card>
																		<CardHeader>
																			<CardTitle>
																				Order Summary
																			</CardTitle>
																		</CardHeader>
																		<CardContent className="space-y-4">
																			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
																				<div>
																					<h3 className="font-medium mb-2">
																						Order Details
																					</h3>
																					<div className="grid grid-cols-2 gap-2 text-sm">
																						<div className="text-muted-foreground">
																							Order ID:
																						</div>
																						<div>
																							#
																							{selectedOrder.id.substring(
																								0,
																								8,
																							)}
																							...
																						</div>
																						<div className="text-muted-foreground">
																							Date:
																						</div>
																						<div>
																							{formatDate(
																								selectedOrder.created_at,
																							)}
																						</div>
																						<div className="text-muted-foreground">
																							Status:
																						</div>
																						<div>
																							{getStatusBadge(
																								selectedOrder.status,
																							)}
																						</div>
																						<div className="text-muted-foreground">
																							Payment:
																						</div>
																						<div className="capitalize">
																							{selectedOrder.payment_method ||
																								"Not specified"}
																						</div>
																					</div>
																				</div>

																				<div>
																					<h3 className="font-medium mb-2">
																						Customer
																					</h3>
																					<div className="space-y-2 text-sm">
																						<div className="flex items-center gap-2">
																							<User className="h-4 w-4 text-muted-foreground" />
																							<span>
																								{getShippingAddressProperty(
																									selectedOrder,
																									"name",
																								)}
																							</span>
																						</div>
																						<div className="flex items-center gap-2">
																							<Mail className="h-4 w-4 text-muted-foreground" />
																							<span>
																								{selectedOrder
																									.user
																									?.email ||
																									getShippingAddressProperty(
																										selectedOrder,
																										"email",
																									)}
																							</span>
																						</div>
																						<div className="flex items-center gap-2">
																							<Phone className="h-4 w-4 text-muted-foreground" />
																							<span>
																								{getShippingAddressProperty(
																									selectedOrder,
																									"phone",
																								)}
																							</span>
																						</div>
																					</div>
																				</div>
																			</div>

																			<div>
																				<h3 className="font-medium mb-2">
																					Shipping Address
																				</h3>
																				<div className="grid grid-cols-1 gap-2">
																					<div className="flex items-start gap-2 text-sm">
																						<MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
																						<div>
																							<p>
																								{getShippingAddressProperty(
																									selectedOrder,
																									"address",
																								)}
																							</p>
																							<p>
																								{getShippingAddressProperty(
																									selectedOrder,
																									"city",
																								)}
																								,{" "}
																								{getShippingAddressProperty(
																									selectedOrder,
																									"postal_code",
																								)}
																							</p>
																							<p>
																								{getShippingAddressProperty(
																									selectedOrder,
																									"country",
																								)}
																							</p>
																						</div>
																					</div>
																				</div>
																			</div>

																			<div className="border-t pt-4 mt-4">
																				<div className="flex justify-between font-medium">
																					<span>Total</span>
																					<span>
																						{formatCurrency(
																							selectedOrder.total,
																						)}
																					</span>
																				</div>
																			</div>
																		</CardContent>
																	</Card>

																	<div className="flex justify-end mt-4">
																		<Select
																			defaultValue={
																				selectedOrder.status
																			}
																			onValueChange={(
																				status,
																			) =>
																				updateOrderStatus(
																					selectedOrder.id,
																					status,
																				)
																			}
																			disabled={
																				isSubmitting
																			}>
																			<SelectTrigger className="w-[180px]">
																				<SelectValue placeholder="Update status" />
																			</SelectTrigger>
																			<SelectContent>
																				{ORDER_STATUS.map(
																					(status) => (
																						<SelectItem
																							key={
																								status.value
																							}
																							value={
																								status.value
																							}>
																							{status.label}
																						</SelectItem>
																					),
																				)}
																			</SelectContent>
																		</Select>
																	</div>
																</TabsContent>

																<TabsContent
																	value="items"
																	className="space-y-4">
																	<Card>
																		<CardHeader>
																			<CardTitle>
																				Order Items
																			</CardTitle>
																			<CardDescription>
																				Products included in
																				this order
																			</CardDescription>
																		</CardHeader>
																		<CardContent>
																			{isItemsLoading ? (
																				<div className="space-y-4">
																					{Array.from({
																						length: 3,
																					}).map(
																						(_, index) => (
																							<div
																								key={index}
																								className="flex space-x-4">
																								<Skeleton className="w-12 h-12 rounded-md" />
																								<div className="space-y-2 flex-1">
																									<Skeleton className="h-4 w-3/4" />
																									<Skeleton className="h-4 w-1/2" />
																								</div>
																							</div>
																						),
																					)}
																				</div>
																			) : orderItems.length ===
																			  0 ? (
																				<div className="text-center py-4 text-muted-foreground">
																					No items found for
																					this order.
																				</div>
																			) : (
																				<div className="space-y-4">
																					{orderItems.map(
																						(item) => (
																							<div
																								key={
																									item.id
																								}
																								className="flex items-start space-x-4 pb-4 border-b last:border-0">
																								<div className="w-16 h-16 rounded-md border overflow-hidden bg-background flex-shrink-0">
																									{item
																										.product
																										?.image ? (
																										<img
																											src={
																												item
																													.product
																													.image
																											}
																											alt={
																												item
																													.product
																													.name
																											}
																											className="w-full h-full object-cover"
																											onError={(
																												e,
																											) => {
																												(
																													e.target as HTMLImageElement
																												).src =
																													"https://placehold.co/100?text=No+Image";
																											}}
																										/>
																									) : (
																										<div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
																											No
																											image
																										</div>
																									)}
																								</div>
																								<div className="flex-1 min-w-0">
																									<h4 className="font-medium text-sm">
																										{item
																											.product
																											?.name ||
																											"Unknown Product"}
																									</h4>
																									<div className="text-sm text-muted-foreground">
																										Quantity:{" "}
																										{
																											item.quantity
																										}
																									</div>
																									<div className="text-sm">
																										Price:{" "}
																										{formatCurrency(
																											item.price,
																										)}
																									</div>
																								</div>
																								<div className="text-right">
																									<div className="font-medium">
																										{formatCurrency(
																											item.price *
																												item.quantity,
																										)}
																									</div>
																								</div>
																							</div>
																						),
																					)}
																				</div>
																			)}
																		</CardContent>
																	</Card>
																</TabsContent>

																<TabsContent
																	value="shipping"
																	className="space-y-4">
																	<Card>
																		<CardHeader>
																			<CardTitle>
																				Shipping Information
																			</CardTitle>
																		</CardHeader>
																		<CardContent className="space-y-4">
																			<div className="space-y-2">
																				<h3 className="font-medium">
																					Delivery Address
																				</h3>
																				<div className="grid grid-cols-1 gap-2">
																					<div className="flex items-start gap-2">
																						<MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
																						<div>
																							<p>
																								{getShippingAddressProperty(
																									selectedOrder,
																									"address",
																								)}
																							</p>
																							<p>
																								{getShippingAddressProperty(
																									selectedOrder,
																									"city",
																								)}
																								,{" "}
																								{getShippingAddressProperty(
																									selectedOrder,
																									"postal_code",
																								)}
																							</p>
																							<p>
																								{getShippingAddressProperty(
																									selectedOrder,
																									"country",
																								)}
																							</p>
																						</div>
																					</div>
																				</div>
																			</div>

																			<div className="space-y-2">
																				<h3 className="font-medium">
																					Recipient
																				</h3>
																				<div className="grid grid-cols-1 gap-2">
																					<div className="flex items-center gap-2">
																						<User className="h-4 w-4 text-muted-foreground" />
																						<span>
																							{getShippingAddressProperty(
																								selectedOrder,
																								"name",
																							)}
																						</span>
																					</div>
																					<div className="flex items-center gap-2">
																						<Phone className="h-4 w-4 text-muted-foreground" />
																						<span>
																							{getShippingAddressProperty(
																								selectedOrder,
																								"phone",
																							)}
																						</span>
																					</div>
																					<div className="flex items-center gap-2">
																						<Mail className="h-4 w-4 text-muted-foreground" />
																						<span>
																							{selectedOrder
																								.user
																								?.email ||
																								getShippingAddressProperty(
																									selectedOrder,
																									"email",
																								)}
																						</span>
																					</div>
																				</div>
																			</div>

																			<div className="space-y-2">
																				<h3 className="font-medium">
																					Shipping Method
																				</h3>
																				<div className="flex items-center gap-2">
																					<Truck className="h-4 w-4 text-muted-foreground" />
																					<span>
																						Standard
																						Shipping
																					</span>
																				</div>
																			</div>
																		</CardContent>
																	</Card>
																</TabsContent>
															</Tabs>
														</div>

														<DialogFooter className="mt-4 pt-4 border-t">
															<DialogClose asChild>
																<Button>Close</Button>
															</DialogClose>
														</DialogFooter>
													</DialogContent>
												)}
											</Dialog>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
};

export default Orders;
