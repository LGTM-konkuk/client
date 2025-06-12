"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquareIcon } from "lucide-react";
import { ReadReviewCommentResponse } from "@/types";
import { GeneralCommentForm } from "./GeneralCommentForm";

interface GeneralCommentsProps {
  comments: ReadReviewCommentResponse[];
  onAddComment: (content: string) => Promise<void>;
}

export function GeneralComments({
  comments,
  onAddComment,
}: GeneralCommentsProps) {
  return (
    <Card className='mt-4'>
      <CardHeader>
        <CardTitle className='text-sm flex items-center gap-2'>
          <MessageSquareIcon className='h-4 w-4' />
          일반 댓글 ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        {comments.map((comment) => (
          <div
            key={comment.id}
            className='text-sm border-l-2 border-primary pl-2 flex flex-col gap-2'
          >
            <div className='font-bold'>{comment.author.name}</div>
            <p className='text-muted-foreground'>{comment.content}</p>{" "}
          </div>
        ))}

        <GeneralCommentForm onSubmit={onAddComment} />
      </CardContent>
    </Card>
  );
}
