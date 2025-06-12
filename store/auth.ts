import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { apiRequest } from "@/lib/api-utils";
import type { ReadUserResponse } from "@/types";
import * as userApi from "@/api/user";
import * as authApi from "@/api/auth";

interface AuthState {
  user: ReadUserResponse | null;
  accessToken: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUserInfo: () => Promise<void>;
  clearTokens: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isLoading: true,
      isInitialized: false,

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
          const user = await userApi.me(apiRequest)();
          set({ user, isLoading: false, isInitialized: true });
        } catch (error) {
          console.error("사용자 정보 조회 실패:", error);
          get().clearTokens();
          set({ isLoading: false, isInitialized: true });
        }
      },

      login: async (email, password) => {
        const { accessToken, refreshToken } = await authApi.signIn(apiRequest)(
          email,
          password,
        );
        set({ accessToken });
        localStorage.setItem("refreshToken", refreshToken);
        await get().fetchUserInfo();
      },

      logout: async () => {
        try {
          await authApi.signOut(apiRequest)();
        } catch (error) {
          console.error("로그아웃 API 호출 실패:", error);
        } finally {
          get().clearTokens();
        }
      },

      initializeAuth: async () => {
        if (get().isInitialized) return;
        await get().fetchUserInfo();
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ accessToken: state.accessToken }),
    },
  ),
);
