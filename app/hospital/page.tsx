"use client";

import React, { useState, useEffect } from "react";
import { BloodRequest as Request } from "@/types";
import { useLanguage } from "../LanguageContext"; 

export default function HospitalPage() {
  const { t } = useLanguage(); 
  const [bloodGroup, setBloodGroup] = useState("");
  const [location, setLocation] = useState("");
  const [requests, setRequests] = useState<Request[]>([]);

  // Загрузка списка заявок при загрузке страницы
  useEffect(() => {
    fetch("/api/requests")
      .then((res) => res.json())
      .then((data) => setRequests(data));
  }, []);

  // Функция отправки новой заявки
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        hospital_name: "City Hospital", 
        blood_group: bloodGroup, 
        location 
      }),
    });

    if (res.ok) {
      
      const updated = await fetch("/api/requests").then((r) => r.json());
      setRequests(updated);
      
      setBloodGroup("");
      setLocation("");
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "0 auto", fontFamily: "system-ui" }}>
      {/* Шапка страницы */}
      <header style={{ marginBottom: "40px" }}>
        <h1 style={{ color: "#2563eb", marginBottom: "10px", fontSize: "2.5rem" }}>
          {t.hospTitle}
        </h1>
        <p style={{ color: "#64748b", fontSize: "1.1rem" }}>
          {t.hospSub}
        </p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "40px" }}>
        
        {/* ЛЕВАЯ КОЛОНКА: Форма создания заявки */}
        <section>
          <div style={{ 
            background: "#fff", 
            padding: "30px", 
            borderRadius: "20px", 
            border: "1px solid #e2e8f0", 
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" 
          }}>
            <h3 style={{ marginTop: 0, marginBottom: "25px", color: "#1e293b" }}>
              {t.newRequest}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#475569" }}>
                  {t.bloodGroup}
                </label>
                <select 
                  value={bloodGroup} 
                  onChange={(e) => setBloodGroup(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #cbd5e1", outline: "none", fontSize: "1rem" }}
                  required
                >
                  <option value="">--</option>
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "25px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#475569" }}>
                  {t.location}
                </label>
                <input 
                  placeholder="..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #cbd5e1", outline: "none", fontSize: "1rem" }}
                  required
                />
              </div>

              <button 
                type="submit" 
                style={{ 
                  width: "100%", 
                  padding: "14px", 
                  background: "#2563eb", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "10px", 
                  fontWeight: "bold", 
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
              >
                {t.btnPost}
              </button>
            </form>
          </div>
        </section>

        {/* ПРАВАЯ КОЛОНКА: Список активных заявок */}
        <section>
          <h3 style={{ marginTop: 0, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
            {t.history}
            <span style={{ fontSize: "12px", background: "#dbeafe", color: "#2563eb", padding: "4px 10px", borderRadius: "20px" }}>
              {requests.length}
            </span>
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {requests.length === 0 ? (
              <p style={{ color: "#94a3b8", textAlign: "center", padding: "40px", border: "2px dashed #e2e8f0", borderRadius: "16px" }}>
                Заявок пока нет
              </p>
            ) : (
              requests.map((req) => (
                <div key={req.id} style={{ 
                  padding: "20px", 
                  background: "white", 
                  borderRadius: "16px", 
                  border: "1px solid #e2e8f0", 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                }}>
                  <div>
                    <span style={{ 
                      fontWeight: "900", 
                      fontSize: "1.4rem", 
                      color: "#dc2626", 
                      marginRight: "20px",
                      display: "inline-block",
                      minWidth: "50px"
                    }}>
                      {req.blood_group}
                    </span>
                    <span style={{ color: "#475569", fontWeight: "500" }}>{req.location}</span>
                  </div>
                  <div style={{ 
                    fontSize: "13px", 
                    color: req.status === 'open' ? '#16a34a' : '#64748b', 
                    background: req.status === 'open' ? '#f0fdf4' : '#f1f5f9',
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    textTransform: "uppercase"
                  }}>
                    {req.status === 'open' ? '● Active' : '✓ Closed'}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}