import type { apiRequest } from "@/lib/api-utils";
import type { ApiResponse, ListBranchesResponse } from "@/types";

type AuthedApi = typeof apiRequest;

export const getBranches =
  (authedApi: AuthedApi) =>
  async (gitUrl: string): Promise<ListBranchesResponse> => {
    const encodedUrl = encodeURIComponent(gitUrl);
    const response = await authedApi<ApiResponse<ListBranchesResponse>>(
      "GET",
      `/git/branches?gitUrl=${encodedUrl}`,
    );
    return response.data!;
  };
