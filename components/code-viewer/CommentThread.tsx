"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CommentForm } from "./CommentForm";
import type {
  CommentThreadProps,
  ReadReviewCommentResponse,
} from "@/types/code-viewer";

function CommentCard({ comment }: { comment: ReadReviewCommentResponse }) {
  return (
    <div className='flex items-start gap-3'>
      <div className='w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold'>
        {comment.author.name.charAt(0).toUpperCase()}
      </div>
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2 mb-1'>
          <span className='font-semibold text-sm'>{comment.author.name}</span>
          <span className='text-xs text-muted-foreground'>
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
          {comment.isEdited && (
            <Badge variant='secondary' className='text-xs'>
              수정됨
            </Badge>
          )}
        </div>
        <p className='text-sm text-gray-800 whitespace-pre-wrap'>
          {comment.content}
        </p>
      </div>
    </div>
  );
}

export function CommentThread({ comment, onReply }: CommentThreadProps) {
  const [isReplying, setIsReplying] = useState(false);

  const handleReplySubmit = async (content: string) => {
    await onReply(comment.id, content);
    setIsReplying(false);
  };

  return (
    <div className='space-y-3'>
      <CommentCard comment={comment} />

      {/* 답글 목록 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className='ml-8 pl-4 border-l-2 space-y-3'>
          {comment.replies.map((reply) => (
            <CommentCard key={reply.id} comment={reply} />
          ))}
        </div>
      )}

      {/* 답글 폼 토글 */}
      <div className='ml-8'>
        {isReplying ? (
          <CommentForm
            onSubmit={handleReplySubmit}
            placeholder='답글을 작성하세요...'
            submitButtonText='답글 작성'
            onCancel={() => setIsReplying(false)}
          />
        ) : (
          <Button
            variant='ghost'
            size='sm'
            className='text-xs'
            onClick={() => setIsReplying(true)}
          >
            답글 달기
          </Button>
        )}
      </div>
    </div>
  );
}
