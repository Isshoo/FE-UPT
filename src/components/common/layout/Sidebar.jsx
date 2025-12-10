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
  ClipboardCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils/tailwind';
import { useAuthStore, useThemeStore } from '@/store';
import { APP_NAME } from '@/config/environment';
import { ROUTES } from '@/lib/constants/routes';
import { ROLES } from '@/lib/constants/labels';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import NotificationBell from './NotificationBell';
import { getInitials } from '@/lib/utils/helpers';
import Image from 'next/image';

const ADMIN_MENU_ITEMS = [
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

const DOSEN_MENU_ITEMS = [
  {
    label: 'Dashboard',
    href: ROUTES.DOSEN_DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: 'Penilaian',
    href: ROUTES.DOSEN_PENILAIAN,
    icon: ClipboardCheck,
  },
  {
    label: 'Pendampingan',
    href: ROUTES.DOSEN_PENDAMPINGAN,
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

  // Determine menu items based on role
  const menuItems =
    user?.role === ROLES.DOSEN ? DOSEN_MENU_ITEMS : ADMIN_MENU_ITEMS;
  const panelTitle = user?.role === ROLES.DOSEN ? 'Dosen Panel' : 'Admin Panel';

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
        className={cn(
          'fixed top-4 z-50 transition-all duration-350 lg:hidden',
          isOpen ? 'left-[13rem]' : 'left-4'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
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
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                <Image
                  src="/images/icon.png"
                  alt="Logo"
                  width={50}
                  height={50}
                  className="rounded-lg"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-xl font-bold text-[#fba635]">
                  {APP_NAME}
                </h2>
                <p className="text-muted-foreground truncate text-xs">
                  {panelTitle}
                </p>
              </div>
            </Link>
          </div>

          {/* User Info */}
          <div className="flex items-center justify-between gap-2 border-b px-4 py-4 dark:border-gray-800">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="bg-[#174c4e] text-white">
                  {getInitials(user?.nama || 'User')}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {user?.nama || 'User'}
                </p>
                <p className="text-muted-foreground truncate text-xs capitalize">
                  {user?.role || 'Admin'}
                </p>
              </div>
            </div>
            {/* Notification */}
            <div className="flex-shrink-0">
              <NotificationBell />
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
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
                      <Icon className="h-4 w-4 flex-shrink-0" />
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
              href={
                user?.role === ROLES.DOSEN
                  ? ROUTES.DOSEN_PROFILE
                  : ROUTES.ADMIN_PROFILE
              }
              onClick={() => setIsOpen(false)}
            >
              <Button
                variant="outline"
                className="mb-2 w-full justify-start"
                size="sm"
              >
                <User className="mr-2 h-4 w-4" />
                Profil
              </Button>
            </Link>

            {/* Theme Toggle */}
            <Button
              variant="outline"
              className="w-full justify-start"
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
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950 dark:hover:text-red-400"
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
