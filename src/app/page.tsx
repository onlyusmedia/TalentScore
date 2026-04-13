'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useStore } from '@/lib/store';
import {
  Sparkles, ArrowRight, Eye, EyeOff, Target, BarChart3,
  FileText, Brain, CheckCircle2, Zap, Shield, Users, ChevronRight,
} from 'lucide-react';

/* ─── Animated Background Orbs ─────────────────────────────── */
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <style jsx>{`
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
          animation: float 20s ease-in-out infinite;
        }
        .orb-1 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(99,102,241,0.35), transparent 70%);
          top: -10%; left: -5%;
          animation-duration: 18s;
        }
        .orb-2 {
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(139,92,246,0.3), transparent 70%);
          bottom: -5%; right: 10%;
          animation-duration: 22s;
          animation-delay: -5s;
        }
        .orb-3 {
          width: 250px; height: 250px;
          background: radial-gradient(circle, rgba(59,130,246,0.2), transparent 70%);
          top: 40%; left: 30%;
          animation-duration: 25s;
          animation-delay: -10s;
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -40px) scale(1.05); }
          50% { transform: translate(-20px, 20px) scale(0.95); }
          75% { transform: translate(40px, 30px) scale(1.02); }
        }
      `}</style>
    </div>
  );
}

/* ─── Animated Counter ─────────────────────────────────────── */
function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 30);
    return () => clearInterval(timer);
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Typing Effect ────────────────────────────────────────── */
function TypingText({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index];
    const speed = deleting ? 40 : 80;

    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplayed(word.slice(0, displayed.length + 1));
        if (displayed.length === word.length) {
          setTimeout(() => setDeleting(true), 2000);
        }
      } else {
        setDisplayed(word.slice(0, displayed.length - 1));
        if (displayed.length === 0) {
          setDeleting(false);
          setIndex((i) => (i + 1) % words.length);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayed, deleting, index, words]);

  return (
    <span className="bg-clip-text text-transparent" style={{
      backgroundImage: 'linear-gradient(135deg, #818cf8, #c084fc, #f472b6)',
    }}>
      {displayed}
      <span className="animate-pulse text-indigo-400">|</span>
    </span>
  );
}

