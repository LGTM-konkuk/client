"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReviewersLoading() {
  return (
    <div className='container py-12'>
      {/* 검색 필터 스켈레톤 (선택 사항으로 추가 가능) */}
      {/* <div className='flex gap-4 mb-6'>
        <Skeleton className='h-10 w-full max-w-xs' />
        <Skeleton className='h-10 w-full max-w-xs' />
        <Skeleton className='h-10 w-20' />
      </div> */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className='h-6 w-3/4 mb-2' />
              <Skeleton className='h-4 w-1/2' />
            </CardHeader>
            <CardContent>
              <Skeleton className='h-16 w-full mb-4' />
              <div className='flex flex-wrap gap-2 mb-2'>
                <Skeleton className='h-5 w-16' />
                <Skeleton className='h-5 w-20' />
                <Skeleton className='h-5 w-14' />
              </div>
              <div className='flex flex-wrap gap-2'>
                <Skeleton className='h-5 w-12' />
                <Skeleton className='h-5 w-16' />
              </div>
              <Skeleton className='h-10 w-full mt-4' />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
