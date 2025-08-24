// API service for Smart Parking System
const API_BASE_URL = 'http://localhost:5000/api';

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'owner' | 'staff' | 'user';
  wallet: {
    coins: number;
    transactions: WalletTransaction[];
  };
  ownedParkings: any[];
  staffParking: any;
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransaction {
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  timestamp: string;
}

export interface Parking {
  _id: string;
  parkingId: string;
  name: string;
  description: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
    };
  };
  parkingType: 'opensky' | 'closedsky';
  paymentType: 'paid' | 'free';
  ownershipType: 'private' | 'public';
  capacity: {
    car: number;
    bus_truck: number;
    bike: number;
  };
  currentCount: {
    car: number;
    bus_truck: number;
    bike: number;
  };
  hourlyRate: {
    car: number;
    bus_truck: number;
    bike: number;
  };
  isFull: boolean;
  availableSpaces: {
    car: number;
    bus_truck: number;
    bike: number;
  };
  occupancyPercentage: number;
  owner: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  isActive: boolean;
  isApproved: boolean;
  lastUpdated: string;
  distance?: number;
}

export interface Visit {
  _id: string;
  parking: {
    _id: string;
    name: string;
    location: any;
    parkingType: string;
    paymentType: string;
  };
  visitDate: string;
  coinsEarned: number;
  distance: number;
  isVerified: boolean;
  verificationMethod: string;
  ageInDays: number;
  formattedVisitDate: string;
}

export interface Request {
  _id: string;
  requestType: 'parking' | 'no_parking';
  status: 'pending' | 'approved' | 'denied';
  title: string;
  description: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  images: Array<{
    url: string;
    caption: string;
  }>;
  parkingDetails?: any;
  noParkingDetails?: any;
  createdAt: string;
  ageInDays: number;
  isPending: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Auth token management
let authToken: string | null = localStorage.getItem('auth_token');

const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
};

// API request helper
const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    if (!data.success) {
      throw new Error(data.message || 'API request failed');
    }

    return data.data as T;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Authentication API
export const authApi = {
  register: async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    const response = await apiRequest<{ user: User; token: string }>('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    setAuthToken(response.token);
    return response;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await apiRequest<{ user: User; token: string }>('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    setAuthToken(response.token);
    return response;
  },

  logout: async () => {
    await apiRequest('/users/logout', { method: 'POST' });
    setAuthToken(null);
  },

  getProfile: async () => {
    return await apiRequest<{ user: User }>('/users/profile');
  },

  updateProfile: async (profileData: Partial<User>) => {
    return await apiRequest<{ user: User }>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};

// Parking API
export const parkingApi = {
  getAll: async (params: {
    page?: number;
    limit?: number;
    parkingType?: string;
    paymentType?: string;
  } = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString());
    });
    
    return await apiRequest<{ parkings: Parking[]; pagination: any }>(`/parkings?${searchParams}`);
  },

  getNearby: async (coordinates: [number, number], maxDistance: number = 5000) => {
    return await apiRequest<{ parkings: Parking[] }>(
      `/parkings/nearby?coordinates=${coordinates[0]},${coordinates[1]}&maxDistance=${maxDistance}`
    );
  },

  getAvailable: async (coordinates: [number, number], maxDistance: number = 5000) => {
    return await apiRequest<{ parkings: Parking[] }>(
      `/parkings/available?coordinates=${coordinates[0]},${coordinates[1]}&maxDistance=${maxDistance}`
    );
  },

  create: async (parkingData: any) => {
    return await apiRequest<{ parking: Parking }>('/parkings', {
      method: 'POST',
      body: JSON.stringify(parkingData),
    });
  },

  updateVehicleCount: async (parkingId: string, vehicleType: string, count: number) => {
    return await apiRequest(`/parkings/${parkingId}/vehicle-count`, {
      method: 'PUT',
      body: JSON.stringify({ vehicleType, count }),
    });
  },

  incrementVehicleCount: async (parkingId: string, vehicleType: string, increment: number = 1) => {
    return await apiRequest(`/parkings/${parkingId}/vehicle-count/increment`, {
      method: 'POST',
      body: JSON.stringify({ vehicleType, increment }),
    });
  },

  decrementVehicleCount: async (parkingId: string, vehicleType: string, decrement: number = 1) => {
    return await apiRequest(`/parkings/${parkingId}/vehicle-count/decrement`, {
      method: 'POST',
      body: JSON.stringify({ vehicleType, decrement }),
    });
  },
};

// Visit API
export const visitApi = {
  record: async (visitData: {
    parkingId: string;
    location: { type: 'Point'; coordinates: [number, number] };
    distance: number;
  }) => {
    return await apiRequest<{ visit: Visit }>('/visits', {
      method: 'POST',
      body: JSON.stringify(visitData),
    });
  },

  getUserVisits: async (page: number = 1, limit: number = 20) => {
    return await apiRequest<{ visits: Visit[]; pagination: any }>(
      `/visits/user/me?page=${page}&limit=${limit}`
    );
  },

  verify: async (visitId: string, method: string, notes?: string) => {
    return await apiRequest(`/visits/${visitId}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ method, notes }),
    });
  },
};

// Request API
export const requestApi = {
  create: async (requestData: any) => {
    return await apiRequest<{ request: Request }>('/requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },

  getUserRequests: async (page: number = 1, limit: number = 20, status?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);
    
    return await apiRequest<{ requests: Request[]; pagination: any }>(
      `/requests/user/me?${params}`
    );
  },

  approve: async (requestId: string, data: { coinsAwarded: number; adminNotes: string }) => {
    return await apiRequest(`/requests/${requestId}/approve`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deny: async (requestId: string, data: { adminNotes: string }) => {
    return await apiRequest(`/requests/${requestId}/deny`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Wallet API
export const walletApi = {
  getWallet: async () => {
    return await apiRequest<{ wallet: { coins: number; transactions: WalletTransaction[] } }>('/users/wallet');
  },

  getTransactions: async (page: number = 1, limit: number = 20) => {
    return await apiRequest<{ transactions: WalletTransaction[]; pagination: any }>(
      `/users/wallet/transactions?page=${page}&limit=${limit}`
    );
  },
};

export { authToken, setAuthToken };
