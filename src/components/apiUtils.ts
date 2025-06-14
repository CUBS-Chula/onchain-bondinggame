// API utility functions for the onchain bonding game

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('Token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// User profile interface
export interface UserProfile {
  _id: string;
  userId: string;
  username: string;
  walletId: string;
  friendList: any[];
  avatarId: string;
  rank: number;
  score: number;
  favoriteChain: string[];
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Auth API calls
export const authApi = {
  // Get current user profile
  async getMe(): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.status}`);
    }

    const data: ApiResponse<UserProfile> = await response.json();
    if (data.success && data.data) {
      return data.data;
    } else {
      throw new Error('Invalid response format');
    }
  },

  // Get all users for leaderboard
  async getAllUsers(): Promise<UserProfile[]> {
    const response = await fetch(`${API_BASE_URL}/auth/users`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const data = await response.json();
    
    // Handle different response formats
    let usersArray: UserProfile[] = [];
    if (Array.isArray(data)) {
      usersArray = data;
    } else if (data && Array.isArray(data.users)) {
      usersArray = data.users;
    } else if (data && Array.isArray(data.data)) {
      usersArray = data.data;
    } else {
      throw new Error('Invalid data format: expected an array of users');
    }

    // Sort users by score in descending order
    return usersArray.sort((a, b) => b.score - a.score);
  },

  // Login with wallet
  async login(walletId: string): Promise<{ token: string }> {
    const requestBody = {
      userId: "",
      walletId: walletId
    };

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Login failed: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }
};

// Utility functions
export const apiUtils = {
  // Save token to localStorage
  saveToken(token: string): void {
    localStorage.setItem('Token', token);
  },

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem('Token');
  },

  // Remove token from localStorage
  removeToken(): void {
    localStorage.removeItem('Token');
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};
