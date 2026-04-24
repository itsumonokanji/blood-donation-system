"use client";
import React, { useState, useEffect } from "react";
import { useLanguage } from "../LanguageContext";

export default function HospitalPage() {
  const { t, lang } = useLanguage();
  const [bloodGroup, setBloodGroup] = useState("");
  const [location, setLocation] = useState("");
  const [selectedHospitalId, setSelectedHospitalId] = useState(""); 
  const [requests, setRequests] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Генерируем список ID на основе ключей из твоего словаря
  const hospitalIds = Object.keys(t.hospitalsList || {});

  const handleHospitalChange = (id: string) => {
    setSelectedHospitalId(id);
    if (id && t.addresses[id]) {
      setLocation(t.addresses[id]);
    } else {
      setLocation("");
    }
  };

  // Эффект для обновления адреса при смене языка
  useEffect(() => {
    if (selectedHospitalId && t.addresses[selectedHospitalId]) {
      setLocation(t.addresses[selectedHospitalId]);
    }
  }, [lang, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHospitalId) return alert(t.selectHospital);
    
    setIsSubmitting(true);
    try {
      await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hospital: t.hospitalsList[selectedHospitalId],
          blood_group: bloodGroup,
          location: location,
          status: "active",
          lat: 42.8747, lng: 74.5698
        }),
      });
      alert(t.msgSuccess);
      setBloodGroup("");
      // Тут можно добавить loadData()
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto", color: "var(--foreground)" }}>
      <header style={{ marginBottom: "40px" }}>
        <h1 style={{ color: "#2563eb", fontSize: "2.5rem" }}>{t.hospTitle}</h1>
        <p>{t.hospSub}</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "40px" }}>
        <section>
          <div style={{ background: "var(--card)", padding: "30px", borderRadius: "20px", border: "1px solid var(--border)" }}>
            <h3 style={{ marginBottom: "25px" }}>{t.newRequest}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>{t.institution}</label>
                <select
                  value={selectedHospitalId}
                  onChange={(e) => handleHospitalChange(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }}
                  required
                >
                  <option value="">-- {t.selectHospital} --</option>
                  {hospitalIds.map(id => (
                    <option key={id} value={id}>{t.hospitalsList[id]}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>{t.bloodGroup}</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "var(--background)", color: "var(--foreground)", border: "1px solid var(--border)" }}
                  required
                >
                  <option value="">--</option>
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: "25px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>{t.location}</label>
                <input readOnly value={location} style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
              </div>

              <button type="submit" disabled={isSubmitting} style={{ width: "100%", padding: "14px", background: "#2563eb", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>
                {isSubmitting ? "..." : t.btnPost}
              </button>
            </form>
          </div>
        </section>
        
        {/* Здесь можно добавить список истории, если нужно */}
      </div>
    </div>
  );
}