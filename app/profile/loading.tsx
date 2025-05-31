"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className='container mx-auto py-10'>
      <Skeleton className='h-9 w-1/4 mb-6' /> {/* 페이지 제목 스켈레톤 */}
      <div className='bg-white shadow overflow-hidden sm:rounded-lg'>
        <div className='px-4 py-5 sm:px-6'>
          <Skeleton className='h-7 w-1/3 mb-1' /> {/* 섹션 제목 스켈레톤 */}
          <Skeleton className='h-4 w-1/2' /> {/* 섹션 부제목 스켈레톤 */}
        </div>
        <div className='border-t border-gray-200 px-4 py-5 sm:p-0'>
          <dl className='sm:divide-y sm:divide-gray-200'>
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'
              >
                <Skeleton className='h-5 w-1/4' /> {/* 항목 이름 스켈레톤 */}
                <Skeleton className='h-5 w-1/2 sm:col-span-2' />{" "}
                {/* 항목 값 스켈레톤 */}
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
