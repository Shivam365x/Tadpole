import { LoginCredentials, SignupData, OTPVerification, User } from '../types';
import { mockUsers } from '../mock/data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    await delay(800);
    
    // Mock validation
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }
    
    return {
      user: mockUsers[0],
      token: 'mock-jwt-token-' + Math.random().toString(36),
    };
  },

  signup: async (data: SignupData): Promise<{ user: User; requiresOTP: boolean }> => {
    await delay(1000);
    
    if (!data.email || !data.password || !data.name) {
      throw new Error('All fields are required');
    }
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: data.email,
      name: data.name,
      role: 'developer',
      workspaceId: 'ws-1',
    };
    
    return {
      user: newUser,
      requiresOTP: true,
    };
  },

  verifyOTP: async (verification: OTPVerification): Promise<{ success: boolean; token: string }> => {
    await delay(600);
    
    if (verification.otp.length !== 6) {
      throw new Error('Invalid OTP format');
    }
    
    return {
      success: true,
      token: 'mock-jwt-token-' + Math.random().toString(36),
    };
  },

  forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    await delay(800);
    
    if (!email) {
      throw new Error('Email is required');
    }
    
    return {
      success: true,
      message: 'Password reset link sent to your email',
    };
  },

  resetPassword: async (token: string, newPassword: string): Promise<{ success: boolean }> => {
    await delay(800);
    
    if (!token || !newPassword) {
      throw new Error('Token and new password are required');
    }
    
    return {
      success: true,
    };
  },

  googleLogin: async (): Promise<{ user: User; token: string }> => {
    await delay(1200);
    
    return {
      user: mockUsers[0],
      token: 'mock-google-jwt-token-' + Math.random().toString(36),
    };
  },

  logout: async (): Promise<void> => {
    await delay(300);
  },

  getCurrentUser: async (): Promise<User> => {
    await delay(400);
    return mockUsers[0];
  },

  refreshToken: async (): Promise<{ token: string }> => {
    await delay(300);
    return {
      token: 'mock-refreshed-token-' + Math.random().toString(36),
    };
  },
};
