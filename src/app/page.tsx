'use client';

import Link from 'next/link';
import { Play, ArrowRight, CheckCircle2, ChevronRight, BarChart3, Star, Layers, Activity, FileText, Shield } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#0D0D0D] font-sans selection:bg-[#79DA37]/30 overflow-hidden relative">
      
      {/* ─── Exact Background (Grid + Central Soft Radial Glow) ─── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:60px_60px]" style={{ maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)' }} />
        <div className="absolute top-[10%] w-[700px] h-[500px] bg-[#79DA37]/[0.15] blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      {/* ─── Floating Pill Navigation ─── */}
      <div className="absolute top-8 left-0 right-0 z-50 flex justify-center px-6">
        <nav className="bg-white rounded-full px-6 py-2 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-gray-100 max-w-[800px] w-full">
          <div className="flex items-center gap-3 pl-2">
            <div className="w-7 h-7 rounded-lg bg-[#79DA37] flex items-center justify-center shadow-sm">
              <div className="w-2.5 h-2.5 bg-white rounded-sm rotate-45 transform" />
            </div>
            <span className="font-bold text-[16px] tracking-tight text-[#0D0D0D]">TalentScore</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-gray-400 tracking-wide">
            <Link href="#home" className="text-[#0D0D0D] font-bold">Home</Link>
            <Link href="#features" className="hover:text-[#0D0D0D] transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-[#0D0D0D] transition-colors">Pricing</Link>
            <Link href="#how-it-works" className="hover:text-[#0D0D0D] transition-colors">How It Works</Link>
            <Link href="#integrations" className="hover:text-[#0D0D0D] transition-colors">Integrations</Link>
          </div>

          <Link 
            href="/login"
            className="px-6 py-2.5 rounded-full bg-[#111] text-white font-medium text-[13px] hover:bg-black transition-all shadow-md"
          >
            Log In
          </Link>
        </nav>
      </div>

      <main className="relative z-10 pt-[140px]">
        
        {/* ─── HERO SECTION ─── */}
        <section className="relative pb-24 max-w-[1440px] mx-auto px-10 text-center select-none pt-4">
          
          <div className="max-w-[1100px] mx-auto relative z-10">
            {/* The bold, tightly tracked typography */}
            <h1 className="text-[64px] md:text-[84px] leading-[1.0] tracking-[-0.03em] font-bold mb-8">
              <span className="text-[#111]">Score Every</span><br />
              <span className="text-[#111]">Candidate With</span><br />
              <span className="text-gray-300">AI-Powered</span><br />
              <span className="text-[#111]">Precision</span>
            </h1>

            <p className="text-[17px] text-gray-500 mb-10 max-w-[700px] mx-auto font-medium leading-relaxed tracking-wide">
              Upload a job post, describe what matters most, upload resumes, and let AI score and rank every candidate — from job post to ranked results in one session.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link 
                href="/login"
                className="px-8 py-3.5 rounded-[14px] bg-[#79DA37] text-[#111] font-bold text-[15px] hover:bg-[#6BC230] transition-all shadow-[0_4px_15px_rgba(121,218,55,0.2)]"
              >
                Start Hiring
              </Link>
              <button 
                className="px-8 py-3.5 rounded-[14px] bg-[#111] text-white font-bold text-[15px] flex items-center gap-2 hover:bg-black transition-all shadow-[0_4px_15px_rgba(0,0,0,0.1)]"
              >
                <div className="w-5 h-5 bg-white flex items-center justify-center rounded-full">
                  <Play className="w-3 h-3 text-[#111] fill-[#111] ml-0.5" />
                </div>
                Watch Demo
              </button>
            </div>
          </div>

          {/* ─── FLOATING CARDS (Absolutely Positioned) ─── */}
          {/* Top Left: Maria Angelica M */}
          <div className="absolute top-[5%] left-[5%] hidden lg:flex flex-col bg-white p-3 pr-8 rounded-[16px] shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-gray-100 z-30 animate-float-slow -rotate-2 transform">
            <div className="flex items-center gap-3 mb-3">
              <img src="https://i.pravatar.cc/100?img=5" className="w-9 h-9 rounded-full border border-gray-100" alt="User" />
              <div className="text-left">
                <p className="text-xs font-bold text-[#111]">Sarah Mitchell</p>
                <p className="text-[10px] text-gray-400 font-medium">Hiring Manager</p>
              </div>
              <div className="ml-2 text-gray-400 font-bold tracking-widest text-[10px] mb-2">...</div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <p className="text-[9px] text-gray-400">Score: 92/100</p>
              <div className="flex -space-x-1">
                <div className="w-4 h-4 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[8px]">M</div>
                <div className="w-4 h-4 rounded-full bg-blue-600 border border-white flex items-center justify-center text-[8px] text-white">in</div>
                <div className="w-4 h-4 rounded-full bg-pink-500 border border-white flex items-center justify-center text-[8px] text-white">O</div>
              </div>
            </div>
          </div>

          {/* Top Right: Marcus Alexandro */}
          <div className="absolute top-[8%] right-[5%] hidden lg:flex flex-col bg-white p-3 pr-8 rounded-[16px] shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-gray-100 z-30 animate-float-delayed rotate-3 transform">
            <div className="flex items-center gap-3 mb-3">
              <img src="https://i.pravatar.cc/100?img=11" className="w-9 h-9 rounded-full border border-gray-100" alt="User" />
              <div className="text-left">
                <p className="text-xs font-bold text-[#111]">James Chen</p>
                <p className="text-[10px] text-gray-400 font-medium">VP of Recruiting</p>
              </div>
              <div className="ml-2 text-gray-400 font-bold tracking-widest text-[10px] mb-2">...</div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <p className="text-[9px] text-gray-400">Score: 74/100</p>
              <div className="flex -space-x-1">
                <div className="w-4 h-4 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[8px]">M</div>
                <div className="w-4 h-4 rounded-full bg-blue-600 border border-white flex items-center justify-center text-[8px] text-white">in</div>
                <div className="w-4 h-4 rounded-full bg-pink-500 border border-white flex items-center justify-center text-[8px] text-white">O</div>
              </div>
            </div>
          </div>

          {/* Bottom Left: Vinco Marconzo */}
          <div className="absolute top-[55%] left-[8%] hidden lg:flex items-center gap-3 bg-[#1B1B1B] p-2 pr-6 rounded-full shadow-[0_15px_30px_rgba(0,0,0,0.15)] z-20">
            {/* The literal pointer arrow above it */}
            <div className="absolute -top-4 -right-1">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-180">
                <path d="M22 2L11 22L9 15L2 13L22 2Z" fill="#1B1B1B" />
              </svg>
            </div>
            <img src="https://i.pravatar.cc/100?img=12" className="w-8 h-8 rounded-full border border-white/10" alt="User" />
            <div className="text-left">
              <p className="text-[11px] font-bold text-white">Elena Rodriguez</p>
              <p className="text-[9px] text-white/50">HR Director</p>
            </div>
          </div>

          {/* Bottom Right: Robert Williamson */}
          <div className="absolute top-[60%] right-[10%] hidden lg:flex items-center gap-3 bg-[#0A3D31] p-2 pr-6 rounded-full shadow-[0_15px_30px_rgba(10,61,49,0.2)] z-20">
            {/* The literal pointer arrow above it */}
            <div className="absolute -top-4 -left-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 22L9 15L2 13L22 2Z" fill="#0A3D31" />
              </svg>
            </div>
            <img src="https://i.pravatar.cc/100?img=33" className="w-8 h-8 rounded-full border border-white/20" alt="User" />
            <div className="text-left">
              <p className="text-[11px] font-bold text-white">David Park</p>
              <p className="text-[9px] text-[#79DA37]/80 font-medium">Talent Lead</p>
            </div>
          </div>

           {/* ─── CENTRAL OVERLAPPING CARD ─── */}
           <div className="absolute top-[48%] left-1/2 -translate-x-[45%] -translate-y-[60%] w-[210px] hidden md:block z-30">
            {/* Background stacked cards for depth effect */}
            <div className="absolute -bottom-3 left-3 right-3 h-full bg-white rounded-[20px] shadow-sm border border-gray-100" />
            <div className="absolute -bottom-1.5 left-1.5 right-1.5 h-full bg-gray-50 rounded-[20px] shadow-sm border border-gray-100" />
            
            {/* The main green card */}
            <div className="relative bg-[#1A5C4A] text-white p-4 rounded-[20px] shadow-[0_20px_40px_rgba(26,92,74,0.3)] text-left">
              <p className="text-[8px] text-[#79DA37] font-bold tracking-wider mb-1">TalentScore AI</p>
              <h3 className="text-[15px] font-bold leading-tight mb-2 tracking-tight">Senior Product Manager</h3>
              <p className="text-[9px] text-white/70 leading-relaxed mb-3">
                AI-scored 92/100 — Strong Hire. Excels in accountability,  communication, and financial awareness.
              </p>
              <div className="flex gap-1.5 mb-3">
                <span className="px-1.5 py-0.5 bg-[#79DA37] rounded text-[8px] text-[#1A5C4A] font-bold flex items-center gap-1">
                  <div className="w-[3px] h-[3px] bg-[#1A5C4A] rounded-full" /> Strong Hire
                </span>
                <span className="px-1.5 py-0.5 bg-white/10 rounded text-[8px] text-white font-medium flex items-center gap-1">
                  <div className="w-[3px] h-[3px] bg-white rounded-full" /> 92 / 100
                </span>
              </div>
              <div className="pt-2 border-t border-white/10">
                <p className="text-[13px] font-bold">Top Ranked</p>
                <p className="text-[8px] text-white/50">5 categories scored · Interview analyzed</p>
              </div>
            </div>
          </div>

        </section>

        {/* ─── BRANDS SECTION ─── */}
        <section className="relative z-20 max-w-[1440px] mx-auto mt-16 px-10">
          <div className="border-t border-b border-gray-100/80 py-10 relative">
            {/* Subtle vertical edge lines as seen in reference */}
            <div className="absolute top-[-20px] bottom-[-20px] left-6 w-px bg-gray-100/60" />
            <div className="absolute top-[-20px] bottom-[-20px] right-6 w-px bg-gray-100/60" />

            <div className="flex flex-wrap justify-between items-center px-12 grayscale brightness-0 opacity-[0.3] relative z-10">
              <span className="font-sans font-black text-xl tracking-tighter text-[#111]">RCK</span>
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Miro_logo.svg" alt="Miro" className="h-6 object-contain" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-[22px] object-contain" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-6 object-contain" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png" alt="Adobe" className="h-5 object-contain" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg" alt="Spotify" className="h-6 object-contain" />
              <span className="font-sans font-bold text-xl tracking-tighter text-[#111]">HSBC</span>
            </div>
          </div>
        </section>

        {/* ─── STATS & INTRO SECTION ─── */}
        <section className="py-32 max-w-[1440px] mx-auto px-10 relative">
          <div className="grid md:grid-cols-[1.5fr_1fr] gap-16 items-center">
            
            {/* Left Content */}
            <div className="pl-4">
              <span className="text-[#0A3D31] font-bold text-[16px] tracking-wide mb-6 block drop-shadow-sm">
                // How It Works //
              </span>
              <h2 className="text-[48px] md:text-[56px] leading-[1.05] font-bold tracking-[-0.03em] mb-12">
                <span className="text-[#111]">From Job Post To<br/>Ranked Results </span>
                <span className="text-gray-400">In One<br/>Simple Session</span>
              </h2>
              <p className="text-gray-400 font-medium mb-12 leading-relaxed text-[15px] max-w-[420px]">
                Upload your job description, tell us what matters most, upload resumes, and let AI score every candidate — no training needed.
              </p>
              <Link 
                href="/login"
                className="inline-flex px-8 py-3 rounded-[12px] bg-[#79DA37] text-[#111] font-bold text-[14px] hover:bg-[#6BC230] transition-all shadow-[0_4px_15px_rgba(121,218,55,0.2)]"
              >
                Get Started
              </Link>
            </div>

            {/* Right Stats with Green Brackets */}
            <div className="relative mt-8 md:mt-0 flex flex-col items-end right-8">
              
              {/* Massive soft green glow behind stats */}
              <div className="absolute top-1/2 right-[5%] -translate-y-1/2 w-[550px] h-[550px] bg-[#79DA37]/[0.12] blur-[100px] rounded-full pointer-events-none mix-blend-multiply" />

              <div className="space-y-12 relative z-10 w-full max-w-[380px]">
                
                {/* Stat block 1 */}
                <div className="relative py-12 px-10">
                  {/* The 4 custom corners using exact border thickness */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-[1.5px] border-l-[1.5px] border-[#79DA37]" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-[1.5px] border-r-[1.5px] border-[#79DA37]" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[1.5px] border-l-[1.5px] border-[#79DA37]" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[1.5px] border-r-[1.5px] border-[#79DA37]" />
                  
                  <h3 className="text-[44px] tracking-[-0.03em] font-bold mb-5 leading-none">
                    <span className="text-[#111]">10k+</span> <span className="text-gray-400">Candidates Scored</span>
                  </h3>
                  <p className="text-gray-400 font-medium text-[14px] leading-relaxed max-w-[300px]">
                    Resumes parsed, interviews transcribed, and candidates scored with AI-powered category breakdowns.
                  </p>
                </div>
                
                {/* Stat block 2 */}
                <div className="relative py-12 px-10">
                  {/* The 4 custom corners */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-[1.5px] border-l-[1.5px] border-[#79DA37]" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-[1.5px] border-r-[1.5px] border-[#79DA37]" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[1.5px] border-l-[1.5px] border-[#79DA37]" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[1.5px] border-r-[1.5px] border-[#79DA37]" />
                  
                  <h3 className="text-[34px] tracking-[-0.03em] font-bold mb-5 leading-none">
                    <span className="text-[#111]">95%</span> <span className="text-gray-400">Faster Decisions</span>
                  </h3>
                  <p className="text-gray-400 font-medium text-[13px] leading-relaxed max-w-[280px]">
                    Employers go from job post to ranked candidate shortlist in a single session — no spreadsheets, no guesswork.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </section>
        {/* ─── FEATURES SECTION ─── */}
        <section className="py-28 bg-[#FAFAFA] border-t border-gray-100" id="features">
          <div className="max-w-[1150px] mx-auto px-6">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-[#0A3D31] font-bold text-[16px] tracking-wide mb-6 block drop-shadow-sm">
                // Our Features //
              </span>
              <h2 className="text-[48px] md:text-[56px] leading-[1.05] tracking-[-0.03em] font-bold text-[#111]">
                Six Steps From Job Post <br/>
                To Ranked Results
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Feature 1 (Dark Theme) */}
              <div className="bg-[#0B3B24] rounded-[32px] p-8 shadow-[0_20px_40px_rgba(11,59,36,0.15)] relative overflow-hidden group min-h-[420px] flex flex-col">
                <div className="relative z-10 mb-8">
                  <h3 className="text-[20px] tracking-[-0.02em] font-bold text-white mb-3">Create a Role & Set Priorities</h3>
                  <p className="text-[13px] text-white/70 font-medium leading-relaxed pr-4">
                    Upload your job post and tell us what matters most — AI generates scoring categories instantly
                  </p>
                </div>
                
                {/* Mock Card UI */}
                <div className="relative mt-auto flex justify-center items-end bottom-[-20px] transition-transform duration-500 group-hover:-translate-y-2">
                  <div className="absolute inset-0 bg-black/10 rounded-t-[24px] blur-xl" />
                  
                  <div className="w-[85%] bg-[#1A5C4A] rounded-t-[20px] shadow-2xl overflow-hidden border-t border-l border-r border-white/10 z-10">
                    <div className="p-5">
                      <p className="text-[9px] text-[#79DA37] font-bold tracking-wider uppercase mb-1">TalentScore AI</p>
                      <h4 className="text-[17px] tracking-tight font-bold text-white mb-4 leading-tight">Senior Product<br/>Manager</h4>
                      <div className="w-full h-1.5 bg-white/20 rounded-full mb-3" />
                      <div className="w-[80%] h-1.5 bg-white/20 rounded-full mb-6" />
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-[#79DA37] text-[#103D27] rounded text-[9px] font-bold">● Strong Hire</span>
                        <span className="px-2 py-1 bg-white/10 text-white rounded text-[9px] font-medium opacity-80">● 92/100</span>
                      </div>
                    </div>
                    {/* White panel at bottom of green card */}
                    <div className="bg-white p-4">
                      <p className="text-[14px] font-bold text-[#111] leading-none mb-1">Top Ranked</p>
                      <p className="text-[9px] text-gray-500">5 categories scored · Interview analyzed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2 (Light Green Theme) */}
              <div className="bg-[#E4F9E9] rounded-[32px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] relative overflow-hidden group min-h-[420px] flex flex-col">
                <div className="relative z-10 mb-8">
                  <h3 className="text-[20px] tracking-[-0.02em] font-bold text-[#111] mb-3">Upload & Score Resumes</h3>
                  <p className="text-[13px] text-gray-600 font-medium leading-relaxed pr-2">
                    Batch upload resumes. AI extracts summaries, key strengths, and flags concerns per candidate.
                  </p>
                </div>
                
                {/* Mock UI elements stacked */}
                <div className="relative mt-auto h-[200px] flex items-center justify-center">
                  {/* Faded Background Elements */}
                  <div className="absolute top-4 w-[90%] h-14 bg-[#103D27]/5 rounded-xl blur-[1px]" />
                  <div className="absolute bottom-2 w-[80%] h-16 bg-[#103D27]/5 rounded-xl blur-[1px] -translate-x-4" />
                  
                  {/* Center Crisp Element */}
                  <div className="relative bg-white rounded-[16px] shadow-[0_15px_30px_rgba(0,0,0,0.06)] p-3 flex flex-col gap-3 transform group-hover:scale-105 transition-transform duration-500 w-[95%] border border-white/50 z-10">
                    <div className="flex items-center gap-3 w-full">
                      <img src="https://i.pravatar.cc/100?img=5" className="w-8 h-8 rounded-full border border-gray-100" alt="Candidate" />
                      <div>
                        <p className="text-[12px] font-bold text-[#111] tracking-tight">Sarah Mitchell</p>
                        <p className="text-[9px] text-gray-400 font-medium">Score: 92/100 | Strong Hire</p>
                      </div>
                      <div className="ml-auto text-gray-400 font-bold tracking-widest text-[10px]">...</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-6 px-2 flex items-center rounded-md bg-gray-50 border border-gray-100 shadow-sm text-[10px] font-bold text-gray-600 gap-1 content-center">
                        <FileText className="w-3 h-3" /> Resume
                      </span>
                      <span className="h-6 px-2 flex items-center rounded-md bg-[#E4F9E9] text-[#1F7A4D] text-[10px] font-bold">
                        👍 92/100
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 3 (White Theme) */}
              <div className="bg-white rounded-[32px] p-8 shadow-[0_15px_40px_rgba(0,0,0,0.05)] border border-gray-100 relative overflow-hidden group min-h-[420px] flex flex-col">
                <div className="relative z-10 mb-8">
                  <h3 className="text-[20px] tracking-[-0.02em] font-bold text-[#111] mb-3">AI Interview Scoring</h3>
                  <p className="text-[13px] text-gray-500 font-medium leading-relaxed">
                    Upload recordings or transcripts. AI scores each answer against your custom categories.
                  </p>
                </div>
                
                <div className="relative mt-auto h-[220px]">
                  {/* Grid background abstract shapes mimicking avatars */}
                  <div className="absolute bottom-[-10px] inset-x-0 grid grid-cols-3 gap-3 px-2 z-0">
                    <div className="h-24 bg-[#F2EDE8] rounded-2xl overflow-hidden shadow-inner"><img src="https://i.pravatar.cc/150?img=44" className="w-full h-full object-cover mix-blend-multiply opacity-80" /></div>
                    <div className="h-24 bg-[#E2F0D9] rounded-2xl overflow-hidden shadow-inner translate-y-4"><img src="https://i.pravatar.cc/150?img=12" className="w-full h-full object-cover mix-blend-multiply opacity-80" /></div>
                    <div className="h-24 bg-[#EBDDEA] rounded-2xl overflow-hidden shadow-inner -translate-y-4"><img src="https://i.pravatar.cc/150?img=68" className="w-full h-full object-cover mix-blend-multiply opacity-80" /></div>
                    <div className="h-20 bg-[#F4F4F4] rounded-2xl" />
                    <div className="h-20 bg-[#F4F4F4] rounded-2xl" />
                    <div className="h-20 bg-[#F4F4F4] rounded-2xl" />
                  </div>

                  {/* Chat Mockup overlay */}
                  <div className="absolute top-[20%] left-[-5%] right-[-5%] bg-[#0B3B24] text-white p-4 pb-3 rounded-[20px] rounded-br-sm shadow-[0_20px_40px_rgba(11,59,36,0.3)] transform group-hover:-translate-y-2 transition-transform duration-500 z-10 mx-2">
                    <p className="text-[11px] leading-relaxed mb-2 font-medium">Score: 92/100 — Strong communication and accountability. Recommended as Strong Hire.</p>
                    <p className="text-[9px] text-[#79DA37] text-right font-bold flex items-center justify-end gap-1">
                      13:00 <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                    </p>
                    {/* Tail of chat bubble */}
                    <div className="absolute -bottom-2 right-4 w-4 h-4 bg-[#0B3B24] rotate-45 transform origin-top-left z-0" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* ─── INTEGRATIONS SECTION ─── */}
        <section className="py-24 relative bg-white">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] h-[500px] bg-[radial-gradient(ellipse_at_bottom,rgba(121,218,55,0.1),transparent_70%)] pointer-events-none mix-blend-multiply" />
          
          <div className="max-w-[1440px] mx-auto px-10 text-center relative z-10">
            
            {/* Orbital Layout */}
            <div className="relative h-[250px] mb-6 flex items-end justify-center overflow-hidden">
              
              {/* Semi-circle dotted line */}
              <div className="absolute w-[1100px] h-[550px] border border-dashed border-gray-200 rounded-t-full bottom-[-10px] left-1/2 -translate-x-1/2 -z-10" />

              {/* Center Logo */}
              <div className="w-[88px] h-[88px] bg-[#103D27] rounded-3xl flex items-center justify-center shadow-[0_15px_40px_rgba(16,61,39,0.3)] absolute bottom-[-10px] border-[5px] border-white/50 z-20">
                <div className="w-8 h-8 bg-[#79DA37] rounded-[8px] transform rotate-45 border-[3.5px] border-[#103D27] shadow-inner flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-[#103D27] rounded-sm transform -rotate-45" />
                </div>
              </div>

              {/* Orbiting Icons */}
              {/* 1. Light Blue C */}
              <div className="absolute top-[160px] left-[15px] w-12 h-12 bg-[#E1EFFF] rounded-full flex items-center justify-center shadow-sm border-[4px] border-white">
                <div className="w-4 h-4 border-2 border-[#59AFFF] rounded-full border-t-transparent origin-center rotate-45 pt-0.5 pr-0.5 flex items-center justify-center">
                   <div className="w-1.5 h-1.5 bg-[#59AFFF] rounded-full" />
                </div>
              </div>
              {/* 2. Abstract Blue */}
              <div className="absolute top-[70px] left-[13%] w-[54px] h-[54px] bg-[#4F46E5] rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(79,70,229,0.2)] border-[4px] border-white">
                <div className="grid grid-cols-2 gap-0.5 w-5 h-5"><div className="bg-white rounded-tl-sm"/><div className="bg-white rounded-tr-full"/><div className="bg-white rounded-bl-full"/><div className="bg-white rounded-br-sm"/></div>
              </div>
              {/* 3. Zoom */}
              <div className="absolute top-[10px] left-[26%] w-[60px] h-[60px] bg-[#2D8CFF] rounded-full flex items-center justify-center shadow-[0_15px_30px_rgba(45,140,255,0.25)] border-[5px] border-white">
                <span className="text-white text-[12px] font-bold tracking-tight">zoom</span>
              </div>
              {/* 4. LinkedIn (Center Top) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[68px] h-[68px] bg-[#0077B5] rounded-full flex items-center justify-center shadow-[0_15px_35px_rgba(0,119,181,0.25)] border-[6px] border-white -translate-y-[18px]">
                <span className="text-white font-bold font-serif text-[24px]">in</span>
              </div>
              {/* 5. Green Oval (GreenHouse/Upwork style?) */}
              <div className="absolute top-[10px] right-[26%] w-[60px] h-[60px] bg-[#114F33] rounded-full flex items-center justify-center shadow-[0_15px_30px_rgba(17,79,51,0.25)] border-[5px] border-white">
                <div className="w-5 h-5 bg-[#79DA37] rounded-full flex items-center justify-center"><div className="w-2.5 h-2.5 bg-[#114F33] rounded-full"/></div>
              </div>
              {/* 6. Teams */}
              <div className="absolute top-[70px] right-[13%] w-[54px] h-[54px] bg-[#5B5FC7] rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(91,95,199,0.2)] border-[4px] border-white">
                <div className="text-white font-bold text-[20px] font-serif leading-none flex items-center">T<span className="text-[12px] -ml-0.5 pb-2">›</span></div>
              </div>
              {/* 7. HackerRank-ish Gray */}
              <div className="absolute top-[160px] right-[15px] w-14 h-14 bg-gray-100/90 rounded-full flex items-center justify-center shadow-sm border-[4px] border-white z-10 backdrop-blur-sm relative">
                <div className="flex font-black text-gray-400 text-lg tracking-tighter">H<span className="text-[#79DA37] ml-[1px]">|</span></div>
              </div>
            </div>

            <h2 className="text-[44px] leading-[1.05] font-bold text-[#111] mb-5 tracking-[-0.03em]">
              Connect With The <br />
              <span className="text-gray-400 font-medium">Tools Your Team Already Uses</span>
            </h2>
            <p className="text-gray-400 font-medium mb-10 max-w-[420px] mx-auto text-[14px] leading-relaxed">
              TalentScore integrates with your existing workflow — from calendar scheduling to communication platforms.
            </p>

            <Link 
              href="/login"
              className="inline-flex px-8 py-3 rounded-[12px] bg-[#79DA37] text-[#111] font-bold text-[14px] hover:bg-[#6BC230] transition-all shadow-[0_4px_15px_rgba(121,218,55,0.2)] pt-[13px]"
            >
              Get Started
            </Link>

          </div>
        </section>

        {/* ─── PRICING SECTION ─── */}
        <section className="py-24 bg-white border-t border-gray-100" id="pricing">
          <div className="max-w-[1000px] mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-[#0A3D31] font-bold text-[16px] tracking-wide mb-6 block drop-shadow-sm">
                // Our Pricing //
              </span>
              <h2 className="text-[48px] md:text-[56px] leading-[1.05] tracking-[-0.03em] font-bold text-[#111]">
                Simple Credit-Based <br/>
                <span className="text-gray-400 font-medium">Pay Per Candidate Pricing</span>
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {/* Starting Plan */}
              <div className="bg-white rounded-[24px] p-8 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden flex flex-col">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAFAFA] border border-gray-100 mb-8 w-max">
                  <div className="w-4 h-4 bg-[#E4F9E9] rounded-full flex items-center justify-center">
                     <ArrowRight className="w-2.5 h-2.5 text-[#0A3D31]" />
                  </div>
                  <span className="text-[12px] font-bold text-[#0A3D31] tracking-wide pr-1">Starting Plan</span>
                </div>
                <div className="mb-3">
                  <span className="text-[40px] tracking-[-0.03em] font-bold text-[#111]">$99 USD</span>
                  <span className="text-gray-400 font-medium text-[16px] ml-1">/Month</span>
                </div>
                <p className="text-[14px] text-gray-400 font-medium leading-relaxed mb-8 pr-4">
                  Includes 10 candidate evaluations. Perfect for small teams hiring for 1–2 roles at a time.
                </p>
                <Link href="/login" className="flex justify-center w-full py-4 rounded-full bg-[#111] text-white font-bold text-[14px] mb-8 hover:bg-black transition-all shadow-md">
                  SignUp Now
                </Link>
                
                <ul className="space-y-4">
                  {[
                    'Up to 10 candidate evaluations',
                    'AI resume parsing & scoring',
                    'Interview question generation',
                    'Audio transcription & analysis',
                    'Ranked results with audit trail'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[15px] text-[#111] font-medium">
                      <CheckCircle2 className="w-5 h-5 text-gray-300 stroke-[1.5]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-[#0B3B24] rounded-[24px] p-8 shadow-[0_20px_40px_rgba(11,59,36,0.15)] relative overflow-hidden flex flex-col border border-[#1A5C4A]">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1A5C4A] bg-[#0A3D31] mb-8 w-max">
                  <div className="w-4 h-4 bg-[#1A5C4A] rounded-full flex items-center justify-center">
                     <Layers className="w-2.5 h-2.5 text-[#79DA37]" />
                  </div>
                  <span className="text-[12px] font-bold text-[#79DA37] tracking-wide pr-1">Enterprise Plan</span>
                </div>
                <div className="mb-3">
                  <span className="text-[40px] tracking-[-0.03em] font-bold text-white">Custom</span>
                  <span className="text-white/60 font-medium text-[16px] ml-1">/Month</span>
                </div>
                <p className="text-[14px] text-white/60 font-medium leading-relaxed mb-8 pr-6">
                  Unlimited evaluations, multi-department pipelines, dedicated SLA, and priority support.
                </p>
                <Link href="/login" className="flex justify-center w-full py-4 rounded-full bg-[#79DA37] text-[#111] font-bold text-[14px] mb-8 hover:bg-[#6BC230] transition-all shadow-[0_4px_15px_rgba(121,218,55,0.2)]">
                  SignUp Now
                </Link>
                
                <ul className="space-y-4">
                  {[
                    'Everything in Starter Plan',
                    'Unlimited candidate evaluations',
                    'Multi-department org structure',
                    'Compliance safeguards & audit logs',
                    'Dedicated onboarding & SLA'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[15px] text-white/90 font-medium">
                      <CheckCircle2 className="w-5 h-5 text-[#79DA37] stroke-[1.5]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Simplify Recruitment Banner */}
            <div className="bg-[#FAFBF9] rounded-[24px] overflow-hidden flex flex-col md:flex-row shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-[#79DA37]/10 min-h-[180px]">
              
              {/* Gradient bg section */}
              <div className="w-full md:w-[50%] p-8 relative bg-[radial-gradient(ellipse_at_top_right,rgba(121,218,55,0.15),transparent_70%)] flex flex-col justify-center">
                <div className="absolute inset-0 bg-[#E4F9E9]/10 pointer-events-none" />
                <div className="relative z-10">
                  <h3 className="text-[22px] tracking-tight font-bold text-[#111] leading-[1.2] mb-3">
                    Turn Hiring From Guesswork <br/> Into <span className="text-gray-400">Structured Decisions</span>
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium leading-relaxed mb-6 max-w-[280px]">
                    Upload a job post, describe what matters, upload resumes, and get a clear ranked shortlist — all in one session
                  </p>
                  <Link 
                    href="/login"
                    className="inline-flex px-6 py-2 rounded-lg bg-[#79DA37] text-[#111] font-bold text-[12px] shadow-[0_4px_15px_rgba(121,218,55,0.2)] hover:bg-[#6BC230] transition-all w-max"
                  >
                    Start Free Trial
                  </Link>
                </div>
              </div>

              {/* Floating UI side */}
              <div className="w-full md:w-[50%] relative py-8 px-4 flex items-center justify-center">
                {/* Background faint grid */}
                <div className="absolute inset-0 grid grid-cols-5 grid-rows-3 gap-2 opacity-[0.03] p-4 pointer-events-none">
                  {[...Array(15)].map((_, i) => <div key={i} className="bg-black rounded-lg" />)}
                </div>
                
                {/* Stack of candidate cards */}
                <div className="relative w-full max-w-[340px] h-[160px] z-10">
                  <div className="absolute top-0 right-2 left-6 bg-white shadow-md border border-gray-100 rounded-2xl p-3.5 flex items-center gap-4 translate-y-0">
                    <img src="https://i.pravatar.cc/100?img=5" className="w-9 h-9 rounded-full" alt="User" />
                    <div><p className="text-[12px] font-bold text-[#111]">Sarah Mitchell</p><p className="text-[10px] text-gray-400 font-medium">Score: 92 · Strong Hire</p></div><div className="ml-auto text-gray-400 font-bold tracking-widest text-[12px]">...</div>
                  </div>
                  
                  <div className="absolute top-[48px] right-2 left-2 bg-[#103D27] shadow-xl border border-[#1A5C4A] rounded-2xl p-3.5 flex items-center gap-4 transform scale-[1.02] z-20">
                    <img src="https://i.pravatar.cc/100?img=11" className="w-9 h-9 rounded-full border border-white/20" alt="User" />
                    <div><p className="text-[12px] font-bold text-white">James Chen</p><p className="text-[10px] text-[#79DA37]/80 font-medium">Score: 87 · Strong Hire</p></div><div className="ml-auto text-white font-bold tracking-widest text-[12px]">...</div>
                  </div>

                  <div className="absolute bottom-0 right-4 left-6 bg-white shadow-md border border-gray-100 rounded-2xl p-3.5 flex items-center gap-4 translate-y-0 relative z-10">
                    <img src="https://i.pravatar.cc/100?img=12" className="w-9 h-9 rounded-full" alt="User" />
                    <div><p className="text-[12px] font-bold text-[#111]">David Park</p><p className="text-[10px] text-gray-400 font-medium">Score: 74 · Consider</p></div><div className="ml-auto text-gray-400 font-bold tracking-widest text-[12px]">...</div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

      </main>

      {/* ─── FOOTER ─── */}
      <footer className="bg-[#FAFBF9] border-t border-gray-100" id="footer">
        <div className="max-w-[1440px] mx-auto px-10 pt-10 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#79DA37] flex items-center justify-center shadow-sm">
                  <div className="w-3.5 h-3.5 bg-white rounded-sm rotate-45 transform" />
                </div>
                <span className="font-bold text-xl tracking-tight text-[#111]">TalentScore</span>
              </div>
              <p className="text-gray-400 text-[13px] font-medium mb-8 max-w-[200px] leading-relaxed">
                AI-powered hiring intelligence.<br />
                From job post to ranked results.
              </p>
              
              <div className="flex items-center gap-2 max-w-xs bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-1.5 focus-within:border-[#79DA37] transition-colors">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 bg-transparent px-3 py-2 text-[13px] outline-none placeholder:text-gray-300 font-medium text-[#111]"
                />
                <button className="px-4 py-2 rounded-lg bg-[#79DA37] text-[#111] font-bold text-[12px] shadow-[0_2px_10px_rgba(121,218,55,0.2)] hover:bg-[#6BC230] transition-colors">
                  Subscribe
                </button>
              </div>
            </div>

            <div className="col-span-1 md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8 md:pl-16">
              <div>
                <h4 className="font-bold text-[#111] text-[15px] mb-6">Navigation</h4>
                <ul className="space-y-4">
                  <li><Link href="/" className="text-gray-400 hover:text-[#111] text-[14px] font-medium transition-colors">Home</Link></li>
                  <li><Link href="#pricing" className="text-gray-400 hover:text-[#111] text-[14px] font-medium transition-colors">Pricing</Link></li>
                  <li><Link href="#features" className="text-gray-400 hover:text-[#111] text-[14px] font-medium transition-colors">How It Works</Link></li>
                  <li><Link href="#integrations" className="text-gray-400 hover:text-[#111] text-[14px] font-medium transition-colors">Integrations</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-[#111] text-[14px] font-medium transition-colors">Security</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#111] text-[15px] mb-6">Features</h4>
                <ul className="space-y-4">
                  <li><Link href="#" className="text-gray-400 hover:text-[#111] text-[14px] font-medium transition-colors">Role Setup</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-[#111] text-[14px] font-medium transition-colors">Resume Parsing</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-[#111] text-[14px] font-medium transition-colors">Interview Scoring</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-[#111] text-[14px] font-medium transition-colors">Candidate Ranking</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-[#111] text-[14px] font-medium transition-colors">Audit Trail</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-[#111] text-[15px] mb-6">Support</h4>
                <ul className="space-y-4">
                  <li><Link href="#" className="text-gray-400 hover:text-[#111] text-[14px] font-medium transition-colors">FAQ</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-[#111] text-[14px] font-medium transition-colors">Articles</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-[#111] text-[14px] font-medium transition-colors">Community</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-[#111] text-[14px] font-medium transition-colors">Help Center</Link></li>
                </ul>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-center border-t border-gray-100">
            <p className="text-gray-400 text-[13px] font-medium">
              ©2026 TalentScore. All Rights Reserved <span className="mx-1">|</span> <Link href="#" className="hover:text-[#111] transition-colors">Terms of Use</Link> <span className="mx-1">|</span> <Link href="#" className="hover:text-[#111] transition-colors">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </footer>

      {/* Global CSS overrides specifically for the landing page animations */}
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
