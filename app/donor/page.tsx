"use client";

import React, { useState, useEffect } from "react";
import { Donor } from "@/types";
import { useLanguage } from "../LanguageContext"; // Импортируем контекст

export default function DonorPage() {
  const { t } = useLanguage(); // Подключаем переводы
  const [name, setName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [location, setLocation] = useState("");
  const [searchName, setSearchName] = useState("");
  const [myProfile, setMyProfile] = useState<Donor | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  // Функция регистрации
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/donors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, blood_group: bloodGroup, location }),
    });
    if (res.ok) {
      setIsRegistered(true);
      alert(t.msgSuccess || "Success!"); // Используем перевод для алерта
      checkProfile(name);
    }
  };

  // Функция поиска своего профиля
  const checkProfile = async (targetName: string) => {
    const res = await fetch("/api/donors");
    if (res.ok) {
      const allDonors: Donor[] = await res.json();
      const found = allDonors.find(d => d.name.toLowerCase() === targetName.toLowerCase());
      setMyProfile(found || null);
      if (!found) alert(t.msgError || "Not found");
    }
  };

  // Таблица совместимости (локализованная через контекст)
  const getCompatibility = (group: string) => {
    // В зависимости от языка выдаем разные пояснения
    const isRu = t.bloodGroup === "Группа крови"; 
    
    const map: Record<string, string> = {
      "O-": isRu ? "Все группы (Универсальный донор)" : "All groups (Universal Donor)",
      "O+": "O+, A+, B+, AB+",
      "A-": "A-, A+, AB-, AB+",
      "A+": "A+, AB+",
      "B-": "B-, B+, AB-, AB+",
      "B+": "B+, AB+",
      "AB-": "AB-, AB+",
      "AB+": isRu ? "AB+ (Только свои)" : "AB+ (Only same group)",
    };
    return map[group] || (isRu ? "Уточните у врача" : "Consult a doctor");
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", fontFamily: "system-ui" }}>
      
      {!myProfile ? (
        <section style={{ textAlign: "center" }}>
          <h1 style={{ color: "#dc2626" }}>{t.donorHero}</h1>
          <p style={{ color: "#64748b", marginBottom: "40px" }}>{t.donorSub}</p>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {/* ФОРМА РЕГИСТРАЦИИ */}
            <form onSubmit={handleRegister} style={{ background: "#fff", padding: "30px", borderRadius: "16px", border: "1px solid #e2e8f0", textAlign: "left" }}>
              <h3 style={{ marginTop: 0 }}>{t.regTitle}</h3>
              <input 
                placeholder={t.colName || "ФИО"} 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                required
              />
              <select 
                value={bloodGroup} 
                onChange={(e) => setBloodGroup(e.target.value)}
                style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                required
              >
                <option value="">{t.bloodGroup}</option>
                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <input 
                placeholder={t.location || "City"} 
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
                style={{ width: "100%", padding: "12px", marginBottom: "20px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                required
              />
              <button type="submit" style={{ width: "100%", padding: "12px", background: "#dc2626", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
                {t.btnReg}
              </button>
            </form>

            {/* ПРОВЕРКА СТАТУСА */}
            <div style={{ background: "#f8fafc", padding: "30px", borderRadius: "16px", border: "1px solid #e2e8f0", textAlign: "left" }}>
              <h3 style={{ marginTop: 0 }}>{t.alreadyInBase}</h3>
              <p style={{ fontSize: "14px", color: "#64748b" }}>{t.findProfileDesc}</p>
              <input 
                placeholder={t.searchPlaceholder || "Search..."} 
                value={searchName} 
                onChange={(e) => setSearchName(e.target.value)}
                style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
              />
              <button 
                onClick={() => checkProfile(searchName)}
                style={{ width: "100%", padding: "12px", background: "#1e293b", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
              >
                {t.btnFind}
              </button>
            </div>
          </div>
        </section>
      ) : (
        /* КАРТОЧКА ДОНОРА (Личный кабинет) */
        <section style={{ animation: "fadeIn 0.5s ease" }}>
          <button onClick={() => setMyProfile(null)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", marginBottom: "20px" }}>
            ← {t.btnClose || "Back"}
          </button>
          
          <div style={{ background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)", padding: "40px", borderRadius: "24px", color: "white", boxShadow: "0 10px 25px -5px rgba(220, 38, 38, 0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "2rem" }}>{myProfile.name}</h2>
                <p style={{ opacity: 0.8 }}>{t.readyStatus ? t.readyStatus.replace("✅", "") : "Donor Card"}</p>
                <div style={{ marginTop: "20px", display: "inline-block", background: "rgba(255,255,255,0.2)", padding: "10px 20px", borderRadius: "12px" }}>
                  📍 {myProfile.location || "---"}
                </div>
              </div>
              <div style={{ fontSize: "4rem", fontWeight: "900", background: "white", color: "#dc2626", width: "100px", height: "100px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}>
                {myProfile.blood_group}
              </div>
            </div>

            <hr style={{ margin: "30px 0", opacity: 0.2 }} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <h4 style={{ margin: "0 0 10px 0", textTransform: "uppercase", fontSize: "12px", letterSpacing: "1px" }}>{t.compatibility}</h4>
                <p style={{ fontSize: "1.1rem" }}><strong>{getCompatibility(myProfile.blood_group)}</strong></p>
              </div>
              <div style={{ textAlign: "right" }}>
                <h4 style={{ margin: "0 0 10px 0", textTransform: "uppercase", fontSize: "12px", letterSpacing: "1px" }}>{t.colStatus}:</h4>
                <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{t.readyStatus}</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "30px", padding: "20px", background: "#fff4f4", borderRadius: "12px", border: "1px solid #fecaca", color: "#991b1b" }}>
            {t.bloodGroup === "Группа крови" ? (
              <><strong>💡 Памятка:</strong> Перед сдачей крови обязательно выспитесь и выпейте достаточное количество воды. Спасибо, что вы с нами!</>
            ) : (
              <><strong>💡 Tip:</strong> Get a good night&apos;s sleep and drink plenty of water before donating. Thank you for being with us!</>
            )}
          </div>
        </section>
      )}

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}