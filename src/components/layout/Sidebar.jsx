'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Store,
  Briefcase,
  Users,
  LogOut,
  User,
  Sun,
  Moon,
  SquareArrowOutUpLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore, useThemeStore } from '@/store';
import { ROUTES, APP_NAME } from '@/lib/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

const menuItems = [
  {
    title: 'Dashboard',
    href: ROUTES.ADMIN_DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    title: 'Marketplace',
    href: ROUTES.ADMIN_MARKETPLACE,
    icon: Store,
  },
  {
    title: 'UMKM Binaan',
    href: ROUTES.ADMIN_UMKM,
    icon: Briefcase,
  },
  {
    title: 'Users',
    href: ROUTES.ADMIN_USERS,
    icon: Users,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const handleLogout = () => {
    logout();
    window.location.href = ROUTES.LOGIN;
  };

  return (
    <>
      {/* Sidebar untuk Tablet & Desktop */}
      <aside className="fixed top-0 left-0 z-40 hidden h-screen w-20 max-w-64 min-w-20 border-r bg-white sm:block lg:w-full dark:border-gray-800 dark:bg-gray-900">
        <div className="flex h-full flex-col">
          {/* Logo/Brand */}
          <div className="flex h-16 items-center border-b px-6 dark:border-gray-800">
            <Link
              href={ROUTES.HOME}
              className="flex !cursor-pointer items-center"
            >
              <span className="hidden pl-1 text-xl font-bold text-[#fba635] lg:block">
                {APP_NAME}
              </span>
              <span className="block pl-1 text-xl font-bold text-[#fba635] lg:hidden">
                UP
              </span>
              <SquareArrowOutUpLeft className="mt-0.5 ml-2 h-4 w-4 text-[#174c4e] dark:text-white" />
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.includes(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex w-full items-center justify-center gap-3 rounded-lg px-3 py-2.5 pl-2.5 text-sm font-medium transition-colors lg:justify-start lg:pl-4',
                    isActive
                      ? 'bg-[#fba635] text-white'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <p className="hidden lg:block">{item.title}</p>
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="border-t p-4 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex w-full items-center justify-start gap-3 pl-2.5 lg:pl-4"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-[#174c4e] text-white">
                        {getInitials(user?.nama || 'User')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden flex-col items-start text-sm lg:flex">
                      <span className="font-medium">
                        {user?.nama || 'User'}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {user?.role || 'Admin'}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="!md:ml-0 mb-1 ml-8 w-48"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      href={ROUTES.USER_PROFILE}
                      className="flex cursor-pointer items-center"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="">
                    {/* Theme Toggle */}
                    <button
                      onClick={toggleTheme}
                      className="flex w-full cursor-pointer items-center"
                    >
                      {theme === 'light' ? (
                        <>
                          <Moon className="mr-2 h-5 w-5" />{' '}
                          <p className="capitalize">Dark</p>
                        </>
                      ) : (
                        <>
                          <Sun className="mr-2 h-5 w-5" />{' '}
                          <p className="capitalize">Light</p>
                        </>
                      )}
                    </button>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <button
                      onClick={handleLogout}
                      className="flex w-full cursor-pointer items-center !text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <LogOut className="mr-2 h-4 w-4 pl-0.5 text-red-600" />
                      Logout
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar (hanya untuk layar sangat kecil) */}
      <div className="fixed top-0 right-0 left-0 z-40 flex h-16 items-center justify-between border-b bg-white px-4 sm:hidden dark:border-gray-800 dark:bg-gray-900">
        <Link href={ROUTES.ADMIN_DASHBOARD} className="flex items-center">
          <span className="text-xl font-bold text-[#fba635]">{APP_NAME}</span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-[#174c4e] text-white">
                  {getInitials(user?.nama || 'User')}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link
                href={ROUTES.USER_PROFILE}
                className="flex cursor-pointer items-center"
              >
                <User className="mr-2 h-4 w-4" />
                Profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <button
                onClick={toggleTheme}
                className="flex w-full cursor-pointer items-center"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="mr-2 h-5 w-5" />
                    <p className="capitalize">Dark</p>
                  </>
                ) : (
                  <>
                    <Sun className="mr-2 h-5 w-5" />
                    <p className="capitalize">Light</p>
                  </>
                )}
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <button
                onClick={handleLogout}
                className="flex w-full cursor-pointer items-center !text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="mr-2 h-4 w-4 pl-0.5 text-red-600" />
                Logout
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Bottom Navigation (hanya untuk layar sangat kecil) */}
      <nav className="fixed right-0 bottom-0 left-0 z-40 border-t bg-white sm:hidden dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-around">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.includes(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
                  isActive
                    ? 'text-[#fba635]'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                )}
              >
                <Icon className="h-6 w-6" />
                <span className="text-[10px]">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
