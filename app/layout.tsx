import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shivaratnakumar Patil | Health Insurance Consultant",
  description: "Understand health insurance options for yourself and your family with personal guidance from Shivaratnakumar Patil.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Shivaratnakumar Patil | Health Insurance Consultant",
    description: "Clear, friendly guidance to help you understand health insurance options.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
