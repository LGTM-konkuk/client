"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { SaveIcon } from "lucide-react";

interface FinalReviewFormProps {
  onSubmit: (content: string) => Promise<void>;
  isSaving: boolean;
  initialContent?: string;
}

export function FinalReviewForm({
  onSubmit,
  isSaving,
  initialContent = "",
}: FinalReviewFormProps) {
  const [content, setContent] = useState(initialContent);

  const handleSave = () => {
    if (!content.trim()) return;
    onSubmit(content);
  };

  return (
    <Card className='mt-6'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <SaveIcon className='h-4 w-4' />
          최종 리뷰
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <Textarea
          placeholder='프로젝트 전체에 대한 종합적인 리뷰를 작성해주세요...'
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className='resize-none'
          disabled={isSaving}
        />
        <div className='flex gap-2'>
          <Button onClick={handleSave} disabled={isSaving || !content.trim()}>
            {isSaving ? "저장 중..." : "리뷰 저장"}
          </Button>
          <Button
            variant='outline'
            onClick={() => setContent("")}
            disabled={isSaving}
          >
            초기화
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
