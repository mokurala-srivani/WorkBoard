import { useState } from 'react';
import { CheckCircle, Plus } from 'lucide-react';
import { api } from '../api';

const CATEGORIES = ['Engineering', 'Design', 'Marketing', 'Data', 'Finance', 'Content', 'Operations', 'Sales'];
const TYPES = ['full-time', 'part-time', 'contract', 'remote'];

export default function PostJobPage({ navigate }) {
  const [form, setForm] = useState({
    title: '', company: '', location: '', type: 'full-time',
    category: 'Engineering', salary_min: 80000, salary_max: 120000,
    description: '', requirements: [''], featured: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const setReq = (i, v) => {
    const reqs = [...form.requirements];
    reqs[i] = v;
    setForm(f => ({ ...f, requirements: reqs }));
  };

  const addReq = () => setForm(f => ({ ...f, requirements: [...f.requirements, ''] }));
  const removeReq = (i) => setForm(f => ({ ...f, requirements: f.requirements.filter((_, idx) => idx !== i) }));

  const submit = async () => {
    const { title, company, location, description } = form;
    if (!title || !company || !location || !description) {
      setError('Please fill in all required fields.');
      return;
    }
    const reqs = form.requirements.filter(r => r.trim());
    if (reqs.length === 0) {
      setError('Please add at least one requirement.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.createJob({ ...form, requirements: reqs });
      setSuccess(true);
    } catch {
      setError('Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="container">
      <div className="post-page" style={{ textAlign: 'center' }}>
        <CheckCircle size={64} color="var(--green)" style={{ margin: '0 auto 24px', display: 'block' }} />
        <h1 style={{ marginBottom: 12 }}>Job Posted!</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>
          Your listing for <strong>{form.title}</strong> at {form.company} is now live.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => navigate('jobs')}>Browse Jobs</button>
          <button className="btn btn-ghost" onClick={() => { setSuccess(false); setForm({ title: '', company: '', location: '', type: 'full-time', category: 'Engineering', salary_min: 80000, salary_max: 120000, description: '', requirements: [''], featured: false }); }}>
            Post Another
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container">
      <div className="post-page">
        <h1>Post a Job</h1>
        <p className="sub">Reach thousands of qualified candidates in minutes.</p>

        {error && <div className="error-banner" style={{ marginBottom: 24 }}>{error}</div>}

        <div className="post-form">
          {/* Basic Info */}
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Basic Information</div>

          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Job Title *</label>
              <input className="form-input" placeholder="Senior Engineer" value={form.title} onChange={e => set('title', e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Company *</label>
              <input className="form-input" placeholder="Acme Corp" value={form.company} onChange={e => set('company', e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Location *</label>
              <input className="form-input" placeholder="New York, NY or Remote" value={form.location} onChange={e => set('location', e.target.value)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Job Type</label>
              <select className="form-select" value={form.type} onChange={e => set('type', e.target.value)}>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Featured Listing</label>
              <select className="form-select" value={form.featured} onChange={e => set('featured', e.target.value === 'true')}>
                <option value="false">Standard</option>
                <option value="true">⚡ Featured (+visibility)</option>
              </select>
            </div>
          </div>

          <hr className="section-divider" />
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Compensation</div>

          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Min Salary (USD/yr)</label>
              <input className="form-input" type="number" step="5000" value={form.salary_min} onChange={e => set('salary_min', parseInt(e.target.value))} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Max Salary (USD/yr)</label>
              <input className="form-input" type="number" step="5000" value={form.salary_max} onChange={e => set('salary_max', parseInt(e.target.value))} />
            </div>
          </div>

          <hr className="section-divider" />
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Job Details</div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Description *</label>
            <textarea className="form-textarea" style={{ minHeight: 140 }} placeholder="Describe the role, team, and impact..." value={form.description} onChange={e => set('description', e.target.value)} />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Requirements</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {form.requirements.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 8 }}>
                  <input className="form-input" style={{ flex: 1 }} placeholder={`Requirement ${i + 1}`} value={r} onChange={e => setReq(i, e.target.value)} />
                  {form.requirements.length > 1 && (
                    <button onClick={() => removeReq(i)} style={{ background: 'var(--border)', borderRadius: 8, width: 40, color: 'var(--text-muted)', fontSize: 18 }}>×</button>
                  )}
                </div>
              ))}
              <button className="btn btn-ghost" style={{ alignSelf: 'flex-start' }} onClick={addReq}>
                <Plus size={14} /> Add Requirement
              </button>
            </div>
          </div>

          <hr className="section-divider" />

          <button className="apply-btn" onClick={submit} disabled={loading} style={{ marginTop: 0 }}>
            {loading ? <span className="spinner" style={{ margin: '0 auto' }} /> : '🚀 Publish Job Listing'}
          </button>
        </div>
      </div>
    </div>
  );
}
