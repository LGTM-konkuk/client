"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";
import { handleApiResponse } from "@/lib/api-utils";
import {
  ApiResponse,
  ReadReviewResponse,
  ReviewSubmissionStatus,
  CreateCommentRequest,
  ReadCommentResponse,
} from "@/types";
import { UnauthorizedAccess } from "@/components/UnauthorizedAccess";

export default function ReviewDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { user, getToken, isLoading: authLoading } = useAuth();
  const [review, setReview] = useState<ReadReviewResponse | null>(null);
  const [comments, setComments] = useState<ReadCommentResponse[]>([]);
  const [newComment, setNewComment] = useState("");

  const reviewId = params.id;

  const fetchReviewAndComments = async () => {
    if (!user || !reviewId) {
      setReview(null);
      setComments([]);
      return;
    }
    try {
      const token = getToken()!;
      const reviewResponse = await fetch(`/api/backend/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const reviewResult = await handleApiResponse<
        ApiResponse<ReadReviewResponse>
      >(reviewResponse);
      if (reviewResult.data) {
        setReview(reviewResult.data);
      } else {
        setReview(null);
        throw new Error(
          reviewResult.message || "리뷰 정보를 불러오지 못했습니다.",
        );
      }

      const commentsResponse = await fetch(
        `/api/backend/reviews/${reviewId}/comments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const commentsResult = await handleApiResponse<
        ApiResponse<ReadCommentResponse[]>
      >(commentsResponse);
      if (commentsResult.data) {
        setComments(commentsResult.data);
      } else {
        setComments([]);
        console.warn("댓글 로딩 실패:", commentsResult.message);
      }
    } catch (err) {
      console.error("리뷰 또는 댓글 조회 실패 (page.tsx):", err);
      setReview(null);
      setComments([]);
      if (!review && err instanceof Error) {
        throw err;
      } else if (!review) {
        throw new Error(String(err));
      }
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (user && reviewId) {
        fetchReviewAndComments();
      } else if (!user) {
        setReview(null);
        setComments([]);
      }
    }
  }, [authLoading, user, reviewId]);

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !reviewId || !newComment.trim()) return;

    try {
      const token = getToken()!;
      const body: CreateCommentRequest = { content: newComment };
      const response = await fetch(
        `/api/backend/reviews/${reviewId}/comments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );
      const result = await handleApiResponse<ApiResponse<ReadCommentResponse>>(
        response,
      );
      if (result.data) {
        setComments((prevComments) => [...prevComments, result.data!]);
        setNewComment("");
      } else {
        console.error("댓글 작성 실패:", result.message);
      }
    } catch (err) {
      console.error("댓글 작성 실패 (catch):", err);
    }
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
    return new Date(dateString).toLocaleDateString("ko-KR");
  };

  if (authLoading) {
    return null;
  }

  if (!user) {
    return <UnauthorizedAccess />;
  }

  if (!review) {
    return (
      <div className='container mx-auto py-8 text-center'>
        <p>리뷰 정보를 찾을 수 없습니다. 또는 로드 중 오류가 발생했습니다.</p>
        <Button onClick={() => router.push("/reviews")} className='mt-4'>
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className='container mx-auto py-8'>
      <header className='mb-6'>
        <Button
          variant='outline'
          onClick={() => router.back()}
          className='mb-4'
        >
          &larr; 뒤로가기
        </Button>
        <h1 className='text-3xl font-bold mb-1'>
          {review.gitUrl
            ? review.gitUrl.split("/").pop()
            : `리뷰 ID: ${review.id}`}
        </h1>
        <div className='flex items-center space-x-4 text-sm text-muted-foreground'>
          <span>{getStatusBadge(review.status)}</span>
          <span>요청일: {formatDate(review.createdAt)}</span>
          <span>리뷰어: {review.reviewer.user.name}</span>
          <span>리뷰이: {review.reviewee.user.name}</span>
        </div>
      </header>

      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>리뷰 요청 내용</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='whitespace-pre-wrap'>
            {review.requestMessage || "요청 메시지가 없습니다."}
          </p>
        </CardContent>
      </Card>

      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>리뷰 내용</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='whitespace-pre-wrap'>
            {review.reviewContent || "아직 리뷰 내용이 없습니다."}
          </p>
        </CardContent>
      </Card>

      <section>
        <h2 className='text-2xl font-semibold mb-4'>댓글</h2>
        <div className='space-y-4 mb-6'>
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardHeader className='pb-2'>
                <div className='flex justify-between items-center'>
                  <p className='font-semibold'>{comment.user.name}</p>
                  <p className='text-xs text-muted-foreground'>
                    {formatDate(comment.createdAt)}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <p className='whitespace-pre-wrap'>{comment.content}</p>
              </CardContent>
            </Card>
          ))}
          {comments.length === 0 && <p>아직 댓글이 없습니다.</p>}
        </div>

        <form onSubmit={handleCommentSubmit} className='space-y-3'>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder='댓글을 입력하세요...'
            rows={3}
            disabled={false}
          />
          <Button type='submit' disabled={!newComment.trim()}>
            댓글 작성
          </Button>
        </form>
      </section>
    </div>
  );
}
