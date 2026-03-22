import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { TransactionProvider } from "@/store/TransactionContext";
import { PortfolioProvider } from "@/store/PortfolioContext";
import { GoalProvider } from "@/store/GoalContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wealth Management | Family Office",
  description: "Wealth Management Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-background-app`}
    >
      <body className="min-h-full flex font-sans text-text-main">
        <GoalProvider>
          <PortfolioProvider>
            <TransactionProvider>
              <Sidebar />
              <div className="flex-1 ml-64 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 p-8 animate-fade-in overflow-hidden">
                  {children}
                </main>
              </div>
            </TransactionProvider>
          </PortfolioProvider>
        </GoalProvider>
      </body>
    </html>
  );
}
