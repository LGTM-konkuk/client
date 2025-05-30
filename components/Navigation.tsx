"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";

export const Navigation = () => {
  const pathname = usePathname();
  const { status } = useSession();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const links = [
    {
      label: "멘토 찾기",
      href: "/mentors",
    },
    {
      label: "코드 리뷰",
      href: "/reviews",
    },
  ];

  return (
    <nav className='bg-white flex justify-between w-full h-16 px-6'>
      <div className='flex'>
        <Link href='/' className='flex items-center'>
          <span className='text-xl font-bold text-primary'>PTAL</span>
        </Link>
      </div>
      <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
              isActive(link.href)
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className='w-fit flex gap-2 items-center'>
        {status === "authenticated" ? (
          <Button>
            <Link href='/logout'>로그아웃</Link>
          </Button>
        ) : (
          <>
            <Button variant='secondary'>
              <Link href='/login'>로그인</Link>
            </Button>
            <Button>
              <Link href='/register'>시작하기</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
};
