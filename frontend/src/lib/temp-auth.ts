
import type { 
  AuthResponse, 
  SignInCredentials, 
  SignUpCredentials, 
  User 
} from '@/types/auth';

// Mock user data
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@gmail.com',
    created_at: new Date().toISOString(),
  },
  {
    id: '2', 
    email: 'user@gmail.com',
    created_at: new Date().toISOString(),
  }
];

// Mock credentials
const MOCK_CREDENTIALS = [
  { email: 'admin@gmail.com', password: '123' },
  { email: 'user@gmail.com', password: '123' }
];

// Generate mock tokens
function generateMockTokens(user: User) {
  const accessToken = `mock_access_token_${user.id}_${Date.now()}`;
  const refreshToken = `mock_refresh_token_${user.id}_${Date.now()}`;
  
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: Date.now() + (15 * 60 * 1000) // 15 minutes from now
  };
}

// Simulate API delay
function delay(ms: number = 500) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Sign up with email and password (mock)
export async function signUp(
  email: string, 
  password: string, 
  userData?: Record<string, unknown>
): Promise<User> {
  await delay();
  
  try {
    // Check if user already exists
    const existingUser = MOCK_USERS.find(user => user.email === email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Create new mock user
    const newUser: User = {
      id: String(MOCK_USERS.length + 1),
      email,
      created_at: new Date().toISOString(),
    };
    
    // Add to mock database
    MOCK_USERS.push(newUser);
    MOCK_CREDENTIALS.push({ email, password });
    
    // Generate tokens
    const session = generateMockTokens(newUser);
    
    // Store in localStorage
    localStorage.setItem('accessToken', session.access_token);
    localStorage.setItem('refreshToken', session.refresh_token);
    localStorage.setItem('userId', newUser.id);
    localStorage.setItem('userEmail', newUser.email);
    
    console.log('Mock signup successful:', newUser);
    return newUser;
  } catch (error: any) {
    console.error('Mock signup error:', error);
    throw error;
  }
}

// Sign in with email and password (mock)
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  await delay();
  
  try {
    // Find user credentials
    const credentials = MOCK_CREDENTIALS.find(cred => 
      cred.email === email && cred.password === password
    );
    
    if (!credentials) {
      throw new Error('Invalid email or password');
    }
    
    // Find user data
    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Generate tokens
    const session = generateMockTokens(user);
    
    // Store in localStorage
    localStorage.setItem('accessToken', session.access_token);
    localStorage.setItem('refreshToken', session.refresh_token);
    localStorage.setItem('userId', user.id);
    localStorage.setItem('userEmail', user.email);
    
    const authResponse: AuthResponse = {
      user,
      session,
      // message: 'Login successful'
    };
    
    console.log('Mock signin successful:', authResponse);
    return authResponse;
  } catch (error: any) {
    console.error('Mock signin error:', error);
    throw error;
  }
}

// Sign out (mock)
export async function signOut(): Promise<void> {
  await delay(200);
  
  try {
    // Clear localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    
    console.log('Mock signout successful');
  } catch (error) {
    console.error('Mock signout error:', error);
  }
}

// Reset password (mock)
export async function resetPassword(email: string): Promise<void> {
  await delay();
  
  try {
    // Check if user exists
    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) {
      // Don't reveal if email exists or not
      console.log(`Mock password reset sent to: ${email}`);
      return;
    }
    
    console.log(`Mock password reset sent to: ${email}`);
    // In real implementation, you would send an email here
  } catch (error: any) {
    console.error('Mock reset password error:', error);
    throw new Error('Failed to reset password');
  }
}

// Get current user (mock)
export async function getCurrentUser(): Promise<User> {
  await delay(200);
  
  try {
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    
    if (!userId || !userEmail) {
      throw new Error('No user session found');
    }
    
    const user = MOCK_USERS.find(u => u.id === userId && u.email === userEmail);
    if (!user) {
      throw new Error('User not found');
    }
    
    console.log('Mock getCurrentUser successful:', user);
    return user;
  } catch (error: any) {
    console.error('Mock getCurrentUser error:', error);
    throw error;
  }
}

// Refresh token (mock)
export async function refreshToken(): Promise<string> {
  await delay(200);
  
  try {
    const userId = localStorage.getItem('userId');
    const currentRefreshToken = localStorage.getItem('refreshToken');
    
    if (!userId || !currentRefreshToken) {
      throw new Error('No refresh token available');
    }
    
    const user = MOCK_USERS.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Generate new tokens
    const newSession = generateMockTokens(user);
    
    // Update localStorage
    localStorage.setItem('accessToken', newSession.access_token);
    localStorage.setItem('refreshToken', newSession.refresh_token);
    
    console.log('Mock token refresh successful');
    return newSession.access_token;
  } catch (error: any) {
    console.error('Mock refresh token error:', error);
    throw error;
  }
}

// Check if user is authenticated (mock)
export function isAuthenticated(): boolean {
  const token = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('userId');
  return !!(token && userId);
}

// Get access token (mock)
export function getAccessToken(): string | null {
  return localStorage.getItem('accessToken');
}

// Mock auth axios (for compatibility)
export const authAxios = {
  getAccessToken,
  refreshToken: async () => {
    try {
      return await refreshToken();
    } catch (error) {
      console.error('Mock authAxios refresh failed:', error);
      throw error;
    }
  },
  onAuthError: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    
    if (typeof window !== 'undefined') {
      console.log("Mock auth error, redirecting to login.");
      window.location.href = '/auth/login'; 
    }
  }
};