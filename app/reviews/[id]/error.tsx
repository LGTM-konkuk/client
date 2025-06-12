"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // 목록으로 돌아가기 버튼을 위해 추가

export default function ReviewDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] bg-background px-4 py-12 sm:px-6 lg:px-8 lg:w-5xl sm:w-3xl'>
      <div className='text-center max-w-md w-full p-6 sm:p-8 bg-card shadow-xl rounded-xl space-y-6'>
        <h1 className='text-xl font-bold tracking-tight text-destructive sm:text-4xl'>
          오류 발생
        </h1>
        <p className='text-sm text-muted-foreground bg-red-50 p-3 rounded-md'>
          {error.message || "알 수 없는 오류입니다."}
        </p>
        <div className='flex flex-col gap-4 mt-6'>
          <Button
            onClick={() => reset()} // Attempt to recover by trying to re-render the segment
            size='lg'
            className='w-full text-base px-8 py-3'
          >
            다시 시도
          </Button>
          <Button
            variant='outline'
            onClick={() => router.push("/reviews")} // Go back to the reviews list
            size='lg'
            className='w-full text-base px-8 py-3'
          >
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
}
