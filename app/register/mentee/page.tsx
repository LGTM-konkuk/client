"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const menteeSchema = z
  .object({
    name: z.string().min(1, "이름을 입력해주세요"),
    email: z.string().email("올바른 이메일 형식이 아닙니다"),
    password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다"),
    confirmPassword: z.string(),
    experience: z.string().min(1, "개발 경험을 입력해주세요"),
    interests: z.string().min(1, "관심 분야를 입력해주세요"),
    goals: z.string().min(1, "목표를 입력해주세요"),
    githubUrl: z.string().url("올바른 URL 형식이 아닙니다").optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

type MenteeFormData = z.infer<typeof menteeSchema>;

export default function MenteeRegister() {
  const router = useRouter();
  const form = useForm<MenteeFormData>({
    resolver: zodResolver(menteeSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      experience: "",
      interests: "",
      goals: "",
      githubUrl: "",
    },
  });

  const onSubmit = async (data: MenteeFormData) => {
    try {
      // TODO: API 연동
      console.log("멘티 등록:", data);
      router.push("/login");
    } catch (error) {
      console.error("등록 실패:", error);
    }
  };

  return (
    <div className='container max-w-2xl py-12'>
      <div className='text-center mb-8'>
        <h2 className='text-4xl font-bold tracking-tight'>멘티 등록</h2>
        <p className='mt-4 text-xl text-muted-foreground'>
          코드 리뷰를 통해 실력을 키우고 싶은 개발자분들을 환영합니다.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
          <CardDescription>
            멘티 등록을 위한 기본 정보를 입력해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름</FormLabel>
                    <FormControl>
                      <Input placeholder='홍길동' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='example@email.com'
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
                      <Input type='password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호 확인</FormLabel>
                    <FormControl>
                      <Input type='password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='experience'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>개발 경험</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='예: 1년차 프론트엔드 개발자'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='interests'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>관심 분야</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='예: React, TypeScript, 웹 성능 최적화'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='goals'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>목표</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='코드 리뷰를 통해 달성하고 싶은 목표를 작성해주세요.'
                        className='resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='githubUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub URL</FormLabel>
                    <FormControl>
                      <Input
                        type='url'
                        placeholder='https://github.com/username'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full'>
                멘티 등록하기
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
