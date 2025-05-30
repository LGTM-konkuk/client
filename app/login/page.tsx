"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력해주세요"),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      // TODO: 에러 메시지 표시
      console.error(result.error);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className='container flex flex-col items-center justify-center py-12'>
      <div className='text-center mb-8'>
        <h2 className='text-4xl font-bold tracking-tight'>로그인</h2>
        <p className='mt-4 text-xl text-muted-foreground'>
          코드 리뷰 플랫폼에 오신 것을 환영합니다
        </p>
      </div>

      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>로그인</CardTitle>
          <CardDescription>
            이메일과 비밀번호를 입력하여 로그인하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='이메일을 입력하세요'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='비밀번호를 입력하세요'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    id='remember-me'
                    className='h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary'
                  />
                  <label
                    htmlFor='remember-me'
                    className='text-sm font-normal text-muted-foreground'
                  >
                    로그인 상태 유지
                  </label>
                </div>

                <Button variant='link' asChild className='px-0'>
                  <Link href='/forgot-password'>비밀번호를 잊으셨나요?</Link>
                </Button>
              </div>

              <Button type='submit' className='w-full'>
                로그인
              </Button>
            </form>
          </Form>

          <p className='mt-6 text-center text-sm text-muted-foreground'>
            계정이 없으신가요?{" "}
            <Button variant='link' asChild className='px-0'>
              <Link href='/register'>회원가입</Link>
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
