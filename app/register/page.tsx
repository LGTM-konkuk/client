"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterChoice() {
  return (
    <div className='container flex flex-col items-center justify-center py-12'>
      <div className='text-center mb-8'>
        <h2 className='text-4xl font-bold tracking-tight'>
          어떤 멤버가 되고 싶으신가요?
        </h2>
        <p className='mt-4 text-xl text-muted-foreground'>
          코드 리뷰를 통해 함께 성장하는 개발자 커뮤니티에 참여하세요.
        </p>
      </div>

      <div className='grid gap-8 sm:grid-cols-2 w-full max-w-3xl'>
        <Card className='hover:shadow-lg transition-shadow'>
          <CardHeader>
            <CardTitle>멘토</CardTitle>
            <CardDescription>
              경험 많은 개발자로서 다른 개발자들의 코드를 리뷰하고 성장을
              도와주세요.
            </CardDescription>
          </CardHeader>
          <CardContent className='flex justify-center'>
            <Button asChild variant='secondary'>
              <Link href='/register/mentor'>멘토로 시작하기</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className='hover:shadow-lg transition-shadow'>
          <CardHeader>
            <CardTitle>멘티</CardTitle>
            <CardDescription>
              코드 리뷰를 통해 실력을 키우고 싶은 개발자분들을 환영합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className='flex justify-center'>
            <Button asChild variant='secondary'>
              <Link href='/register/mentee'>멘티로 시작하기</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
