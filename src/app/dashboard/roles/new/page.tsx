'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { useJobPoller } from '@/hooks/useSSE';
import {
  ArrowLeft, ArrowRight, FileText, Mic, MicOff, Play, Square,
  Check, Loader2, Sparkles, AlertTriangle, Plus, Trash2, Edit3, ChevronDown
} from 'lucide-react';

type Step = 'job' | 'priorities' | 'review' | 'processing' | 'results';

export default function NewRolePage() {
  const router = useRouter();

  // Form state
  const [step, setStep] = useState<Step>('job');
  const [title, setTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [payMin, setPayMin] = useState('');
  const [payMax, setPayMax] = useState('');
  const [priorities, setPriorities] = useState('');
  const [stdQuestions, setStdQuestions] = useState(5);
  const [customQuestions, setCustomQuestions] = useState(3);

  // Processing state
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [roleId, setRoleId] = useState<string | null>(null);
  const [roleData, setRoleData] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<number | null>(null);

  // Voice recorder
  const recorder = useVoiceRecorder();

  // Poll for job completion
  useJobPoller(jobId, async (job) => {
    if (job.status === 'done' && roleId) {
      try {
        const { role } = await api.getRole(roleId);
        setRoleData(role);
        setStep('results');
      } catch {
        toast.error('Failed to load results');
      }
    } else if (job.status === 'failed') {
      toast.error('AI processing failed. Please try again.');
      setStep('review');
    }
    setJobId(null);
  });

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read text from file (simplified — real implementation would use backend parsing)
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setJobDescription(text);
      toast.success('Job description loaded from file');
    };
    reader.readAsText(file);
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setStep('processing');

    try {
      const payRange = payMin && payMax ? {
        min: parseInt(payMin),
        max: parseInt(payMax),
        currency: 'USD',
      } : undefined;

      const { role, jobId: jId } = await api.createRole({
        title,
        jobDescription,
        payRange,
        priorities,
        interviewConfig: {
          standardQuestionCount: stdQuestions,
          customQuestionCount: customQuestions,
        },
      });

      setRoleId(role._id);
      setJobId(jId);
      toast.success('Role created! AI is working on it...');
    } catch (err: any) {
      toast.error(err.message);
      setStep('review');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategories = async () => {
    if (!roleId || !roleData) return;
    try {
      await api.updateRole(roleId, {
        scoringCategories: roleData.scoringCategories,
      });
      toast.success('Categories saved');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const removeCategory = (index: number) => {
    const updated = { ...roleData };
    updated.scoringCategories = updated.scoringCategories.filter((_: any, i: number) => i !== index);
    setRoleData(updated);
  };

  const addCategory = () => {
    const updated = { ...roleData };
    updated.scoringCategories = [
      ...updated.scoringCategories,
      { name: 'New Category', description: 'Describe what this measures', weight: 1, isCustom: true },
    ];
    setRoleData(updated);
    setEditingCategory(updated.scoringCategories.length - 1);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-8 no-print">
        {(['job', 'priorities', 'review', 'results'] as const).map((s, i) => {
          const labels = ['Job Post', 'Priorities', 'Review', 'Results'];
          const stepOrder = ['job', 'priorities', 'review', 'processing', 'results'];
          const currentIdx = stepOrder.indexOf(step);
          const thisIdx = i;
          const isActive = step === s || (s === 'results' && step === 'processing');
          const isDone = currentIdx > thisIdx;

          return (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all"
                  style={{
                    background: isDone ? 'var(--success)' : isActive ? 'var(--accent-primary)' : 'var(--bg-card)',
                    border: `1px solid ${isDone ? 'var(--success)' : isActive ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
                    color: isDone || isActive ? 'white' : 'var(--text-muted)',
                  }}
                >
                  {isDone ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className="text-sm font-medium hidden sm:block"
                  style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {labels[i]}
                </span>
              </div>
              {i < 3 && (
                <div className="flex-1 h-px" style={{ background: isDone ? 'var(--success)' : 'var(--border-primary)' }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1: Job Description */}
      {step === 'job' && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold mb-2">Job Description</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Paste or upload the job description. This is the foundation for everything.
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Role Title *</label>
              <input
                className="input-field"
                placeholder="e.g. Senior Account Manager"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Job Description *</label>
              <textarea
                className="textarea-field"
                style={{ minHeight: '200px' }}
                placeholder="Paste the full job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <div className="mt-2">
                <label className="btn-secondary text-sm cursor-pointer inline-flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Upload File (.txt, .pdf, .docx)
                  <input type="file" accept=".txt,.pdf,.docx" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Min Pay <span style={{ color: 'var(--text-muted)' }}>(optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-muted)' }}>$</span>
                  <input
                    className="input-field pl-7"
                    type="number"
                    placeholder="80000"
                    value={payMin}
                    onChange={(e) => setPayMin(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Max Pay <span style={{ color: 'var(--text-muted)' }}>(optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-muted)' }}>$</span>
                  <input
                    className="input-field pl-7"
                    type="number"
                    placeholder="120000"
                    value={payMax}
                    onChange={(e) => setPayMax(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              className="btn-primary flex items-center gap-2"
              disabled={!title || !jobDescription}
              onClick={() => setStep('priorities')}
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Priorities */}
      {step === 'priorities' && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold mb-2">What Matters Most</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Tell us what you really care about. Past hiring issues, behavioral expectations, hidden requirements — the things that don't go in the job post.
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Type your priorities</label>
              <textarea
                className="textarea-field"
                style={{ minHeight: '160px' }}
                placeholder={`Examples:\n• "I need someone who understands margins"\n• "Past hires were too passive with clients"\n• "I don't want someone who avoids accountability"\n• "Must be able to work independently without hand-holding"`}
                value={priorities}
                onChange={(e) => setPriorities(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px" style={{ background: 'var(--border-primary)' }} />
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>OR RECORD VOICE</span>
              <div className="flex-1 h-px" style={{ background: 'var(--border-primary)' }} />
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-4">
                {!recorder.isRecording && !recorder.audioUrl && (
                  <button
                    className="btn-primary flex items-center gap-2"
                    onClick={recorder.start}
                  >
                    <Mic className="w-4 h-4" />
                    Record Voice
                  </button>
                )}

                {recorder.isRecording && (
                  <>
                    <button
                      className="btn-danger flex items-center gap-2 animate-pulse-glow"
                      onClick={recorder.stop}
                    >
                      <Square className="w-4 h-4" />
                      Stop Recording
                    </button>
                    <span className="text-sm font-mono" style={{ color: 'var(--danger)' }}>
                      ● {Math.floor(recorder.duration / 60)}:{String(recorder.duration % 60).padStart(2, '0')}
                    </span>
                  </>
                )}

                {recorder.audioUrl && !recorder.isRecording && (
                  <div className="flex items-center gap-3">
                    <audio src={recorder.audioUrl} controls className="h-8" />
                    <button className="btn-secondary text-sm" onClick={recorder.reset}>
                      <Trash2 className="w-3.5 h-3.5 inline mr-1" />
                      Re-record
                    </button>
                    <span className="badge-success badge">Recorded</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button className="btn-secondary flex items-center gap-2" onClick={() => setStep('job')}>
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              className="btn-primary flex items-center gap-2"
              onClick={() => setStep('review')}
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 'review' && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold mb-2">Review & Generate</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            Confirm your inputs. AI will generate scoring categories and an improved job post.
          </p>

          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Role</h3>
              <p className="font-semibold text-lg">{title}</p>
            </div>

            <div className="card p-5">
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Job Description</h3>
              <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-primary)', maxHeight: '120px', overflow: 'hidden' }}>
                {jobDescription.substring(0, 300)}...
              </p>
            </div>

            {(payMin || payMax) && (
              <div className="card p-5">
                <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Pay Range</h3>
                <p>${parseInt(payMin || '0').toLocaleString()} – ${parseInt(payMax || '0').toLocaleString()}</p>
              </div>
            )}

            {priorities && (
              <div className="card p-5">
                <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Priorities</h3>
                <p className="text-sm whitespace-pre-wrap">{priorities}</p>
              </div>
            )}

            <div className="card p-5">
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>Interview Config</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Standard Questions</label>
                  <select
                    className="input-field mt-1"
                    value={stdQuestions}
                    onChange={(e) => setStdQuestions(parseInt(e.target.value))}
                  >
                    {[3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Custom Questions per Candidate</label>
                  <select
                    className="input-field mt-1"
                    value={customQuestions}
                    onChange={(e) => setCustomQuestions(parseInt(e.target.value))}
                  >
                    {[2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button className="btn-secondary flex items-center gap-2" onClick={() => setStep('priorities')}>
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button className="btn-primary flex items-center gap-2" onClick={handleSubmit} disabled={loading}>
              <Sparkles className="w-4 h-4" />
              Create Role & Generate
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Processing */}
      {step === 'processing' && (
        <div className="animate-fade-in text-center py-16">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse-glow" style={{ background: 'var(--gradient-primary)' }}>
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3">AI is working...</h2>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
            Analyzing your job post, generating scoring categories, and preparing market feedback.
          </p>

          <div className="max-w-sm mx-auto space-y-3">
            {[
              { label: 'Improving job post', done: false },
              { label: 'Generating scoring categories', done: false },
              { label: 'Market feedback', done: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)' }}>
                <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--accent-primary)' }} />
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 5: Results */}
      {step === 'results' && roleData && (
        <div className="animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--success-bg)' }}>
              <Check className="w-5 h-5" style={{ color: 'var(--success)' }} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Role Setup Complete</h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Review the AI-generated outputs below</p>
            </div>
          </div>

          {/* Improved Job Post */}
          <div className="card p-6 mb-5">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--accent-primary)' }}>
              <FileText className="w-4 h-4" />
              Improved Job Post
            </h3>
            <div className="text-sm whitespace-pre-wrap p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
              {roleData.improvedJobDescription}
            </div>
          </div>

          {/* Scoring Categories */}
          <div className="card p-6 mb-5">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--accent-primary)' }}>
              <Sparkles className="w-4 h-4" />
              Scoring Categories
            </h3>
            <div className="space-y-2">
              {roleData.scoringCategories?.map((cat: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="flex-1">
                    {editingCategory === i ? (
                      <input
                        className="input-field py-1 text-sm"
                        value={cat.name}
                        onChange={(e) => {
                          const updated = { ...roleData };
                          updated.scoringCategories[i].name = e.target.value;
                          setRoleData(updated);
                        }}
                        onBlur={() => setEditingCategory(null)}
                        autoFocus
                      />
                    ) : (
                      <>
                        <p className="font-medium text-sm">{cat.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{cat.description}</p>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      className="p-1.5 rounded-lg hover:bg-white/5"
                      onClick={() => setEditingCategory(i)}
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                    </button>
                    <button
                      className="p-1.5 rounded-lg hover:bg-red-500/10"
                      onClick={() => removeCategory(i)}
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                    </button>
                  </div>
                </div>
              ))}
              <button
                className="w-full p-3 rounded-xl border border-dashed text-sm font-medium flex items-center justify-center gap-2 transition-colors hover:border-indigo-500/30"
                style={{ borderColor: 'var(--border-primary)', color: 'var(--text-secondary)' }}
                onClick={addCategory}
              >
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </div>
            <button className="btn-secondary text-sm mt-3" onClick={handleSaveCategories}>
              Save Changes
            </button>
          </div>

          {/* Market Feedback */}
          {roleData.marketFeedback?.warnings?.length > 0 && (
            <div className="card p-6 mb-5">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--warning)' }}>
                <AlertTriangle className="w-4 h-4" />
                Market Feedback
              </h3>
              <div className="space-y-2">
                {roleData.marketFeedback.warnings.map((w: string, i: number) => (
                  <p key={i} className="text-sm flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <span>•</span> {w}
                  </p>
                ))}
              </div>
              {roleData.marketFeedback.salaryRange && (
                <p className="text-sm mt-3" style={{ color: 'var(--text-secondary)' }}>
                  Market range: ${roleData.marketFeedback.salaryRange.min?.toLocaleString()} – ${roleData.marketFeedback.salaryRange.max?.toLocaleString()}
                </p>
              )}
            </div>
          )}

          <button
            className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
            onClick={() => router.push(`/dashboard/roles/${roleId}`)}
          >
            Continue to Candidates
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
