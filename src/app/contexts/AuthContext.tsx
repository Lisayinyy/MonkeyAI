import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type AuthProvider = 'google' | 'email';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  provider: AuthProvider;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  onboardingCompleted: boolean;
  pendingMagicEmail: string | null;
  signInWithGoogle: () => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  signInWithEmail: (email: string) => Promise<void>;
  completeOnboarding: () => void;
  signOut: () => void;
  updateUserProfile: (updates: Partial<Pick<AuthUser, 'name' | 'email'>>) => void;
}

const AUTH_USER_KEY = 'monkey-auth-user';
const MAGIC_EMAIL_KEY = 'monkey-auth-magic-email';

function onboardingKey(email: string) {
  return `monkey-onboarding-complete:${email.toLowerCase()}`;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

function parseUser(raw: string | null): AuthUser | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed?.email || !parsed?.id) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() =>
    typeof window === 'undefined' ? null : parseUser(window.localStorage.getItem(AUTH_USER_KEY))
  );
  const [pendingMagicEmail, setPendingMagicEmail] = useState<string | null>(() =>
    typeof window === 'undefined' ? null : window.localStorage.getItem(MAGIC_EMAIL_KEY)
  );
  const [onboardingCompleted, setOnboardingCompleted] = useState(() => {
    if (typeof window === 'undefined') return false;
    const storedUser = parseUser(window.localStorage.getItem(AUTH_USER_KEY));
    if (!storedUser) return false;
    return window.localStorage.getItem(onboardingKey(storedUser.email)) === 'true';
  });

  const persistUser = (nextUser: AuthUser | null) => {
    setUser(nextUser);
    if (typeof window === 'undefined') return;
    if (!nextUser) {
      window.localStorage.removeItem(AUTH_USER_KEY);
      return;
    }
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
  };

  const signInWithGoogle = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const googleUser: AuthUser = {
      id: 'google-demo-user',
      name: 'Monkey User',
      email: 'user@gmail.com',
      provider: 'google',
    };
    persistUser(googleUser);
    const completed = typeof window !== 'undefined' && window.localStorage.getItem(onboardingKey(googleUser.email)) === 'true';
    setOnboardingCompleted(completed);
  };

  const sendMagicLink = async (email: string) => {
    const normalized = email.trim().toLowerCase();
    if (!normalized) return;
    await new Promise((resolve) => setTimeout(resolve, 600));
    setPendingMagicEmail(normalized);
  };

  const signInWithEmail = async (email: string) => {
    const normalized = email.trim().toLowerCase();
    await new Promise((resolve) => setTimeout(resolve, 400));
    const displayName = normalized.split('@')[0]?.replace(/[._-]+/g, ' ') || 'Monkey User';
    const emailUser: AuthUser = {
      id: `email-${normalized}`,
      name: displayName
        .split(' ')
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' '),
      email: normalized,
      provider: 'email',
    };
    persistUser(emailUser);
    const completed = typeof window !== 'undefined' && window.localStorage.getItem(onboardingKey(emailUser.email)) === 'true';
    setOnboardingCompleted(completed);
    setPendingMagicEmail(null);
  };

  const completeOnboarding = () => {
    if (!user || typeof window === 'undefined') return;
    window.localStorage.setItem(onboardingKey(user.email), 'true');
    setOnboardingCompleted(true);
  };

  const signOut = () => {
    persistUser(null);
    setPendingMagicEmail(null);
    setOnboardingCompleted(false);
  };

  const updateUserProfile = (updates: Partial<Pick<AuthUser, 'name' | 'email'>>) => {
    if (!user) return;
    const nextUser: AuthUser = {
      ...user,
      ...updates,
      email: updates.email?.toLowerCase() ?? user.email,
    };
    persistUser(nextUser);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (pendingMagicEmail) {
      window.localStorage.setItem(MAGIC_EMAIL_KEY, pendingMagicEmail);
    } else {
      window.localStorage.removeItem(MAGIC_EMAIL_KEY);
    }
  }, [pendingMagicEmail]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      onboardingCompleted,
      pendingMagicEmail,
      signInWithGoogle,
      sendMagicLink,
      signInWithEmail,
      completeOnboarding,
      signOut,
      updateUserProfile,
    }),
    [user, onboardingCompleted, pendingMagicEmail]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
