"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReadReviewSubmissionResponse } from "@/types";

interface ReviewRequestCardProps {
  submission: ReadReviewSubmissionResponse;
}

export function ReviewRequestCard({ submission }: ReviewRequestCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>리뷰 요청 내용</CardTitle>
      </CardHeader>
      <CardContent>
        <p className='whitespace-pre-wrap text-sm'>
          {submission.requestDetails}
        </p>
      </CardContent>
    </Card>
  );
}
