// types/index.ts

export interface Donor {
  id?: number;
  name: string;
  blood_group: string;
  location?: string;
  last_donation?: string;
  // Добавляем координаты (опционально, так как не у всех они могут быть сразу)
  lat?: number; 
  lng?: number;
}

export interface Hospital {
  id: number;
  name: string;
  location: string;
  contact: string;
  lat?: number;
  lng?: number;
}

export interface BloodRequest {
  id: number;
  hospital: string;
  blood_group: string;
  location: string;
  status: "pending" | "done" | "open" | "closed";
  donor_name?: string;
  // Добавляем координаты сюда тоже
  lat?: number;
  lng?: number;
}

