"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { useAuth } from "@/lib/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Navigation = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const links = [
    {
      label: "멘토 찾기",
      href: "/reviewers",
    },
    {
      label: "코드 리뷰",
      href: "/reviews",
    },
  ];

  const handleLogout = async () => {
    logout();
    // 필요하다면 로그아웃 후 리다이렉션 로직 추가
    // 예: router.push('/');
  };

  return (
    <nav className='bg-white flex justify-between w-full h-16 px-6 border-b'>
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
                ? "text-gray-900 border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-900 hover:border-b-2 hover:border-gray-300"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className='w-fit flex gap-4 items-center'>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
                <Avatar className='h-8 w-8'>
                  <AvatarFallback>
                    {user.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align='end' forceMount>
              <DropdownMenuLabel className='font-normal'>
                <div className='flex flex-col space-y-1'>
                  <p className='text-sm font-medium leading-none'>
                    {user.name}
                  </p>
                  <p className='text-xs leading-none text-muted-foreground'>
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href='/profile'>내 프로필</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button variant='secondary' asChild>
              <Link href='/login'>로그인</Link>
            </Button>
            <Button asChild>
              <Link href='/register'>시작하기</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
};
