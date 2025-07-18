"use client";

import {
  ApiResponse,
  CreateReviewCommentRequest,
  CreateReviewRequest,
  CreateReviewSubmissionRequest,
  FileContent,
  ListReviewCommentsResponse,
  Page,
  ProjectFileSystem,
  ReadReviewCommentResponse,
  ReadReviewResponse,
  ReadReviewSubmissionResponse,
} from "@/types";
import type { apiRequest } from "@/lib/api-utils";

type AuthedApi = typeof apiRequest;

export const getReviewSubmission =
  (authedApi: AuthedApi) =>
  async (submissionId: number): Promise<ReadReviewSubmissionResponse> => {
    const response = await authedApi<ApiResponse<ReadReviewSubmissionResponse>>(
      "GET",
      `/review-submissions/${submissionId}`,
    );
    return response.data!;
  };

export const getFileSystem =
  (authedApi: AuthedApi) =>
  async (submissionId: number): Promise<ProjectFileSystem> => {
    const response = await authedApi<ApiResponse<ProjectFileSystem>>(
      "GET",
      `/review-submissions/${submissionId}/filesystem`,
    );
    return response.data!;
  };

export const getFileContent =
  (authedApi: AuthedApi) =>
  async (submissionId: number, filePath: string): Promise<FileContent> => {
    const encodedPath = encodeURIComponent(filePath);
    const response = await authedApi<ApiResponse<FileContent>>(
      "GET",
      `/review-submissions/${submissionId}/files?path=${encodedPath}`,
    );
    return response.data!;
  };

export const getReviewComments =
  (authedApi: AuthedApi) =>
  async (
    submissionId: number,
    filePath?: string,
  ): Promise<ListReviewCommentsResponse> => {
    const params = new URLSearchParams();
    if (filePath) params.append("filePath", filePath);
    const queryString = params.toString() ? `?${params.toString()}` : "";
    const response = await authedApi<ApiResponse<ListReviewCommentsResponse>>(
      "GET",
      `/review-submissions/${submissionId}/comments${queryString}`,
    );
    return response.data!;
  };

export const createReviewComment =
  (authedApi: AuthedApi) =>
  async (
    submissionId: number,
    data: CreateReviewCommentRequest,
  ): Promise<ReadReviewCommentResponse> => {
    const response = await authedApi<ApiResponse<ReadReviewCommentResponse>>(
      "POST",
      `/review-submissions/${submissionId}/comments`,
      data,
    );
    return response.data!;
  };

export const createReply =
  (authedApi: AuthedApi) =>
  async (
    commentId: string,
    content: string,
  ): Promise<ReadReviewCommentResponse> => {
    const response = await authedApi<ApiResponse<ReadReviewCommentResponse>>(
      "POST",
      `/review-comments/${commentId}/replies`,
      { content },
    );
    return response.data!;
  };

export const createReview =
  (authedApi: AuthedApi) =>
  async (
    submissionId: number,
    data: CreateReviewRequest,
  ): Promise<ReadReviewResponse> => {
    const response = await authedApi<ApiResponse<ReadReviewResponse>>(
      "POST",
      `/review-submissions/${submissionId}/reviews`,
      data,
    );
    return response.data!;
  };

export const createReviewSubmission =
  (authedApi: AuthedApi) =>
  async (
    data: CreateReviewSubmissionRequest,
  ): Promise<ReadReviewSubmissionResponse> => {
    const response = await authedApi<ApiResponse<ReadReviewSubmissionResponse>>(
      "POST",
      "/review-submissions/new",
      data,
    );
    return response.data!;
  };

export const listReviews =
  (authedApi: AuthedApi) =>
  async (options: {
    page?: number;
    size?: number;
    status?: string;
  }): Promise<Page<ReadReviewResponse>> => {
    const params = new URLSearchParams();
    if (options.page !== undefined)
      params.append("page", options.page.toString());
    if (options.size !== undefined)
      params.append("size", options.size.toString());
    if (options.status) params.append("status", options.status);

    const response = await authedApi<ApiResponse<Page<ReadReviewResponse>>>(
      "GET",
      `/reviews?${params.toString()}`,
    );
    return response.data!;
  };
