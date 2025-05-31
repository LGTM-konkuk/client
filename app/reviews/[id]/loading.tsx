"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ReviewDetailLoading() {
  return (
    <div className='container mx-auto py-8'>
      <Skeleton className='h-8 w-3/4 mb-2' /> {/* 페이지 제목 스켈레톤 */}
      <Skeleton className='h-5 w-1/2 mb-6' /> {/* 부제목 또는 날짜 스켈레톤 */}
      <Card className='mb-6'>
        <CardHeader>
          <Skeleton className='h-6 w-1/3 mb-2' />
        </CardHeader>
        <CardContent className='space-y-3'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-2/3' />
        </CardContent>
      </Card>
      <Card className='mb-6'>
        <CardHeader>
          <Skeleton className='h-6 w-1/4 mb-2' />
        </CardHeader>
        <CardContent className='space-y-3'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-5/6' />
        </CardContent>
      </Card>
      {/* 댓글 섹션 스켈레톤 (필요하다면) */}
      <Skeleton className='h-10 w-full mt-6' />{" "}
      {/* 댓글 입력창 또는 버튼 스켈레톤 */}
    </div>
  );
}
