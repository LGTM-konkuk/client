import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { apiRequest } from "@/lib/api-utils";
import type { UserMinimalResponse, ApiResponse } from "@/types";

interface AuthState {
  user: UserMinimalResponse | null;
  accessToken: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUserInfo: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isLoading: true,
      isInitialized: false, // 앱 시작 시 인증 상태 초기화 여부

      setTokens: (accessToken: string) => {
        set({ accessToken });
      },

      clearTokens: () => {
        set({ accessToken: null, user: null });
        localStorage.removeItem("refreshToken");
      },

      fetchUserInfo: async () => {
        const { accessToken } = get();
        if (!accessToken) {
          set({ user: null, isLoading: false, isInitialized: true });
          return;
        }

        set({ isLoading: true });
        try {
          const response = await apiRequest<ApiResponse<UserMinimalResponse>>(
            "GET",
            "/users/me",
          );
          set({ user: response.data, isLoading: false, isInitialized: true });
        } catch (error) {
          console.error("사용자 정보 조회 실패:", error);
          get().clearTokens(); // 토큰이 유효하지 않으면 비움
          set({ isLoading: false, isInitialized: true });
        }
      },

      login: async (email, password) => {
        const response = await apiRequest<
          ApiResponse<{ accessToken: string; refreshToken: string }>
        >("POST", "/auth/signin", { email, password });

        const { accessToken, refreshToken } = response.data!;
        set({ accessToken });
        localStorage.setItem("refreshToken", refreshToken); // 리프레시 토큰은 별도 관리
        await get().fetchUserInfo();
      },

      logout: async () => {
        try {
          await apiRequest("POST", "/auth/signout");
        } catch (error) {
          console.error("로그아웃 API 호출 실패:", error);
        } finally {
          get().clearTokens();
        }
      },

      initializeAuth: async () => {
        // 이미 초기화되었으면 다시 실행하지 않음
        if (get().isInitialized) return;
        await get().fetchUserInfo();
      },
    }),
    {
      name: "auth-storage", // 로컬 스토리지에 저장될 때 사용될 키
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ accessToken: state.accessToken }), // accessToken만 저장
    },
  ),
);
