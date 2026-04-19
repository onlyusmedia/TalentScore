'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useJobPoller } from '@/hooks/useSSE';
import {
  Upload, Users, FileText, BarChart3, MessageSquare, Loader2,
  Check, AlertCircle, X, Trash2, Plus, Mic, Play, ArrowRight
} from 'lucide-react';

export default function RoleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [role, setRole] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [showInterviewModal, setShowInterviewModal] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  // Poll for active job completion
  useJobPoller(activeJobId, () => {
    loadData();
    setActiveJobId(null);
  });

  const loadData = async () => {
    try {
      const [roleRes, candRes] = await Promise.all([
        api.getRole(id),
        api.getCandidates(id),
      ]);
      setRole(roleRes.role);
      setCandidates(candRes.candidates);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileDrop = useCallback(async (files: FileList) => {
    setUploading(true);
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    for (const file of Array.from(files)) {
      if (!validTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
        toast.error(`${file.name}: Unsupported format. Use PDF or DOCX.`);
        continue;
      }

      try {
        // 1. Upload to S3
        toast.loading(`Uploading ${file.name}...`, { id: `upload-${file.name}` });
        const s3Key = await api.uploadFileToS3(file, 'resumes', id);
        
        // 2. Add Candidate with real S3 key
        const { candidate, jobId } = await api.addCandidate(id, {
          s3Key,
          fileName: file.name,
          fileType: file.name.split('.').pop() as any,
        });

        setCandidates((prev) => [candidate, ...prev]);
        setActiveJobId(jobId);
        toast.success(`${file.name} uploaded — processing resume...`, { id: `upload-${file.name}` });
      } catch (err: any) {
        toast.error(`${file.name}: ${err.message}`, { id: `upload-${file.name}` });
      }
    }
    setUploading(false);
  }, [id]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFileDrop(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) handleFileDrop(e.dataTransfer.files);
  };

  const handleDeleteCandidate = async (candId: string) => {
    if (!confirm('Remove this candidate?')) return;
    try {
      await api.deleteCandidate(candId);
      setCandidates(candidates.filter((c) => c._id !== candId));
      toast.success('Candidate removed');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleUploadInterview = async (candidateId: string, audioFile?: File) => {
    if (!transcript.trim() && !audioFile) {
      toast.error('Please enter a transcript or upload an audio file');
      return;
    }

    try {
      setUploading(true);
      let audioS3Key = undefined;

      if (audioFile) {
        toast.loading(`Uploading ${audioFile.name}...`, { id: 'upload-interview' });
        audioS3Key = await api.uploadFileToS3(audioFile, 'audio', id);
        toast.success('Interview audio uploaded', { id: 'upload-interview' });
      }

      const { jobId } = await api.uploadInterview(candidateId, { 
        transcript: transcript.trim() || undefined,
        audioS3Key 
      });

      setActiveJobId(jobId);
      setShowInterviewModal(null);
      setTranscript('');
      toast.success('Interview submitted — processing...');
    } catch (err: any) {
      toast.error(err.message, { id: 'upload-interview' });
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    try {
      const { jobId } = await api.generateQuestions(id);
      setActiveJobId(jobId);
      toast.success('Generating interview questions...');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleScoreCandidates = async () => {
    try {
      const { jobId } = await api.scoreCandidates(id);
      setActiveJobId(jobId);
      toast.success('Scoring candidates...');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <Check className="w-4 h-4" style={{ color: 'var(--success)' }} />;
      case 'pending':
      case 'processing': return <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--warning)' }} />;
      case 'failed': return <AlertCircle className="w-4 h-4" style={{ color: 'var(--danger)' }} />;
      default: return <div className="w-4 h-4 rounded-full" style={{ background: 'var(--border-primary)' }} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--accent-primary)' }} />
      </div>
    );
  }

  if (!role) return <p>Role not found</p>;

  const processedCandidates = candidates.filter((c) => c.resume?.processingStatus === 'done');

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{role.title}</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {candidates.length} candidates · {role.scoringCategories?.length || 0} scoring categories
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="btn-secondary text-sm flex items-center gap-2"
            onClick={handleGenerateQuestions}
            disabled={processedCandidates.length === 0}
          >
            <MessageSquare className="w-4 h-4" />
            Generate Questions
          </button>
          <button
            className="btn-secondary text-sm flex items-center gap-2"
            onClick={() => router.push(`/dashboard/roles/${id}/questions`)}
          >
            <FileText className="w-4 h-4" />
            View Questions
          </button>
          <button
            className="btn-primary text-sm flex items-center gap-2"
            onClick={handleScoreCandidates}
            disabled={processedCandidates.length === 0}
          >
            <BarChart3 className="w-4 h-4" />
            Score & Rank All
          </button>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        className={`card p-8 text-center mb-6 cursor-pointer transition-all border-dashed ${dragOver ? 'border-[#79DA37] bg-[#79DA37]/5' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input id="file-input" type="file" multiple accept=".pdf,.docx" className="hidden" onChange={handleFileInput} />
        {uploading ? (
          <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin" style={{ color: 'var(--accent-primary)' }} />
        ) : (
          <Upload className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
        )}
        <p className="font-medium mb-1">Drop resumes here or click to upload</p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>PDF, DOCX — up to 10 files</p>
      </div>

      {/* Candidates List */}
      <div className="space-y-3 stagger-children">
        {candidates.map((cand) => (
          <div key={cand._id} className="card p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  {getStatusIcon(cand.resume?.processingStatus)}
                  <h3 className="font-semibold">{cand.name || cand.resume?.fileName || 'Processing...'}</h3>
                  {cand.scores?.label && (
                    <span className={`badge text-xs ${cand.scores.label === 'Strong Hire' ? 'badge-success' : cand.scores.label === 'Consider' ? 'badge-warning' : 'badge-danger'}`}>
                      {cand.scores.label}
                    </span>
                  )}
                </div>

                {cand.resume?.processingStatus === 'done' && (
                  <>
                    <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                      {cand.resume.summary}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                      {cand.resume.strengths?.slice(0, 2).map((s: string, i: number) => (
                        <span key={i} className="flex items-center gap-1">
                          <span style={{ color: 'var(--success)' }}>✓</span> {s}
                        </span>
                      ))}
                      {cand.resume.concerns?.slice(0, 1).map((c: string, i: number) => (
                        <span key={i} className="flex items-center gap-1">
                          <span style={{ color: 'var(--warning)' }}>⚠</span> {c}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                {cand.resume?.processingStatus === 'processing' && (
                  <p className="text-sm" style={{ color: 'var(--warning)' }}>Processing resume...</p>
                )}

                {/* Status row */}
                <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span className="flex items-center gap-1">
                    Resume: {getStatusIcon(cand.resume?.processingStatus)}
                  </span>
                  <span className="flex items-center gap-1">
                    Interview: {getStatusIcon(cand.interview?.processingStatus)}
                  </span>
                  <span className="flex items-center gap-1">
                    Scoring: {getStatusIcon(cand.scores?.processingStatus)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 ml-4">
                <button
                  className="btn-secondary text-xs py-1.5 px-3"
                  onClick={() => setShowInterviewModal(cand._id)}
                >
                  Upload Interview
                </button>
                <button
                  className="btn-secondary text-xs py-1.5 px-3"
                  onClick={() => router.push(`/dashboard/candidates/${cand._id}`)}
                >
                  Detail
                </button>
                <button
                  className="p-1.5 rounded-lg hover:bg-red-500/10"
                  onClick={() => handleDeleteCandidate(cand._id)}
                >
                  <Trash2 className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {candidates.length === 0 && (
          <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
            <Users className="w-10 h-10 mx-auto mb-3" />
            <p>No candidates yet. Upload resumes above to get started.</p>
          </div>
        )}
      </div>

      {/* View Results button */}
      {candidates.some((c) => c.scores?.processingStatus === 'done') && (
        <button
          className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
          onClick={() => router.push(`/dashboard/roles/${id}/results`)}
        >
          <BarChart3 className="w-4 h-4" />
          View Ranked Results
          <ArrowRight className="w-4 h-4" />
        </button>
      )}

      {/* Interview Upload Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowInterviewModal(null)}>
          <div className="card p-6 w-full max-w-lg mx-4 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upload Interview</h3>
              <button onClick={() => setShowInterviewModal(null)}>
                <X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Paste Transcript</label>
                <textarea
                  className="textarea-field"
                  style={{ minHeight: '120px' }}
                  placeholder="Paste the interview transcript here..."
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px" style={{ background: 'var(--border-primary)' }} />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>OR</span>
                <div className="flex-1 h-px" style={{ background: 'var(--border-primary)' }} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Upload Audio/Video</label>
                <div 
                  className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                  style={{ borderColor: 'var(--border-primary)' }}
                  onClick={() => document.getElementById('audio-input')?.click()}
                >
                  <input 
                    id="audio-input" 
                    type="file" 
                    accept="audio/*,video/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadInterview(showInterviewModal, file);
                    }}
                  />
                  <Mic className="w-5 h-5 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Click to upload recording (.mp3, .wav, .mp4, etc.)</p>
                </div>
              </div>

              <button
                className="btn-primary w-full"
                onClick={() => handleUploadInterview(showInterviewModal)}
                disabled={!transcript.trim() || uploading}
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2 inline" /> : null}
                Process Transcript
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
