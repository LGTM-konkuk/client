"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { handleApiResponse } from "@/lib/api-utils";
import { useAuth } from "@/lib/auth-context";
import {
  ApiResponse,
  Page,
  ReadReviewResponse,
  ReviewSubmissionStatus,
} from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UnauthorizedAccess } from "@/components/UnauthorizedAccess";
import { Badge } from "@/components/ui/badge";

export default function ReviewsPage() {
  const router = useRouter();
  const { user, getToken, isLoading: authLoading } = useAuth();
  const [reviews, setReviews] = useState<ReadReviewResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchReviews = async (page = 0) => {
    if (!user) {
      setReviews([]);
      setTotalPages(0);
      setCurrentPage(0);
      return;
    }
    try {
      const token = getToken();
      const params = new URLSearchParams({
        page: page.toString(),
        size: "10",
      });

      const response = await fetch(
        `/api/backend/reviews?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const result = await handleApiResponse<
        ApiResponse<Page<ReadReviewResponse>>
      >(response);

      if (result.data) {
        setReviews(result.data.content);
        setTotalPages(result.data.totalPages);
        setCurrentPage(result.data.page);
      } else {
        console.warn("API 응답에 data 필드가 없거나 비어있습니다.", result);
        setReviews([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("리뷰 목록 조회 실패 (page.tsx catch 블록):", error);
      setReviews([]);
      setTotalPages(0);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchReviews(currentPage);
      } else {
        setReviews([]);
        setTotalPages(0);
        setCurrentPage(0);
      }
    }
  }, [authLoading, user, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusBadge = (status?: ReviewSubmissionStatus) => {
    if (!status) return null;
    const statusMap: Record<
      ReviewSubmissionStatus,
      {
        label: string;
        variant:
          | "default"
          | "secondary"
          | "destructive"
          | "outline"
          | null
          | undefined;
      }
    > = {
      PENDING: { label: "대기중", variant: "secondary" },
      CANCELED: { label: "취소됨", variant: "destructive" },
      REVIEWED: { label: "리뷰완료", variant: "default" },
    };
    const style = statusMap[status] || { label: status, variant: "outline" };
    return <Badge variant={style.variant}>{style.label}</Badge>;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (authLoading) {
    return null;
  }

  if (!user) {
    return <UnauthorizedAccess />;
  }

  if (reviews.length === 0) {
    return (
      <div className='container mx-auto py-8'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold'>내 코드 리뷰</h1>
          <Button onClick={() => router.push("/submit-review")}>
            새 리뷰 요청
          </Button>
        </div>
        <div className='text-center py-12'>
          <p className='text-gray-500 mb-4'>
            아직 요청했거나 받은 코드 리뷰가 없습니다.
          </p>
          <Button onClick={() => router.push("/submit-review")}>
            첫 리뷰 요청하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto py-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>내 코드 리뷰</h1>
        <Button onClick={() => router.push("/submit-review")}>
          새 리뷰 요청
        </Button>
      </div>

      <>
        <div className='space-y-4 mb-8'>
          {reviews.map((review) => (
            <Card
              key={review.id}
              className='hover:shadow-lg transition-shadow cursor-pointer'
              onClick={() => router.push(`/reviews/${review.id}`)}
            >
              <CardHeader>
                <div className='flex justify-between items-start'>
                  <CardTitle className='text-lg'>
                    {review.gitUrl
                      ? review.gitUrl.split("/").pop()
                      : `리뷰 ID: ${review.id}`}
                  </CardTitle>
                  {getStatusBadge(review.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  <p className='text-sm text-gray-500'>
                    리뷰 내용 (일부): {review.reviewContent.substring(0, 100)}
                    ...
                  </p>
                  <p className='text-sm text-gray-500'>
                    리뷰어: {review.reviewer.user.name}
                  </p>
                  <p className='text-sm text-gray-500'>
                    리뷰이: {review.reviewee.user.name}
                  </p>
                  <div className='flex justify-between text-sm text-gray-500'>
                    <span>작성일: {formatDate(review.createdAt)}</span>
                    <span>마지막 업데이트: {formatDate(review.updatedAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {totalPages > 1 && (
          <div className='flex justify-center gap-2'>
            <Button
              variant='outline'
              onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
            >
              이전
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i).map(
              (pageIndex) => (
                <Button
                  key={pageIndex}
                  variant={pageIndex === currentPage ? "default" : "outline"}
                  onClick={() => handlePageChange(pageIndex)}
                >
                  {pageIndex + 1}
                </Button>
              ),
            )}
            <Button
              variant='outline'
              onClick={() =>
                handlePageChange(Math.min(totalPages - 1, currentPage + 1))
              }
              disabled={currentPage >= totalPages - 1}
            >
              다음
            </Button>
          </div>
        )}
      </>
    </div>
  );
}
