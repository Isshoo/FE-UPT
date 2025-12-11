'use client';

import { useState, useEffect, useCallback } from 'react';
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
  ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils/tailwind';
import { useAuthStore, useThemeStore, useSidebarStore } from '@/store';
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
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const toggleCollapse = useSidebarStore((state) => state.toggleCollapse);

  // Determine menu items based on role
  const menuItems =
    user?.role === ROLES.DOSEN ? DOSEN_MENU_ITEMS : ADMIN_MENU_ITEMS;
  const panelTitle = user?.role === ROLES.DOSEN ? 'Dosen Panel' : 'Admin Panel';

  const handleLogout = async () => {
    await logout();
    router.push(ROUTES.LOGIN);
  };

  // Close sidebar on Escape key
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  // Add keyboard listener
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when mobile sidebar is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Menu Button - Changed to lg breakpoint */}
      <Button
        variant="outline"
        size="sm"
        className={cn(
          'fixed top-4 z-50 transition-all duration-300 lg:hidden',
          isOpen ? 'left-[13rem]' : 'left-4'
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Overlay for mobile - Changed to lg breakpoint */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - Changed to lg breakpoint and added collapsed state */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen border-r bg-white transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900',
          // Mobile: slide in/out
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop: always visible, can be collapsed
          'lg:translate-x-0',
          isCollapsed ? 'lg:w-20' : 'lg:w-64',
          // Mobile width
          'w-64'
        )}
        role="navigation"
        aria-label="Main navigation"
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
              <div
                className={cn(
                  'min-w-0 flex-1 transition-opacity duration-200',
                  isCollapsed ? 'lg:hidden lg:opacity-0' : 'lg:opacity-100'
                )}
              >
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
          <div
            className={cn(
              'flex items-center gap-2 border-b px-4 py-4 dark:border-gray-800',
              isCollapsed ? 'lg:justify-center' : 'justify-between'
            )}
          >
            {/* Show notification icon when collapsed, otherwise show user info */}
            {isCollapsed ? (
              <div className="hidden lg:block">
                <NotificationBell />
              </div>
            ) : null}

            <div
              className={cn(
                'flex min-w-0 flex-1 items-center gap-3',
                isCollapsed && 'lg:hidden'
              )}
            >
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
            {/* Notification - show when not collapsed */}
            <div className={cn('flex-shrink-0', isCollapsed && 'lg:hidden')}>
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
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-[#fba635] text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                        isCollapsed && 'lg:justify-center lg:px-2'
                      )}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span
                        className={cn(
                          'transition-opacity duration-200',
                          isCollapsed
                            ? 'lg:hidden lg:opacity-0'
                            : 'lg:opacity-100'
                        )}
                      >
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Collapse Toggle Button - Desktop only */}
          <div className="hidden border-t px-4 py-2 lg:block dark:border-gray-800">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center"
              onClick={toggleCollapse}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <ChevronLeft
                className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  isCollapsed && 'rotate-180'
                )}
              />
              <span
                className={cn(
                  'ml-2 transition-opacity duration-200',
                  isCollapsed ? 'hidden opacity-0' : 'opacity-100'
                )}
              >
                Sembunyikan
              </span>
            </Button>
          </div>

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
                className={cn(
                  'mb-2 w-full',
                  isCollapsed ? 'lg:justify-center lg:px-2' : 'justify-start'
                )}
                size="sm"
                title={isCollapsed ? 'Profil' : undefined}
              >
                <User className="h-4 w-4" />
                <span
                  className={cn(
                    'ml-2 transition-opacity duration-200',
                    isCollapsed ? 'lg:hidden lg:opacity-0' : 'lg:opacity-100'
                  )}
                >
                  Profil
                </span>
              </Button>
            </Link>

            {/* Theme Toggle */}
            <Button
              variant="outline"
              className={cn(
                'w-full',
                isCollapsed ? 'lg:justify-center lg:px-2' : 'justify-start'
              )}
              size="sm"
              onClick={toggleTheme}
              title={
                isCollapsed
                  ? theme === 'light'
                    ? 'Dark Mode'
                    : 'Light Mode'
                  : undefined
              }
            >
              {theme === 'light' ? (
                <>
                  <Moon className="h-4 w-4" />
                  <span
                    className={cn(
                      'ml-2 transition-opacity duration-200',
                      isCollapsed ? 'lg:hidden lg:opacity-0' : 'lg:opacity-100'
                    )}
                  >
                    Mode Gelap
                  </span>
                </>
              ) : (
                <>
                  <Sun className="h-4 w-4" />
                  <span
                    className={cn(
                      'ml-2 transition-opacity duration-200',
                      isCollapsed ? 'lg:hidden lg:opacity-0' : 'lg:opacity-100'
                    )}
                  >
                    Mode Terang
                  </span>
                </>
              )}
            </Button>

            {/* Logout */}
            <Button
              variant="outline"
              className={cn(
                'w-full text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950 dark:hover:text-red-400',
                isCollapsed ? 'lg:justify-center lg:px-2' : 'justify-start'
              )}
              size="sm"
              onClick={handleLogout}
              title={isCollapsed ? 'Logout' : undefined}
            >
              <LogOut className="h-4 w-4" />
              <span
                className={cn(
                  'ml-2 transition-opacity duration-200',
                  isCollapsed ? 'lg:hidden lg:opacity-0' : 'lg:opacity-100'
                )}
              >
                Keluar
              </span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
