import React from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import {
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
} from "@/components/ui/tabs";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

const AuthTabs: React.FC = () => {
	const { t } = useTranslation();

	return (
		<Card className="w-full max-w-md">
			<Tabs defaultValue="signin">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="signin">
						{t("auth.signIn")}
					</TabsTrigger>
					<TabsTrigger value="signup">
						{t("auth.signUp")}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="signin">
					<SignInForm />
				</TabsContent>

				<TabsContent value="signup">
					<SignUpForm />
				</TabsContent>
			</Tabs>
		</Card>
	);
};

export default AuthTabs;
