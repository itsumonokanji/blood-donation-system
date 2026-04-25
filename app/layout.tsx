import type { Metadata, Viewport } from "next"; // Добавили Viewport
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./LanguageContext"; 
import { ThemeProvider } from "./ThemeContext"; 
import Header from "./Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ПРАВИЛЬНЫЙ способ задать viewport в Next.js
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "LifeLink — Система донорства",
  description: "Поиск доноров и управление заявками крови",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col antialiased`}>
        <ThemeProvider>
          <LanguageProvider>
            <Header />
            <main style={{ flex: 1 }}>
              {children}
            </main>
            <footer style={{ textAlign: "center", padding: "20px", color: "#9ca3af", borderTop: "1px solid var(--border-color)" }}>
              © 2026 LifeLink. Сделано с заботой.
            </footer>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}