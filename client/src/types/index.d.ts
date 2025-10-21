export type UserRole = "user" | "admin" | "owner" | "staff";

export interface WalletTransaction {
  type: "credit" | "debit";
  amount: number;
  description: string;
  timestamp: string;
}

export interface Wallet {
  coins: number;
  transactions: WalletTransaction[];
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  wallet: Wallet;
  ownedParkings?: string[];
  staffParking?: string;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  isActive?: boolean;
  lastLogin?: string;
  profilePicture?: string;
}

export type ParkingType = "opensky" | "closedsky";
export type PaymentType = "paid" | "free";
export type OwnershipType = "private" | "public";
export type VehicleType = "car" | "bus_truck" | "bike";

export interface CoordinatesAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface GeoPoint {
  type: "Point";
  coordinates: [number, number];
  address?: CoordinatesAddress;
}

export interface ParkingStatistics {
  totalVisits: number;
  totalRevenue: number;
  averageOccupancy: number;
}

export interface ParkingCounts {
  car: number;
  bus_truck: number;
  bike: number;
}

export interface ParkingRates {
  car: number;
  bus_truck: number;
  bike: number;
}

export interface Parking {
  _id: string;
  parkingId: string;
  name: string;
  description?: string;
  location: GeoPoint;
  parkingType: ParkingType;
  paymentType: PaymentType;
  ownershipType: OwnershipType;
  capacity: ParkingCounts;
  currentCount: ParkingCounts;
  hourlyRate: ParkingRates;
  owner: Pick<User, "_id" | "name" | "email" | "phone">;
  staff: Array<Pick<User, "_id" | "name" | "email" | "phone">>;
  isActive: boolean;
  isApproved: boolean;
  approvedBy?: Pick<User, "_id" | "name">;
  approvedAt?: string;
  images: Array<{ url: string; caption?: string; uploadedAt: string }>;
  amenities: string[];
  operatingHours: { open: string; close: string; is24Hours: boolean };
  statistics: ParkingStatistics;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
  // Virtuals
  availableSpaces: ParkingCounts;
  isFull: boolean;
  occupancyPercentage: number;
}

export interface Request {
  _id: string;
  user: Pick<User, "_id" | "name" | "email" | "phone">;
  requestType: "parking" | "no_parking";
  status: "pending" | "approved" | "denied";
  title: string;
  description: string;
  location: GeoPoint;
  images: Array<{ url: string; publicId: string; caption?: string; uploadedAt: string }>;
  parkingDetails?: {
    name?: string;
    capacity?: ParkingCounts;
    parkingType?: ParkingType;
    paymentType?: PaymentType;
    ownershipType?: OwnershipType;
    hourlyRate?: ParkingRates;
    amenities?: string[];
    operatingHours?: { open: string; close: string; is24Hours: boolean };
  };
  noParkingDetails?: {
    reason?: "construction" | "event" | "maintenance" | "safety" | "other";
    duration?: { startDate?: string; endDate?: string };
    affectedArea?: "partial" | "complete";
  };
  adminNotes?: string;
  coinsAwarded?: number;
  approvedBy?: Pick<User, "_id" | "name">;
  approvedAt?: string;
  deniedBy?: Pick<User, "_id" | "name">;
  deniedAt?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Visit {
  _id: string;
  user: Pick<User, "_id" | "name" | "email" | "phone">;
  parking: Pick<Parking, "_id" | "name" | "parkingId" | "location" | "parkingType" | "paymentType">;
  visitDate: string;
  coinsEarned: number;
  location: { type: "Point"; coordinates: [number, number] };
  distance: number;
  isVerified: boolean;
  verificationMethod: "gps" | "qr_code" | "manual";
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiSuccess<T> {
  success: true;
  message?: string;
  data: T;
}

export interface ApiError {
  success: false;
  status?: string;
  message: string;
  error?: unknown;
}