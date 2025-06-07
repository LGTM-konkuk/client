"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { UnauthorizedAccess } from "@/components/UnauthorizedAccess";
import { useAuthStore } from "@/store/auth-store";
import { FileTree } from "@/components/FileTree";
import { CodeViewer } from "@/components/code-viewer/CodeViewer";
import {
  ReadReviewSubmissionResponse,
  ProjectFileSystem,
  FileContent,
  ReadReviewCommentResponse,
} from "@/types";
import { FileTextIcon } from "lucide-react";
import { ReviewDetailHeader } from "@/components/review/ReviewDetailHeader";
import { ReviewRequestCard } from "@/components/review/ReviewRequestCard";
import { GeneralComments } from "@/components/comment/GeneralComments";
import { FinalReviewForm } from "@/components/review/FinalReviewForm";
import { useApi } from "@/api";

export default function ReviewDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { user, isLoading: authLoading } = useAuthStore();
  const api = useApi();

  // 상태 관리
  const [submission, setSubmission] =
    useState<ReadReviewSubmissionResponse | null>(null);
  const [fileSystem, setFileSystem] = useState<ProjectFileSystem | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileContent | null>(null);
  const [comments, setComments] = useState<ReadReviewCommentResponse[]>([]);
  const [generalComments, setGeneralComments] = useState<
    ReadReviewCommentResponse[]
  >([]);
  const [finalReviewContent, setFinalReviewContent] = useState("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [isSavingReview, setIsSavingReview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submissionId = parseInt(id as string);

  const loadGeneralComments = useCallback(async () => {
    try {
      const commentsData = await api.reviews.getComments(submissionId, {
        page: 0,
        size: 100,
      });
      const general = commentsData.content.filter(
        (c) => !c.filePath && !c.parentCommentId,
      );
      setGeneralComments(general);
    } catch (error) {
      console.error("일반 댓글 로딩 실패:", error);
    }
  }, [submissionId, api.reviews]);

  const loadReviewData = useCallback(async () => {
    if (!submissionId) return;
    try {
      setError(null);
      const submissionData = await api.reviews.getSubmission(submissionId);
      setSubmission(submissionData);
      setFinalReviewContent("");
      const fileSystemData = await api.reviews.getFileSystem(submissionId);
      setFileSystem(fileSystemData);
      await loadGeneralComments();
    } catch (error) {
      console.error("리뷰 데이터 로딩 실패:", error);
      setError("리뷰 데이터를 불러오는데 실패했습니다.");
    }
  }, [submissionId, api.reviews, loadGeneralComments]);

  // 데이터 로딩
  useEffect(() => {
    if (!authLoading && user && submissionId) {
      loadReviewData();
    }
  }, [authLoading, user, submissionId, loadReviewData]);

  const loadFileComments = useCallback(
    async (filePath: string) => {
      try {
        const commentsData = await api.reviews.getComments(submissionId, {
          filePath,
          page: 0,
          size: 100,
        });
        setComments(commentsData.content);
      } catch (error) {
        console.error("댓글 로딩 실패:", error);
      }
    },
    [submissionId, api.reviews],
  );

  const handleFileSelect = useCallback(
    async (filePath: string) => {
      try {
        setIsLoadingFile(true);
        setError(null);
        const fileContent = await api.reviews.getFileContent(
          submissionId,
          filePath,
        );
        setSelectedFile(fileContent);
        await loadFileComments(filePath);
      } catch (error) {
        console.error("파일 로딩 실패:", error);
        setError("파일을 불러오는데 실패했습니다.");
      } finally {
        setIsLoadingFile(false);
      }
    },
    [submissionId, api.reviews, loadFileComments],
  );

  const handleAddComment = useCallback(
    async (lineNumber: number, content: string) => {
      if (!selectedFile) return;

      try {
        await api.reviews.createComment(submissionId, {
          content,
          filePath: selectedFile.path,
          lineNumber,
        });
        await loadFileComments(selectedFile.path);
      } catch (error) {
        console.error("댓글 추가 실패:", error);
        throw error;
      }
    },
    [submissionId, selectedFile, api.reviews, loadFileComments],
  );

  const handleReply = useCallback(
    async (commentId: string, content: string) => {
      try {
        await api.reviews.createReply(commentId, content);
        if (selectedFile) {
          await loadFileComments(selectedFile.path);
        } else {
          await loadGeneralComments();
        }
      } catch (error) {
        console.error("답글 추가 실패:", error);
        throw error;
      }
    },
    [selectedFile, api.reviews, loadFileComments, loadGeneralComments],
  );

  const handleAddGeneralComment = useCallback(
    async (content: string) => {
      try {
        await api.reviews.createComment(submissionId, { content });
        await loadGeneralComments();
      } catch (error) {
        console.error("일반 댓글 추가 실패:", error);
        throw error;
      }
    },
    [submissionId, api.reviews, loadGeneralComments],
  );

  const handleSaveFinalReview = useCallback(
    async (content: string) => {
      if (!submission) return;

      try {
        setIsSavingReview(true);
        setFinalReviewContent(content);

        await api.reviews.create(submissionId, {
          reviewSubmissionId: submissionId,
          reviewContent: content,
        });

        await loadReviewData();
      } catch (error) {
        console.error("리뷰 저장 실패:", error);
        setError("리뷰를 저장하는데 실패했습니다.");
      } finally {
        setIsSavingReview(false);
      }
    },
    [submission, submissionId, api.reviews, loadReviewData],
  );

  if (authLoading) {
    return null;
  }

  if (!user) {
    return <UnauthorizedAccess />;
  }

  if (error) {
    throw new Error(error);
  }

  if (!submission) {
    return null;
  }

  return (
    <div className='container mx-auto py-6 max-w-7xl'>
      {/* 헤더 */}
      <div className='mb-6'>
        <Button
          variant='outline'
          onClick={() => router.back()}
          className='mb-4'
        >
          ← 뒤로가기
        </Button>

        <ReviewDetailHeader submission={submission} />

        {/* 요청 내용 */}
        <ReviewRequestCard submission={submission} />
      </div>

      {/* 메인 컨텐츠 */}
      <div className='grid grid-cols-12 gap-6'>
        {/* 사이드바 - 파일 트리 */}
        <div className='col-span-3'>
          <Card className='h-fit max-h-[calc(100vh-200px)] overflow-hidden'>
            <CardHeader>
              <CardTitle className='text-sm flex items-center'>
                <FileTextIcon className='h-4 w-4' />
                파일 목록
              </CardTitle>
            </CardHeader>
            <CardContent className='p-0'>
              <div className='overflow-y-auto max-h-[calc(100vh-300px)]'>
                {fileSystem ? (
                  <FileTree
                    fileSystem={fileSystem.rootDirectory}
                    selectedPath={selectedFile?.path}
                    onFileSelect={handleFileSelect}
                    className='p-3'
                  />
                ) : (
                  <div className='p-3 text-sm text-muted-foreground'>
                    파일 시스템을 로딩 중...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 일반 댓글 */}
          <GeneralComments
            comments={generalComments}
            onAddComment={handleAddGeneralComment}
          />
        </div>

        {/* 메인 영역 - 코드 뷰어 */}
        <div className='col-span-9'>
          {selectedFile ? (
            <div className='space-y-4'>
              {isLoadingFile ? (
                <div className='animate-pulse'>
                  <div className='h-8 bg-gray-200 rounded mb-4'></div>
                  <div className='h-96 bg-gray-200 rounded'></div>
                </div>
              ) : (
                <CodeViewer
                  fileContent={selectedFile}
                  comments={comments}
                  onAddComment={handleAddComment}
                  onReply={handleReply}
                />
              )}
            </div>
          ) : (
            <Card>
              <CardContent className='py-12 text-center'>
                <FileTextIcon className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                <p className='text-muted-foreground'>
                  좌측에서 파일을 선택하여 코드를 확인하고 댓글을 달아보세요.
                </p>
              </CardContent>
            </Card>
          )}

          {/* 최종 리뷰 작성 */}
          <FinalReviewForm
            onSubmit={handleSaveFinalReview}
            isSaving={isSavingReview}
            initialContent={finalReviewContent}
          />
        </div>
      </div>
    </div>
  );
}
