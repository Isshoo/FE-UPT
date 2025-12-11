'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Moon, Sun, User, LogOut, LogIn } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils/tailwind';
import { useAuthStore, useThemeStore } from '@/store';
import { APP_NAME } from '@/config/environment';
import { ROUTES } from '@/lib/constants/routes';
import { ROLES } from '@/lib/constants/labels';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import NotificationBell from './NotificationBell';
import { getInitials } from '@/lib/utils/helpers';
import Image from 'next/image';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = user?.role === ROLES.ADMIN;
  const isDosen = user?.role === ROLES.DOSEN;

  const menuItems = [
    { title: 'Beranda', href: ROUTES.HOME },
    { title: 'Marketplace', href: ROUTES.USER_MARKETPLACE },
    { title: 'Tentang Kami', href: ROUTES.ABOUT },
  ];

  const handleLogout = async () => {
    await logout();
    router.push(ROUTES.LOGIN);
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-white/30 shadow-lg backdrop-blur-md transition-all duration-300 dark:bg-gray-900/90">
      <div className="container mx-auto flex h-18 items-center justify-between px-4">
        {/* Logo */}
        <Link href={ROUTES.HOME} className="flex items-center">
          <div className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <Image
                src="/images/icon.png"
                alt="Logo"
                width={30}
                height={30}
                className="rounded-lg"
              />
            </div>
            <span
              className={cn(
                'text-xl font-bold transition-colors',
                theme === 'light' ? 'text-[#174c4e]' : 'text-[#fba635]'
              )}
            >
              {APP_NAME}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-10 lg:flex">
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
            className="!px-1 text-gray-700 hover:bg-gray-100 md:inline-flex dark:text-gray-300 dark:hover:bg-gray-800"
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
              <Button
                variant="ghost"
                asChild
                className="text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <Link href={ROUTES.LOGIN}>Login</Link>
              </Button>
              <Button asChild className="bg-[#fba635] hover:bg-[#fdac58]">
                <Link href={ROUTES.REGISTER}>Register</Link>
              </Button>
            </div>
          ) : (
            <>
              {isDosen || isAdmin ? null : (
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
              )}
              {isAdmin && (
                <Button
                  asChild
                  className="ml-3 hidden bg-[#fba635] hover:bg-[#fdac58] md:flex"
                >
                  <Link href={ROUTES.ADMIN_DASHBOARD}>
                    Admin Panel <LogIn />
                  </Link>
                </Button>
              )}
              {isDosen && (
                <Button
                  asChild
                  className="ml-3 hidden bg-[#fba635] hover:bg-[#fdac58] md:flex"
                >
                  <Link href={ROUTES.DOSEN_DASHBOARD}>
                    Dosen Panel <LogIn />
                  </Link>
                </Button>
              )}
            </>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-700 hover:bg-gray-100 lg:hidden dark:text-gray-300 dark:hover:bg-gray-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="!size-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t bg-white md:hidden dark:border-gray-800 dark:bg-gray-900">
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
                    <Link href={ROUTES.LOGIN}>Masuk</Link>
                  </Button>
                  <Button asChild className="bg-[#fba635] hover:bg-[#fdac58]">
                    <Link href={ROUTES.REGISTER}>Daftar</Link>
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
            {isDosen && (
              <>
                <div className="mt-2 flex flex-col gap-2 border-t pt-2 dark:border-gray-800">
                  <Button asChild className="bg-[#fba635] hover:bg-[#fdac58]">
                    <Link href={ROUTES.DOSEN_DASHBOARD}>Dosen Panel</Link>
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
