"use client";

import { CommentThread } from "./CommentThread";
import { CommentForm } from "./CommentForm";
import type { CommentSectionProps } from "@/types/code-viewer";

export function CommentSection({
  lineNumber,
  comments,
  onAddComment,
  onReply,
}: CommentSectionProps) {
  const lineComments = comments.filter(
    (comment) => comment.lineNumber === lineNumber && !comment.parentCommentId,
  );

  const handleAddComment = (content: string) => {
    return onAddComment(lineNumber, content);
  };

  return (
    <div className='p-4 bg-gray-50 border-t'>
      <div className='max-w-4xl mx-auto space-y-6'>
        {lineComments.length > 0 && (
          <div className='space-y-6'>
            {lineComments.map((comment) => (
              <CommentThread
                key={comment.id}
                comment={comment}
                onReply={onReply}
              />
            ))}
          </div>
        )}

        <div>
          <h3 className='text-sm font-semibold mb-2'>
            {`Line ${lineNumber}에 새 댓글 작성`}
          </h3>
          <CommentForm
            onSubmit={handleAddComment}
            placeholder='이 줄에 대한 코멘트를 작성하세요...'
            submitButtonText='댓글 작성'
          />
        </div>
      </div>
    </div>
  );
}
