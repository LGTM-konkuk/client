// 기본 API 응답 구조
export interface ApiResponse<T = unknown> {
  message: string;
  data?: T;
}

// 공통 감사 필드 (생성/수정일)
export interface BaseAuditResponse {
  createdAt: string; // ISO DateTime String
  updatedAt: string; // ISO DateTime String
}

// 사용자 역할
export type UserRole = "USER" | "REVIEWER" | "REVIEWEE" | "ADMIN";

// 최소 사용자 정보 (임베디드용)
export interface UserMinimalResponse {
  id: number;
  name: string;
  email?: string; // 선택적 필드
}

// 사용자 상세 정보 응답
export interface ReadUserResponse extends BaseAuditResponse {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

// 리뷰이 프로필 생성 요청
export interface CreateRevieweeRequest {
  email: string;
  password?: string; // 회원가입 시에만 필요할 수 있음
  name: string;
  preferences?: string[];
}

// 리뷰이 프로필 생성 응답 (ID 및 감사 정보 포함)
export interface CreateRevieweeResponse extends BaseAuditResponse {
  id: number;
  preferences?: string[];
  user?: UserMinimalResponse; // API 명세에는 없지만 일반적으로 포함될 수 있음
}

// 리뷰이 프로필 읽기 응답
export interface ReadRevieweeResponse extends BaseAuditResponse {
  id: number;
  preferences?: string[];
  user: UserMinimalResponse;
}

// 리뷰어 프로필 생성 요청
export interface CreateReviewerRequest {
  email: string;
  password?: string; // 회원가입 시에만 필요할 수 있음
  name: string;
  preferences?: string[];
  bio?: string;
  tags?: string[];
}

// 리뷰어 프로필 생성 응답
export interface CreateReviewerResponse extends BaseAuditResponse {
  id: number;
  preferences?: string[];
  bio?: string;
  tags?: string[];
  user?: UserMinimalResponse; // API 명세에는 없지만 일반적으로 포함될 수 있음
}

// 리뷰어 프로필 읽기 응답
export interface ReadReviewerResponse extends BaseAuditResponse {
  id: number;
  preferences?: string[];
  bio?: string;
  tags?: string[];
  user: UserMinimalResponse;
}

// 리뷰 제출 상태
export type ReviewSubmissionStatus = "PENDING" | "CANCELED" | "REVIEWED";

// 리뷰 제출(요청) 생성 요청
export interface CreateReviewSubmissionRequest {
  reviewerId: number;
  gitUrl: string;
  requestDetails: string;
}

// 리뷰 제출(요청) 정보 응답
export interface ReadReviewSubmissionResponse extends BaseAuditResponse {
  id: number;
  gitUrl: string;
  requestMessage: string;
  status: ReviewSubmissionStatus;
  reviewee: ReadRevieweeResponse;
  reviewer: ReadReviewerResponse;
}

// 리뷰 생성 요청
export interface CreateReviewRequest {
  reviewSubmissionId: number;
  reviewContent: string;
}

// 리뷰 수정 요청
export interface UpdateReviewRequest {
  reviewContent?: string;
}

// 단일 리뷰 조회 응답 정보
export interface ReadReviewResponse extends ReadReviewSubmissionResponse {
  reviewContent: string;
}

// 페이지네이션 응답 기본 구조
export interface Page<T> {
  totalPages: number;
  totalElements: number;
  page: number; // 0부터 시작
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  content: T[];
}

// API 응답 래퍼 (페이지네이션용)
export type PaginatedApiResponse<T> = ApiResponse<Page<T>>;

// 예시: 리뷰 목록 조회 API 응답 타입
// export type ListReviewsApiResponse = PaginatedApiResponse<ReadReviewResponse>;

// 예시: 리뷰어 목록 조회 API 응답 타입
// export type ListReviewersApiResponse = PaginatedApiResponse<ReadReviewerResponse>;

// 예시: 리뷰 제출 목록 조회 API 응답 타입
// export type ListReviewSubmissionsApiResponse = PaginatedApiResponse<ReadReviewSubmissionResponse>;

// 댓글 생성 요청
export interface CreateCommentRequest {
  content: string;
}

// 댓글 정보 응답
export interface ReadCommentResponse extends BaseAuditResponse {
  id: number;
  content: string;
  user: UserMinimalResponse; // 댓글 작성자
}
