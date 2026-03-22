'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutGrid, 
  Wallet, 
  PieChart, 
  Target, 
  Lightbulb
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Tổng quan', href: '/', icon: LayoutGrid },
  { name: 'Giao dịch', href: '/transactions', icon: Wallet },
  { name: 'Danh mục đầu tư', href: '/portfolio', icon: PieChart },
  { name: 'Mục tiêu tài chính', href: '/goals', icon: Target },
  { name: 'Trung tâm tư vấn', href: '/advisory', icon: Lightbulb },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-border-subtle h-screen flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-xl font-bold text-primary tracking-tight">
          Wealth Management
        </h1>
        <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">
          PERSONAL & FAMILY
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative',
                isActive 
                  ? 'text-primary bg-primary/5' 
                  : 'text-text-muted hover:text-text-main hover:bg-gray-50'
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-secondary rounded-r-full" />
              )}
              <Icon className={cn('w-5 h-5', isActive ? 'text-primary' : 'text-gray-400')} />
              {item.name}
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}
