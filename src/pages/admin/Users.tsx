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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Search,
	MoreHorizontal,
	Mail,
	Calendar,
	Phone,
	MapPin,
	ShoppingCart,
	Clock,
	User,
	Shield,
	Loader2,
	Ban,
} from "lucide-react";
import useUsers from "@/features/admin/hooks/useUsers";

const Users = () => {
	const {
		users,
		selectedUser,
		userOrders,
		isLoading,
		isSubmitting,
		isOrdersLoading,
		searchQuery,
		setSearchQuery,
		viewUserDetails,
		updateUserRole,
		formatDate,
		formatCurrency,
		getInitials,
		getFullName,
	} = useUsers();

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Users
				</h1>
				<p className="text-muted-foreground">
					Manage your users and customers
				</p>
			</div>

			<div className="flex items-center">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search users..."
						className="pl-8"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-start">
								User
							</TableHead>
							<TableHead className="text-start">
								Joined
							</TableHead>
							<TableHead className="text-start">
								Role
							</TableHead>
							<TableHead className="text-start">
								Orders
							</TableHead>
							<TableHead className="text-start">
								Total Spent
							</TableHead>
							<TableHead className="text-right">
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							Array.from({ length: 5 }).map((_, index) => (
								<TableRow key={index}>
									<TableCell>
										<div className="flex items-center gap-3">
											<Skeleton className="h-9 w-9 rounded-full" />
											<div className="space-y-1">
												<Skeleton className="h-4 w-[150px]" />
												<Skeleton className="h-3 w-[120px]" />
											</div>
										</div>
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-[100px]" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-5 w-[70px]" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-[30px]" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-[80px]" />
									</TableCell>
									<TableCell className="text-right">
										<Skeleton className="h-8 w-8 rounded-md ml-auto" />
									</TableCell>
								</TableRow>
							))
						) : users.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={6}
									className="h-24 text-center">
									No users found.
								</TableCell>
							</TableRow>
						) : (
							users.map((user) => (
								<TableRow key={user.id}>
									<TableCell>
										<div className="flex items-center gap-3">
											<Avatar>
												<AvatarImage
													src={
														user.profile?.avatar_url || ""
													}
												/>
												<AvatarFallback>
													{getInitials(user)}
												</AvatarFallback>
											</Avatar>
											<div>
												<div className="font-medium">
													{getFullName(user)}
												</div>
												<div className="text-sm text-muted-foreground">
													{user.email}
												</div>
											</div>
										</div>
									</TableCell>
									<TableCell>
										{formatDate(user.created_at)}
									</TableCell>
									<TableCell>
										<Badge
											variant={
												user.role === "admin"
													? "default"
													: "outline"
											}>
											{user.role || "user"}
										</Badge>
									</TableCell>
									<TableCell>{user.orders_count}</TableCell>
									<TableCell>
										{formatCurrency(user.total_spent || 0)}
									</TableCell>
									<TableCell className="text-right">
										<Dialog>
											<DialogTrigger asChild>
												<Button
													variant="outline"
													size="sm"
													className="ml-auto"
													onClick={() =>
														viewUserDetails(user)
													}>
													<User className="h-4 w-4 mr-2" />
													View
												</Button>
											</DialogTrigger>
											<DialogContent className="sm:max-w-[800px]">
												<DialogHeader>
													<DialogTitle>
														User Details
													</DialogTitle>
													<DialogDescription>
														Viewing user {user.email}
													</DialogDescription>
												</DialogHeader>

												{selectedUser && (
													<Tabs
														defaultValue="details"
														className="mt-4">
														<TabsList>
															<TabsTrigger value="details">
																Profile
															</TabsTrigger>
															<TabsTrigger value="orders">
																Orders
															</TabsTrigger>
															<TabsTrigger value="admin">
																Admin
															</TabsTrigger>
														</TabsList>
														<TabsContent
															value="details"
															className="space-y-4">
															<Card>
																<CardHeader>
																	<CardTitle>
																		Personal Information
																	</CardTitle>
																</CardHeader>
																<CardContent className="space-y-4">
																	<div className="flex items-center gap-4">
																		<Avatar className="h-20 w-20">
																			<AvatarImage
																				src={
																					selectedUser
																						.profile
																						?.avatar_url ||
																					""
																				}
																			/>
																			<AvatarFallback className="text-lg">
																				{getInitials(
																					selectedUser,
																				)}
																			</AvatarFallback>
																		</Avatar>
																		<div>
																			<h3 className="text-xl font-semibold">
																				{getFullName(
																					selectedUser,
																				)}
																			</h3>
																			<div className="flex items-center gap-2 text-muted-foreground">
																				<Mail className="h-4 w-4" />
																				<span>
																					{
																						selectedUser.email
																					}
																				</span>
																			</div>
																			<div className="flex items-center gap-2 text-muted-foreground mt-1">
																				<Calendar className="h-4 w-4" />
																				<span>
																					Joined{" "}
																					{formatDate(
																						selectedUser.created_at,
																					)}
																				</span>
																			</div>
																		</div>
																	</div>

																	<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
																		<div className="space-y-1">
																			<div className="text-sm font-medium">
																				Phone
																			</div>
																			<div className="flex items-center gap-2">
																				<Phone className="h-4 w-4 text-muted-foreground" />
																				<span>
																					{selectedUser
																						.profile
																						?.phone ||
																						"Not provided"}
																				</span>
																			</div>
																		</div>
																		<div className="space-y-1">
																			<div className="text-sm font-medium">
																				Address
																			</div>
																			<div className="flex items-center gap-2">
																				<MapPin className="h-4 w-4 text-muted-foreground" />
																				<span>
																					{selectedUser
																						.profile
																						?.address
																						? `${
																								selectedUser
																									.profile
																									.address
																									?.address ||
																								""
																						  }, ${
																								selectedUser
																									.profile
																									.address
																									?.city ||
																								""
																						  }, ${
																								selectedUser
																									.profile
																									.address
																									?.postal_code ||
																								""
																						  }, ${
																								selectedUser
																									.profile
																									.address
																									?.country ||
																								""
																						  }`
																						: "Not provided"}
																				</span>
																			</div>
																		</div>
																	</div>

																	<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
																		<Card>
																			<CardHeader className="pb-2">
																				<CardTitle className="text-sm font-medium">
																					Orders
																				</CardTitle>
																			</CardHeader>
																			<CardContent>
																				<div className="flex items-center space-x-2">
																					<ShoppingCart className="h-4 w-4 text-muted-foreground" />
																					<span>
																						{
																							selectedUser.orders_count
																						}{" "}
																						orders
																					</span>
																				</div>
																			</CardContent>
																		</Card>
																		<Card>
																			<CardHeader className="pb-2">
																				<CardTitle className="text-sm font-medium">
																					Total Spent
																				</CardTitle>
																			</CardHeader>
																			<CardContent>
																				<div className="flex items-center space-x-2">
																					<span className="text-xl font-bold">
																						{formatCurrency(
																							selectedUser.total_spent ||
																								0,
																						)}
																					</span>
																				</div>
																			</CardContent>
																		</Card>
																	</div>
																</CardContent>
															</Card>
														</TabsContent>

														<TabsContent
															value="orders"
															className="space-y-4">
															<Card>
																<CardHeader>
																	<CardTitle>
																		Order History
																	</CardTitle>
																	<CardDescription>
																		Last {userOrders.length}{" "}
																		orders by this user
																	</CardDescription>
																</CardHeader>
																<CardContent>
																	{isOrdersLoading ? (
																		<div className="flex items-center justify-center p-8">
																			<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
																		</div>
																	) : userOrders.length ===
																	  0 ? (
																		<div className="text-center py-8 text-muted-foreground">
																			This user has no
																			orders yet.
																		</div>
																	) : (
																		<div className="rounded-md border">
																			<Table>
																				<TableHeader>
																					<TableRow>
																						<TableHead>
																							Order ID
																						</TableHead>
																						<TableHead>
																							Date
																						</TableHead>
																						<TableHead>
																							Status
																						</TableHead>
																						<TableHead className="text-right">
																							Amount
																						</TableHead>
																					</TableRow>
																				</TableHeader>
																				<TableBody>
																					{userOrders.map(
																						(order) => (
																							<TableRow
																								key={
																									order.id
																								}>
																								<TableCell className="font-medium">
																									{order.id.substring(
																										0,
																										8,
																									)}
																									...
																								</TableCell>
																								<TableCell>
																									<div className="flex items-center gap-2">
																										<Calendar className="h-4 w-4 text-muted-foreground" />
																										<span>
																											{formatDate(
																												order.created_at,
																											)}
																										</span>
																									</div>
																								</TableCell>
																								<TableCell>
																									<Badge
																										variant={
																											order.status ===
																											"delivered"
																												? "default"
																												: order.status ===
																												  "cancelled"
																												? "destructive"
																												: "outline"
																										}>
																										{
																											order.status
																										}
																									</Badge>
																								</TableCell>
																								<TableCell className="text-right">
																									{formatCurrency(
																										order.total,
																									)}
																								</TableCell>
																							</TableRow>
																						),
																					)}
																				</TableBody>
																			</Table>
																		</div>
																	)}
																</CardContent>
															</Card>
														</TabsContent>

														<TabsContent
															value="admin"
															className="space-y-4">
															<Card>
																<CardHeader>
																	<CardTitle>
																		Administrative Actions
																	</CardTitle>
																	<CardDescription>
																		Manage user permissions
																		and access
																	</CardDescription>
																</CardHeader>
																<CardContent className="space-y-4">
																	<div className="space-y-2">
																		<div className="flex items-center justify-between">
																			<div className="flex items-center gap-2">
																				<Shield className="h-5 w-5 text-muted-foreground" />
																				<div>
																					<div className="font-medium">
																						User Role
																					</div>
																					<div className="text-sm text-muted-foreground">
																						Current role:
																						<Badge
																							className="ml-2"
																							variant={
																								selectedUser.role ===
																								"admin"
																									? "default"
																									: "outline"
																							}>
																							{selectedUser.role ||
																								"user"}
																						</Badge>
																					</div>
																				</div>
																			</div>
																			<div className="flex gap-2">
																				<Button
																					size="sm"
																					variant={
																						selectedUser.role ===
																						"admin"
																							? "default"
																							: "outline"
																					}
																					onClick={() =>
																						updateUserRole(
																							selectedUser.id,
																							"admin",
																						)
																					}
																					disabled={
																						isSubmitting ||
																						selectedUser.role ===
																							"admin"
																					}>
																					{isSubmitting &&
																						selectedUser.role !==
																							"admin" && (
																							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
																						)}
																					Make Admin
																				</Button>
																				<Button
																					size="sm"
																					variant={
																						selectedUser.role ===
																							"user" ||
																						!selectedUser.role
																							? "default"
																							: "outline"
																					}
																					onClick={() =>
																						updateUserRole(
																							selectedUser.id,
																							"user",
																						)
																					}
																					disabled={
																						isSubmitting ||
																						selectedUser.role ===
																							"user" ||
																						!selectedUser.role
																					}>
																					{isSubmitting &&
																						selectedUser.role ===
																							"admin" && (
																							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
																						)}
																					Set as User
																				</Button>
																			</div>
																		</div>
																	</div>

																	<div className="pt-4 border-t">
																		<Button
																			variant="destructive"
																			className="w-full"
																			disabled>
																			<Ban className="mr-2 h-4 w-4" />
																			Disable Account
																		</Button>
																		<p className="text-xs text-muted-foreground mt-2 text-center">
																			This feature is
																			disabled in the demo.
																		</p>
																	</div>
																</CardContent>
															</Card>
														</TabsContent>
													</Tabs>
												)}

												<DialogFooter>
													<DialogClose asChild>
														<Button>Close</Button>
													</DialogClose>
												</DialogFooter>
											</DialogContent>
										</Dialog>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

export default Users;
