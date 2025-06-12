"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApi } from "@/api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UnauthorizedAccess } from "@/components/UnauthorizedAccess";
import { CreateReviewSubmissionRequest, GitBranch } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthStore } from "@/store/auth";

// Zod 스키마 정의
const formSchema = z.object({
  gitUrl: z
    .string()
    .min(1, "Git 저장소 URL을 입력해주세요.")
    .regex(
      new RegExp(/^https?:\/\/(github\.com|gitlab\.com|bitbucket\.org).+/),
      "올바른 Git 저장소 URL을 입력해주세요 (GitHub, GitLab, Bitbucket).",
    ),
  branch: z.string().min(1, "브랜치를 선택해주세요."),
  requestDetails: z.string().min(1, "요청 내용을 입력해주세요."),
});

type FormData = z.infer<typeof formSchema>;

export default function NewReviewPage() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const api = useApi();

  // 상태 관리
  const [branches, setBranches] = useState<GitBranch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // react-hook-form 초기화
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gitUrl: "",
      branch: "",
      requestDetails: "",
    },
  });

  const watchedGitUrl = form.watch("gitUrl");

  // Git URL 변경 시 브랜치 목록 로딩
  useEffect(() => {
    const fetchBranches = async () => {
      if (!watchedGitUrl || !isValidGitUrl(watchedGitUrl)) {
        setBranches([]);
        form.setValue("branch", "");
        return;
      }

      try {
        setLoadingBranches(true);
        setApiError(null);
        const branchesData = await api.git.getBranches(watchedGitUrl);
        setBranches(branchesData.branches);

        // 기본 브랜치가 있으면 자동 선택
        if (branchesData.defaultBranch) {
          form.setValue("branch", branchesData.defaultBranch);
        }
      } catch (error) {
        console.error("브랜치 목록 로딩 실패:", error);
        setBranches([]);
        form.setValue("branch", "");
        setApiError(
          "브랜치 목록을 불러오는데 실패했습니다. Git URL을 확인해주세요.",
        );
      } finally {
        setLoadingBranches(false);
      }
    };

    // 디바운스를 위한 타이머
    const timer = setTimeout(fetchBranches, 500);
    return () => clearTimeout(timer);
  }, [watchedGitUrl, api.git]);

  const isValidGitUrl = (url: string): boolean => {
    const gitUrlRegex =
      /^https?:\/\/(github\.com|gitlab\.com|bitbucket\.org).+/;
    return gitUrlRegex.test(url);
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setApiError(null);

    try {
      const requestData: CreateReviewSubmissionRequest = {
        gitUrl: data.gitUrl,
        branch: data.branch,
        requestDetails: data.requestDetails,
      };

      await api.reviews.createSubmission(requestData);

      // 성공 시 리뷰 목록 페이지로 이동
      router.push(
        `/reviews?message=${encodeURIComponent(
          "리뷰 요청이 성공적으로 제출되었습니다.",
        )}`,
      );
    } catch (error) {
      console.error("리뷰 요청 실패:", error);
      setApiError(
        error instanceof Error ? error.message : "리뷰 요청에 실패했습니다.",
      );
    }
  };

  if (!user) {
    return <UnauthorizedAccess />;
  }

  return (
    <div className='container mx-auto py-8 max-w-2xl'>
      <Card>
        <CardHeader>
          <CardTitle>새 코드 리뷰 요청</CardTitle>
        </CardHeader>
        <CardContent>
          {apiError && (
            <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-md'>
              <p className='text-red-800 text-sm'>{apiError}</p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              {/* Git 저장소 URL */}
              <FormField
                control={form.control}
                name='gitUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Git 저장소 URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='url'
                        placeholder='https://github.com/username/repository.git'
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 브랜치 선택 */}
              <FormField
                control={form.control}
                name='branch'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>브랜치 선택</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={
                        !watchedGitUrl ||
                        !isValidGitUrl(watchedGitUrl) ||
                        loadingBranches ||
                        form.formState.isSubmitting ||
                        branches.length === 0
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              !watchedGitUrl || !isValidGitUrl(watchedGitUrl)
                                ? "Git URL을 먼저 입력해주세요"
                                : loadingBranches
                                ? "브랜치 로딩 중..."
                                : branches.length === 0
                                ? "브랜치를 찾을 수 없습니다"
                                : "브랜치를 선택해주세요"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch.name} value={branch.name}>
                            <div className='flex items-center gap-2'>
                              <span>{branch.name}</span>
                              {branch.isDefault && (
                                <span className='text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded'>
                                  기본
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 요청 내용 */}
              <FormField
                control={form.control}
                name='requestDetails'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>요청 내용</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder='리뷰받고 싶은 부분이나 특별히 확인받고 싶은 내용을 자세히 적어주세요...'
                        rows={4}
                        disabled={form.formState.isSubmitting}
                        className='h-64'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 제출 버튼 */}
              <div className='flex gap-4'>
                <Button
                  type='submit'
                  disabled={form.formState.isSubmitting}
                  className='flex-1'
                >
                  {form.formState.isSubmitting ? "제출 중..." : "리뷰 요청"}
                </Button>
                <Button type='button' variant='outline' asChild>
                  <Link href='/reviews'>취소</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
