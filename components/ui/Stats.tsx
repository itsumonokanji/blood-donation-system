"use client"; 

import { Donor, BloodRequest } from "../../types";
import { useLanguage } from "../../app/LanguageContext"; 

interface StatsProps {
  donors: Donor[];
  requests: BloodRequest[];
}

export default function Stats({ donors, requests }: StatsProps) {
  const { t } = useLanguage(); 

  const totalDonors = donors.length;
  
  const pendingRequests = requests.filter(r => r.status === "pending" || r.status === "open").length;
  const completedRequests = requests.filter(r => r.status === "done").length;

  return (
    <div className="stats-container">
      <div className="stat-card">
        <h3>{totalDonors}</h3>
        
        <p>{t.statsTotal}</p>
      </div>
      
      <div className="stat-card">
        <h3>{pendingRequests}</h3>
        <p>{t.statsActive}</p>
      </div>
      
      <div className="stat-card">
        <h3>{completedRequests}</h3>
        
        <p>{t.statsSaved || "Saved Lives"}</p>
      </div>

      <style jsx>{`
        .stats-container {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
        }
        .stat-card {
          flex: 1;
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          text-align: center;
          border: 1px solid #eee;
          transition: transform 0.2s;
        }
        .stat-card:hover {
          transform: translateY(-5px);
        }
        h3 { font-size: 2rem; margin: 0; color: #dc2626; }
        p { color: #666; margin: 5px 0 0; font-weight: 500; }
      `}</style>
    </div>
  );
}