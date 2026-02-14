import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/providers/ToastProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ResuMatch AI - Intelligent Career Optimization",
  description: "Generate job-specific, ATS-optimized CVs with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <SubscriptionProvider>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              {children}
            </div>
            <ToastProvider />
          </SubscriptionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
