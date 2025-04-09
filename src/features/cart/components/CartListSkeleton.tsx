import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartItemSkeleton } from "./CartItemSkeleton";

export const CartListSkeleton = () => {
	return (
		<Card className="p-2 sm:p-4">
			<ScrollArea className="h-[calc(70dvh-100px)] sm:h-[calc(90dvh-300px)] pr-2 sm:pr-4">
				<div className="space-y-2 sm:space-y-4">
					{Array.from({ length: 3 }).map((_, index) => (
						<CartItemSkeleton key={index} />
					))}
				</div>
			</ScrollArea>
		</Card>
	);
};
