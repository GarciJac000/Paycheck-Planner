import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paycheck Planner - AI Budgeting for Gig Workers",
  description: "Intelligently allocate your paycheck with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased">{children}</body>
    </html>
  );
}
