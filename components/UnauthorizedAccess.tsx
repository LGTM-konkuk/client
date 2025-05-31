"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface UnauthorizedAccessProps {
  title?: string;
  message?: string;
  buttonText?: string;
  redirectPath?: string;
}

export const UnauthorizedAccess: React.FC<UnauthorizedAccessProps> = ({
  title = "로그인이 필요합니다",
  message = "이 페이지에 접근하려면 먼저 로그인해주세요.",
  buttonText = "로그인하기",
  redirectPath = "/login",
}) => {
  const router = useRouter();

  return (
    <div className='flex flex-col items-center justify-start min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8'>
      <div className='text-center max-w-md w-full space-y-6 p-6 sm:p-8'>
        <h1 className='text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
          {title}
        </h1>
        <p className='text-muted-foreground text-lg'>{message}</p>
        <Button
          onClick={() => router.push(redirectPath)}
          size='lg'
          className='w-full sm:w-auto text-base px-8 py-3'
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};
