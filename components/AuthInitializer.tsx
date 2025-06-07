"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

// 이 컴포넌트는 앱의 최상단(Layout)에 위치하여
// 앱이 로드될 때 인증 상태를 초기화하는 역할을 합니다.
export function AuthInitializer() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    // 한 번만 실행되도록 처리
    if (!isInitialized) {
      initializeAuth();
    }
  }, [initializeAuth, isInitialized]);

  // 이 컴포넌트는 UI를 렌더링하지 않습니다.
  return null;
}
