"use client";
import Link from "next/link";
import { useLanguage } from "./LanguageContext"; // Подключаем рацию

export default function LandingPage() {
  const { t } = useLanguage(); // Достаем переводы

  return (
    <div style={{ 
      padding: "100px 20px", 
      textAlign: "center", 
      fontFamily: "system-ui",
      background: "linear-gradient(to bottom, #fff, #fef2f2)",
      minHeight: "80vh"
    }}>
      {/* Используем t.welcome вместо "Стань героем..." */}
      <h1 style={{ fontSize: "3.5rem", color: "#dc2626", marginBottom: "20px" }}>
        {t.welcome}
      </h1>
      
      {/* Используем t.description вместо "Современная платформа..." */}
      <p style={{ fontSize: "1.5rem", color: "#4b5563", maxWidth: "600px", margin: "0 auto 40px" }}>
        {t.description}
      </p>

      <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
        <Link href="/donor">
          <button style={{ 
            padding: "15px 30px", 
            fontSize: "1.1rem", 
            background: "#dc2626", 
            color: "white", 
            border: "none", 
            borderRadius: "8px", 
            cursor: "pointer",
            fontWeight: "bold" 
          }}>
            {t.donor} {/* Перевод для кнопки */}
          </button>
        </Link>

        <Link href="/hospital">
          <button style={{ 
            padding: "15px 30px", 
            fontSize: "1.1rem", 
            background: "white", 
            color: "#dc2626", 
            border: "2px solid #dc2626", 
            borderRadius: "8px", 
            cursor: "pointer",
            fontWeight: "bold" 
          }}>
            {t.hospital} {/* Перевод для кнопки */}
          </button>
        </Link>
      </div>

      <div style={{ marginTop: "60px", color: "#9ca3af" }}>
        <p>
          {/* Можно добавить еще ключей в LanguageContext, например t.adminQuestion */}
          Admin? <Link href="/admin" style={{ color: "#dc2626" }}>{t.admin}</Link>
        </p>
      </div>
    </div>
  );
}