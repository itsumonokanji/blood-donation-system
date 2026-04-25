"use client";

export default function LandingPage() {
  return (
    <div style={{ padding: "50px", textAlign: "center", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#dc2626" }}>Система донации крови</h1>
      <p>Если вы это видите, значит билд наконец-то прошел успешно!</p>
      <div style={{ marginTop: "20px" }}>
        <a href="/register" style={{ marginRight: "15px" }}>Регистрация</a>
        <a href="/donor">Донорам</a>
      </div>
    </div>
  );
}