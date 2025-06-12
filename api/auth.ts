import type { apiRequest } from "@/lib/api-utils";
import type { ApiResponse } from "@/types";

type AuthedApi = typeof apiRequest;

export const signIn =
  (authedApi: AuthedApi) =>
  async (
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> => {
    const response = await authedApi<
      ApiResponse<{ accessToken: string; refreshToken: string }>
    >("POST", "/auth/signin", { email, password });
    return response.data!;
  };

export const signOut = (authedApi: AuthedApi) => async (): Promise<void> => {
  await authedApi("POST", "/auth/signout");
};
