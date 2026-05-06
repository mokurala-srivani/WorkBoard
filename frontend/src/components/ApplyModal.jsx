import { useState } from 'react';

import {
  X,
  CheckCircle
} from 'lucide-react';

import toast from 'react-hot-toast';

import { api } from '../api';

export default function ApplyModal({
  job,
  onClose
}) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    cover_letter: ''
  });

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState('');

  const set = (k, v) =>
    setForm(f => ({
      ...f,
      [k]: v
    }));

  const submit = async () => {
    if (
      !form.name ||
      !form.email ||
      !form.cover_letter
    ) {
      setError(
        'Please fill in all fields.'
      );

      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.applyJob(job.id, form);

      toast.success(
        'Application submitted!'
      );

      setSuccess(true);
    } catch {
      toast.error(
        'Something went wrong'
      );

      setError(
        'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={e =>
        e.target === e.currentTarget &&
        onClose()
      }
    >
      <div className="modal">
        {success ? (
          <div
            style={{
              textAlign: 'center',
              padding: '20px 0'
            }}
          >
            <CheckCircle
              size={48}
              color="var(--green)"
              style={{
                margin:
                  '0 auto 16px'
              }}
            />

            <h2
              style={{
                marginBottom: 8
              }}
            >
              Application Sent!
            </h2>

            <p
              style={{
                color:
                  'var(--text-muted)',
                marginBottom: 24
              }}
            >
              We've received your
              application for{' '}
              <strong>
                {job.title}
              </strong>{' '}
              at {job.company}.
            </p>

            <button
              className="btn btn-primary"
              onClick={onClose}
            >
              Back to Jobs
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',
                alignItems:
                  'flex-start',
                marginBottom: 4
              }}
            >
              <h2>Apply Now</h2>

              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  color:
                    'var(--text-muted)',
                  padding: 4
                }}
              >
                <X size={20} />
              </button>
            </div>

            <p className="modal-sub">
              {job.title} ·{' '}
              {job.company}
            </p>

            {error && (
              <div
                className="error-banner"
                style={{
                  marginBottom: 20
                }}
              >
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                Full Name
              </label>

              <input
                className="form-input"
                placeholder="Jane Smith"
                value={form.name}
                onChange={e =>
                  set(
                    'name',
                    e.target.value
                  )
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Email Address
              </label>

              <input
                className="form-input"
                type="email"
                placeholder="jane@example.com"
                value={form.email}
                onChange={e =>
                  set(
                    'email',
                    e.target.value
                  )
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Cover Letter
              </label>

              <textarea
                className="form-textarea"
                placeholder="Tell us why you're a great fit..."
                value={
                  form.cover_letter
                }
                onChange={e =>
                  set(
                    'cover_letter',
                    e.target.value
                  )
                }
                style={{
                  minHeight: 150
                }}
              />
            </div>

            <button
              className="apply-btn"
              onClick={submit}
              disabled={loading}
            >
              {loading ? (
                <span
                  className="spinner"
                  style={{
                    margin:
                      '0 auto'
                  }}
                />
              ) : (
                'Submit Application'
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}