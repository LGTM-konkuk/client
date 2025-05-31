"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { handleApiResponse } from "@/lib/api-utils";

interface Reviewer {
  id: number;
  user: {
    name: string;
    email: string;
  };
  preferences: string[];
  bio: string;
  tags: string[];
}

export default function SubmitReviewPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 파라미터에서 reviewerId 가져오기 (멘토 목록에서 선택한 경우)
  const preselectedReviewerId = searchParams.get("reviewerId");

  const [formData, setFormData] = useState({
    reviewerId: preselectedReviewerId || "",
    gitUrl: "",
    requestDetails: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateGitUrl = (url: string) => {
    const gitUrlPattern =
      /^https?:\/\/(github\.com|gitlab\.com|bitbucket\.org).+/;
    return gitUrlPattern.test(url);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!formData.reviewerId) {
      setError("리뷰어를 선택해주세요.");
      setIsLoading(false);
      return;
    }

    if (!validateGitUrl(formData.gitUrl)) {
      setError("올바른 Git 저장소 URL을 입력해주세요.");
      setIsLoading(false);
      return;
    }

    if (!formData.requestDetails.trim()) {
      setError("요청 내용을 입력해주세요.");
      setIsLoading(false);
      return;
    }

    try {
      const headers = await getAuthHeaders();
      const response = await fetch("/review-submissions/new", {
        method: "POST",
        headers,
        body: JSON.stringify({
          reviewerId: parseInt(formData.reviewerId),
          gitUrl: formData.gitUrl,
          requestDetails: formData.requestDetails,
        }),
      });

      const data = await handleApiResponse(response);

      if (data.data?.id) {
        router.push("/reviews?message=리뷰 요청이 성공적으로 제출되었습니다.");
      }
    } catch (err) {
      console.error("리뷰 요청 실패:", err);
      setError(
        err instanceof Error ? err.message : "리뷰 요청에 실패했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className='container mx-auto py-8'>
        <Skeleton className='h-8 w-1/3' />
        <Skeleton className='h-32 w-1/2' />
      </div>
    );
  }

  if (!user) {
    return (
      <div className='container mx-auto py-8'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-4'>로그인이 필요합니다</h1>
          <Button asChild>
            <Link href='/login'>로그인하기</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto py-8 max-w-2xl'>
      <Card>
        <CardHeader>
          <CardTitle>코드 리뷰 요청</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='reviewerId'>리뷰어 선택</Label>
              <Select
                value={formData.reviewerId}
                onValueChange={(value) =>
                  setFormData({ ...formData, reviewerId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='리뷰어를 선택해주세요' />
                </SelectTrigger>
                <SelectContent>
                  {loadingReviewers ? (
                    <SelectItem value='loading' disabled>
                      로딩 중...
                    </SelectItem>
                  ) : reviewers.length === 0 ? (
                    <SelectItem value='empty' disabled>
                      등록된 리뷰어가 없습니다
                    </SelectItem>
                  ) : (
                    reviewers.map((reviewer) => (
                      <SelectItem
                        key={reviewer.id}
                        value={reviewer.id.toString()}
                      >
                        <div className='flex flex-col'>
                          <span className='font-medium'>
                            {reviewer.user.name}
                          </span>
                          <span className='text-xs text-muted-foreground'>
                            {reviewer.preferences.slice(0, 3).join(", ")}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <p className='text-sm text-gray-500'>
                <Button variant='link' asChild className='p-0 h-auto'>
                  <Link href='/mentors'>멘토 목록에서 선택하기</Link>
                </Button>
              </p>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='gitUrl'>Git 저장소 URL</Label>
              <Input
                id='gitUrl'
                type='url'
                required
                value={formData.gitUrl}
                onChange={(e) =>
                  setFormData({ ...formData, gitUrl: e.target.value })
                }
                placeholder='https://github.com/username/repository'
              />
              <p className='text-sm text-gray-500'>
                GitHub, GitLab, Bitbucket 저장소 URL을 입력해주세요.
              </p>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='requestDetails'>요청 내용</Label>
              <Textarea
                id='requestDetails'
                required
                value={formData.requestDetails}
                onChange={(e) =>
                  setFormData({ ...formData, requestDetails: e.target.value })
                }
                placeholder='리뷰어에게 전달하고 싶은 내용을 입력하세요. (예: 특정 기능, 파일, 개선점 등)'
                rows={6}
              />
            </div>

            {error && (
              <div className='bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg'>
                {error}
              </div>
            )}

            <Button type='submit' disabled={isLoading} className='w-full'>
              {isLoading ? "요청 중..." : "리뷰 요청하기"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
