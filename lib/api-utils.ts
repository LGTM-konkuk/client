import { useAuthStore } from "../store/auth-store";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/backend";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// API 요청 함수
export async function apiRequest<T>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  endpoint: string,
  body: unknown = null,
  isFormData = false,
): Promise<T> {
  const token = useAuthStore.getState().accessToken;
  const headers: HeadersInit = {};

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = isFormData ? (body as FormData) : JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || "API 요청 중 오류가 발생했습니다.",
      response.status,
      errorData,
    );
  }

  if (
    response.status === 204 ||
    response.headers.get("Content-Length") === "0"
  ) {
    return {} as T;
  }

  return response.json() as T;
}

// API 에러 처리
export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    return `[${error.status}] ${error.message}`;
  }
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
