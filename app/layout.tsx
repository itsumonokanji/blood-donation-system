import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./LanguageContext"; // Импортируем провайдер
import Header from "./Header"; // Сейчас создадим этот компонент

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Метаданные остаются тут, они важны для SEO и названия вкладки
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
        {/* Оборачиваем ВЕСЬ сайт в провайдер языка */}
        <LanguageProvider>
          
          {/* Мы вынесли шапку в отдельный файл Header.tsx, чтобы там работал "use client" */}
          <Header />

          <main style={{ flex: 1 }}>
            {children}
          </main>

          <footer style={{ textAlign: "center", padding: "20px", color: "#9ca3af", borderTop: "1px solid #eee" }}>
            © 2026 LifeLink. Сделано с заботой.
          </footer>

        </LanguageProvider>
      </body>
    </html>
  );
}