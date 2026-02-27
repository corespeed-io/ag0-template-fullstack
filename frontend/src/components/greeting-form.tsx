"use client";

import { useState } from "react";
import { SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendGreeting } from "@/lib/api";

export function GreetingForm() {
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isPending, setIsPending] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const name = formData.get("name") as string;
		if (!name) return;

		setIsPending(true);
		try {
			const result = await sendGreeting(name);
			if (result.error) {
				setError(result.error);
				setMessage(null);
			} else {
				setMessage(result.message ?? null);
				setError(null);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong");
			setMessage(null);
		} finally {
			setIsPending(false);
		}
	};

	return (
		<div className="flex flex-col gap-3">
			<form onSubmit={handleSubmit} className="flex gap-2">
				<Input name="name" placeholder="Enter a name" required />
				<Button type="submit" disabled={isPending}>
					<SendIcon data-icon="inline-start" />
					{isPending ? "Sending…" : "Greet"}
				</Button>
			</form>
			{message && <p className="text-sm text-green-600">{message}</p>}
			{error && <p className="text-destructive text-sm">{error}</p>}
		</div>
	);
}
