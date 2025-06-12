import type { apiRequest } from "@/lib/api-utils";
import type { ApiResponse, ReadUserResponse } from "@/types";

type AuthedApi = typeof apiRequest;

export const me =
  (authedApi: AuthedApi) => async (): Promise<ReadUserResponse> => {
    const response = await authedApi<ApiResponse<ReadUserResponse>>(
      "GET",
      "/users/me",
    );
    return response.data!;
  };
