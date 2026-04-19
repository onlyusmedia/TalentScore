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
  const creditColor = credits && credits.creditsRemaining <= 2 ? '#f59e0b' : '#79DA37';

  return (
    <nav className="sticky top-0 z-50 no-print" style={{
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(20px) saturate(180%)',
      borderBottom: '1px solid #E5E7EB',
    }}>
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* ─── Left: Logo + Nav Links ─── */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-[#79DA37] flex items-center justify-center shadow-sm transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(121,218,55,0.4)]">
              <div className="w-3 h-3 bg-white rounded-sm rotate-45 transform" />
            </div>
            <span className="font-bold text-[15px] tracking-tight text-[#0D0D0D] hidden sm:block">
              TalentScore
            </span>
          </Link>

          {/* Nav Divider */}
          <div className="hidden md:block h-5 w-px bg-gray-200" />

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
                    color: active ? '#0A3D31' : '#9CA3AF',
                    background: active ? 'rgba(121,218,55,0.12)' : 'transparent',
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  <link.icon className="w-3.5 h-3.5" />
                  {link.label}
                  {active && (
                    <div className="absolute bottom-0 left-3 right-3 h-px" style={{
                      background: 'linear-gradient(90deg, transparent, #79DA37, transparent)',
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
                background: '#F5F5F5',
                border: '1px solid #E5E7EB',
              }}
            >
              {/* Circular progress indicator */}
              <div className="relative w-6 h-6 flex items-center justify-center">
                <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" fill="none" stroke="#E5E7EB" strokeWidth="2.5" />
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
                <span className="font-semibold text-[#0D0D0D] group-hover:text-[#0A3D31] transition-colors">
                  {credits.creditsRemaining}
                </span>
                <span style={{ color: '#9CA3AF' }}>
                  / {credits.creditsIncluded}
                </span>
              </div>
            </Link>
          )}

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all duration-200 hover:bg-gray-50"
              style={{
                border: profileOpen ? '1px solid #E5E7EB' : '1px solid transparent',
              }}
            >
              {/* Avatar */}
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-bold text-white" style={{
                background: 'linear-gradient(135deg, #0A3D31, #1A5C4A)',
              }}>
                {user?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>

              {/* Name */}
              <div className="hidden sm:block text-left">
                <p className="text-[12px] font-medium text-[#0D0D0D] leading-none">
                  {user?.name || 'User'}
                </p>
                <p className="text-[10px] leading-none mt-0.5" style={{ color: '#9CA3AF' }}>
                  {credits?.plan ? credits.plan.charAt(0).toUpperCase() + credits.plan.slice(1) : 'Free'} plan
                </p>
              </div>

              <ChevronDown
                className="w-3.5 h-3.5 transition-transform duration-200"
                style={{
                  color: '#9CA3AF',
                  transform: profileOpen ? 'rotate(180deg)' : 'rotate(0)',
                }}
              />
            </button>

            {/* Dropdown Menu */}
            {profileOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-56 rounded-xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.08)]"
                style={{
                  background: 'rgba(255, 255, 255, 0.98)',
                  border: '1px solid #E5E7EB',
                  backdropFilter: 'blur(20px)',
                  animation: 'slideDown 0.15s ease-out',
                }}
              >
                {/* User Info */}
                <div className="px-4 py-3" style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <p className="text-sm font-semibold text-[#0D0D0D]">{user?.name}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>
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
                      style={{ color: '#6B7280' }}
                      onClick={() => setProfileOpen(false)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#F5F5F5';
                        e.currentTarget.style.color = '#0D0D0D';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#6B7280';
                      }}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* Logout */}
                <div style={{ borderTop: '1px solid #F3F4F6' }} className="py-1.5">
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
