import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/providers/UserProvider";
import SetupGate from "@/providers/SetupGate";
import Navbar from "@/components/Navbar";

const inter = Inter({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Y Discussion",
    description: "Discuss on contentious topics",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} antialiased flex justify-center min-h-screen`}>
                <UserProvider>
                    <SetupGate>
                        <div className="w-full max-w-7xl flex relative">
                            <Navbar />
                            <div className="flex-1">
                                {children}
                            </div>
                        </div>
                    </SetupGate>
                </UserProvider>
            </body>
        </html>
    );
}
