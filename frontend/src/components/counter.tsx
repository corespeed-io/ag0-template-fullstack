"use client";

import { useState } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Counter() {
	const [count, setCount] = useState(0);

	return (
		<div className="flex items-center gap-3">
			<Button
				variant="outline"
				size="icon-sm"
				onClick={() => setCount((c) => c - 1)}
			>
				<MinusIcon />
			</Button>
			<Badge variant="secondary" className="tabular-nums">
				{count}
			</Badge>
			<Button
				variant="outline"
				size="icon-sm"
				onClick={() => setCount((c) => c + 1)}
			>
				<PlusIcon />
			</Button>
		</div>
	);
}
