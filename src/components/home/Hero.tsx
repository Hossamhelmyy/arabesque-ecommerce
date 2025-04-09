import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { useState } from "react";

const Hero = () => {
	const { t } = useTranslation();
	const { isRTL } = useLanguage();
	const [mainImageLoaded, setMainImageLoaded] =
		useState(false);
	const [secondaryImageLoaded, setSecondaryImageLoaded] =
		useState(false);

	return (
		<section className="relative overflow-hidden">
			{/* Background pattern */}
			<div className="absolute inset-0 arabesque-pattern opacity-10" />

			<div className="container relative px-4 py-12 sm:py-16 lg:py-24">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
					<div
						className={`text-center lg:text-${
							isRTL ? "right" : "left"
						} animate-fade-in`}>
						<h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 text-foreground">
							{t("home.hero.title")}
						</h1>
						<p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-muted-foreground max-w-xl mx-auto lg:mx-0">
							{t("home.hero.subtitle")}
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
							<Button
								asChild
								size="lg"
								className="font-medium">
								<Link to="/products">
									{t("home.hero.cta")}
								</Link>
							</Button>
							<Button
								asChild
								size="lg"
								variant="outline"
								className="font-medium">
								<Link to="/categories">
									{t("common.categories")}
								</Link>
							</Button>
						</div>
					</div>

					<div className="relative">
						{/* Main image */}
						<div className="rounded-2xl overflow-hidden shadow-lg">
							<AspectRatio ratio={1 / 1}>
								<div className="relative w-full h-full">
									{!mainImageLoaded && (
										<div className="absolute inset-0 z-10 bg-gradient-to-br from-arabesque-gold/20 via-arabesque-sand/30 to-arabesque-navy/20">
											<div className="absolute inset-0 arabesque-pattern opacity-20" />
											<div className="absolute inset-0 flex items-center justify-center">
												<span className="font-heading text-4xl text-foreground/50">
													Arabesque
												</span>
											</div>
										</div>
									)}
									<img
										src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1600&auto=format&fit=crop"
										alt="Elegant Arabic-inspired home decor items"
										className={cn(
											"w-full h-full object-cover transition-opacity duration-300",
											mainImageLoaded
												? "opacity-100"
												: "opacity-0",
										)}
										onLoad={() => setMainImageLoaded(true)}
										onError={() => setMainImageLoaded(true)}
									/>
								</div>
							</AspectRatio>
						</div>

						{/* Secondary image */}
						<div className="absolute -bottom-6 -right-6 md:-bottom-8 md:-right-8 w-2/3 rounded-2xl overflow-hidden border-4 border-background shadow-xl hidden sm:block">
							<AspectRatio ratio={16 / 9}>
								<div className="relative w-full h-full">
									{!secondaryImageLoaded && (
										<div className="absolute inset-0 z-10 bg-gradient-to-tr from-arabesque-navy/20 via-arabesque-sand/30 to-arabesque-gold/20">
											<div className="absolute inset-0 arabesque-pattern opacity-20" />
											<div className="absolute inset-0 flex items-center justify-center">
												<span className="font-heading text-2xl text-foreground/50">
													Treasures
												</span>
											</div>
										</div>
									)}
									<img
										src="https://images.unsplash.com/photo-1567016526105-22da7c13161a?q=80&w=1600&auto=format&fit=crop"
										alt="Traditional Arabic pottery"
										className={cn(
											"w-full h-full object-cover transition-opacity duration-300",
											secondaryImageLoaded
												? "opacity-100"
												: "opacity-0",
										)}
										onLoad={() =>
											setSecondaryImageLoaded(true)
										}
										onError={() =>
											setSecondaryImageLoaded(true)
										}
									/>
								</div>
							</AspectRatio>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
