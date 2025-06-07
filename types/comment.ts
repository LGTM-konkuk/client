import {
  UserMinimalResponse,
  BaseAuditResponse,
  BasePageResponse,
} from "./common";

// 댓글 작성 요청 타입
export interface CreateReviewCommentRequest {
  content: string; // 댓글 내용 (필수)
  filePath?: string; // 파일별/라인별 댓글인 경우 파일 경로
  lineNumber?: number; // 라인별 댓글인 경우 라인 번호
  parentCommentId?: string; // 답글인 경우 부모 댓글 ID
}

// 댓글 수정 요청 타입
export interface UpdateReviewCommentRequest {
  content: string; // 수정할 댓글 내용
}

// 댓글 조회 응답 타입
export interface ReadReviewCommentResponse extends BaseAuditResponse {
  id: string; // 댓글 고유 ID (UUID)
  submissionId: number; // 리뷰 제출 건 ID
  content: string; // 댓글 내용
  filePath?: string; // 댓글이 작성된 파일 경로 (파일별 댓글인 경우)
  lineNumber?: number; // 댓글이 작성된 라인 번호 (라인별 댓글인 경우)
  author: UserMinimalResponse; // 댓글 작성자 정보
  parentCommentId?: string; // 부모 댓글 ID (답글인 경우)
  replies: ReadReviewCommentResponse[]; // 답글 목록
  isEdited: boolean; // 수정 여부
}

// 댓글 목록 조회 응답 타입
export interface ListReviewCommentsResponse extends BasePageResponse {
  content: ReadReviewCommentResponse[]; // 댓글 목록
}

// 답글 작성 요청 타입
export interface CreateReplyRequest {
  content: string; // 답글 내용
}

// 댓글 필터링 옵션
export interface CommentFilterOptions {
  filePath?: string; // 특정 파일의 댓글만 조회
  lineNumber?: number; // 특정 라인의 댓글만 조회
  page?: number; // 페이지 번호
  size?: number; // 페이지 크기
}

// 댓글 유형 (UI에서 사용)
export type CommentType = "general" | "file" | "line" | "reply";

// 댓글 폼 데이터 (UI에서 사용)
export interface CommentFormData {
  content: string;
  type: CommentType;
  filePath?: string;
  lineNumber?: number;
  parentCommentId?: string;
}
