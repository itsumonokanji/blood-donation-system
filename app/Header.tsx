"use client";

import Link from "next/link";
import { useLanguage } from "@/app/LanguageContext";
import { useTheme } from "@/app/ThemeContext"; // Импортируем тему

export default function Header() {
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme(); // Достаем переменные темы

  return (
    <header style={{ 
      padding: "15px 40px", 
      background: "var(--background)", 
      borderBottom: "1px solid var(--border)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <Link href="/" style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#dc2626", textDecoration: "none" }}>
        🩸 {t.title}
      </Link>
      
      <nav style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link href="/donor" style={{ textDecoration: "none", color: "var(--foreground)", fontWeight: 500 }}>{t.donor}</Link>
        <Link href="/hospital" style={{ textDecoration: "none", color: "var(--foreground)", fontWeight: 500 }}>{t.hospital}</Link>
        <Link href="/admin" style={{ textDecoration: "none", color: "var(--foreground)", fontWeight: 500 }}>{t.admin}</Link>

        {/* --- НОВАЯ КНОПКА: СТАТЬ ДОНОРОМ --- */}
        <Link 
          href="/register" 
          style={{ 
            padding: "8px 16px", 
            background: "#dc2626", 
            color: "white", 
            fontWeight: "bold", 
            textDecoration: "none",
            borderRadius: "10px",
            fontSize: "0.9rem",
            transition: "opacity 0.2s"
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = "0.8"}
          onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
        >
          {lang === 'ru' ? "Стать донором" : "Become a Donor"}
        </Link>

        {/* КНОПКА ТЕМЫ */}
        <button 
          onClick={toggleTheme} 
          style={{ 
            fontSize: "1.2rem", 
            cursor: "pointer", 
            background: "none", 
            border: "none",
            marginLeft: "10px",
            display: "flex",
            alignItems: "center"
          }}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {/* ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКА */}
        <select 
          value={lang} 
          onChange={(e) => setLang(e.target.value as any)}
          style={{ 
            padding: "5px 10px", 
            borderRadius: "6px", 
            border: "1px solid var(--border)",
            background: "var(--background)",
            color: "var(--foreground)",
            cursor: "pointer",
            marginLeft: "10px"
          }}
        >
          <option value="ru">🇷🇺 RU</option>
          <option value="en">🇺🇸 EN</option>
          <option value="jp">🇯🇵 JP</option>
          <option value="kr">🇰🇷 KR</option>
        </select>
      </nav>
    </header>
  );
}