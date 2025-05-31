"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const mentorSchema = z
  .object({
    name: z.string().min(1, "이름을 입력해주세요"),
    email: z.string().email("올바른 이메일 형식이 아닙니다"),
    password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다"),
    confirmPassword: z.string(),
    preferences: z.string().min(1, "전문 기술 분야를 입력해주세요"),
    bio: z.string().min(1, "자기소개를 입력해주세요"),
    tags: z.string().min(1, "관련 태그를 입력해주세요"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

type MentorFormData = z.infer<typeof mentorSchema>;

export default function MentorRegister() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<MentorFormData>({
    resolver: zodResolver(mentorSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      preferences: "",
      bio: "",
      tags: "",
    },
  });

  const onSubmit = async (data: MentorFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // 문자열을 배열로 변환 (쉼표로 구분)
      const preferencesArray = data.preferences
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      const tagsArray = data.tags
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      await fetch("/reviewers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.name,
          preferences: preferencesArray,
          bio: data.bio,
          tags: tagsArray,
        }),
      });

      // 회원가입 성공 시 로그인 페이지로 이동
      router.push("/login?message=회원가입이 완료되었습니다. 로그인해주세요.");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "회원가입에 실패했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='container max-w-2xl py-12'>
      <div className='text-center mb-8'>
        <h2 className='text-4xl font-bold tracking-tight'>리뷰어 등록</h2>
        <p className='mt-4 text-xl text-muted-foreground'>
          코드 리뷰를 통해 다른 개발자들의 성장을 도와주세요.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
          <CardDescription>
            리뷰어 등록을 위한 기본 정보를 입력해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className='bg-red-50 border border-red-200 rounded-md p-4 mb-6'>
              <p className='text-red-600 text-sm'>{error}</p>
            </div>
          )}

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
                name='preferences'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>전문 기술 분야</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='예: Python, Django, FastAPI (쉼표로 구분)'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='bio'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>자기소개</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='경력, 전문성, 멘토링 경험 등을 작성해주세요.'
                        className='resize-none'
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='tags'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>관련 태그</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='예: backend, api, database (쉼표로 구분)'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? "등록 중..." : "리뷰어로 등록하기"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
