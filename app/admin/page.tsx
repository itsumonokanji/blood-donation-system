"use client";

import React, { useState, useEffect } from "react";
import { Donor, Hospital, BloodRequest } from "@/types";
import Stats from "@/components/ui/Stats";
import { useLanguage } from "../LanguageContext"; 

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "warning";
}

export default function Home() {
  const { t, lang } = useLanguage();

  const [donors, setDonors] = useState<Donor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingHospitalId, setEditingHospitalId] = useState<number | null>(null);
  const [matchedDonors, setMatchedDonors] = useState<{ requestId: number, list: Donor[] } | null>(null);
  const [form, setForm] = useState({ name: "", blood_group: "", location: "" });
  const [hospitalForm, setHospitalForm] = useState({ name: "", location: "", contact: "" });
  const [requestForm, setRequestForm] = useState({ hospital: "", blood_group: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [bloodFilter, setBloodFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [queue, setQueue] = useState<Toast[]>([]);

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

  function findDonorsForRequest(requestId: number, bloodGroup: string) {
    if (matchedDonors?.requestId === requestId) {
      setMatchedDonors(null);
      return;
    }
    const matches = donors.filter(d => d.blood_group === bloodGroup);
    setMatchedDonors({ requestId, list: matches });
    if (matches.length === 0) {
      showToast(`${t.bloodGroup} ${bloodGroup} - ${t.msgError}`, "warning");
    } else {
      showToast(`${t.compatibility} ${matches.length}`, "success");
    }
  }

  async function handleDonorSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.blood_group.trim()) {
      return showToast(t.msgError, "error");
    }
    const method = editingId ? "PUT" : "POST";
    const body = editingId ? { id: editingId, ...form } : form;
    try {
      const res = await fetch("/api/donors", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      setEditingId(null);
      setForm({ name: "", blood_group: "", location: "" });
      await loadDonors();
      showToast(t.msgSuccess, "success");
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

  async function completeRequest(id: number) {
    try {
      const res = await fetch("/api/requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      await loadRequests();
      showToast(t.msgSuccess, "success");
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
        .page-container { 
          padding: 40px; 
          max-width: 1200px; 
          margin: 0 auto; 
          background: var(--background); 
          color: var(--foreground);
        }
        .toast-wrapper { position: fixed; top: 20px; right: 20px; display: flex; flex-direction: column; gap: 10px; z-index: 999; }
        .toast { padding: 12px 20px; border-radius: 8px; color: white; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: slideIn 0.3s ease; }
        .success { background: #10b981; }
        .error { background: #ef4444; }
        .warning { background: #f59e0b; }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        
        .loader { display: flex; justify-content: center; align-items: center; height: 100vh; color: var(--foreground); }
        
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-bottom: 40px; 
          background: var(--card); 
          border-radius: 8px; 
          overflow: hidden; 
          color: var(--card-foreground);
          border: 1px solid var(--border);
        }
        th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid var(--border); }
        th { background: var(--muted); font-weight: 600; }
        
        input, select { 
          padding: 10px; 
          border: 1px solid var(--border); 
          border-radius: 6px; 
          font-size: 14px; 
          background: var(--background); 
          color: var(--foreground); 
        }
        
        button { padding: 10px 15px; border-radius: 6px; border: none; cursor: pointer; font-weight: 500; transition: opacity 0.2s; }
        .btn-primary { background: #2563eb; color: white; }
        .btn-delete { background: #fee2e2; color: #dc2626; }
        .btn-edit { background: #fef3c7; color: #d97706; }
        
        .filter-section { 
          display: flex; 
          gap: 15px; 
          margin-bottom: 30px; 
          background: var(--muted); 
          padding: 20px; 
          border-radius: 10px; 
        }
        .match-row { background: var(--accent); color: var(--accent-foreground); }
      `}</style>

      <h1>🩸 {t.adminTitle}</h1>
      <Stats donors={donors} requests={requests} />

      <div className="filter-section">
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          onChange={(e) => setSearch(e.target.value)} />
        <select value={bloodFilter} onChange={(e) => setBloodFilter(e.target.value)}>
          <option value="">{t.bloodGroup} (All)</option>
          {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <input placeholder={t.location + "..."} value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} />
      </div>

      <section>
        <h2>🧑‍🤝‍🧑 {t.adminDonors}</h2>
        <form onSubmit={handleDonorSubmit} style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <input 
            placeholder={t.colName} 
            value={form.name} 
            onChange={(e) => setForm({ ...form, name: e.target.value })} 
          />
          <select value={form.blood_group} onChange={(e) => setForm({ ...form, blood_group: e.target.value })}>
            <option value="">{t.bloodGroup}</option>
            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <input placeholder={t.location} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          
          <button type="submit" className="btn-primary">
            {editingId ? t.statusDone : t.btnReg}
          </button>
          
          {editingId && (
            <button type="button" onClick={() => setEditingId(null)} style={{ background: "var(--muted)", color: "var(--foreground)" }}>
              {t.btnClose}
            </button>
          )}
        </form>

        <table>
          <thead>
            <tr>
              <th>{t.colId}</th>
              <th>{t.colName}</th>
              <th>{t.bloodGroup}</th>
              <th>{t.location}</th>
              <th>{t.tableAction}</th>
            </tr>
          </thead>
          <tbody>
            {donors
              .filter(d => d.name.toLowerCase().includes(search.toLowerCase()))
              .filter(d => (bloodFilter ? d.blood_group === bloodFilter : true))
              .map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.name}</td>
                  <td>{d.blood_group}</td>
                  <td>{d.location || "—"}</td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button className="btn-delete" onClick={() => deleteDonor(d.id!)}>
                        {t.btnDelete}
                      </button>
                      <button className="btn-edit" onClick={() => { 
                        setEditingId(d.id!); 
                        setForm({ name: d.name, blood_group: d.blood_group, location: d.location || "" }); 
                      }}>
                        {lang === 'ru' ? "Ред." : "Edit"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>

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
                  <td>{r.hospital}</td>
                  <td><strong>{r.blood_group}</strong></td>
                  <td>
                    {r.status === "done" 
                      ? `✅ ${t.statusDone}` 
                      : `⏳ ${t.statusPending}`
                    }
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      {r.status !== "done" && (
                        <>
                          <button className="btn-edit" onClick={() => findDonorsForRequest(r.id, r.blood_group)}>
                            🔍 {t.btnFind}
                          </button>
                          <button className="btn-primary" onClick={() => completeRequest(r.id)}>
                            {t.btnClose}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                {matchedDonors?.requestId === r.id && (
                  <tr className="match-row">
                    <td colSpan={4}>
                      <div style={{ padding: "10px" }}>
                        <strong>{t.compatibility}:</strong>
                        {matchedDonors.list.length > 0 ? (
                          <ul style={{ margin: "10px 0" }}>
                            {matchedDonors.list.map(d => (
                              <li key={d.id}>{d.name} ({d.location || "—"})</li>
                            ))}
                          </ul>
                        ) : (
                          <p>{t.msgError}</p> 
                        )}
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