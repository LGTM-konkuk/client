import { useAuth } from "./auth-context";

// 클라이언트에서 인증 헤더 가져오기
export function useAuthHeaders() {
  const { getToken } = useAuth();
  
  return () => {
    const token = getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  };
}

// 서버사이드나 비-hook 컨텍스트에서 사용
export function getAuthHeadersFromToken(token: string | null): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

// API 에러 처리
export function handleApiError(error: any): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "알 수 없는 오류가 발생했습니다.";
}

// 응답 데이터 추출
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  return response.json();
}
