'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Moon, Sun, User, LogOut, Bell } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { getInitials } from '@/lib/utils';

export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDosen = user?.role === ROLES.DOSEN;

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
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 dark:border-gray-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href={ROUTES.HOME} className="flex items-center">
          <span className="text-xl font-bold text-[#fba635]">{APP_NAME}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-[#fba635]',
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
            size="icon"
            onClick={toggleTheme}
            className="hidden md:inline-flex"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {/* Notifications (if authenticated) */}
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-2 text-sm font-semibold">Notifikasi</div>
                <DropdownMenuItem className="p-3 cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">Event Baru Dibuka</p>
                    <p className="text-xs text-gray-500">
                      Bazaar Semester Ganjil 2025 telah dibuka
                    </p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Auth Buttons */}
          {!isAuthenticated ? (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href={ROUTES.LOGIN}>Login</Link>
              </Button>
              <Button asChild className="bg-[#fba635] hover:bg-[#fdac58]">
                <Link href={ROUTES.REGISTER}>Register</Link>
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden md:flex gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[#174c4e] text-white text-sm">
                      {getInitials(user?.name || 'User')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link
                    href={ROUTES.USER_PROFILE}
                    className="flex items-center cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t dark:border-gray-800">
          <nav className="container mx-auto flex flex-col gap-2 p-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.title}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="flex flex-col gap-2 mt-2 pt-2 border-t dark:border-gray-800">
                <Button variant="ghost" asChild>
                  <Link href={ROUTES.LOGIN}>Login</Link>
                </Button>
                <Button asChild className="bg-[#fba635] hover:bg-[#fdac58]">
                  <Link href={ROUTES.REGISTER}>Register</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}