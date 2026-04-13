'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Plus, Users, BarChart3, ChevronRight, Briefcase, Clock, Trash2, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const { roles } = await api.getRoles();
      setRoles(roles);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this role and all its data?')) return;
    try {
      await api.deleteRole(id);
      setRoles(roles.filter((r) => r._id !== id));
      toast.success('Role deleted');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'var(--success)';
      case 'setup': return 'var(--warning)';
      case 'closed': return 'var(--text-muted)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your hiring roles and candidates</p>
        </div>
        <button
          className="btn-primary flex items-center gap-2"
          onClick={() => router.push('/dashboard/roles/new')}
        >
          <Plus className="w-4 h-4" />
          Create New Role
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card-glow p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--info-bg)' }}>
              <Briefcase className="w-4 h-4" style={{ color: 'var(--info)' }} />
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Active Roles</span>
          </div>
          <p className="text-3xl font-bold">{roles.filter((r) => r.status === 'active').length}</p>
        </div>
        <div className="card-glow p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--success-bg)' }}>
              <Users className="w-4 h-4" style={{ color: 'var(--success)' }} />
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Total Candidates</span>
          </div>
          <p className="text-3xl font-bold">{roles.reduce((a, r) => a + (r.candidateCount || 0), 0)}</p>
        </div>
        <div className="card-glow p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
              <BarChart3 className="w-4 h-4" style={{ color: 'var(--accent-secondary)' }} />
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Roles Scored</span>
          </div>
          <p className="text-3xl font-bold">{roles.filter((r) => r.status === 'active').length}</p>
        </div>
      </div>

      {/* Roles List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--accent-primary)' }} />
        </div>
      ) : roles.length === 0 ? (
        <div className="card-glow p-12 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--bg-secondary)' }}>
            <Briefcase className="w-7 h-7" style={{ color: 'var(--text-muted)' }} />
          </div>
          <h3 className="text-lg font-semibold mb-2">No roles yet</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Create your first role to start evaluating candidates with AI.</p>
          <button className="btn-primary" onClick={() => router.push('/dashboard/roles/new')}>
            <Plus className="w-4 h-4 inline mr-2" />
            Create Your First Role
          </button>
        </div>
      ) : (
        <div className="space-y-3 stagger-children">
          {roles.map((role) => (
            <div
              key={role._id}
              className="card p-5 cursor-pointer group hover:border-indigo-500/30"
              onClick={() => router.push(`/dashboard/roles/${role._id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1.5">
                    <h3 className="text-lg font-semibold group-hover:text-indigo-400 transition-colors">
                      {role.title}
                    </h3>
                    <span className="badge text-xs" style={{
                      background: `${getStatusColor(role.status)}15`,
                      color: getStatusColor(role.status),
                    }}>
                      <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ background: getStatusColor(role.status) }} />
                      {role.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      {role.candidateCount || 0} candidates
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(role.createdAt).toLocaleDateString()}
                    </span>
                    {role.payRange?.min && (
                      <span>${(role.payRange.min / 1000).toFixed(0)}k – ${(role.payRange.max / 1000).toFixed(0)}k</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="p-2 rounded-lg transition-colors hover:bg-red-500/10"
                    onClick={(e) => handleDelete(role._id, e)}
                    title="Delete role"
                  >
                    <Trash2 className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  </button>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" style={{ color: 'var(--text-muted)' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
