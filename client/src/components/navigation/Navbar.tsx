import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/src/components/ui/button';

export const Navbar: React.FC = () => {
  return (
    <nav className="w-full border-b border-border/20 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
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

          {/* Right Side - Auth Buttons */}
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign up</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

