import React, {
	createContext,
	useContext,
	useState,
	useEffect,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import {
	type AuthContextType,
	type User,
	type LoginCredentials,
	type RegisterCredentials,
} from "@/features/auth/types";

type AuthError = {
	message: string;
	[key: string]: unknown;
};
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error(
			"useAuth must be used within an AuthProvider",
		);
	}
	return context;
};
// Create a safer navigation function
const useSafeNavigate = () => {
	try {
		// This will throw an error if used outside of Router context
		return useNavigate();
	} catch (error) {
		// Return a dummy navigate function that logs the error
		return (path: string) => {
			console.error(
				"Navigation attempted outside Router context to:",
				path,
			);
			return undefined;
		};
	}
};

const AuthContext = createContext<
	AuthContextType | undefined
>(undefined);

export const AuthProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useSafeNavigate();

	useEffect(() => {
		// Check active sessions and sets the user
		const getUser = async () => {
			try {
				setIsLoading(true);
				const {
					data: { session },
				} = await supabase.auth.getSession();

				if (session?.user) {
					// Fetch profile but don't let it crash the whole app if table is missing
					try {
						const { data: profile, error: profileError } = await supabase
							.from("profiles")
							.select("*")
							.eq("id", session.user.id)
							.single();

						if (profileError) {
							console.warn("Profile fetch error:", profileError.message);
						}

						setUser({
							id: session.user.id,
							email: session.user.email || "",
							created_at: session.user.created_at,
							...(profile || {}),
						});
					} catch (profileCatchError) {
						console.error("Profile catch error:", profileCatchError);
						setUser({
							id: session.user.id,
							email: session.user.email || "",
							created_at: session.user.created_at,
						});
					}
				} else {
					setUser(null);
				}
			} catch (sessionError) {
				console.error("Session error:", sessionError);
			} finally {
				setIsLoading(false);
			}
		};

		getUser();

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(
			(_event, session) => {
				getUser();
			},
		);

		return () => {
			subscription.unsubscribe();
		};
	}, []);

	const signIn = async ({
		email,
		password,
	}: LoginCredentials) => {
		try {
			setIsLoading(true);
			const { error } =
				await supabase.auth.signInWithPassword({
					email,
					password,
				});

			if (error) throw error;

			toast({
				title: "Welcome back!",
				description: "You have successfully signed in.",
			});

			try {
				navigate("/");
			} catch (navError) {
				console.error("Navigation error:", navError);
			}
		} catch (error: unknown) {
			const authError = error as AuthError;
			toast({
				title: "Error signing in",
				description:
					authError.message ||
					"An error occurred during sign in",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const signUp = async ({
		email,
		password,
		confirmPassword,
	}: RegisterCredentials) => {
		if (password !== confirmPassword) {
			toast({
				title: "Passwords do not match",
				description: "Please ensure your passwords match",
				variant: "destructive",
			});
			return;
		}

		try {
			setIsLoading(true);
			const { error } = await supabase.auth.signUp({
				email,
				password,
			});

			if (error) throw error;

			toast({
				title: "Account created",
				description:
					"Please check your email for verification instructions",
			});
		} catch (error: unknown) {
			const authError = error as AuthError;
			toast({
				title: "Error signing up",
				description:
					authError.message ||
					"An error occurred during sign up",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const signOut = async () => {
		try {
			setIsLoading(true);
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
			setUser(null);
		} catch (error: unknown) {
			const authError = error as AuthError;
			console.error(
				"Error signing out:",
				authError.message,
			);
		} finally {
			setIsLoading(false);
			try {
				navigate("/auth");
			} catch (navError) {
				console.error("Navigation error:", navError);
			}
		}
	};

	return (
		<AuthContext.Provider
			value={{ user, isLoading, signIn, signUp, signOut }}>
			{children}
		</AuthContext.Provider>
	);
};
