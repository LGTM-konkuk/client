import { apiRequest } from "@/lib/api-utils";
import { useCallback } from "react";

import type {
  CreateReviewCommentRequest,
  CreateReviewRequest,
  CreateReviewSubmissionRequest,
} from "@/types";

import * as reviewApi from "./review";
import * as reviewersApi from "./reviewers";
import * as gitApi from "./git";

export function useApi() {
  return {
    reviews: {
      getSubmission: useCallback(
        (submissionId: number) =>
          reviewApi.getReviewSubmission(apiRequest)(submissionId),
        [],
      ),
      getFileSystem: useCallback(
        (submissionId: number) =>
          reviewApi.getFileSystem(apiRequest)(submissionId),
        [],
      ),
      getFileContent: useCallback(
        (submissionId: number, path: string) =>
          reviewApi.getFileContent(apiRequest)(submissionId, path),
        [],
      ),
      getComments: useCallback(
        (
          submissionId: number,
          options?: {
            filePath?: string;
            lineNumber?: number;
            page?: number;
            size?: number;
          },
        ) => reviewApi.getReviewComments(apiRequest)(submissionId, options),
        [],
      ),
      createComment: useCallback(
        (submissionId: number, data: CreateReviewCommentRequest) =>
          reviewApi.createReviewComment(apiRequest)(submissionId, data),
        [],
      ),
      createReply: useCallback(
        (commentId: string, content: string) =>
          reviewApi.createReply(apiRequest)(commentId, content),
        [],
      ),
      create: useCallback(
        (submissionId: number, data: CreateReviewRequest) =>
          reviewApi.createReview(apiRequest)(submissionId, data),
        [],
      ),
      createSubmission: useCallback(
        (data: CreateReviewSubmissionRequest) =>
          reviewApi.createReviewSubmission(apiRequest)(data),
        [],
      ),
      list: useCallback(
        (page?: number, size?: number) =>
          reviewApi.listReviews(apiRequest)(page, size),
        [],
      ),
    },
    reviewers: {
      list: useCallback(
        (options?: {
          preferences?: string;
          tags?: string;
          page?: number;
          size?: number;
        }) => reviewersApi.listReviewers(apiRequest)(options),
        [],
      ),
    },
    git: {
      getBranches: useCallback(
        (gitUrl: string) => gitApi.getBranches(apiRequest)(gitUrl),
        [],
      ),
    },
  };
}
