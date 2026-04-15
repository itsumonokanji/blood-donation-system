"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    blood_group: ""
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  // SEARCH (ADDED)
  const [search, setSearch] = useState("");

  // BLOOD FILTER (ADDED)
  const [bloodFilter, setBloodFilter] = useState("");

  // ERROR (ADDED)
  const [error, setError] = useState("");

  // UNDO DELETE (ADDED)
  const [deletedDonor, setDeletedDonor] = useState<any | null>(null);

  // =========================
  // TOAST STACK (ADDED - SLIDE IN + LIMIT 3 + QUEUE)
  // =========================
  const [toasts, setToasts] = useState<
    { id: number; message: string; type: "success" | "error" | "warning" }[]
  >([]);

  const [queue, setQueue] = useState<
    { id: number; message: string; type: "success" | "error" | "warning" }[]
  >([]);

  function showToast(
    message: string,
    type: "success" | "error" | "warning" = "success"
  ) {
    const id = Date.now() + Math.random();

    const newToast = { id, message, type };

    setQueue((prev) => [...prev, newToast]);
  }

  // PROCESS QUEUE (MAX 3 ON SCREEN)
  useEffect(() => {
    if (queue.length === 0) return;
    if (toasts.length >= 3) return;

    const next = queue[0];

    setToasts((prev) => [...prev, next]);
    setQueue((prev) => prev.slice(1));

    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== next.id));
    }, 2000); // ⬅️ ИЗМЕНЕНО БЫЛО 2500 → 2000

    return () => clearTimeout(timer);
  }, [queue, toasts]);

  // CANCEL EDIT (ADDED)
  function cancelEdit() {
    setEditingId(null);
    setForm({ name: "", blood_group: "" });
    setError("");
  }

  // LOAD
  async function loadDonors() {
    try {
      const res = await fetch("/api/donors");
      const data = await res.json();
      setDonors(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDonors();
  }, []);

  // ADD
  async function addDonor(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim() || !form.blood_group.trim()) {
      setError("Name and Blood Group are required!");
      showToast("Name and Blood Group are required!", "error");
      return;
    }

    setError("");

    await fetch("/api/donors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setForm({ name: "", blood_group: "" });
    loadDonors();

    showToast("Donor added successfully", "success");
  }

  // DELETE
  async function deleteDonor(id: number) {
    const confirmDelete = window.confirm("Are you sure you want to delete this donor?");
    if (!confirmDelete) {
      showToast("Delete cancelled", "warning");
      return;
    }

    const donorToDelete = donors.find((d) => d.id === id);

    await fetch(`/api/donors?id=${id}`, {
      method: "DELETE"
    });

    setDeletedDonor(donorToDelete);
    loadDonors();

    showToast("Donor deleted", "warning");
  }

  // UPDATE
  async function updateDonor(e: React.FormEvent) {
    e.preventDefault();

    await fetch("/api/donors", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingId,
        name: form.name,
        blood_group: form.blood_group
      })
    });

    setEditingId(null);
    setForm({ name: "", blood_group: "" });
    loadDonors();

    showToast("Donor updated successfully", "success");
  }

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }} className="page">

      {/* ========================= */}
      {/* TOAST STACK UI (ADDED) */}
      {/* ========================= */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.type === "success" && "✅ "}
            {t.type === "error" && "❌ "}
            {t.type === "warning" && "⚠️ "}
            {t.message}
          </div>
        ))}
      </div>

      <style jsx>{`
        .page {
          animation: fadeIn 0.6s ease-in-out;
        }

        .row {
          animation: rowIn 0.4s ease-in-out;
        }

        /* TOAST STACK */
        .toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 9999;
        }

        .toast {
          min-width: 220px;
          padding: 12px 16px;
          border-radius: 10px;
          color: white;
          font-weight: bold;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          animation: slideIn 0.3s ease-out;
        }

        .success { background: #16a34a; }
        .error { background: #dc2626; }
        .warning { background: #f59e0b; }

        @keyframes slideIn {
          from {
            transform: translateX(120%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes rowIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      <h1>🩸 Blood Donation Admin Panel</h1>

      {error && (
        <div style={{ color: "red", marginBottom: 10 }}>
          {error}
        </div>
      )}

      {deletedDonor && (
        <div style={{
          background: "#222",
          color: "white",
          padding: 10,
          marginBottom: 10,
          borderRadius: 6,
          display: "flex",
          justifyContent: "space-between"
        }}>
          <span>Donor deleted</span>
          <button
            onClick={() => {
              setDonors((prev) => [...prev, deletedDonor]);
              setDeletedDonor(null);
              showToast("Undo successful", "success");
            }}
            style={{
              background: "green",
              color: "white",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
              borderRadius: 5
            }}
          >
            Undo
          </button>
        </div>
      )}

      {/* SEARCH */}
      <input
        placeholder="Search donor by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: 8,
          marginBottom: 15,
          border: "1px solid #ccc",
          borderRadius: 6,
          width: "100%"
        }}
      />

      {/* BLOOD FILTER */}
      <select
        value={bloodFilter}
        onChange={(e) => setBloodFilter(e.target.value)}
        style={{
          padding: 8,
          marginBottom: 15,
          marginLeft: 10,
          border: "1px solid #ccc",
          borderRadius: 6
        }}
      >
        <option value="">All groups</option>
        <option value="A+">A+</option>
        <option value="A-">A-</option>
        <option value="B+">B+</option>
        <option value="B-">B-</option>
        <option value="O+">O+</option>
        <option value="O-">O-</option>
        <option value="AB+">AB+</option>
        <option value="AB-">AB-</option>
      </select>

      {/* FORM */}
      <form
        onSubmit={editingId ? updateDonor : addDonor}
        style={{
          display: "flex",
          gap: 10,
          marginTop: 20,
          marginBottom: 20
        }}
      >
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          style={{
            padding: 8,
            border: "1px solid #ccc",
            borderRadius: 6
          }}
        />

        <input
          placeholder="Blood Group (A+, O- etc)"
          value={form.blood_group}
          onChange={(e) =>
            setForm({ ...form, blood_group: e.target.value })
          }
          style={{
            padding: 8,
            border: "1px solid #ccc",
            borderRadius: 6
          }}
        />

        <button type="submit">
          {editingId ? "Save Changes" : "Add Donor"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={cancelEdit}
            style={{
              background: "gray",
              color: "white",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
              borderRadius: 5
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* TABLE */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse"
        }}
      >
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "2px solid #ddd" }}>
            <th style={{ padding: 10 }}>ID</th>
            <th style={{ padding: 10 }}>Name</th>
            <th style={{ padding: 10 }}>Blood Group</th>
            <th style={{ padding: 10 }}>Action</th>
          </tr>
        </thead>

        <tbody>
          {donors
            .filter((d: any) =>
              d.name.toLowerCase().includes(search.toLowerCase())
            )
            .filter((d: any) =>
              bloodFilter ? d.blood_group === bloodFilter : true
            )
            .map((d: any, index: number) => (
              <tr
                key={d.id}
                className="row"
                style={{
                  borderBottom: "1px solid #eee",
                  animationDelay: `${index * 0.05}s`
                }}
              >
                <td style={{ padding: 10 }}>{d.id}</td>
                <td style={{ padding: 10 }}>{d.name}</td>
                <td style={{ padding: 10 }}>{d.blood_group}</td>

                <td style={{ padding: 10 }}>
                  <button
                    onClick={() => deleteDonor(d.id)}
                    style={{
                      background: "red",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer",
                      borderRadius: 5,
                      marginRight: 5
                    }}
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => {
                      setEditingId(d.id);
                      setForm({
                        name: d.name,
                        blood_group: d.blood_group
                      });
                    }}
                    style={{
                      background: "orange",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer",
                      borderRadius: 5
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}