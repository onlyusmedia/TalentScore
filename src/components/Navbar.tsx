'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import {
  Sparkles, LogOut, CreditCard, Settings, ChevronRight,
  LayoutDashboard, FolderPlus, Zap, ChevronDown, User,
  Receipt, Bell,
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, credits, logout, loadCredits } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) loadCredits();
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Navigation links
  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/roles/new', label: 'New Role', icon: FolderPlus },
    { href: '/dashboard/billing', label: 'Billing', icon: Receipt },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  // Credit percentage for visual indicator
  const creditPercent = credits
    ? Math.round((credits.creditsUsed / credits.creditsIncluded) * 100)
    : 0;
  const creditColor = credits && credits.creditsRemaining <= 2 ? '#f59e0b' : '#818cf8';

  return (
    <nav className="sticky top-0 z-50 no-print" style={{
      background: 'rgba(8, 8, 14, 0.85)',
      backdropFilter: 'blur(20px) saturate(180%)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* ─── Left: Logo + Nav Links ─── */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]" style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[15px] tracking-tight text-white hidden sm:block">
              TalentScore
            </span>
          </Link>

          {/* Nav Divider */}
          <div className="hidden md:block h-5 w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200"
                  style={{
                    color: active ? '#c7d2fe' : 'rgba(255,255,255,0.4)',
                    background: active ? 'rgba(99,102,241,0.1)' : 'transparent',
                  }}
                >
                  <link.icon className="w-3.5 h-3.5" />
                  {link.label}
                  {active && (
                    <div className="absolute bottom-0 left-3 right-3 h-px" style={{
                      background: 'linear-gradient(90deg, transparent, #818cf8, transparent)',
                    }} />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ─── Right: Credits + Profile ─── */}
        <div className="flex items-center gap-2.5">
          {/* Credit Pill */}
          {credits && (
            <Link
              href="/dashboard/billing"
              className="hidden sm:flex items-center gap-2.5 pl-2.5 pr-3.5 py-1.5 rounded-full text-[13px] transition-all duration-200 group"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              {/* Circular progress indicator */}
              <div className="relative w-6 h-6 flex items-center justify-center">
                <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
                  <circle
                    cx="12" cy="12" r="9" fill="none"
                    stroke={creditColor}
                    strokeWidth="2.5"
                    strokeDasharray={`${(1 - creditPercent / 100) * 56.5} 56.5`}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <Zap className="absolute w-2.5 h-2.5" style={{ color: creditColor }} />
              </div>

              <div className="flex items-baseline gap-1">
                <span className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                  {credits.creditsRemaining}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>
                  / {credits.creditsIncluded}
                </span>
              </div>
            </Link>
          )}

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all duration-200 hover:bg-white/[0.04]"
              style={{
                border: profileOpen ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
              }}
            >
              {/* Avatar */}
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-bold text-white" style={{
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              }}>
                {user?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>

              {/* Name */}
              <div className="hidden sm:block text-left">
                <p className="text-[12px] font-medium text-white leading-none">
                  {user?.name || 'User'}
                </p>
                <p className="text-[10px] leading-none mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {credits?.plan ? credits.plan.charAt(0).toUpperCase() + credits.plan.slice(1) : 'Free'} plan
                </p>
              </div>

              <ChevronDown
                className="w-3.5 h-3.5 transition-transform duration-200"
                style={{
                  color: 'rgba(255,255,255,0.3)',
                  transform: profileOpen ? 'rotate(180deg)' : 'rotate(0)',
                }}
              />
            </button>

            {/* Dropdown Menu */}
            {profileOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-56 rounded-xl overflow-hidden shadow-2xl"
                style={{
                  background: 'rgba(18, 18, 28, 0.98)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(20px)',
                  animation: 'slideDown 0.15s ease-out',
                }}
              >
                {/* User Info */}
                <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-sm font-semibold text-white">{user?.name}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {user?.email}
                  </p>
                </div>

                {/* Menu Items */}
                <div className="py-1.5">
                  {[
                    { href: '/dashboard/settings', icon: User, label: 'Profile & Settings' },
                    { href: '/dashboard/billing', icon: CreditCard, label: 'Billing & Credits' },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2.5 px-4 py-2 text-[13px] transition-colors"
                      style={{ color: 'rgba(255,255,255,0.55)' }}
                      onClick={() => setProfileOpen(false)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
                      }}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* Logout */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} className="py-1.5">
                  <button
                    onClick={() => { setProfileOpen(false); handleLogout(); }}
                    className="flex items-center gap-2.5 px-4 py-2 text-[13px] w-full transition-colors"
                    style={{ color: 'rgba(239,68,68,0.7)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(239,68,68,0.06)';
                      e.currentTarget.style.color = 'rgba(239,68,68,0.9)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'rgba(239,68,68,0.7)';
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dropdown Animation */}
      <style jsx global>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </nav>
  );
}
