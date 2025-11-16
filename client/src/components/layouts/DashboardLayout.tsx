import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '@/src/hooks/useAuthCore';
import { api } from '@/lib/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { Settings, MessageSquare, LogOut, User, UserCircle, Linkedin, Instagram } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavLink {
  href: string;
  label: string;
}

// Role-specific navigation links
const getNavLinks = (role: string | null): NavLink[] => {
  const roleLower = role?.toLowerCase() || '';

  switch (roleLower) {
    case 'student':
      return [
        { href: '/student/dashboard', label: 'Dashboard' },
        { href: '/student/projects', label: 'Projects' },
        { href: '/student/mentoring', label: 'Mentoring' },
        { href: '/student/skills', label: 'Skills' },
        { href: '/student/certificates', label: 'Certificates' },
        { href: '/student/community', label: 'Community' },
        { href: '/student/resources', label: 'Resources' },
      ];
    case 'parent':
      return [
        { href: '/parent/dashboard', label: 'Dashboard' },
        { href: '/parent/students', label: 'Students' },
        { href: '/parent/progress', label: 'Progress' },
        { href: '/parent/certificates', label: 'Certificates' },
        { href: '/parent/workbooks', label: 'Workbooks' },
      ];
    case 'corporate_partner':
      return [
        { href: '/corporate/dashboard', label: 'Dashboard' },
        { href: '/corporate/projects', label: 'Projects' },
        { href: '/corporate/talent', label: 'Talent' },
        { href: '/corporate/volunteers', label: 'Volunteers' },
        { href: '/corporate/impact', label: 'Impact' },
      ];
    case 'admin':
      return [
        { href: '/admin/dashboard', label: 'Dashboard' },
        { href: '/admin/users', label: 'Users' },
        { href: '/admin/content', label: 'Content' },
        { href: '/admin/analytics', label: 'Analytics' },
        { href: '/admin/payments', label: 'Payments' },
        { href: '/admin/crm', label: 'CRM' },
        { href: '/admin/roles', label: 'Roles' },
        { href: '/admin/settings', label: 'Settings' },
      ];
    default:
      return [];
  }
};

interface DashboardLayoutProps {
  children: ReactNode;
  backgroundClassName?: string;
}

interface FullUser {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  username?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, backgroundClassName }) => {
  const router = useRouter();
  const { user, role, logout, loading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [fullUser, setFullUser] = useState<FullUser | null>(null);

  // Prevent hydration mismatch by only rendering client-side content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch full user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id || !mounted) return;

      try {
        const userId = user.id;
        const response = await api.getUser(userId);
        if (response.data) {
          setFullUser(response.data as FullUser);
        }
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    };

    fetchUserData();
  }, [user?.id, mounted]);

  const navLinks = getNavLinks(role);
  const currentPath = router.pathname;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Get user's first name and last name for display
  const getUserDisplayName = () => {
    // First try to get from full user data
    if (fullUser) {
      const firstName = fullUser.first_name || '';
      const lastName = fullUser.last_name || '';
      if (firstName || lastName) {
        return `${firstName} ${lastName}`.trim();
      }
      if (fullUser.username) {
        return fullUser.username;
      }
      if (fullUser.email) {
        return fullUser.email.split('@')[0];
      }
    }
    
    // Fallback to user object from auth
    if (user && typeof user === 'object') {
      const firstName = (user as any).first_name || (user as any).firstName || '';
      const lastName = (user as any).last_name || (user as any).lastName || '';
      if (firstName || lastName) {
        return `${firstName} ${lastName}`.trim() || 'User';
      }
      const email = (user as any).email || '';
      if (email) {
        return email.split('@')[0];
      }
    }
    return 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getSettingsPath = () => {
    const roleLower = role?.toLowerCase() || '';
    switch (roleLower) {
      case 'student':
        return '/student/settings';
      case 'parent':
        return '/parent/settings';
      case 'corporate_partner':
        return '/corporate/settings';
      case 'admin':
        return '/admin/settings';
      default:
        return '/settings';
    }
  };

  const getProfilePath = () => {
    const roleLower = role?.toLowerCase() || '';
    switch (roleLower) {
      case 'student':
        return '/student/profile';
      case 'parent':
        return '/parent/account';
      case 'corporate_partner':
        return '/corporate/profile';
      case 'admin':
        return '/admin/settings';
      default:
        return '/profile';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Background Gradient Overlay */}
      {backgroundClassName && (
        <div className={cn("absolute inset-0 pointer-events-none", backgroundClassName)} />
      )}
      {/* Navbar */}
      <nav className="w-full border-b border-border/30 bg-transparent sticky top-0 z-50 relative">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Side - Logo and Navigation */}
            <div className="flex items-center gap-8">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <div className="relative w-32 h-10">
                  <Image
                    src="/AA_Educates_logo.svg"
                    alt="AA Educates Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>

              {/* Navigation Links */}
              {mounted && (
                <div className="hidden md:flex items-center gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                        currentPath === link.href
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side - User Menu */}
            {mounted && (
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                      <span className="hidden sm:block text-sm font-medium text-foreground">
                        {getUserDisplayName()}
                      </span>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={getUserDisplayName()} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="flex flex-col">
                      <span>{getUserDisplayName()}</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {fullUser?.email || (user as any)?.email || 'No email'}
                      </span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={getProfilePath()} className="flex items-center cursor-pointer">
                        <UserCircle className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={getSettingsPath()} className="flex items-center cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/messages" className="flex items-center cursor-pointer">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Messages
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mounted && (
        <div className="md:hidden border-b border-border/30 bg-transparent">
          <div className="container mx-auto px-6 py-2">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors',
                    currentPath === link.href
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 relative z-10">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/20 bg-background mt-auto relative z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              © 2025 AA Educates, Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/company/aa-educates/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/aa_educates/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

