"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import type { AuthUser } from "@/lib/api";
import { fetchCurrentUser } from "@/lib/api";

export default function AboutPage() {
	const [user, setUser] = useState<AuthUser | null>(null);

	useEffect(() => {
		fetchCurrentUser().then(setUser);
	}, []);

	return (
		<div className="flex min-h-svh flex-col">
			<Header user={user} />
			<main className="flex flex-1 items-center justify-center p-6">
				<div className="mx-auto flex w-full max-w-lg flex-col gap-6">
					<div>
						<h1 className="text-4xl font-bold tracking-tight">
							About Template Speed
						</h1>
						<p className="text-muted-foreground mt-2">
							A modern full-stack template with Next.js + Hono
						</p>
					</div>
					<Button variant="link" asChild className="w-fit">
						<Link href="/">
							<ArrowLeftIcon data-icon="inline-start" />
							Return home
						</Link>
					</Button>
				</div>
			</main>
			<Footer />
		</div>
	);
}
