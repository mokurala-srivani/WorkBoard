const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
  async getJobs(params = {}) {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '' && v !== 'All') q.set(k, v); });
    const res = await fetch(`${BASE}/api/jobs?${q}`);
    return res.json();
  },
  async getJob(id) {
    const res = await fetch(`${BASE}/api/jobs/${id}`);
    if (!res.ok) throw new Error('Job not found');
    return res.json();
  },
  async createJob(data) {
    const res = await fetch(`${BASE}/api/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create job');
    return res.json();
  },
  async getStats() {
    const res = await fetch(`${BASE}/api/stats`);
    return res.json();
  },
  async getCategories() {
    const res = await fetch(`${BASE}/api/categories`);
    return res.json();
  },
  async applyJob(jobId, data) {
    const res = await fetch(`${BASE}/api/jobs/${jobId}/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, job_id: jobId }),
    });
    if (!res.ok) throw new Error('Failed to submit application');
    return res.json();
  },
};

export const fmt = {
  salary: (min, max) => {
    const f = n => n >= 1000 ? `$${(n/1000).toFixed(0)}k` : `$${n}`;
    return `${f(min)} – ${f(max)}`;
  },
  date: (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now - d) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff}d ago`;
    if (diff < 30) return `${Math.floor(diff/7)}w ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  },
};
