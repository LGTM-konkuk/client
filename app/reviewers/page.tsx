"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { handleApiResponse } from "@/lib/api-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ReadReviewerResponse, Page, ApiResponse } from "@/types";
import { UnauthorizedAccess } from "@/components/UnauthorizedAccess";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function ReviewersPage() {
  const { user, isLoading: authLoading, getToken } = useAuth();
  const [reviewers, setReviewers] = useState<ReadReviewerResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchPreferences, setSearchPreferences] = useState("");
  const [searchTags, setSearchTags] = useState("");

  const fetchReviewers = async (page = 0) => {
    try {
      const token = getToken();
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const params = new URLSearchParams({ page: page.toString(), size: "12" });
      if (searchPreferences) params.set("preferences", searchPreferences);
      if (searchTags) params.set("tags", searchTags);

      const response = await fetch(
        `/api/backend/reviewers?${params.toString()}`,
        { headers },
      );

      const result = await handleApiResponse<
        ApiResponse<Page<ReadReviewerResponse>>
      >(response);

      if (result.data) {
        setReviewers(result.data.content);
        setTotalPages(result.data.totalPages);
        setCurrentPage(result.data.page);
      } else {
        console.warn("API 응답에 data 필드가 없거나 비어있습니다.", result);
        setReviewers([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("멘토 목록 조회 실패 (page.tsx catch 블록):", error);
      setReviewers([]);
      setTotalPages(0);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchReviewers(currentPage);
      } else {
        setReviewers([]);
        setTotalPages(0);
      }
    }
  }, [authLoading, user, currentPage]);

  const handleSearch = () => {
    setCurrentPage(0);
    if (currentPage === 0) {
      if (user) fetchReviewers(0);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (authLoading) {
    return null;
  }

  if (!user) {
    return <UnauthorizedAccess />;
  }

  if (reviewers.length === 0) {
    return (
      <div className='container py-12'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold tracking-tight mb-4'>멘토 찾기</h1>
          <p className='text-xl text-muted-foreground mb-6'>
            경험 많은 멘토들의 코드 리뷰를 받아보세요.
          </p>
          <div className='flex gap-4 mb-6'>
            <Input
              placeholder='기술 분야 검색 (예: Java, React)'
              value={searchPreferences}
              onChange={(e) => setSearchPreferences(e.target.value)}
              className='max-w-xs'
            />
            <Input
              placeholder='태그 검색 (예: backend, frontend)'
              value={searchTags}
              onChange={(e) => setSearchTags(e.target.value)}
              className='max-w-xs'
            />
            <Button onClick={handleSearch}>검색</Button>
          </div>
        </div>
        <div className='text-center py-12'>
          <h3 className='text-lg font-semibold mb-2'>
            멘토를 찾을 수 없습니다
          </h3>
          <p className='text-muted-foreground'>
            다른 검색 조건을 시도해보세요.
          </p>
        </div>
      </div>
    );
  }

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

    if (endPage < totalPages - 1) {
      pageItems.push(
        <PaginationItem key='end-ellipsis'>
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }
    return pageItems;
  };

  return (
    <div className='container py-12'>
      <div className='mb-8'>
        <h1 className='text-4xl font-bold tracking-tight mb-4'>멘토 찾기</h1>
        <p className='text-xl text-muted-foreground mb-6'>
          경험 많은 멘토들의 코드 리뷰를 받아보세요.
        </p>
        <div className='flex gap-4 mb-6'>
          <Input
            placeholder='기술 분야 검색 (예: Java, React)'
            value={searchPreferences}
            onChange={(e) => setSearchPreferences(e.target.value)}
            className='max-w-xs'
          />
          <Input
            placeholder='태그 검색 (예: backend, frontend)'
            value={searchTags}
            onChange={(e) => setSearchTags(e.target.value)}
            className='max-w-xs'
          />
          <Button onClick={handleSearch}>검색</Button>
        </div>
      </div>

      <>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8'>
          {reviewers.map((reviewer) => (
            <Card
              key={reviewer.id}
              className='hover:shadow-lg transition-shadow'
            >
              <CardHeader>
                <CardTitle className='text-lg'>{reviewer.user.name}</CardTitle>
                <p className='text-sm text-muted-foreground'>
                  {reviewer.user.email}
                </p>
              </CardHeader>
              <CardContent>
                <p className='text-sm mb-4 line-clamp-3'>{reviewer.bio}</p>
                <div className='space-y-3'>
                  <div>
                    <h4 className='text-sm font-medium mb-2'>전문 분야</h4>
                    <div className='flex flex-wrap gap-1'>
                      {(reviewer.preferences || []).map((pref, index) => (
                        <Badge key={index} variant='secondary'>
                          {pref}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className='text-sm font-medium mb-2'>태그</h4>
                    <div className='flex flex-wrap gap-1'>
                      {(reviewer.tags || []).map((tag, index) => (
                        <Badge key={index} variant='outline'>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className='mt-4'>
                  <Button asChild className='w-full'>
                    <Link href={`/review?reviewerId=${reviewer.id}`}>
                      리뷰 요청하기
                    </Link>
                  </Button>
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
                  // shadcn/ui는 disabled 대신 비활성 스타일을 클래스로 제어
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
    </div>
  );
}
