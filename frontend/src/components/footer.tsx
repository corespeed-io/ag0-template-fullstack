import { Separator } from "@/components/ui/separator";

export function Footer() {
	return (
		<footer className="px-6 py-4">
			<Separator className="mb-4" />
			<p className="text-muted-foreground text-sm">
				Built with{" "}
				<a
					href="https://nextjs.org"
					target="_blank"
					rel="noreferrer"
					className="underline underline-offset-4 hover:text-foreground"
				>
					Next.js
				</a>{" "}
				+{" "}
				<a
					href="https://hono.dev"
					target="_blank"
					rel="noreferrer"
					className="underline underline-offset-4 hover:text-foreground"
				>
					Hono
				</a>
			</p>
		</footer>
	);
}
