import Link from "next/link";
import { LogOutIcon, LogInIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { AuthUser } from "@/lib/api";

export function Header({ user }: { user: AuthUser | null }) {
	return (
		<header className="flex items-center gap-4 px-6 py-4">
			<h2 className="text-base font-bold tracking-tight">
				<Link href="/">Template Speed</Link>
			</h2>
			<Separator orientation="vertical" className="!h-5" />
			<nav className="ml-auto flex items-center gap-2">
				{user ? (
					<>
						<span className="text-muted-foreground text-sm">
							{user.username ?? user.email ?? user.sub}
						</span>
						<Button variant="ghost" size="sm" asChild>
							<a href="/auth/logout">
								<LogOutIcon data-icon="inline-start" />
								Logout
							</a>
						</Button>
					</>
				) : (
					<Button variant="outline" size="sm" asChild>
						<a href="/auth/login">
							<LogInIcon data-icon="inline-start" />
							Login
						</a>
					</Button>
				)}
			</nav>
		</header>
	);
}
