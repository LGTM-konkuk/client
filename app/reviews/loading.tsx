"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReviewsLoading() {
  return (
    <div className='container mx-auto py-8'>
      <div className='flex justify-between items-center mb-8'>
        <Skeleton className='h-9 w-1/4' />
        <Skeleton className='h-10 w-28' />
      </div>
      <div className='space-y-4'>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className='flex justify-between items-start'>
                <Skeleton className='h-6 w-3/4 mb-1' />
                <Skeleton className='h-5 w-16' />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className='h-4 w-full mb-2' />
              <Skeleton className='h-4 w-2/3 mb-2' />
              <div className='flex justify-between text-sm text-gray-500 mt-3'>
                <Skeleton className='h-4 w-1/3' />
                <Skeleton className='h-4 w-1/3' />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
