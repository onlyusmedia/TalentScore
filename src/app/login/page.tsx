'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useStore } from '@/lib/store';
import { ArrowRight, Eye, EyeOff, Shield } from 'lucide-react';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const { user, token } = await api.login({ email, password });
        setUser(user, token);
        toast.success(`Welcome back, ${user.name}!`);
        router.push('/dashboard');
      } else {
        const { user, token } = await api.register({ email, password, name, company });
        setUser(user, token);
        toast.success('Account created successfully!');
        router.push('/dashboard');
      }
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#FDFDFD] text-[#0D0D0D] relative overflow-hidden">
      {/* Background grid + glow matching home page */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:60px_60px]" style={{ maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)' }} />
        <div className="absolute top-[20%] w-[600px] h-[400px] bg-[#79DA37]/[0.12] blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      {/* Auth Card */}
      <div 
        className="w-full max-w-md relative p-8 md:p-10 rounded-[2rem] border border-gray-200 bg-white overflow-hidden z-10"
        style={{
          boxShadow: '0 15px 50px rgba(0,0,0,0.06)',
        }}
      >
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#79DA37]/60 to-transparent" />
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#79DA37] shadow-[0_0_30px_rgba(121,218,55,0.25)] mb-6">
            <div className="w-5 h-5 bg-white rounded-sm rotate-45 transform" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#111] mb-2">
            {mode === 'login' ? 'Welcome back' : 'Start hiring smarter'}
          </h2>
          <p className="text-sm font-medium text-gray-400">
            {mode === 'login' ? 'Enter your details to access your dashboard' : 'Create an account to evaluate candidates with AI'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-2 uppercase tracking-wider text-gray-400">
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
                <label className="block text-xs font-medium mb-2 uppercase tracking-wider text-gray-400">
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
            <label className="block text-xs font-medium mb-2 uppercase tracking-wider text-gray-400">
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
            <label className="block text-xs font-medium mb-2 uppercase tracking-wider text-gray-400">
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
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors hover:bg-gray-100"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword
                  ? <EyeOff className="w-4 h-4 text-gray-400" />
                  : <Eye className="w-4 h-4 text-gray-400" />
                }
              </button>
            </div>
          </div>

          {mode === 'login' && (
            <div className="flex justify-end">
              <button type="button" className="text-xs transition-colors text-[#0A3D31] hover:text-[#0B3B24]">
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full h-12 mt-4 rounded-xl font-semibold text-sm text-[#111] flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden group"
            disabled={loading}
            style={{
              background: '#79DA37',
              boxShadow: '0 4px 25px rgba(121,218,55,0.3)',
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2), transparent, rgba(255,255,255,0.1))',
            }} />

            {loading ? (
              <div className="w-5 h-5 border-2 border-[#111]/20 border-t-[#111] rounded-full animate-spin" />
            ) : (
              <span className="relative flex items-center gap-2">
                {mode === 'login' ? 'Sign In' : 'Create Account'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            )}
          </button>
        </form>

        <div className="flex items-center gap-4 my-7">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-[10px] uppercase tracking-widest text-gray-300">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <p className="text-center text-sm text-gray-400">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            className="font-semibold transition-colors hover:underline text-[#0A3D31]"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Sign up free' : 'Sign in'}
          </button>
        </p>

        <div className="flex items-center justify-center gap-2 mt-8 text-[11px] text-gray-400">
          <Shield className="w-3.5 h-3.5" />
          <span>256-bit encrypted · SOC 2 compliant</span>
        </div>
      </div>

      <style jsx global>{`
        .auth-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.875rem;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          background: #F5F5F5;
          border: 1px solid #E5E7EB;
          color: #0D0D0D;
        }
        .auth-input::placeholder { color: #9CA3AF; }
        .auth-input:hover { border-color: #D1D5DB; background: #F0F0F0; }
        .auth-input:focus { border-color: #79DA37; box-shadow: 0 0 0 3px rgba(121, 218, 55, 0.15), 0 0 20px rgba(121, 218, 55, 0.05); background: #FAFAFA; }
      `}</style>
    </div>
  );
}
