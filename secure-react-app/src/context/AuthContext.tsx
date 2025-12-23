import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authApi, clearCsrfToken, setCsrfToken } from "../api";

interface User {
  userId: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshCsrfToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化時檢查認證狀態
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const data = await authApi.checkAuth();
        if (data.authenticated && data.user) {
          setUser(data.user);
          // 獲取新的 CSRF Token
          await authApi.getCsrfToken();
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
        clearCsrfToken();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string) => {
    const data = await authApi.login(username, password);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      clearCsrfToken();
    }
  };

  const refreshCsrfToken = async () => {
    try {
      const data = await authApi.getCsrfToken();
      if (data.csrfToken) {
        setCsrfToken(data.csrfToken);
      }
    } catch (error) {
      console.error("Failed to refresh CSRF token:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshCsrfToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
