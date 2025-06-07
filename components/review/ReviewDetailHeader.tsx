"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReadReviewSubmissionResponse, ReviewSubmissionStatus } from "@/types";
import {
  GitBranchIcon,
  CalendarIcon,
  UserIcon,
  ExternalLinkIcon,
} from "lucide-react";

interface ReviewDetailHeaderProps {
  submission: ReadReviewSubmissionResponse;
}

const getStatusBadge = (status: ReviewSubmissionStatus) => {
  const statusMap = {
    PENDING: { label: "리뷰 대기", variant: "secondary" as const },
    CANCELED: { label: "취소됨", variant: "destructive" as const },
    REVIEWED: { label: "리뷰 완료", variant: "default" as const },
  };
  const style = statusMap[status];
  return <Badge variant={style.variant}>{style.label}</Badge>;
};

export function ReviewDetailHeader({ submission }: ReviewDetailHeaderProps) {
  return (
    <div className='flex items-start justify-between mb-4'>
      <div>
        <h1 className='text-2xl font-bold mb-2'>
          {submission.gitUrl.split("/").pop()?.replace(".git", "") ||
            `리뷰 #${submission.id}`}
        </h1>
        <div className='flex items-center gap-4 text-sm text-muted-foreground'>
          {getStatusBadge(submission.status)}
          <div className='flex items-center gap-1'>
            <GitBranchIcon className='h-4 w-4' />
            <span>{submission.branch}</span>
          </div>
          <div className='flex items-center gap-1'>
            <CalendarIcon className='h-4 w-4' />
            <span>{new Date(submission.createdAt).toLocaleDateString()}</span>
          </div>
          <div className='flex items-center gap-1'>
            <UserIcon className='h-4 w-4' />
            <span>리뷰어: {submission.reviewer.user.name}</span>
          </div>
        </div>
      </div>
      <Button
        variant='outline'
        size='sm'
        onClick={() => window.open(submission.gitUrl, "_blank")}
      >
        <ExternalLinkIcon className='h-4 w-4 mr-1' />
        저장소 보기
      </Button>
    </div>
  );
}
