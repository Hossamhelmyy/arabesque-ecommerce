import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetFooter,
	SheetClose,
} from "@/components/ui/sheet";
import { Category, FilterState } from "../../types";

interface FilterSheetProps {
	filterOpen: boolean;
	setFilterOpen: (open: boolean) => void;
	filters: FilterState;
	categories?: Category[];
	handleFilterChange: (
		key: keyof FilterState,
		value: FilterState[keyof FilterState],
	) => void;
	handlePriceChange: (values: number[]) => void;
	clearFilters: () => void;
	countActiveFilters: () => number;
	isRTL: boolean;
}

const FilterSheet = ({
	filterOpen,
	setFilterOpen,
	filters,
	categories,
	handleFilterChange,
	handlePriceChange,
	clearFilters,
	countActiveFilters,
	isRTL,
}: FilterSheetProps) => {
	const { t, i18n } = useTranslation();

	return (
		<Sheet open={filterOpen} onOpenChange={setFilterOpen}>
			<SheetContent
				side={isRTL ? "right" : "left"}
				className="overflow-y-auto">
				<SheetHeader>
					<SheetTitle>{t("filters.title")}</SheetTitle>
				</SheetHeader>

				<div className="py-6 space-y-6">
					{/* Categories */}
					<div className="space-y-3">
						<h3 className="text-sm font-medium">
							{t("products.categories")}
						</h3>
						<div className="space-y-2 pl-2">
							<div className="flex items-center">
								<Button
									variant="ghost"
									className={`w-full justify-start px-2 ${
										!filters.category
											? "font-bold text-primary"
											: ""
									}`}
									onClick={() => {
										handleFilterChange("category", "");
									}}>
									{t("products.allCategories")}
								</Button>
							</div>
							{categories?.map((category) => (
								<div
									key={category.id}
									className="flex items-center">
									<Button
										variant="ghost"
										className={`w-full justify-start px-2 ${
											filters.category === category.slug
												? "font-bold text-primary"
												: ""
										}`}
										onClick={() => {
											handleFilterChange(
												"category",
												category.slug,
											);
										}}>
										{i18n.language === "ar"
											? category.name_ar
											: category.name}
									</Button>
								</div>
							))}
						</div>
					</div>

					<Separator />

					{/* Price Range */}
					<div className="space-y-3">
						<h3 className="text-sm font-medium">
							{t("filters.priceRange")}
						</h3>
						<div className="space-y-5 px-2">
							<Slider
								defaultValue={[
									filters.minPrice,
									filters.maxPrice,
								]}
								max={1000}
								min={0}
								step={10}
								value={[filters.minPrice, filters.maxPrice]}
								onValueChange={handlePriceChange}
								className="mb-6"
							/>
							<div className="flex items-center justify-between">
								<div className="border rounded-md p-2 w-20">
									<p className="text-[10px] text-muted-foreground">
										Min
									</p>
									<p className="font-medium">
										${filters.minPrice}
									</p>
								</div>
								<div className="border rounded-md p-2 w-20">
									<p className="text-[10px] text-muted-foreground">
										Max
									</p>
									<p className="font-medium">
										${filters.maxPrice}
									</p>
								</div>
							</div>
						</div>
					</div>

					<Separator />

					{/* Product State */}
					<div className="space-y-3">
						<h3 className="text-sm font-medium">
							{t("filters.productState")}
						</h3>
						<div className="space-y-3 px-2">
							<div className="flex items-center space-x-2 rtl:space-x-reverse">
								<Checkbox
									id="mobile-filter-new"
									checked={filters.isNew}
									onCheckedChange={(checked) =>
										handleFilterChange(
											"isNew",
											checked === true,
										)
									}
								/>
								<label
									htmlFor="mobile-filter-new"
									className="text-sm cursor-pointer">
									{t("product.new")}
								</label>
							</div>
							<div className="flex items-center space-x-2 rtl:space-x-reverse">
								<Checkbox
									id="mobile-filter-sale"
									checked={filters.isOnSale}
									onCheckedChange={(checked) =>
										handleFilterChange(
											"isOnSale",
											checked === true,
										)
									}
								/>
								<label
									htmlFor="mobile-filter-sale"
									className="text-sm cursor-pointer">
									{t("product.sale")}
								</label>
							</div>
							<div className="flex items-center space-x-2 rtl:space-x-reverse">
								<Checkbox
									id="mobile-filter-featured"
									checked={filters.isFeatured}
									onCheckedChange={(checked) =>
										handleFilterChange(
											"isFeatured",
											checked === true,
										)
									}
								/>
								<label
									htmlFor="mobile-filter-featured"
									className="text-sm cursor-pointer">
									{t("home.featured")}
								</label>
							</div>
						</div>
					</div>
				</div>

				<SheetFooter className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
					<div className="flex justify-between w-full gap-4">
						<Button
							variant="outline"
							className="flex-1"
							onClick={clearFilters}
							disabled={countActiveFilters() === 0}>
							<X className="h-4 w-4 mr-2mx-2" />
							{t("filters.clearAll")}
						</Button>
						<SheetClose asChild>
							<Button className="flex-1">
								{t("filters.apply")} ({countActiveFilters()}
								)
							</Button>
						</SheetClose>
					</div>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
};

export default FilterSheet;
