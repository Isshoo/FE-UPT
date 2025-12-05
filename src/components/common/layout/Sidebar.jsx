'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Store,
  Users,
  LogOut,
  User,
  Sun,
  Moon,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils/tailwind';
import { useAuthStore, useThemeStore } from '@/store';
import { APP_NAME } from '@/config/environment';
import { ROUTES } from '@/lib/constants/routes';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import NotificationBell from './NotificationBell';
import { getInitials } from '@/lib/utils/helpers';
import Image from 'next/image';

const menuItems = [
  {
    label: 'Dashboard',
    href: ROUTES.ADMIN_DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: 'Marketplace',
    href: ROUTES.ADMIN_MARKETPLACE,
    icon: Store,
  },
  {
    label: 'Pengguna',
    href: ROUTES.ADMIN_USERS,
    icon: Users,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push(ROUTES.LOGIN);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="sm"
        className={
          isOpen
            ? 'fixed top-4 left-50 z-50 duration-350 lg:hidden'
            : 'fixed top-4 left-7 z-50 duration-600 lg:hidden'
        }
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen w-64 border-r bg-white transition-transform duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Brand */}
          <div className="border-b px-4 py-6 dark:border-gray-800">
            <Link
              href={ROUTES.HOME}
              className="flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg">
                <Image
                  src="/images/icon.png"
                  alt="Logo"
                  width={50}
                  height={50}
                  className="rounded-lg"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#fba635]">{APP_NAME}</h2>
                <p className="text-muted-foreground text-xs">Admin Panel</p>
              </div>
            </Link>
          </div>

          {/* User Info */}
          <div className="flex items-center justify-between border-b px-6 py-4 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-[#174c4e] text-white">
                  {getInitials(user?.nama || 'User')}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {user?.nama || 'User'}
                </p>
                <p className="text-muted-foreground text-xs capitalize">
                  {user?.role || 'Admin'}
                </p>
              </div>
            </div>
            {/* Notification */}
            <div className="flex items-center justify-end">
              <NotificationBell />
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.includes(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                        isActive
                          ? 'bg-[#fba635] text-white'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom Actions */}
          <div className="space-y-2 border-t p-4 dark:border-gray-800">
            {/* Profile */}
            <Link
              href={ROUTES.USER_PROFILE}
              className=""
              onClick={() => setIsOpen(false)}
            >
              <Button
                variant="outline"
                className="mb-2 w-full justify-start p-0"
                size="sm"
              >
                <User className="mr-2 h-4 w-4" />
                Profil
              </Button>
            </Link>

            {/* Theme Toggle */}
            <Button
              variant="outline"
              className="mb-2 w-full justify-start p-0"
              size="sm"
              onClick={toggleTheme}
            >
              {theme === 'light' ? (
                <>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light Mode</span>
                </>
              )}
            </Button>

            {/* Logout */}
            <Button
              variant="outline"
              className="w-full justify-start p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
