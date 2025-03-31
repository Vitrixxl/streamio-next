"use client";

import React from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth/client/auth-client";
import { tryCatch } from "~/lib/utils";

export function GoogleLogin() {
	const [isLoading, setIsLoading] = React.useState(false);
	const handleLogin = async () => {
		setIsLoading(true);
		const { error } = await tryCatch(
			authClient.signIn.social({ provider: "google", callbackURL: "/" }),
		);
		if (error) {
			toast(error.message);
		}
		setIsLoading(false);
	};

	return (
		<Button variant="outline" onClick={handleLogin} loading={isLoading}>
			<FcGoogle />
			Se connecter avec google
		</Button>
	);
}
