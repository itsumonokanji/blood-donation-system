"use client";

import React, { useState } from "react";
import { useLanguage } from "../LanguageContext";

export default function RegisterDonorPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: "", blood_group: "", location: "", contact: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/donors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsSuccess(true);
        setFormData({ name: "", blood_group: "", location: "", contact: "" });
      } else {
        alert("Ошибка при регистрации. Попробуйте позже.");
      }
    } catch (err) {
      alert("Ошибка сети.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "80vh", textAlign: "center", padding: "20px" }}>
        <div style={{ fontSize: "64px", marginBottom: "20px" }}>❤️</div>
        <h1 style={{ color: "#2563eb" }}>Спасибо, что вы с нами!</h1>
        <p style={{ fontSize: "1.2rem", color: "var(--muted-foreground)" }}>
          Ваши данные успешно добавлены в базу доноров. <br />
          Если кому-то понадобится помощь в вашем городе, больница свяжется с вами.
        </p>
        <button onClick={() => setIsSuccess(false)} style={{ marginTop: "30px", padding: "12px 24px", background: "#2563eb", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}>
          Зарегистрировать еще кого-то
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 20px", maxWidth: "500px", margin: "0 auto", minHeight: "100vh" }}>
      <header style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ color: "#dc2626", fontSize: "2.5rem", marginBottom: "10px" }}>Стать донором</h1>
        <p style={{ color: "var(--muted-foreground)" }}>Каждая капля крови может спасти чью-то жизнь</p>
      </header>

      <form onSubmit={handleSubmit} style={{ background: "var(--card)", padding: "30px", borderRadius: "24px", border: "1px solid var(--border)", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Ваше имя</label>
          <input
            required
            placeholder="Иван Иванов"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Группа крови</label>
          <select
            required
            value={formData.blood_group}
            onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }}
          >
            <option value="">Выберите группу</option>
            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Город проживания</label>
          <input
            required
            placeholder="Бишкек"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }}
          />
        </div>

        <div style={{ marginBottom: "30px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Телефон для связи</label>
          <input
            required
            type="tel"
            placeholder="+996 (___) __ __ __"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: "100%", padding: "16px", background: "#dc2626", color: "white",
            border: "none", borderRadius: "12px", fontSize: "1.1rem", fontWeight: "bold",
            cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1,
            transition: "transform 0.2s"
          }}
        >
          {isSubmitting ? "Регистрация..." : "Зарегистрироваться как донор"}
        </button>
      </form>
    </div>
  );
}