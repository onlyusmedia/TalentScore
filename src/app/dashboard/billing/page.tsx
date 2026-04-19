'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useStore } from '@/lib/store';
import {
  CreditCard, Check, Zap, Crown, Building, ArrowRight,
  Clock, FileText, Loader2, BarChart3
} from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Free Trial',
    price: 0,
    credits: 3,
    icon: Zap,
    features: ['3 candidate evaluations', 'All scoring categories', 'Resume analysis', 'Basic questions'],
    highlight: false,
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 49,
    credits: 25,
    icon: CreditCard,
    features: ['25 evaluations/month', 'Custom scoring categories', 'Interview question generation', 'Priority support'],
    highlight: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 149,
    credits: 100,
    icon: Crown,
    features: ['100 evaluations/month', 'Everything in Starter', 'Audio transcription', 'Interviewer feedback', 'Bulk uploads'],
    highlight: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 499,
    credits: 500,
    icon: Building,
    features: ['500 evaluations/month', 'Everything in Professional', 'Team accounts', 'API access', 'Custom AI training'],
    highlight: false,
  },
];

export default function BillingPage() {
  const { user, credits, loadCredits } = useStore();
  const [loading, setLoading] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    loadCredits();
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const { records } = await api.getUsageHistory();
      setHistory(records);
    } catch {
      // silent fail
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free' || planId === user?.plan?.type) return;
    setLoading(planId);

    try {
      const res = await api.fetch<any>('/api/billing/create-checkout', {
        method: 'POST',
        body: { planType: planId },
      });

      if (res.demoMode) {
        toast.success(res.message);
        loadCredits();
      } else if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">Billing & Credits</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>
        Manage your plan and track credit usage
      </p>

      {/* Current Usage */}
      {credits && (
        <div className="card-glow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Current Plan</p>
              <p className="text-2xl font-bold capitalize mt-1">{credits.plan || 'Free'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Credits Remaining</p>
              <p className="text-3xl font-bold mt-1" style={{
                color: credits.creditsRemaining <= 2 ? 'var(--color-warning)' : 'var(--color-success)',
              }}>
                {credits.creditsRemaining}
                <span className="text-lg font-normal" style={{ color: 'var(--color-text-muted)' }}>
                  /{credits.creditsIncluded}
                </span>
              </p>
            </div>
          </div>
          <div className="mt-4 score-bar" style={{ height: '8px' }}>
            <div
              className="score-bar-fill"
              style={{
                width: `${Math.min(100, (credits.creditsUsed / credits.creditsIncluded) * 100)}%`,
                background: credits.creditsRemaining <= 2 ? 'var(--color-warning)' : 'var(--color-accent)',
              }}
            />
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
            {credits.creditsUsed} of {credits.creditsIncluded} credits used this billing cycle
            {credits.billingCycleEnd && ` · Resets ${new Date(credits.billingCycleEnd).toLocaleDateString()}`}
          </p>
        </div>
      )}

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {plans.map((plan) => {
          const isCurrent = user?.plan?.type === plan.id;

          return (
            <div
              key={plan.id}
              className={`card p-6 relative ${plan.highlight ? 'ring-2 ring-[#79DA37]/50' : ''}`}
              style={plan.highlight ? { background: 'linear-gradient(145deg, rgba(121,218,55,0.06), rgba(10,61,49,0.03))' } : {}}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold" style={{ background: 'var(--color-accent)', color: 'white' }}>
                  Most Popular
                </div>
              )}

              <plan.icon className="w-6 h-6 mb-3" style={{ color: plan.highlight ? 'var(--color-accent)' : 'var(--color-text-secondary)' }} />

              <h3 className="text-lg font-bold">{plan.name}</h3>

              <div className="flex items-baseline gap-1 my-3">
                <span className="text-3xl font-bold">${plan.price}</span>
                {plan.price > 0 && <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>/month</span>}
              </div>

              <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                {plan.credits} evaluations{plan.price > 0 ? '/month' : ' total'}
              </p>

              <ul className="space-y-2 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-success)' }} />
                    {f}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <button className="btn-secondary w-full text-sm" disabled>Current Plan</button>
              ) : plan.id === 'free' ? (
                <button className="btn-secondary w-full text-sm" disabled>Default</button>
              ) : (
                <button
                  className={`w-full text-sm flex items-center justify-center gap-2 ${plan.highlight ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={loading === plan.id}
                >
                  {loading === plan.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>Upgrade <ArrowRight className="w-3.5 h-3.5" /></>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Usage History */}
      <div className="card p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
          Usage History
        </h2>

        {historyLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--color-accent)' }} />
          </div>
        ) : history.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
            No usage records yet. Credits are deducted when candidates are scored.
          </p>
        ) : (
          <div className="space-y-2">
            {history.map((record: any) => (
              <div key={record._id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--color-bg-secondary)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(121,218,55,0.1)' }}>
                    <FileText className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{record.candidateId?.name || 'Candidate'}</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {record.roleId?.title || 'Role'} · {record.action}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-warning)' }}>
                    -{record.credits} credit{record.credits !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    <Clock className="w-3 h-3 inline mr-1" />
                    {new Date(record.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
