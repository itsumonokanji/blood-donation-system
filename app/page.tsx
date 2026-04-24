"use client";
import Link from "next/link";
import { useLanguage } from "./LanguageContext"; 

export default function LandingPage() {
  const { t } = useLanguage(); 

  // Теперь берем данные из t, чтобы всё переводилось!
  const steps = [
    { n: "01", title: t.step1Title, desc: t.step1Desc, icon: "📋" },
    { n: "02", title: t.step2Title, desc: t.step2Desc, icon: "🏥" },
    { n: "03", title: t.step3Title, desc: t.step3Desc, icon: "🔍" },
    { n: "04", title: t.step4Title, desc: t.step4Desc, icon: "❤️" }
  ];

  return (
    <div style={{ 
      fontFamily: "system-ui",
      background: "var(--background)", // Используем переменные темы
      color: "var(--foreground)",
      minHeight: "100vh",
      transition: "all 0.3s ease"
    }}>
      {/* --- HERO SECTION --- */}
      <div style={{ padding: "100px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "3.5rem", color: "#dc2626", marginBottom: "20px", fontWeight: "800" }}>
          {t.welcome}
        </h1>
        
        <p style={{ fontSize: "1.5rem", color: "#6b7280", maxWidth: "600px", margin: "0 auto 40px" }}>
          {t.description}
        </p>

        <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
          <Link href="/donor">
            <button className="hover-button" style={{ 
              padding: "15px 30px", fontSize: "1.1rem", background: "#dc2626", 
              color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "bold",
              transition: "transform 0.2s"
            }}>
              {t.donor} 
            </button>
          </Link>

          <Link href="/hospital">
            <button style={{ 
              padding: "15px 30px", fontSize: "1.1rem", background: "transparent", 
              color: "#dc2626", border: "2px solid #dc2626", borderRadius: "12px", cursor: "pointer", fontWeight: "bold",
              transition: "all 0.2s"
            }}>
              {t.hospital} 
            </button>
          </Link>
        </div>
      </div>

      {/* --- STEPS SECTION --- */}
      <div style={{ 
        padding: "80px 20px", 
        borderTop: "1px solid var(--border)"
      }}>
        <h2 style={{ fontSize: "2.5rem", marginBottom: "50px", textAlign: "center", fontWeight: "700" }}>
          {t.howItWorks}
        </h2>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: "30px", 
          maxWidth: "1200px", 
          margin: "0 auto" 
        }}>
          {steps.map((step) => (
            <div 
              key={step.n} 
              className="step-card" // Добавим класс для CSS анимации
              style={{ 
                background: "var(--background)", 
                padding: "40px 30px", 
                borderRadius: "24px", 
                textAlign: "left",
                position: "relative",
                border: "1px solid var(--border)",
                boxShadow: "0 10px 30px -15px rgba(0,0,0,0.1)",
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px)";
                e.currentTarget.style.boxShadow = "0 20px 40px -20px rgba(220, 38, 38, 0.3)";
                e.currentTarget.style.borderColor = "#dc2626";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 30px -15px rgba(0,0,0,0.1)";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "20px" }}>{step.icon}</div>
              
              <div style={{ 
                position: "absolute", top: "20px", right: "30px", 
                fontSize: "4rem", fontWeight: "900", color: "var(--border)", opacity: 0.3, zIndex: 0 
              }}>
                {step.n}
              </div>

              <h3 style={{ fontSize: "1.5rem", marginBottom: "12px", position: "relative", zIndex: 1 }}>
                {step.title}
              </h3>
              
              <p style={{ fontSize: "1rem", color: "#6b7280", lineHeight: "1.6", position: "relative", zIndex: 1 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}