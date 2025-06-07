import type { apiRequest } from "@/lib/api-utils";
import type { ApiResponse, Page, ReadReviewerResponse } from "@/types";

type AuthedApi = typeof apiRequest;

export const listReviewers =
  (authedApi: AuthedApi) =>
  async (options?: {
    preferences?: string;
    tags?: string;
    page?: number;
    size?: number;
  }): Promise<Page<ReadReviewerResponse>> => {
    const params = new URLSearchParams();
    if (options?.preferences) params.append("preferences", options.preferences);
    if (options?.tags) params.append("tags", options.tags);
    if (options?.page !== undefined)
      params.append("page", options.page.toString());
    if (options?.size !== undefined)
      params.append("size", options.size.toString());

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const response = await authedApi<ApiResponse<Page<ReadReviewerResponse>>>(
      "GET",
      `/reviewers${queryString}`,
    );
    return response.data!;
  };
