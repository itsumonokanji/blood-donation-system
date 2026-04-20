"use client";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Donor, BloodRequest } from "@/types";

// Фикс иконок Leaflet для Next.js
const icon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapProps {
  donors: Donor[];
  requests: BloodRequest[];
}

export default function Map({ donors, requests }: MapProps) {
  // ИЗМЕНЕНО: Координаты центра Бишкека [42.87, 74.59]
  const bishkekCenter: [number, number] = [42.8747, 74.5698]; 

  return (
    <div style={{ height: "400px", width: "100%", borderRadius: "12px", overflow: "hidden", marginBottom: "30px", border: "1px solid var(--border)" }}>
      {/* ИЗМЕНЕНО: Установлен центр Бишкека и зум 12 для лучшего обзора города */}
      <MapContainer center={bishkekCenter} zoom={12} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Рисуем доноров (Синие маркеры) */}
        {donors.map((d, i) => d.lat && d.lng && (
          <Marker key={`donor-${i}`} position={[Number(d.lat), Number(d.lng)]} icon={icon}>
            <Popup>
              <strong>{d.name}</strong><br/>
              Группа: {d.blood_group}<br/>
              {d.location}
            </Popup>
          </Marker>
        ))}

        {/* Рисуем запросы крови (Красные круги) */}
        {requests.map((r, i) => r.lat && r.lng && r.status !== 'done' && (
          <Circle 
            key={`req-${i}`}
            center={[Number(r.lat), Number(r.lng)]}
            pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.5 }}
            radius={800} 
          >
            <Popup>
              <strong>СРОЧНО: {r.blood_group}</strong><br/>
              {r.hospital}
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
}