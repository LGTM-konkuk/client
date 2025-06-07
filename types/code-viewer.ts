import type { FileContent, ReadReviewCommentResponse } from "@/types";

export type { FileContent, ReadReviewCommentResponse };

/**
 * CodeViewer 메인 컴포넌트의 Props
 */
export interface CodeViewerProps {
  fileContent: FileContent;
  comments: ReadReviewCommentResponse[];
  onAddComment: (lineNumber: number, content: string) => Promise<void>;
  onReply: (commentId: string, content: string) => Promise<void>;
  className?: string;
}

/**
 * 댓글 스레드(개별 댓글 + 답글) 컴포넌트의 Props
 */
export interface CommentThreadProps {
  comment: ReadReviewCommentResponse;
  onReply: (commentId: string, content: string) => Promise<void>;
}

/**
 * 특정 라인의 전체 댓글 섹션 컴포넌트의 Props
 */
export interface CommentSectionProps {
  lineNumber: number;
  comments: ReadReviewCommentResponse[];
  onAddComment: (lineNumber: number, content: string) => Promise<void>;
  onReply: (commentId: string, content: string) => Promise<void>;
}

/**
 * 댓글/답글 입력 폼 컴포넌트의 Props
 */
export interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  placeholder: string;
  submitButtonText: string;
  onCancel?: () => void;
  initialContent?: string;
}
