"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRightIcon } from "lucide-react";
import { Counter } from "@/components/counter";
import { GreetingForm } from "@/components/greeting-form";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { AuthUser } from "@/lib/api";
import { fetchCurrentUser } from "@/lib/api";

export default function HomePage() {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		fetchCurrentUser().then((u) => {
			setUser(u);
			setLoaded(true);
		});
	}, []);

	return (
		<div className="flex min-h-svh flex-col">
			<Header user={user} />
			<main className="flex flex-1 items-center justify-center p-6">
				<div className="mx-auto flex w-full max-w-lg flex-col gap-6">
					<div>
						<h1 className="text-4xl font-bold tracking-tight">
							Template Speed
						</h1>
						<p className="text-muted-foreground mt-2">Hello world!</p>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Counter</CardTitle>
							<CardDescription>
								A simple client-side counter demo
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Counter />
						</CardContent>
					</Card>

					{loaded &&
						(user ? (
							<Card>
								<CardHeader>
									<CardTitle>API Demo</CardTitle>
									<CardDescription>
										Send a greeting via the backend API
									</CardDescription>
								</CardHeader>
								<CardContent>
									<GreetingForm />
								</CardContent>
							</Card>
						) : (
							<Card>
								<CardHeader>
									<CardTitle>API Demo</CardTitle>
									<CardDescription>
										Log in to try the greeting API
									</CardDescription>
								</CardHeader>
								<CardContent>
									<Button variant="outline" asChild>
										<a href="/auth/login">
											Login
											<ArrowRightIcon data-icon="inline-end" />
										</a>
									</Button>
								</CardContent>
							</Card>
						))}

					<Button variant="link" asChild className="w-fit">
						<Link href="/about">
							About page
							<ArrowRightIcon data-icon="inline-end" />
						</Link>
					</Button>
				</div>
			</main>
			<Footer />
		</div>
	);
}
