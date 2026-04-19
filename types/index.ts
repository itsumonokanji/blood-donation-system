// types/index.ts
export interface Donor {
  id: number;
  name: string;
  blood_group: string;
  location: string;
}

export interface Hospital {
  id: number;
  name: string;
  location: string;
  contact: string;
}

// types/index.ts

// types/index.ts

export interface BloodRequest {
  id: number;
  hospital: string;      // <-- Убедись, что написано именно hospital
  blood_group: string;
  status: "pending" | "done" | "open" | "closed";
  location?: string;     // Необязательно, но полезно
}