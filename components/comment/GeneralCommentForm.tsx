"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// 일반 댓글 작성 폼 컴포넌트
export function GeneralCommentForm({
  onSubmit,
}: {
  onSubmit: (content: string) => Promise<void>;
}) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit(content);
      setContent("");
    } catch (error) {
      console.error("댓글 작성 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-2'>
      <Textarea
        placeholder='일반적인 댓글을 작성하세요...'
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className='text-xs min-h-[60px]'
      />
      <Button
        type='submit'
        size='sm'
        disabled={!content.trim() || isSubmitting}
        className='w-full'
      >
        {isSubmitting ? "작성 중..." : "댓글 작성"}
      </Button>
    </form>
  );
}
