import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";

export const metadata: Metadata = {
  title: "Nico Phipps - Creative Director",
  description: "Portfolio of Nico Phipps, a creative director specializing in brand experiences, digital products, and innovative campaigns.",
  keywords: ["portfolio", "creative director", "brand experience", "digital design", "Nico Phipps"],
  authors: [{ name: "Nico Phipps" }],
  creator: "Nico Phipps",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nicophipps.com",
    siteName: "Nico Phipps Portfolio",
    title: "Nico Phipps - Creative Director",
    description: "Portfolio of Nico Phipps, a creative director specializing in brand experiences, digital products, and innovative campaigns.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nico Phipps - Creative Director",
    description: "Portfolio of Nico Phipps, a creative director specializing in brand experiences, digital products, and innovative campaigns.",
    creator: "@nicophipps",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased bg-white text-black">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
