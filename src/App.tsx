import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import {
	BrowserRouter,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Layout from "@/components/layout/Layout";
import AdminLayout from "@/components/layout/AdminLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryPage from "./pages/CategoryPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import FavoritesPage from "./pages/FavoritesPage";
import CartPage from "./pages/CartPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Categories from "./pages/admin/Categories";
import Orders from "./pages/admin/Orders";
import Users from "./pages/admin/Users";
import Settings from "./pages/admin/Settings";
import Content from "./pages/admin/Content";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import "./i18n/i18n"; // Import i18n configuration

// Create a new query client with default options
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			refetchOnWindowFocus: false,
			staleTime: 1000 * 60 * 5, // 5 minutes
		},
	},
});

const App = () => (
	<BrowserRouter>
		<QueryClientProvider client={queryClient}>
			<LanguageProvider>
				<AuthProvider>
					<CartProvider>
						<WishlistProvider>
							<TooltipProvider>
								<Toaster />
								<Sonner />
								<Routes>
									<Route element={<Layout />}>
										<Route path="/" element={<Index />} />
										<Route
											path="/products"
											element={<ProductsPage />}
										/>
										<Route
											path="/product/:slug"
											element={<ProductDetailPage />}
										/>
										<Route
											path="/categories"
											element={<CategoriesPage />}
										/>
										<Route
											path="/category/:slug"
											element={<CategoryPage />}
										/>
										<Route
											path="/checkout"
											element={<CheckoutPage />}
										/>
										<Route
											path="/profile"
											element={<ProfilePage />}
										/>
										<Route
											path="/favorites"
											element={<FavoritesPage />}
										/>
										<Route
											path="/cart"
											element={<CartPage />}
										/>
										<Route
											path="/auth"
											element={<AuthPage />}
										/>
										<Route
											path="*"
											element={<NotFound />}
										/>
									</Route>

									{/* Admin Routes */}
									<Route
										path="/admin"
										element={
											<ProtectedRoute adminOnly>
												<AdminLayout />
											</ProtectedRoute>
										}>
										<Route index element={<Dashboard />} />
										<Route
											path="products"
											element={<Products />}
										/>
										<Route
											path="categories"
											element={<Categories />}
										/>
										<Route
											path="orders"
											element={<Orders />}
										/>
										<Route
											path="users"
											element={<Users />}
										/>
										<Route
											path="content"
											element={<Content />}
										/>
										<Route
											path="settings"
											element={<Settings />}
										/>
										<Route
											path="*"
											element={
												<Navigate to="/admin" replace />
											}
										/>
									</Route>
								</Routes>
							</TooltipProvider>
						</WishlistProvider>
					</CartProvider>
				</AuthProvider>
			</LanguageProvider>
		</QueryClientProvider>
	</BrowserRouter>
);

export default App;
