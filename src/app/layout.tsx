import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GamePulse - Top Up Game Terpercaya",
  description: "Platform top up game terpercaya dengan harga terjangkau dan proses cepat. Dukung semua game populer seperti Mobile Legends, PUBG Mobile, Free Fire, dan lainnya.",
  keywords: "top up game, mobile legends, pubg mobile, free fire, genshin impact, valorant, diamond ml, uc pubg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-gray-900 text-white`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
