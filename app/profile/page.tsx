"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <div className='container mx-auto py-10'>
      <h1 className='text-3xl font-bold mb-6'>내 프로필</h1>
      <div className='bg-white shadow overflow-hidden sm:rounded-lg'>
        <div className='px-4 py-5 sm:px-6'>
          <h3 className='text-lg leading-6 font-medium text-gray-900'>
            사용자 정보
          </h3>
          <p className='mt-1 max-w-2xl text-sm text-gray-500'>
            개인 정보를 확인하고 관리할 수 있습니다.
          </p>
        </div>
        <div className='border-t border-gray-200 px-4 py-5 sm:p-0'>
          <dl className='sm:divide-y sm:divide-gray-200'>
            <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>이름</dt>
              <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                {user.name}
              </dd>
            </div>
            <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>이메일</dt>
              <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                {user.email}
              </dd>
            </div>
            <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>역할</dt>
              <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                {user.role}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
