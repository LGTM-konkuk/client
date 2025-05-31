"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: number;
  email: string;
  name: string;
  role: "USER" | "REVIEWER" | "REVIEWEE" | "ADMIN";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 토큰 가져오기
  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  };

  // 토큰 저장
  const setTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  };

  // 토큰 제거
  const removeTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  // 로그인
  const login = async (email: string, password: string) => {
    const response = await fetch("/api/backend/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "로그인에 실패했습니다.");
    }

    const result = await response.json();
    const { accessToken, refreshToken } = result.data;

    // 토큰 저장
    setTokens(accessToken, refreshToken);

    // 사용자 정보 조회
    await fetchUserInfo(accessToken);
  };

  // 로그아웃
  const logout = async () => {
    const token = getToken();

    if (token) {
      try {
        await fetch("/api/backend/auth/signout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("로그아웃 API 호출 실패:", error);
      }
    }

    removeTokens();
    setUser(null);
  };

  // 사용자 정보 조회
  const fetchUserInfo = async (token?: string) => {
    const accessToken = token || getToken();

    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/backend/users/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        setUser(result.data);
      } else {
        // 토큰이 유효하지 않은 경우
        removeTokens();
        setUser(null);
      }
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      removeTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 토큰 확인
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const value = {
    user,
    isLoading,
    login,
    logout,
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
