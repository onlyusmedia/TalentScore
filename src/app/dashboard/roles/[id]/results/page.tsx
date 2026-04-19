'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Loader2, ArrowLeft, Trophy, AlertTriangle, TrendingUp, ChevronRight } from 'lucide-react';

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, [id]);

  const loadResults = async () => {
    try {
      const data = await api.getResults(id);
      setResults(data);
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
      case 'Strong Hire': return 'label-strong-hire';
      case 'Consider': return 'label-consider';
      case 'Risky': return 'label-risky';
      default: return 'badge';
    }
  };

  const getLabelEmoji = (label: string) => {
    switch (label) {
      case 'Strong Hire': return '🟢';
      case 'Consider': return '🟡';
      case 'Risky': return '🔴';
      default: return '⚪';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--accent-primary)' }} />
      </div>
    );
  }

  if (!results) return <p>No results found</p>;

  const scoredCandidates = results.candidates.filter((c: any) => c.scoringComplete);
  const allCategories = scoredCandidates[0]?.categories?.map((c: any) => c.name) || [];

  // Find risk alerts
  const riskAlerts = scoredCandidates
    .filter((c: any) => c.label === 'Risky')
    .map((c: any) => ({
      name: c.name,
      summary: c.executiveSummary,
    }));

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            className="text-sm flex items-center gap-1 mb-2 hover:underline"
            style={{ color: 'var(--text-muted)' }}
            onClick={() => router.push(`/dashboard/roles/${id}`)}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Role
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Trophy className="w-6 h-6" style={{ color: 'var(--warning)' }} />
            Candidate Rankings
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {results.role.title} · {results.totalCandidates} candidates
          </p>
        </div>
      </div>

      {/* Risk Alerts */}
      {riskAlerts.length > 0 && (
        <div className="p-4 rounded-xl mb-6" style={{ background: 'var(--danger-bg)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4" style={{ color: 'var(--danger)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--danger)' }}>Risk Alerts</span>
          </div>
          {riskAlerts.map((alert: any, i: number) => (
            <p key={i} className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              <strong>{alert.name}:</strong> {alert.summary}
            </p>
          ))}
        </div>
      )}

      {/* Rankings Table */}
      {scoredCandidates.length > 0 ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                  <th className="text-left py-4 px-5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Rank
                  </th>
                  <th className="text-left py-4 px-5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Candidate
                  </th>
                  {allCategories.map((cat: string) => (
                    <th key={cat} className="text-center py-4 px-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      {cat.length > 12 ? cat.substring(0, 12) + '…' : cat}
                    </th>
                  ))}
                  <th className="text-center py-4 px-5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Overall
                  </th>
                  <th className="text-center py-4 px-5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Label
                  </th>
                  <th className="py-4 px-3"></th>
                </tr>
              </thead>
              <tbody>
                {scoredCandidates.map((cand: any, idx: number) => (
                  <tr
                    key={cand._id}
                    className="cursor-pointer transition-colors hover:bg-gray-50"
                    style={{ borderBottom: '1px solid var(--border-primary)' }}
                    onClick={() => router.push(`/dashboard/candidates/${cand._id}`)}
                  >
                    <td className="py-4 px-5">
                      <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold" style={{
                        background: idx === 0 ? 'var(--gradient-primary)' : 'var(--bg-secondary)',
                        color: idx === 0 ? 'white' : 'var(--text-muted)',
                      }}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <p className="font-semibold text-sm">{cand.name}</p>
                      {!cand.interviewProcessed && (
                        <span className="text-xs" style={{ color: 'var(--warning)' }}>No interview</span>
                      )}
                    </td>
                    {allCategories.map((catName: string) => {
                      const catScore = cand.categories?.find((c: any) => c.name === catName);
                      const score = catScore?.score || 0;
                      return (
                        <td key={catName} className="py-4 px-3 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-sm font-bold" style={{ color: getScoreColor(score) }}>
                              {score}
                            </span>
                            <div className="score-bar w-12">
                              <div
                                className="score-bar-fill"
                                style={{
                                  width: `${score * 10}%`,
                                  background: getScoreColor(score),
                                }}
                              />
                            </div>
                          </div>
                        </td>
                      );
                    })}
                    <td className="py-4 px-5 text-center">
                      <span className="text-lg font-bold" style={{ color: getScoreColor(cand.overallScore) }}>
                        {cand.overallScore?.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className={`badge ${getLabelClass(cand.label)}`}>
                        {getLabelEmoji(cand.label)} {cand.label}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card-glow p-12 text-center">
          <TrendingUp className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <h3 className="text-lg font-semibold mb-2">No scored candidates yet</h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Upload resumes and run scoring to see the ranking table.
          </p>
        </div>
      )}

      {/* Unscored candidates */}
      {results.candidates.filter((c: any) => !c.scoringComplete).length > 0 && (
        <div className="mt-4 p-4 rounded-xl" style={{ background: 'var(--bg-card)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {results.candidates.filter((c: any) => !c.scoringComplete).length} candidates not yet scored
          </p>
        </div>
      )}
    </div>
  );
}
