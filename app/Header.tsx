"use client"; // Это позволяет нам менять язык по клику

import Link from "next/link";
import { useLanguage } from "@/app/LanguageContext";

export default function Header() {
  const { lang, setLang, t } = useLanguage();

  return (
    <header style={{ 
      padding: "15px 40px", 
      background: "white", 
      borderBottom: "1px solid #e5e7eb",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <Link href="/" style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#dc2626", textDecoration: "none" }}>
        🩸 {t.title}
      </Link>
      
      <nav style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Link href="/donor" style={{ textDecoration: "none", color: "#4b5563", fontWeight: 500 }}>{t.donor}</Link>
        <Link href="/hospital" style={{ textDecoration: "none", color: "#4b5563", fontWeight: 500 }}>{t.hospital}</Link>
        <Link href="/admin" style={{ textDecoration: "none", color: "#4b5563", fontWeight: 500 }}>{t.admin}</Link>

        {/* ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКА */}
        <select 
          value={lang} 
          onChange={(e) => setLang(e.target.value as any)}
          style={{ 
            padding: "5px 10px", 
            borderRadius: "6px", 
            border: "1px solid #cbd5e1",
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