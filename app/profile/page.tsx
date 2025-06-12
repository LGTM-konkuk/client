"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/auth";
import ProfileLoading from "./loading";

function ProfileContent({ title, data }: { title: string; data: string }) {
  return (
    <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
      <dt className='text-sm font-medium text-gray-500'>{title}</dt>
      <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
        {data}
      </dd>
    </div>
  );
}

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isLoading = useAuthStore((state) => state.isLoading);
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !user) {
      router.replace("/login");
    }
  }, [user, isInitialized, router]);

  if (!isInitialized || isLoading) {
    return <ProfileLoading />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className='container mx-auto py-10'>
      <h1 className='text-3xl font-bold mb-6'>내 프로필</h1>
      <Card>
        <CardHeader>
          <CardTitle>사용자 정보</CardTitle>
          <CardDescription>
            개인 정보를 확인하고 관리할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className='sm:divide-y sm:divide-gray-200'>
            <ProfileContent title='이름' data={user.name} />
            <ProfileContent title='이메일' data={user.email} />
            <ProfileContent title='권한' data={user.role} />
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
