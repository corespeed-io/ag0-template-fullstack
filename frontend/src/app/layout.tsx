import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
	title: "Template Speed",
	description: "An internet website!",
	icons: { icon: "/images/favicon.png" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className={inter.variable}>
			<body className="antialiased">{children}</body>
		</html>
	);
}
