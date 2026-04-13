'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api';
import {
  ArrowLeft, Loader2, CheckCircle, AlertTriangle, XCircle,
  Quote, TrendingUp, TrendingDown, Shield, MessageCircle
} from 'lucide-react';

export default function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCandidate();
  }, [id]);

  const loadCandidate = async () => {
    try {
      const { candidate: c } = await api.getCandidate(id);
      setCandidate(c);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'var(--score-excellent)';
    if (score >= 6) return 'var(--score-good)';
    if (score >= 4) return 'var(--score-average)';
    return 'var(--score-poor)';
  };

  const getLabelClass = (label: string) => {
    switch (label) {
      case 'Strong Hire': return 'badge-success';
      case 'Consider': return 'badge-warning';
      case 'Risky': return 'badge-danger';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--accent-primary)' }} />
      </div>
    );
  }

  if (!candidate) return <p>Candidate not found</p>;

  const scores = candidate.scores || {};
  const categories = scores.categories || [];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Back + Header */}
      <button
        className="text-sm flex items-center gap-1 mb-4 hover:underline"
        style={{ color: 'var(--text-muted)' }}
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Results
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{candidate.name}</h1>
          {candidate.email && (
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{candidate.email}</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold" style={{ color: getScoreColor(scores.overallScore || 0) }}>
            {scores.overallScore?.toFixed(1) || '—'}
          </p>
          {scores.label && (
            <span className={`badge ${getLabelClass(scores.label)} mt-1`}>
              {scores.label}
            </span>
          )}
        </div>
      </div>

      {/* Executive Summary */}
      {scores.executiveSummary && (
        <div className="card-glow p-6 mb-6">
          <h2 className="text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Executive Summary
          </h2>
          <p className="text-sm leading-relaxed">{scores.executiveSummary}</p>
        </div>
      )}

      {/* Score Breakdown */}
      {categories.length > 0 && (
        <div className="space-y-3 mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Score Breakdown
          </h2>
          {categories.map((cat: any, i: number) => (
            <div key={i} className="card p-5 animate-slide-in" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{cat.categoryName}</h3>
                <div className="flex items-center gap-3">
                  <div className="score-bar w-24">
                    <div
                      className="score-bar-fill"
                      style={{
                        width: `${(cat.score || 0) * 10}%`,
                        background: getScoreColor(cat.score || 0),
                      }}
                    />
                  </div>
                  <span className="text-xl font-bold w-8 text-right" style={{ color: getScoreColor(cat.score || 0) }}>
                    {cat.score}
                  </span>
                </div>
              </div>

              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                {cat.explanation}
              </p>

              {/* Signals */}
              <div className="space-y-2">
                {cat.signals?.strengths?.map((s: string, j: number) => (
                  <div key={`s-${j}`} className="flex items-start gap-2 text-xs">
                    <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--success)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{s}</span>
                  </div>
                ))}
                {cat.signals?.risks?.map((r: string, j: number) => (
                  <div key={`r-${j}`} className="flex items-start gap-2 text-xs">
                    <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--warning)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{r}</span>
                  </div>
                ))}
                {cat.signals?.quotes?.map((q: string, j: number) => (
                  <div key={`q-${j}`} className="flex items-start gap-2 text-xs mt-2 pl-3 border-l-2" style={{ borderColor: 'var(--border-primary)' }}>
                    <Quote className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent-primary)' }} />
                    <span className="italic" style={{ color: 'var(--text-muted)' }}>{q}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Strengths & Concerns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {scores.topStrengths?.length > 0 && (
          <div className="card p-5">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--success)' }}>
              <TrendingUp className="w-4 h-4" />
              Key Strengths
            </h3>
            <ul className="space-y-2">
              {scores.topStrengths.map((s: string, i: number) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--success)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {scores.topConcerns?.length > 0 && (
          <div className="card p-5">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--warning)' }}>
              <TrendingDown className="w-4 h-4" />
              Concerns
            </h3>
            <ul className="space-y-2">
              {scores.topConcerns.map((c: string, i: number) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--warning)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Past Problem Match */}
      {scores.pastProblemMatch && (
        <div className="card p-5 mb-6" style={{
          background: scores.pastProblemMatch.detected ? 'var(--danger-bg)' : 'var(--success-bg)',
          borderColor: scores.pastProblemMatch.detected ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)',
        }}>
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2" style={{
            color: scores.pastProblemMatch.detected ? 'var(--danger)' : 'var(--success)',
          }}>
            <Shield className="w-4 h-4" />
            Past Problem Match
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {scores.pastProblemMatch.details}
          </p>
        </div>
      )}

      {/* Interviewer Feedback */}
      {scores.interviewerFeedback?.length > 0 && (
        <div className="card p-5 mb-6">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--info)' }}>
            <MessageCircle className="w-4 h-4" />
            Interviewer Feedback
          </h3>
          <div className="space-y-3">
            {scores.interviewerFeedback.map((fb: any, i: number) => (
              <div key={i} className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{fb.issue}</p>
                {fb.suggestion && (
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    💡 {fb.suggestion}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resume Info */}
      {candidate.resume?.processingStatus === 'done' && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Resume Analysis
          </h3>
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            {candidate.resume.summary}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-semibold mb-1" style={{ color: 'var(--success)' }}>Strengths</p>
              <ul className="space-y-1">
                {candidate.resume.strengths?.map((s: string, i: number) => (
                  <li key={i} className="text-xs" style={{ color: 'var(--text-secondary)' }}>• {s}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold mb-1" style={{ color: 'var(--warning)' }}>Concerns</p>
              <ul className="space-y-1">
                {candidate.resume.concerns?.map((c: string, i: number) => (
                  <li key={i} className="text-xs" style={{ color: 'var(--text-secondary)' }}>• {c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
