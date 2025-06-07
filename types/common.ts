// 공통 타입 정의

// 기본 Audit 응답 (생성일, 수정일 포함)
export interface BaseAuditResponse {
  createdAt: string; // 데이터 생성 일시
  updatedAt: string; // 데이터 마지막 수정 일시
}

// 페이지네이션 기본 응답
export interface BasePageResponse {
  totalPages: number; // 전체 페이지 수
  totalElements: number; // 전체 항목 수
  page: number; // 현재 페이지 번호 (0부터 시작)
  size: number; // 한 페이지 당 항목 수
  first: boolean; // 현재 페이지가 첫 번째 페이지인지 여부
  last: boolean; // 현재 페이지가 마지막 페이지인지 여부
  numberOfElements: number; // 현재 페이지에 포함된 항목 수
}

// 최소한의 사용자 정보 (다른 스키마에 임베디드됨)
export interface UserMinimalResponse {
  id: number; // 사용자 고유 ID
  name: string; // 사용자 이름
  email?: string; // 사용자 이메일 주소 (필요시 포함)
}

// API 응답 기본 구조
export interface ApiResponse<T = any> {
  message: string; // API 응답 메시지
  data?: T; // 응답 데이터
}

// 사용자 역할
export type UserRole = "USER" | "REVIEWER" | "REVIEWEE" | "ADMIN";

// 리뷰 제출 상태
export type ReviewSubmissionStatus = "PENDING" | "CANCELED" | "REVIEWED";