/* ─── Main Page ────────────────────────────────────────────── */
export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'register') {
        const { user, token } = await api.register({ email, password, name, company });
        setUser(user, token);
        toast.success('Account created! Welcome to TalentScore.');
      } else {
        const { user, token } = await api.login({ email, password });
        setUser(user, token);
        toast.success('Welcome back!');
      }
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: FileText, title: 'Smart Job Analysis', desc: 'AI-enhanced descriptions with custom scoring categories', color: '#818cf8' },
    { icon: Brain, title: 'Resume Intelligence', desc: 'Instant summaries, strengths, concerns, and red flags', color: '#a78bfa' },
    { icon: Target, title: 'Precision Scoring', desc: 'Evidence-based candidate evaluation scored 1–10', color: '#c084fc' },
    { icon: BarChart3, title: 'Clear Rankings', desc: 'Strong Hire, Consider, or Risky — decided in minutes', color: '#f472b6' },
  ];

  const stats = [
    { value: 10000, suffix: '+', label: 'Candidates Scored' },
    { value: 95, suffix: '%', label: 'Accuracy Rate' },
    { value: 4, suffix: 'x', label: 'Faster Hiring' },
  ];

  const trustedBy = ['TechCorp', 'ScaleUp', 'DataFlow', 'NovaBridge'];

  return (
    <div className="min-h-screen flex relative" style={{ background: '#06060b' }}>
      {/* ─── Left Panel: Brand & Features ─── */}
      <div className="hidden lg:flex lg:w-[55%] flex-col justify-between p-8 xl:p-10 relative overflow-hidden">
        <FloatingOrbs />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center relative" style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: '0 0 30px rgba(99,102,241,0.4)',
            }}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">TalentScore</h1>
              <p className="text-[11px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Hiring Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 space-y-4">
          <h2 className="text-[2.1rem] xl:text-4xl font-extrabold leading-[1.15] text-white">
            From job post to<br />
            <TypingText words={['ranked candidates', 'smart decisions', 'perfect hires', 'clear insights']} />
            <br />
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>in minutes.</span>
          </h2>

          <p className="text-[15px] max-w-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Stop guessing. Let AI analyze resumes, score interviews, and surface the candidates that actually
            match what you need — with evidence, not gut feeling.
          </p>

          {/* CTA Stats */}
          <div className="flex items-center gap-8 pt-1">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="text-2xl font-bold text-white">
                  <AnimatedNumber target={s.value} suffix={s.suffix} />
                </div>
                <div className="text-[10px] mt-0.5 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Row — Compact Horizontal */}
        <div className="relative z-10 space-y-4">
          <div className="grid grid-cols-4 gap-2.5">
            {features.map((f, i) => (
              <div
                key={i}
                className="group p-3 rounded-xl border transition-all duration-300 hover:border-opacity-20 hover:scale-[1.03]"
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  borderColor: 'rgba(255,255,255,0.06)',
                }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110" style={{
                  background: `${f.color}12`,
                }}>
                  <f.icon style={{ color: f.color, width: '16px', height: '16px' }} />
                </div>
                <h3 className="text-[13px] font-semibold text-white mb-0.5 leading-tight">{f.title}</h3>
                <p className="text-[11px] leading-snug" style={{ color: 'rgba(255,255,255,0.35)' }}>{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Trusted By */}
          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Trusted by
            </span>
            <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <div className="flex items-center gap-5">
              {trustedBy.map((name, i) => (
                <span key={i} className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.18)' }}>
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Right Panel: Auth Form ─── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative" style={{
        background: 'linear-gradient(145deg, #0c0c14, #0a0a12)',
      }}>
        {/* Vertical divider glow */}
        <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-px" style={{
          background: 'linear-gradient(180deg, transparent, rgba(99,102,241,0.3) 30%, rgba(139,92,246,0.3) 70%, transparent)',
        }} />

        <div className="w-full max-w-[400px]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            }}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">TalentScore</h1>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1.5">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {mode === 'login'
                ? 'Enter your credentials to access your dashboard'
                : 'Start free — 3 candidate evaluations included'}
            </p>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="John Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    Company
                  </label>
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="Acme Inc."
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Email
              </label>
              <input
                type="email"
                className="auth-input"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input pr-11"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors hover:bg-white/5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
                    : <Eye className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
                  }
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div className="flex justify-end">
                <button type="button" className="text-xs transition-colors" style={{ color: 'rgba(129,140,248,0.7)' }}>
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full h-12 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden group"
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                boxShadow: '0 4px 25px rgba(99,102,241,0.35)',
              }}
            >
              {/* Shine effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent, rgba(255,255,255,0.05))',
              }} />

              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="relative flex items-center gap-2">
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <span className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* Toggle Auth Mode */}
          <p className="text-center text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              className="font-semibold transition-colors hover:underline"
              style={{ color: '#818cf8' }}
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            >
              {mode === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 mt-8 text-[11px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
            <Shield className="w-3.5 h-3.5" />
            <span>256-bit encrypted · SOC 2 compliant</span>
          </div>
        </div>
      </div>

      {/* ─── Auth Input Styles ─── */}
      <style jsx global>{`
        .auth-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.875rem;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: white;
        }
        .auth-input::placeholder {
          color: rgba(255, 255, 255, 0.2);
        }
        .auth-input:hover {
          border-color: rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.04);
        }
        .auth-input:focus {
          border-color: rgba(99, 102, 241, 0.5);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1), 0 0 20px rgba(99, 102, 241, 0.05);
          background: rgba(255, 255, 255, 0.04);
        }
      `}</style>
    </div>
  );
}
