"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ReviewsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] bg-background px-4 py-12 sm:px-6 lg:px-8'>
      <div className='text-center max-w-md w-full p-6 sm:p-8 bg-card shadow-xl rounded-xl space-y-6'>
        <h1 className='text-3xl font-bold tracking-tight text-destructive sm:text-4xl'>
          이런, 문제가 발생했어요!
        </h1>
        <p className='text-muted-foreground text-lg'>
          리뷰 목록을 불러오는 중 예상치 못한 오류가 발생했습니다.
        </p>
        <p className='text-sm text-muted-foreground bg-red-50 p-3 rounded-md'>
          {error.message || "알 수 없는 오류입니다."}
        </p>
        <Button
          onClick={() => reset()}
          size='lg'
          className='w-full sm:w-auto text-base px-8 py-3'
        >
          다시 시도
        </Button>
      </div>
    </div>
  );
}
