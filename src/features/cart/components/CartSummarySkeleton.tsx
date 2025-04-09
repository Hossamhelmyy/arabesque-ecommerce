import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export const CartSummarySkeleton = () => {
	return (
		<Card>
			<CardHeader className="space-y-2">
				<Skeleton className="h-6 w-[150px]" />
				<Skeleton className="h-4 w-[200px]" />
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-4">
					<div className="flex justify-between text-sm">
						<Skeleton className="h-4 w-[80px]" />
						<Skeleton className="h-4 w-[60px]" />
					</div>
					<div className="flex justify-between text-sm">
						<Skeleton className="h-4 w-[60px]" />
						<Skeleton className="h-4 w-[60px]" />
					</div>
					<div className="flex justify-between text-sm">
						<Skeleton className="h-4 w-[40px]" />
						<Skeleton className="h-4 w-[50px]" />
					</div>
				</div>

				<Separator className="my-4" />

				<div className="flex justify-between items-center">
					<div className="space-y-1">
						<Skeleton className="h-5 w-[100px]" />
						<Skeleton className="h-4 w-[140px]" />
					</div>
					<Skeleton className="h-6 w-[80px]" />
				</div>
			</CardContent>
			<CardFooter>
				<Skeleton className="h-10 w-full" />
			</CardFooter>
		</Card>
	);
};
