export type AuthCredentials = {
	email: string;
	password: string;
};

export type SignInResponse = {
	success: boolean;
	error?: string;
};

export type SignUpResponse = {
	success: boolean;
	error?: string;
	confirmation?: boolean;
};

export type AuthFormValues = {
	email: string;
	password: string;
};

export type User = {
	id: string;
	email: string;
	role?: string;
	created_at: string;
};

export type LoginCredentials = {
	email: string;
	password: string;
};

export type RegisterCredentials = {
	email: string;
	password: string;
	confirmPassword: string;
	name?: string;
};

export type AuthContextType = {
	user: User | null;
	isLoading: boolean;
	signIn: (credentials: LoginCredentials) => Promise<void>;
	signUp: (
		credentials: RegisterCredentials,
	) => Promise<void>;
	signOut: () => Promise<void>;
};
