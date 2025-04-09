import { useTranslation } from "react-i18next";
import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";

const Index = () => {
	const { t } = useTranslation();

	return (
		<div className="min-h-screen">
			<Hero />
			<FeaturedCategories />
			<FeaturedProducts />

			{/* Testimonials/Social Proof Section */}
			<section className="py-16 bg-arabesque-sand/20">
				<div className="container text-center">
					<h2 className="font-heading text-3xl md:text-4xl font-bold mb-12">
						{t("home.testimonials")}
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{/* Testimonial 1 */}
						<div className="bg-background rounded-lg p-6 shadow-sm">
							<div className="flex justify-center mb-4">
								<div className="h-16 w-16 rounded-full overflow-hidden">
									<img
										src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
										alt="Customer"
										className="h-full w-full object-cover"
									/>
								</div>
							</div>
							<p className="italic text-muted-foreground mb-4">
								"The quality of the handwoven rug I ordered
								is exceptional. It's exactly as described
								and adds the perfect touch to my living
								room."
							</p>
							<p className="font-medium">Sarah M.</p>
						</div>

						{/* Testimonial 2 */}
						<div className="bg-background rounded-lg p-6 shadow-sm">
							<div className="flex justify-center mb-4">
								<div className="h-16 w-16 rounded-full overflow-hidden">
									<img
										src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
										alt="Customer"
										className="h-full w-full object-cover"
									/>
								</div>
							</div>
							<p className="italic text-muted-foreground mb-4">
								"Fast shipping and beautiful packaging. The
								ceramic pieces I ordered are even more
								stunning in person. Will definitely shop
								here again!"
							</p>
							<p className="font-medium">Ahmed K.</p>
						</div>

						{/* Testimonial 3 */}
						<div className="bg-background rounded-lg p-6 shadow-sm">
							<div className="flex justify-center mb-4">
								<div className="h-16 w-16 rounded-full overflow-hidden">
									<img
										src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
										alt="Customer"
										className="h-full w-full object-cover"
									/>
								</div>
							</div>
							<p className="italic text-muted-foreground mb-4">
								"The spice set was a gift for my mother and
								she absolutely loved it! The packaging is
								beautiful and the spices are so fragrant and
								fresh."
							</p>
							<p className="font-medium">Leila T.</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA/Newsletter Section */}
			<section className="py-16 bg-arabesque-navy dark:bg-transparent text-white">
				<div className="container">
					<div className="max-w-3xl mx-auto text-center">
						<h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
							{t("home.stayUpdated")}
						</h2>
						<p className="text-white/80 mb-8">
							{t("home.newsletter.description")}
						</p>
						<form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
							<input
								type="email"
								placeholder={t(
									"newsletter.emailPlaceholder",
								)}
								className="flex h-10 w-full rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm placeholder:text-white/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-arabesque-gold"
							/>
							<button
								type="submit"
								className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-arabesque-gold px-4 py-2 text-sm font-medium text-white shadow hover:bg-arabesque-gold/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-arabesque-gold">
								{t("newsletter.subscribe")}
							</button>
						</form>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Index;
