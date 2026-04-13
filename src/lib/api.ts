const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface FetchOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('talentscore_token');
  }

  async fetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${this.baseUrl}${path}`, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || error.message || `HTTP ${res.status}`);
    }

    return res.json();
  }

  // ── Auth ──────────────────────────────────────────
  async register(data: { email: string; password: string; name: string; company?: string }) {
    return this.fetch<{ user: any; token: string }>('/api/auth/register', { method: 'POST', body: data });
  }

  async login(data: { email: string; password: string }) {
    return this.fetch<{ user: any; token: string }>('/api/auth/login', { method: 'POST', body: data });
  }

  async getProfile() {
    return this.fetch<{ user: any }>('/api/auth/me');
  }

  // ── Roles ─────────────────────────────────────────
  async createRole(data: any) {
    return this.fetch<{ role: any; jobId: string; message: string }>('/api/roles', { method: 'POST', body: data });
  }

  async getRoles() {
    return this.fetch<{ roles: any[] }>('/api/roles');
  }

  async getRole(id: string) {
    return this.fetch<{ role: any }>(`/api/roles/${id}`);
  }

  async updateRole(id: string, data: any) {
    return this.fetch<{ role: any }>(`/api/roles/${id}`, { method: 'PATCH', body: data });
  }

  async deleteRole(id: string) {
    return this.fetch<{ message: string }>(`/api/roles/${id}`, { method: 'DELETE' });
  }

  async generateQuestions(roleId: string) {
    return this.fetch<{ jobId: string; message: string }>(`/api/roles/${roleId}/generate-questions`, { method: 'POST' });
  }

  async scoreCandidates(roleId: string) {
    return this.fetch<{ jobId: string; message: string }>(`/api/roles/${roleId}/score-candidates`, { method: 'POST' });
  }

  async getResults(roleId: string) {
    return this.fetch<{ role: any; candidates: any[]; totalCandidates: number }>(`/api/roles/${roleId}/results`);
  }

  async getQuestions(roleId: string) {
    return this.fetch<{ role: any; candidates: any[] }>(`/api/roles/${roleId}/questions`);
  }

  // ── Candidates ────────────────────────────────────
  async addCandidate(roleId: string, data: { s3Key: string; fileName: string; fileType?: string }) {
    return this.fetch<{ candidate: any; jobId: string }>(`/api/roles/${roleId}/candidates`, { method: 'POST', body: data });
  }

  async getCandidates(roleId: string) {
    return this.fetch<{ candidates: any[] }>(`/api/roles/${roleId}/candidates`);
  }

  async getCandidate(id: string) {
    return this.fetch<{ candidate: any }>(`/api/candidates/${id}`);
  }

  async deleteCandidate(id: string) {
    return this.fetch<{ message: string }>(`/api/candidates/${id}`, { method: 'DELETE' });
  }

  async uploadInterview(candidateId: string, data: { audioS3Key?: string; videoS3Key?: string; transcript?: string }) {
    return this.fetch<{ jobId: string; message: string }>(`/api/candidates/${candidateId}/interview`, { method: 'POST', body: data });
  }

  // ── Files ─────────────────────────────────────────
  async getPresignedUploadUrl(data: { fileName: string; contentType: string; category: string; roleId?: string }) {
    return this.fetch<{ uploadUrl: string; s3Key: string }>('/api/upload/presigned-url', { method: 'POST', body: data });
  }

  async getPresignedDownloadUrl(s3Key: string) {
    return this.fetch<{ downloadUrl: string }>('/api/upload/presigned-download', { method: 'POST', body: { s3Key } });
  }

  // ── Jobs ──────────────────────────────────────────
  async getJob(id: string) {
    return this.fetch<{ job: any }>(`/api/jobs/${id}`);
  }

  async getActiveJobs() {
    return this.fetch<{ jobs: any[] }>('/api/jobs/active');
  }

  // ── Billing ───────────────────────────────────────
  async getUsage() {
    return this.fetch<any>('/api/billing/usage');
  }

  async getUsageHistory() {
    return this.fetch<{ records: any[] }>('/api/billing/history');
  }

  // ── S3 Direct Upload ──────────────────────────────
  async uploadFileToS3(file: File, category: string, roleId?: string): Promise<string> {
    // 1. Get presigned URL
    const { uploadUrl, s3Key } = await this.getPresignedUploadUrl({
      fileName: file.name,
      contentType: file.type,
      category,
      roleId,
    });

    // 2. Upload directly to S3
    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    });

    if (!uploadRes.ok) {
      throw new Error('Failed to upload file to S3');
    }

    return s3Key;
  }
}

export const api = new ApiClient(API_BASE);
export default api;
