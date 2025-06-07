"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { CommentFormProps } from "@/types/code-viewer";

export function CommentForm({
  onSubmit,
  placeholder,
  submitButtonText,
  onCancel,
  initialContent = "",
}: CommentFormProps) {
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content);
      setContent("");
      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      console.error("Failed to submit comment:", error);
      // 사용자에게 에러 알림을 보여주는 로직을 추가할 수 있습니다.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className='min-h-[80px] text-sm'
        rows={3}
      />
      <div className='flex justify-end gap-2'>
        {onCancel && (
          <Button type='button' variant='outline' size='sm' onClick={onCancel}>
            취소
          </Button>
        )}
        <Button
          type='submit'
          size='sm'
          disabled={!content.trim() || isSubmitting}
        >
          {isSubmitting ? "작성 중..." : submitButtonText}
        </Button>
      </div>
    </form>
  );
}
