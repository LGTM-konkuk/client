"use client";

import { UnauthorizedAccess } from "@/components/UnauthorizedAccess";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useApi } from "@/api";
import { useAuthStore } from "@/store/auth-store";
import { ReadReviewResponse, ReviewSubmissionStatus } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReviewsLoading from "./loading";

export default function ReviewsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const authLoading = useAuthStore((state) => state.isLoading);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const [reviews, setReviews] = useState<ReadReviewResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const api = useApi();

  const fetchReviews = async (page = 0) => {
    if (!user) {
      setReviews([]);
      setTotalPages(0);
      setCurrentPage(0);
      return;
    }

    try {
      const result = await api.reviews.list(page, 10);

      if (result) {
        setReviews(result.content);
        setTotalPages(result.totalPages);
        setCurrentPage(result.page);
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
    if (isInitialized) {
      if (user) {
        fetchReviews(currentPage);
      } else {
        setReviews([]);
        setTotalPages(0);
        setCurrentPage(0);
      }
    }
  }, [isInitialized, user, currentPage]);

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

  // 페이지네이션 번호 생성 로직 (shadcn/ui Pagination에 맞게 단순화)
  const renderPageNumbers = () => {
    const pageItems = [];
    const displayPages = 5; // 표시할 페이지 번호 개수 (현재 페이지 기준 양옆 + 현재 페이지)
    const halfDisplayPages = Math.floor(displayPages / 2);

    let startPage = Math.max(0, currentPage - halfDisplayPages);
    let endPage = Math.min(totalPages - 1, currentPage + halfDisplayPages);

    if (currentPage < halfDisplayPages) {
      endPage = Math.min(totalPages - 1, displayPages - 1);
    }
    if (currentPage > totalPages - 1 - halfDisplayPages) {
      startPage = Math.max(0, totalPages - displayPages);
    }

    // 시작 부분 Ellipsis 추가 조건 수정
    if (startPage > 0) {
      pageItems.push(
        <PaginationItem key='start-ellipsis'>
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pageItems.push(
        <PaginationItem key={i}>
          <PaginationLink
            href='#' // onClick으로 처리하므로 href는 형식적으로 추가
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
            isActive={i === currentPage}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    // 끝 부분 Ellipsis 추가 조건 수정
    if (endPage < totalPages - 1) {
      pageItems.push(
        <PaginationItem key='end-ellipsis'>
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }
    return pageItems;
  };

  if (!isInitialized || authLoading) {
    return <ReviewsLoading />;
  }

  if (!user) {
    return <UnauthorizedAccess />;
  }

  return (
    <div className='container mx-auto py-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>내 코드 리뷰</h1>
        <Button onClick={() => router.push("/reviews/new")}>
          새 리뷰 요청
        </Button>
      </div>

      {reviews.length === 0 ? (
        <div className='text-center py-12'>
          <p className='text-gray-500 mb-4'>
            아직 요청했거나 받은 코드 리뷰가 없습니다.
          </p>
          <Button onClick={() => router.push("/reviews/new")}>
            첫 리뷰 요청하기
          </Button>
        </div>
      ) : (
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
                      리뷰 내용 (일부):{" "}
                      {review.reviewContent?.substring(0, 100) || "내용 없음"}
                      {review.reviewContent && review.reviewContent.length > 100
                        ? "..."
                        : ""}
                    </p>
                    <p className='text-sm text-gray-500'>
                      리뷰어: {review.reviewer.user.name}
                    </p>
                    <p className='text-sm text-gray-500'>
                      리뷰이: {review.reviewee.user.name}
                    </p>
                    <div className='flex justify-between text-sm text-gray-500'>
                      <span>작성일: {formatDate(review.createdAt)}</span>
                      <span>
                        마지막 업데이트: {formatDate(review.updatedAt)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href='#' // onClick으로 처리
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 0) handlePageChange(currentPage - 1);
                    }}
                    className={
                      currentPage === 0
                        ? "pointer-events-none opacity-50"
                        : undefined
                    }
                  />
                </PaginationItem>
                {renderPageNumbers()}
                <PaginationItem>
                  <PaginationNext
                    href='#' // onClick으로 처리
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages - 1)
                        handlePageChange(currentPage + 1);
                    }}
                    className={
                      currentPage >= totalPages - 1
                        ? "pointer-events-none opacity-50"
                        : undefined
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
