import React from "react";
import { AuthTabs } from "@/features/auth";

const AuthPage: React.FC = () => {
	return (
		<div className="container flex justify-center items-center min-h-[calc(100vh-200px)] py-12">
			<AuthTabs />
		</div>
	);
};

export default AuthPage;
