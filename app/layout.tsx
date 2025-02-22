import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";

const inter = Inter({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "JaiBOARD",
    description: "The best way to find your next AI job!",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body className={`${inter.className} antialiased flex flex-col`}>
                <TopBar />
                {children}
                <Footer />
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
