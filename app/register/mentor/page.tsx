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

const mentorSchema = z
  .object({
    name: z.string().min(1, "이름을 입력해주세요"),
    email: z.string().email("올바른 이메일 형식이 아닙니다"),
    password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다"),
    confirmPassword: z.string(),
    experience: z.string().min(1, "개발 경험을 입력해주세요"),
    expertise: z.string().min(1, "전문 분야를 입력해주세요"),
    introduction: z.string().min(1, "자기소개를 입력해주세요"),
    githubUrl: z.string().url("올바른 URL 형식이 아닙니다").optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

type MentorFormData = z.infer<typeof mentorSchema>;

export default function MentorRegister() {
  const router = useRouter();
  const form = useForm<MentorFormData>({
    resolver: zodResolver(mentorSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      experience: "",
      expertise: "",
      introduction: "",
      githubUrl: "",
    },
  });

  const onSubmit = async (data: MentorFormData) => {
    try {
      // TODO: API 연동
      console.log("멘토 등록:", data);
      router.push("/login");
    } catch (error) {
      console.error("등록 실패:", error);
    }
  };

  return (
    <div className='container flex flex-col items-center justify-center py-12'>
      <div className='text-center mb-8'>
        <h2 className='text-4xl font-bold tracking-tight'>멘토 등록</h2>
        <p className='mt-4 text-xl text-muted-foreground'>
          코드 리뷰를 통해 다른 개발자들의 성장을 도와주세요.
        </p>
      </div>

      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
          <CardDescription>
            멘토 등록을 위한 기본 정보를 입력해주세요.
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
                        placeholder='예: 5년차 시니어 프론트엔드 개발자'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='expertise'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>전문 분야</FormLabel>
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
                name='introduction'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>자기소개</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='멘토링 경험이나 코드 리뷰에 대한 생각을 작성해주세요.'
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
                멘토 등록하기
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
