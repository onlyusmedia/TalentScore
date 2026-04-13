'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useStore } from '@/lib/store';
import { User, Lock, Bell, Shield, Save, Loader2, Eye, EyeOff } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useStore();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    company: '',
  });

  const [password, setPassword] = useState({
    current: '',
    newPassword: '',
    confirm: '',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    interviewerFeedback: true,
    autoScoreOnUpload: false,
  });

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name || '', email: user.email || '', company: user.company || '' });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await api.fetch('/api/auth/profile', { method: 'PATCH', body: { name: profile.name, company: profile.company } });
      toast.success('Profile updated');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (password.newPassword !== password.confirm) {
      return toast.error('Passwords don\'t match');
    }
    if (password.newPassword.length < 8) {
      return toast.error('Password must be at least 8 characters');
    }
    setLoading(true);
    try {
      await api.fetch('/api/auth/change-password', {
        method: 'POST',
        body: { currentPassword: password.current, newPassword: password.newPassword },
      });
      toast.success('Password changed');
      setPassword({ current: '', newPassword: '', confirm: '' });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: Bell },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">Settings</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>
        Manage your account and preferences
      </p>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-8 p-1 rounded-xl" style={{ background: 'var(--color-bg-secondary)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{
              background: activeTab === tab.id ? 'var(--color-bg-card)' : 'transparent',
              color: activeTab === tab.id ? 'var(--color-text-main)' : 'var(--color-text-muted)',
              boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.3)' : 'none',
            }}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="card p-6 max-w-2xl">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <User className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
            Personal Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Full Name</label>
              <input className="input-field" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Email</label>
              <input className="input-field" value={profile.email} disabled style={{ opacity: 0.6 }} />
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>Email cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Company</label>
              <input className="input-field" value={profile.company} onChange={(e) => setProfile({ ...profile, company: e.target.value })} placeholder="Your company name" />
            </div>
          </div>

          <button className="btn-primary mt-6 flex items-center gap-2" onClick={handleSaveProfile} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="card p-6 max-w-2xl">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
            Change Password
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Current Password</label>
              <div className="relative">
                <input className="input-field pr-10" type={showPassword ? 'text' : 'password'} value={password.current} onChange={(e) => setPassword({ ...password, current: e.target.value })} />
                <button className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} /> : <Eye className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>New Password</label>
              <input className="input-field" type="password" value={password.newPassword} onChange={(e) => setPassword({ ...password, newPassword: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Confirm New Password</label>
              <input className="input-field" type="password" value={password.confirm} onChange={(e) => setPassword({ ...password, confirm: e.target.value })} />
            </div>
          </div>

          <button className="btn-primary mt-6 flex items-center gap-2" onClick={handleChangePassword} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            Update Password
          </button>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="card p-6 max-w-2xl">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
            Notifications & AI Preferences
          </h2>

          <div className="space-y-5">
            {/* Interviewer Feedback Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--color-bg-secondary)' }}>
              <div>
                <p className="font-medium text-sm">Interviewer Feedback</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  AI generates feedback for the interviewer on areas they should have probed deeper
                </p>
              </div>
              <button
                onClick={() => setPreferences({ ...preferences, interviewerFeedback: !preferences.interviewerFeedback })}
                className="relative w-11 h-6 rounded-full transition-colors"
                style={{ background: preferences.interviewerFeedback ? 'var(--color-accent)' : 'var(--color-border-main)' }}
              >
                <span
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform"
                  style={{ transform: preferences.interviewerFeedback ? 'translateX(20px)' : 'translateX(0)' }}
                />
              </button>
            </div>

            {/* Email Notifications Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--color-bg-secondary)' }}>
              <div>
                <p className="font-medium text-sm">Email Notifications</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  Get notified when AI scoring and analysis are complete
                </p>
              </div>
              <button
                onClick={() => setPreferences({ ...preferences, emailNotifications: !preferences.emailNotifications })}
                className="relative w-11 h-6 rounded-full transition-colors"
                style={{ background: preferences.emailNotifications ? 'var(--color-accent)' : 'var(--color-border-main)' }}
              >
                <span
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform"
                  style={{ transform: preferences.emailNotifications ? 'translateX(20px)' : 'translateX(0)' }}
                />
              </button>
            </div>

            {/* Auto Score Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--color-bg-secondary)' }}>
              <div>
                <p className="font-medium text-sm">Auto-Score on Upload</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  Automatically score candidates when their resume and interview are both uploaded
                </p>
              </div>
              <button
                onClick={() => setPreferences({ ...preferences, autoScoreOnUpload: !preferences.autoScoreOnUpload })}
                className="relative w-11 h-6 rounded-full transition-colors"
                style={{ background: preferences.autoScoreOnUpload ? 'var(--color-accent)' : 'var(--color-border-main)' }}
              >
                <span
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform"
                  style={{ transform: preferences.autoScoreOnUpload ? 'translateX(20px)' : 'translateX(0)' }}
                />
              </button>
            </div>
          </div>

          <button className="btn-primary mt-6 flex items-center gap-2" onClick={() => toast.success('Preferences saved')}>
            <Save className="w-4 h-4" />
            Save Preferences
          </button>
        </div>
      )}
    </div>
  );
}
