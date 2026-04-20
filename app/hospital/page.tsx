"use client";

import React, { useState, useEffect } from "react";
import { BloodRequest as Request, Hospital } from "@/types";
import { useLanguage } from "../LanguageContext";

export default function HospitalPage() {
  const { t } = useLanguage();
  const [bloodGroup, setBloodGroup] = useState("");
  const [location, setLocation] = useState("");
  const [hospitals, setHospitals] = useState<Hospital[]>([]); // Список всех больниц
  const [selectedHospital, setSelectedHospital] = useState(""); // Выбранная больница
  const [requests, setRequests] = useState<Request[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Загрузка данных
  const loadData = async () => {
    try {
      const [reqRes, hospRes] = await Promise.all([
        fetch("/api/requests"),
        fetch("/api/hospitals")
      ]);
      
      if (reqRes.ok) setRequests(await reqRes.json());
      if (hospRes.ok) setHospitals(await hospRes.json());
    } catch (err) {
      console.error("Ошибка загрузки:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 2. Когда выбираем больницу, автоматически ставим её локацию
  const handleHospitalChange = (name: string) => {
    setSelectedHospital(name);
    const found = hospitals.find(h => h.name === name);
    if (found) {
      setLocation(found.location);
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedHospital) return alert("Выберите больницу!");
  
  setIsSubmitting(true);
  try {
    // Находим объект выбранной больницы из общего списка данных, 
    // чтобы вытащить из неё координаты (lat, lng)
    const hospitalData = hospitals.find(h => h.name === selectedHospital);

    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hospital: selectedHospital,
        blood_group: bloodGroup,
        location: location || hospitalData?.location || "Бишкек",
        // Добавляем координаты больницы, либо ставим дефолтный Бишкек
        lat: hospitalData?.lat || 42.8747,
        lng: hospitalData?.lng || 74.5698
      }),
    });

    if (res.ok) {
      alert("Запрос успешно опубликован!");
      setBloodGroup("");
      if (typeof loadData === 'function') await loadData();
    } else {
      // Если сервер вернул ошибку, пробуем прочитать причину
      let errorMessage = "Не удалось создать";
      try {
        const errorData = await res.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        console.error("Не удалось распарсить ошибку");
      }
      alert(`Ошибка сервера: ${errorMessage}`);
    }
  } catch (error) {
    console.error("Ошибка при отправке запроса:", error);
    alert("Ошибка сети. Проверьте соединение с сервером.");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto", background: "var(--background)", color: "var(--foreground)", minHeight: "100vh" }}>
      <header style={{ marginBottom: "40px" }}>
        <h1 style={{ color: "#2563eb", marginBottom: "10px", fontSize: "2.5rem" }}>{t.hospTitle}</h1>
        <p style={{ color: "var(--muted-foreground)", fontSize: "1.1rem" }}>{t.hospSub}</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "40px" }}>
        <section>
          <div style={{ background: "var(--card)", padding: "30px", borderRadius: "20px", border: "1px solid var(--border)", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ marginTop: 0, marginBottom: "25px" }}>{t.newRequest}</h3>

            <form onSubmit={handleSubmit}>
              {/* ВЫБОР БОЛЬНИЦЫ */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600" }}>
                   Учреждение
                </label>
                <select
                  value={selectedHospital}
                  onChange={(e) => handleHospitalChange(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }}
                  required
                >
                  <option value="">-- Выберите из списка --</option>
                  {hospitals.map(h => (
                    <option key={h.id} value={h.name}>{h.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600" }}>{t.bloodGroup}</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }}
                  required
                >
                  <option value="">--</option>
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: "25px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600" }}>{t.location}</label>
                <input
                  readOnly // Теперь город подтягивается сам, менять нельзя (защита данных)
                  value={location}
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--muted)", color: "var(--foreground)", cursor: "not-allowed" }}
                />
              </div>

              <button type="submit" disabled={isSubmitting} style={{ width: "100%", padding: "14px", background: "#2563eb", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: isSubmitting ? "not-allowed" : "pointer" }}>
                {isSubmitting ? "..." : t.btnPost}
              </button>
            </form>
          </div>
        </section>

        <section>
          <h3 style={{ marginTop: 0, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
            {t.history}
            <span style={{ fontSize: "12px", background: "#2563eb", color: "white", padding: "4px 10px", borderRadius: "20px" }}>{requests.length}</span>
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {requests.map((req) => (
              <div key={req.id} style={{ padding: "20px", background: "var(--card)", borderRadius: "16px", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: "900", fontSize: "1.2rem", color: "#dc2626" }}>{req.blood_group}</div>
                  <div style={{ fontSize: "14px", color: "var(--foreground)" }}>{req.hospital}</div>
                  <div style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>{req.location}</div>
                </div>
                <div style={{ fontSize: "12px", color: req.status === 'done' ? 'var(--muted-foreground)' : '#16a34a', background: req.status === 'done' ? 'var(--muted)' : 'rgba(22,163,74,0.1)', padding: "6px 12px", borderRadius: "8px", fontWeight: "bold" }}>
                  {req.status === 'done' ? '✓ Closed' : '● Active'}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}