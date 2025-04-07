import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
	children: ReactNode;
	adminOnly?: boolean;
}

const ProtectedRoute = ({
	children,
	adminOnly = false,
}: ProtectedRouteProps) => {
	const { user, isLoading } = useAuth();

	// While checking authentication status, show nothing
	if (isLoading) {
		return null;
	}

	// If not authenticated, redirect to login
	if (!user) {
		return <Navigate to="/auth" replace />;
	}

	// For admin routes, check if user has admin role
	if (adminOnly) {
		const isAdmin = user.role === "admin";
		if (!isAdmin) {
			return <Navigate to="/" replace />;
		}
	}

	// If authenticated (and admin for admin routes), render the children
	return <>{children}</>;
};

export default ProtectedRoute;
