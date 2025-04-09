import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CategorySearch } from "@/features/categories/components/CategorySearch";
import { CategoryList } from "@/features/categories/components/CategoryList";
import { useCategories } from "@/features/categories/hooks/useCategories";

const CategoriesPage = () => {
	const { t } = useTranslation();
	const {
		filteredCategories,
		isLoading,
		error,
		searchTerm,
		setSearchTerm,
	} = useCategories();

	if (error) {
		return (
			<div className="container py-16 flex flex-col items-center justify-center">
				<div className="text-destructive mb-4">
					<span className="sr-only">
						{t("common.error")}
					</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="h-8 w-8 mx-auto">
						<circle cx="12" cy="12" r="10" />
						<line x1="12" y1="8" x2="12" y2="12" />
						<line x1="12" y1="16" x2="12.01" y2="16" />
					</svg>
				</div>
				<p className="text-muted-foreground">
					{t("common.error")}
				</p>
				<Button
					variant="outline"
					className="mt-4"
					onClick={() => window.location.reload()}>
					{t("common.retry")}
				</Button>
			</div>
		);
	}

	// Define breadcrumb items
	const breadcrumbItems = [
		{
			href: "/categories",
			translationKey: "common.categories",
		},
	];

	return (
		<div className="container py-8 md:py-12">
			{/* Breadcrumb */}
			<Breadcrumbs
				items={breadcrumbItems}
				className="mb-6"
			/>

			<div className="text-center mb-12">
				<h1 className="text-3xl md:text-4xl font-bold mb-3">
					{t("categories.title")}
				</h1>
				<p className="text-muted-foreground max-w-2xl mx-auto">
					{t("categories.description")}
				</p>
			</div>

			<CategorySearch
				searchTerm={searchTerm}
				onSearch={setSearchTerm}
			/>

			<CategoryList
				categories={filteredCategories}
				isLoading={isLoading}
			/>
		</div>
	);
};

export default CategoriesPage;
