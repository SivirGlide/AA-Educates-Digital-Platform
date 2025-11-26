import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { api } from '../../lib/api';

type Nullable<T> = T | null;

interface AuthUser {
  id?: number;
  role?: string;
  profile_id?: number;
  [key: string]: unknown;
}

interface LoginSuccessPayload {
  access?: string;
  refresh?: string;
  user?: AuthUser;
}

interface ApiResult<T> {
  data?: T;
  error?: string;
}

interface RegisterPayload {
  [key: string]: unknown;
}

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';
const USER_ID_KEY = 'userId';
const USER_ROLE_KEY = 'userRole';
const PROFILE_ID_KEY = 'profileId';

const isBrowser = typeof window !== 'undefined';

const parseUser = (raw: string | null): Nullable<AuthUser> => {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch (error) {
    if (isBrowser) {
      window.console.warn('Failed to parse stored user payload, clearing the cache.', error);
      window.localStorage.removeItem(USER_KEY);
    }
    return null;
  }
};

const loadStoredUser = (): Nullable<AuthUser> => {
  if (!isBrowser) {
    return null;
  }

  const storedUser = parseUser(window.localStorage.getItem(USER_KEY));

  if (storedUser) {
    return storedUser;
  }

  const userId = window.localStorage.getItem(USER_ID_KEY);
  const userRole = window.localStorage.getItem(USER_ROLE_KEY);
  const profileId = window.localStorage.getItem(PROFILE_ID_KEY);

  if (!userId && !userRole && !profileId) {
    return null;
  }

  const fallback: AuthUser = {};

  if (userId) {
    const parsedId = Number(userId);
    fallback.id = Number.isNaN(parsedId) ? undefined : parsedId;
  }

  if (userRole) {
    fallback.role = userRole;
  }

  if (profileId) {
    const parsedProfileId = Number(profileId);
    fallback.profile_id = Number.isNaN(parsedProfileId) ? undefined : parsedProfileId;
  }

  return fallback;
};

const loadToken = (key: string): Nullable<string> => {
  if (!isBrowser) {
    return null;
  }
  return window.localStorage.getItem(key);
};

const persistAuthState = (payload: LoginSuccessPayload): void => {
  if (!isBrowser) {
    return;
  }

  if (payload.access) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, payload.access);
  }

  if (payload.refresh) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, payload.refresh);
  }

  if (payload.user) {
    window.localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
    if (payload.user.id !== undefined) {
      window.localStorage.setItem(USER_ID_KEY, String(payload.user.id));
    }
    if (payload.user.role) {
      window.localStorage.setItem(USER_ROLE_KEY, payload.user.role);
    }
    if (payload.user.profile_id !== undefined) {
      window.localStorage.setItem(PROFILE_ID_KEY, String(payload.user.profile_id));
    } else {
      window.localStorage.removeItem(PROFILE_ID_KEY);
    }
  }
};

const clearAuthStorage = () => {
  if (!isBrowser) {
    return;
  }

  [
    ACCESS_TOKEN_KEY,
    REFRESH_TOKEN_KEY,
    USER_KEY,
    USER_ID_KEY,
    USER_ROLE_KEY,
    PROFILE_ID_KEY,
  ].forEach((key) => window.localStorage.removeItem(key));
};

interface AuthContextValue {
  user: Nullable<AuthUser>;
  accessToken: Nullable<string>;
  refreshToken: Nullable<string>;
  role: string | null;
  loading: boolean;
  error: Nullable<string>;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<ApiResult<AuthUser>>;
  register: (data: RegisterPayload) => Promise<ApiResult<unknown>>;
  logout: () => void;
  setUser: Dispatch<SetStateAction<Nullable<AuthUser>>>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Nullable<AuthUser>>(null);
  const [accessToken, setAccessToken] = useState<Nullable<string>>(null);
  const [refreshToken, setRefreshToken] = useState<Nullable<string>>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Nullable<string>>(null);

  useEffect(() => {
    if (!isBrowser) {
      setLoading(false);
      return;
    }

    const storedUser = loadStoredUser();
    const storedAccessToken = loadToken(ACCESS_TOKEN_KEY);
    const storedRefreshToken = loadToken(REFRESH_TOKEN_KEY);

    setUser(storedUser);
    setAccessToken(storedAccessToken);
    setRefreshToken(storedRefreshToken);
    setLoading(false);
  }, []);

  const role = useMemo(() => {
    const currentRole = user?.role;
    if (currentRole) {
      return currentRole.toLowerCase();
    }
    if (isBrowser) {
      const storedRole = window.localStorage.getItem(USER_ROLE_KEY);
      return storedRole ? storedRole.toLowerCase() : null;
    }
    return null;
  }, [user?.role]);

  const login = useCallback(
    async (email: string, password: string): Promise<ApiResult<AuthUser>> => {
      setLoading(true);
      setError(null);

      const response = await api.login(email, password);

      if (response.error || !response.data) {
        setError(response.error ?? 'Unable to login.');
        setLoading(false);
        return { error: response.error ?? 'Unable to login.' };
      }

      const payload = response.data as LoginSuccessPayload;

      setUser(payload.user ?? null);
      setAccessToken(payload.access ?? null);
      setRefreshToken(payload.refresh ?? null);
      persistAuthState(payload);

      setLoading(false);

      return { data: payload.user };
    },
    []
  );

  const register = useCallback(
    async (data: RegisterPayload): Promise<ApiResult<unknown>> => {
      setLoading(true);
      setError(null);

      const response = await api.register(data as any);

      if (response.error || !response.data) {
        setError(response.error ?? 'Registration failed.');
        setLoading(false);
        return { error: response.error ?? 'Registration failed.' };
      }

      setLoading(false);
      return { data: response.data };
    },
    []
  );

  const logout = useCallback(() => {
    clearAuthStorage();
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setError(null);
  }, []);

  const isAuthenticated = useMemo(
    () => Boolean(accessToken && user),
    [accessToken, user]
  );

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      refreshToken,
      role,
      loading,
      error,
      isAuthenticated,
      login,
      register,
      logout,
      setUser,
    }),
    [accessToken, error, isAuthenticated, loading, login, logout, register, refreshToken, role, user]
  );

  return createElement(AuthContext.Provider, { value: contextValue }, children);
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export type UseAuthReturn = AuthContextValue;
