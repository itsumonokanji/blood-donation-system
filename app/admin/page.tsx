"use client";

import React, { useState, useEffect } from "react";
import { Donor, Hospital, BloodRequest } from "@/types";
import Stats from "@/components/ui/Stats";
import { useLanguage } from "../LanguageContext";
import dynamic from 'next/dynamic';

// --- ТИПЫ ДАННЫХ ---
interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "warning";
}

interface MapProps {
  donors: Donor[];
  requests: BloodRequest[];
}

// --- ДИНАМИЧЕСКИЙ ИМПОРТ КАРТЫ ---
// Если Map.tsx лежит в той же папке, что и page.tsx, пишем './Map'
const Map = dynamic<MapProps>(() => import('./Map'), { 
  ssr: false,
  loading: () => (
    <div style={{ height: "400px", background: "#f3f4f6", borderRadius: "12px", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "30px" }}>
      ⏳ Загрузка карты...
    </div>
  )
});

export default function Home() {
  const { t, lang } = useLanguage();

  // Основные данные
  const [donors, setDonors] = useState<Donor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Состояния для поиска и фильтрации (были пропущены)
  const [matchedDonors, setMatchedDonors] = useState<{ requestId: number, list: any[] } | null>(null);
  const [form, setForm] = useState({ name: "", blood_group: "", location: "", lat: null, lng: null });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [bloodFilter, setBloodFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  // Уведомления
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [queue, setQueue] = useState<Toast[]>([]);

  // --- ЛОГИКА TOAST ---
  function showToast(message: string, type: Toast["type"] = "success") {
    const id = Date.now() + Math.random();
    setQueue((prev) => [...prev, { id, message, type }]);
  }

  useEffect(() => {
    if (queue.length === 0 || toasts.length >= 3) return;
    const next = queue[0];
    setToasts((prev) => [...prev, next]);
    setQueue((prev) => prev.slice(1));
    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== next.id));
    }, 2500);
    return () => clearTimeout(timer);
  }, [queue, toasts]);

  // --- ЗАГРУЗКА ДАННЫХ ---
  const loadDonors = async () => {
    const res = await fetch("/api/donors");
    if (res.ok) setDonors(await res.json());
  };

  const loadHospitals = async () => {
    const res = await fetch("/api/hospitals");
    if (res.ok) setHospitals(await res.json());
  };

  const loadRequests = async () => {
    const res = await fetch("/api/requests");
    if (res.ok) setRequests(await res.json());
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        await Promise.all([loadDonors(), loadHospitals(), loadRequests()]);
      } catch (err) {
        showToast(t.msgError, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // --- ДЕЙСТВИЯ ---
  async function deleteRequest(id: number) {
    if (!window.confirm(t.btnDelete + "?")) return;
    try {
      const res = await fetch(`/api/requests?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setRequests(prev => prev.filter(r => r.id !== id));
      if (matchedDonors?.requestId === id) setMatchedDonors(null);
      showToast(t.msgDeleted, "warning");
    } catch {
      showToast(t.msgError, "error");
    }
  }

function findDonorsForRequest(requestId: number, bloodGroup: string) {
    if (matchedDonors?.requestId === requestId) {
      setMatchedDonors(null);
      return;
    }

    const currentReq = requests.find(r => r.id === requestId);
    // Изменение: Если локация пустая, по умолчанию ориентируемся на Бишкек
    const reqCity = currentReq?.location?.split(',')[0].trim().toLowerCase() || "бишкек";

    const matches = donors
      .filter(d => d.blood_group === bloodGroup)
      .map(d => {
        const lastDate = d.last_donation ? new Date(d.last_donation).getTime() : 0;
        const diffDays = Math.floor((Date.now() - lastDate) / (1000 * 60 * 60 * 24));
        const canDonate = !d.last_donation || diffDays >= 60;
        
        return { 
          ...d, 
          canDonate, 
          daysWait: 60 - diffDays,
          // Проверка на вхождение города (теперь и для Бишкека)
          isLocal: d.location?.toLowerCase().includes(reqCity)
        } as any; // as any убирает ошибки типизации новых полей
      })
      .sort((a, b) => {
        // Теперь ошибки "Property does not exist" пропадут
        if (a.canDonate !== b.canDonate) return a.canDonate ? -1 : 1;
        if (a.isLocal !== b.isLocal) return a.isLocal ? -1 : 1;
        return 0;
      });

    setMatchedDonors({ requestId, list: matches });
    
    if (matches.length === 0) {
      showToast(`${t.bloodGroup} ${bloodGroup} - ${t.msgError}`, "warning");
    }
  }

  async function completeRequest(id: number, donorName?: string) {
    try {
      const res = await fetch("/api/requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, donorName }), 
      });
      if (!res.ok) throw new Error();
      await Promise.all([loadRequests(), loadDonors()]);
      setMatchedDonors(null); 
      showToast(donorName ? `Назначен: ${donorName}` : t.msgSuccess, "success");
    } catch {
      showToast(t.msgError, "error");
    }
  }

  async function deleteDonor(id: number) {
    if (!window.confirm(t.btnDelete + "?")) return;
    try {
      const res = await fetch(`/api/donors?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      await loadDonors();
      showToast(t.msgDeleted, "warning");
    } catch {
      showToast(t.msgError, "error");
    }
  }

  if (loading) return <div className="loader">...</div>;

  return (
    <div className="page-container">
      <div className="toast-wrapper">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            {toast.message}
          </div>
        ))}
      </div>

      <style jsx>{`
        .page-container { padding: 40px; max-width: 1200px; margin: 0 auto; background: var(--background); color: var(--foreground); }
        .toast-wrapper { position: fixed; top: 20px; right: 20px; display: flex; flex-direction: column; gap: 10px; z-index: 999; }
        .toast { padding: 12px 20px; border-radius: 8px; color: white; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: slideIn 0.3s ease; }
        .success { background: #10b981; }
        .error { background: #ef4444; }
        .warning { background: #f59e0b; }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .loader { display: flex; justify-content: center; align-items: center; height: 100vh; color: var(--foreground); }
        table { width: 100%; border-collapse: collapse; margin-bottom: 40px; background: var(--card); border-radius: 8px; overflow: hidden; color: var(--card-foreground); border: 1px solid var(--border); }
        th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid var(--border); }
        th { background: var(--muted); font-weight: 600; }
        input, select { padding: 10px; border: 1px solid var(--border); border-radius: 6px; font-size: 14px; background: var(--background); color: var(--foreground); }
        button { padding: 10px 15px; border-radius: 6px; border: none; cursor: pointer; font-weight: 500; transition: opacity 0.2s; }
        .btn-primary { background: #2563eb; color: white; }
        .btn-delete { background: #fee2e2; color: #dc2626; }
        .btn-edit { background: #fef3c7; color: #d97706; }
        .filter-section { display: flex; gap: 15px; margin-bottom: 30px; background: var(--muted); padding: 20px; border-radius: 10px; }
      `}</style>

      <h1>🩸 {t.adminTitle}</h1>
      <Stats donors={donors} requests={requests} />

      {/* --- КАРТА --- */}
      <div style={{ marginBottom: "30px" }}>
        <Map donors={donors} requests={requests} />
      </div>

      {/* --- ФИЛЬТРЫ --- */}
      <div className="filter-section">
        <input type="text" placeholder={t.searchPlaceholder} onChange={(e) => setSearch(e.target.value)} />
        <select value={bloodFilter} onChange={(e) => setBloodFilter(e.target.value)}>
          <option value="">{t.bloodGroup} (All)</option>
          {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <input placeholder={t.location + "..."} value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} />
      </div>

      {/* --- ТАБЛИЦА ДОНОРОВ --- */}
      <section>
        <h2>🧑‍🤝‍🧑 {t.adminDonors}</h2>
        <table>
          <thead>
            <tr>
              <th>{t.colName}</th>
              <th>{t.bloodGroup}</th>
              <th>{t.location}</th>
              <th>{lang === 'ru' ? "Последняя сдача" : "Last Donation"}</th>
              <th>{t.tableAction}</th>
            </tr>
          </thead>
          <tbody>
            {donors
              .filter(d => d.name.toLowerCase().includes(search.toLowerCase()))
              .filter(d => (bloodFilter ? d.blood_group === bloodFilter : true))
              .map((d) => (
                <tr key={d.id}>
                  <td><strong>{d.name}</strong></td>
                  <td>{d.blood_group}</td>
                  <td>{d.location || "—"}</td>
                  <td>{d.last_donation ? new Date(d.last_donation).toLocaleDateString() : "—"}</td>
                  <td>
                    <button className="btn-delete" onClick={() => deleteDonor(d.id!)}>{t.btnDelete}</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>

      {/* --- ТАБЛИЦА ЗАПРОСОВ --- */}
      <section>
        <h2>🩸 {t.adminRequests}</h2>
        <table>
          <thead>
            <tr>
              <th>{t.colHospital}</th>
              <th>{t.bloodGroup}</th>
              <th>{t.colStatus}</th>
              <th>{t.tableAction}</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <React.Fragment key={r.id}>
                <tr>
                  <td>
                    <div>{r.hospital || "—"}</div>
                    <small style={{ opacity: 0.6 }}>{r.location}</small>
                  </td>
                  <td><strong>{r.blood_group}</strong></td>
                  <td>
                    {r.status === "done" ? (
                      <div>
                        ✅ {t.statusDone}
                        {/* @ts-ignore */}
                        {r.donor_name && <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>Донор: {r.donor_name}</div>}
                      </div>
                    ) : `⏳ ${t.statusPending}`}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      {r.status !== "done" && (
                        <>
                          <button className="btn-edit" onClick={() => findDonorsForRequest(r.id, r.blood_group)}>🔍 {t.btnFind}</button>
                          <button className="btn-primary" onClick={() => completeRequest(r.id)}>{t.btnClose}</button>
                        </>
                      )}
                      <button className="btn-delete" onClick={() => deleteRequest(r.id)}>{t.btnDelete}</button>
                    </div>
                  </td>
                </tr>

                {/* Вывод совпадений */}
                {matchedDonors?.requestId === r.id && (
                  <tr>
                    <td colSpan={4} style={{ background: "rgba(0,0,0,0.05)", padding: "15px" }}>
                      <div style={{ display: "grid", gap: "10px" }}>
                        <strong>{t.compatibility}:</strong>
                        {matchedDonors.list.map(d => (
                          <div key={d.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "var(--card)", borderRadius: "8px" }}>
                             <span>{d.name} ({d.location})</span>
                             <button disabled={!d.canDonate} onClick={() => completeRequest(r.id, d.name)} className="btn-primary" style={{ padding: "4px 10px" }}>
                               {lang === 'ru' ? "Назначить" : "Assign"}
                             </button>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}