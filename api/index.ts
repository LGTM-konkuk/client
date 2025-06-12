import { apiRequest } from "@/lib/api-utils";
import { useMemo } from "react";

import type {
  CreateReviewCommentRequest,
  CreateReviewRequest,
  CreateReviewSubmissionRequest
} from "@/types";

import * as gitApi from "./git";
import * as reviewApi from "./review";
import * as reviewersApi from "./reviewers";
import * as userApi from "./user";

export function useApi() {
  return useMemo(
    () => ({
      users: {
        me: () => userApi.me(apiRequest),
      },
      reviews: {
        getSubmission: (submissionId: number) =>
          reviewApi.getReviewSubmission(apiRequest)(submissionId),
        getFileSystem: (submissionId: number) =>
          reviewApi.getFileSystem(apiRequest)(submissionId),
        getFileContent: (submissionId: number, path: string) =>
          reviewApi.getFileContent(apiRequest)(submissionId, path),
        getComments: (
          submissionId: number,
          filePath?: string,
        ) => reviewApi.getReviewComments(apiRequest)(submissionId, filePath),
        createComment: (
          submissionId: number,
          data: CreateReviewCommentRequest,
        ) => reviewApi.createReviewComment(apiRequest)(submissionId, data),
        createReply: (commentId: string, content: string) =>
          reviewApi.createReply(apiRequest)(commentId, content),
        create: (submissionId: number, data: CreateReviewRequest) =>
          reviewApi.createReview(apiRequest)(submissionId, data),
        createSubmission: (data: CreateReviewSubmissionRequest) =>
          reviewApi.createReviewSubmission(apiRequest)(data),
        list: (options: { page?: number; size?: number; status?: string }) =>
          reviewApi.listReviews(apiRequest)(options),
      },
      reviewers: {
        list: (options?: {
          preferences?: string;
          tags?: string;
          page?: number;
          size?: number;
        }) => reviewersApi.listReviewers(apiRequest)(options),
      },
      git: {
        getBranches: (gitUrl: string) => gitApi.getBranches(apiRequest)(gitUrl),
      },
    }),
    [],
  );
}
