'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Moon, Sun, User, LogOut, LogIn } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuthStore, useThemeStore } from '@/store';
import { ROUTES, APP_NAME, ROLES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import NotificationBell from './NotificationBell';
import { getInitials } from '@/lib/utils';
import Image from 'next/image';

export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDosen = user?.role === ROLES.DOSEN;
  const isAdmin = user?.role === ROLES.ADMIN;

  const menuItems = [
    { title: 'Beranda', href: ROUTES.HOME },
    { title: 'Marketplace', href: ROUTES.USER_MARKETPLACE },
    { title: 'UMKM Binaan', href: ROUTES.USER_UMKM },
    { title: 'About', href: ROUTES.ABOUT },
    ...(isDosen
      ? [
          { title: 'Pendampingan', href: ROUTES.DOSEN_PENDAMPINGAN },
          { title: 'Penilaian', href: ROUTES.DOSEN_PENILAIAN },
        ]
      : []),
  ];

  const handleLogout = () => {
    logout();
    window.location.href = ROUTES.LOGIN;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
      <div className="container mx-auto flex h-18 items-center justify-between px-4">
        {/* Logo */}
        <Link href={ROUTES.HOME} className="flex items-center">
          <div className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white shadow-md">
              {/* <span className="text-xl font-bold text-white">U</span> */}
              <Image
                src="/images/icon.png"
                alt="Logo"
                width={30}
                height={30}
                className="rounded-lg"
              />
            </div>
            <span
              className={`text-xl font-bold ${theme === 'light' ? 'text-[#174c4e]' : 'text-[#fba635]'}`}
            >
              {APP_NAME}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-10 md:flex">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-md font-medium transition-colors hover:text-[#fba635]',
                  isActive
                    ? 'text-[#fba635]'
                    : 'text-gray-700 dark:text-gray-300'
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="lg"
            onClick={toggleTheme}
            className="!px-1 md:inline-flex"
          >
            {theme === 'light' ? (
              <Moon className="mx-0 !size-6 sm:mx-2" />
            ) : (
              <Sun className="mx-0 !size-6 sm:mx-2" />
            )}
          </Button>

          {/* Notifications (if authenticated) */}
          {isAuthenticated && !isAdmin && <NotificationBell />}

          {/* Auth Buttons */}
          {!isAuthenticated ? (
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" asChild>
                <Link href={ROUTES.LOGIN}>Login</Link>
              </Button>
              <Button asChild className="bg-[#fba635] hover:bg-[#fdac58]">
                <Link href={ROUTES.REGISTER}>Register</Link>
              </Button>
            </div>
          ) : (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  className="flex justify-center px-1 sm:px-3"
                >
                  <Button variant="ghost" className="gap-2 md:flex">
                    <Avatar className="!size-7">
                      <AvatarFallback className="bg-[#174c4e] text-sm text-white">
                        {getInitials(user?.nama || 'User')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="">
                  <DropdownMenuItem asChild>
                    <Link
                      href={ROUTES.USER_PROFILE}
                      className="flex cursor-pointer items-center"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer !text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4 text-red-600" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {isAdmin && (
                <Button
                  asChild
                  className="hidden bg-[#fba635] hover:bg-[#fdac58] md:flex"
                >
                  <Link href={ROUTES.ADMIN_DASHBOARD}>
                    Admin Panel <LogIn />
                  </Link>
                </Button>
              )}
            </>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="!size-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t md:hidden dark:border-gray-800">
          <nav className="container mx-auto flex flex-col gap-2 p-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.title}
              </Link>
            ))}
            {!isAuthenticated && (
              <>
                <div className="mt-2 flex flex-col gap-2 border-t pt-2 dark:border-gray-800">
                  <Button variant="ghost" asChild>
                    <Link href={ROUTES.LOGIN}>Login</Link>
                  </Button>
                  <Button asChild className="bg-[#fba635] hover:bg-[#fdac58]">
                    <Link href={ROUTES.REGISTER}>Register</Link>
                  </Button>
                </div>
              </>
            )}
            {isAdmin && (
              <>
                <div className="mt-2 flex flex-col gap-2 border-t pt-2 dark:border-gray-800">
                  <Button asChild className="bg-[#fba635] hover:bg-[#fdac58]">
                    <Link href={ROUTES.ADMIN_DASHBOARD}>Admin Panel</Link>
                  </Button>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
