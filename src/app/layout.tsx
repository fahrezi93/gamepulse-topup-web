import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "GamePulse - Top Up Game Terpercaya",
  description: "Platform top up game terpercaya dengan harga terjangkau dan proses cepat. Dukung semua game populer seperti Mobile Legends, PUBG Mobile, Free Fire, dan lainnya.",
  keywords: "top up game, mobile legends, pubg mobile, free fire, genshin impact, valorant, diamond ml, uc pubg",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/game-icon.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.svg',
    apple: '/game-icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${playfairDisplay.variable} ${manrope.variable} font-sans antialiased`} style={{ backgroundColor: '#0D1117', color: '#F0F6FC' }}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0D1117' }}>
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
