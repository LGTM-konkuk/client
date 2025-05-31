"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Profile page error:", error);
  }, [error]);

  return (
    <div className='flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] bg-background px-4 py-12 sm:px-6 lg:px-8'>
      <div className='text-center max-w-md w-full p-6 sm:p-8 bg-card shadow-xl rounded-xl space-y-6'>
        <h1 className='text-3xl font-bold tracking-tight text-destructive sm:text-4xl'>
          오류 발생
        </h1>
        <p className='text-muted-foreground text-lg'>
          프로필 정보를 표시하는 중 예상치 못한 오류가 발생했습니다.
        </p>
        <p className='text-sm text-muted-foreground bg-red-50 p-3 rounded-md'>
          {error.message || "알 수 없는 오류입니다."}
        </p>
        <div className='flex flex-col sm:flex-row gap-4 mt-6'>
          <Button
            onClick={() => reset()}
            size='lg'
            className='w-full text-base px-8 py-3'
          >
            다시 시도
          </Button>
          <Button
            variant='outline'
            onClick={() => router.push("/")} // 홈으로 이동
            size='lg'
            className='w-full text-base px-8 py-3'
          >
            홈으로 이동
          </Button>
        </div>
      </div>
    </div>
  );
}
