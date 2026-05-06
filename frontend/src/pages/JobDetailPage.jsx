import {
  useState,
  useEffect
} from 'react';

import {
  ArrowLeft,
  MapPin,
  Clock,
  Briefcase,
  Calendar,
  ExternalLink,
  Sparkles
} from 'lucide-react';

import {
  api,
  fmt
} from '../api';

import ApplyModal from '../components/ApplyModal';

export default function JobDetailPage({
  jobId,
  navigate
}) {
  const [job, setJob] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [applyOpen,
    setApplyOpen
  ] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadJob =
      async () => {
        try {
          const data =
            await api.getJob(
              jobId
            );

          if (mounted) {
            setJob(data);
            setLoading(false);
          }
        } catch (err) {
          console.error(err);

          if (mounted) {
            navigate('jobs');
          }
        }
      };

    loadJob();

    return () => {
      mounted = false;
    };
  }, [jobId, navigate]);

  if (loading) {
    return (
      <div className="container">
        <div className="loader-wrap">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="container">
      <button
        className="back-btn"
        onClick={() =>
          navigate('jobs')
        }
      >
        <ArrowLeft size={16} />

        Back to Jobs
      </button>

      <div className="detail-layout">
        {/* LEFT */}
        <div className="detail-main fade-up">
          <div className="detail-header">
            <div className="detail-company-row">
              <div
                className="detail-logo"
              >
                <img
                  src={`https://logo.clearbit.com/${job.company.toLowerCase()}.com`}
                  alt={job.company}
                />
              </div>

              <div>
                <div className="company-name">
                  {job.company}
                </div>

                <h1 className="detail-title">
                  {job.title}
                </h1>

                <div className="ai-match">
                  <Sparkles
                    size={14}
                  />

                  96% AI Match
                </div>
              </div>
            </div>

            {job.featured && (
              <div className="featured-badge">
                ⚡ Featured
                Position
              </div>
            )}

            <div className="detail-meta">
              <span className="meta-chip">
                <MapPin
                  size={14}
                />

                {job.location}
              </span>

              <span className="meta-chip">
                <Briefcase
                  size={14}
                />

                {job.type}
              </span>

              <span className="meta-chip">
                <Clock
                  size={14}
                />

                {job.category}
              </span>

              <span className="meta-chip">
                <Calendar
                  size={14}
                />

                Posted{' '}
                {fmt.date(
                  job.posted_at
                )}
              </span>
            </div>
          </div>

          <div className="detail-body">
            <div className="detail-section">
              <h3>
                About the Role
              </h3>

              <p>
                {
                  job.description
                }
              </p>
            </div>

            <div className="detail-section">
              <h3>
                Requirements
              </h3>

              <ul className="req-list">
                {job.requirements.map(
                  (
                    r,
                    i
                  ) => (
                    <li key={i}>
                      {r}
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="detail-section">
              <h3>
                Benefits &
                Perks
              </h3>

              <ul className="req-list">
                <li>
                  Flexible remote
                  work policy
                </li>

                <li>
                  Premium health
                  insurance
                </li>

                <li>
                  Learning budget
                  for certifications
                </li>

                <li>
                  Annual bonuses &
                  equity
                </li>

                <li>
                  Unlimited PTO
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="detail-sidebar fade-up">
          <div className="sidebar-card premium-card">
            <h3>
              Compensation
            </h3>

            <div className="salary-range">
              {fmt.salary(
                job.salary_min,
                job.salary_max
              )}
            </div>

            <div className="salary-note">
              Annual salary · USD
            </div>

            <button
              className="apply-btn"
              onClick={() =>
                setApplyOpen(
                  true
                )
              }
            >
              Apply Now →
            </button>
          </div>

          <div className="sidebar-card">
            <h3>
              Quick Overview
            </h3>

            <div className="overview-list">
              <div className="overview-item">
                <span>
                  Job Type
                </span>

                <strong>
                  {job.type}
                </strong>
              </div>

              <div className="overview-item">
                <span>
                  Category
                </span>

                <strong>
                  {
                    job.category
                  }
                </strong>
              </div>

              <div className="overview-item">
                <span>
                  Location
                </span>

                <strong>
                  {
                    job.location
                  }
                </strong>
              </div>

              <div className="overview-item">
                <span>
                  Experience
                </span>

                <strong>
                  Mid-Senior
                </strong>
              </div>
            </div>
          </div>

          <div className="sidebar-card ai-card">
            <Sparkles
              size={18}
            />

            <h4>
              AI Insight
            </h4>

            <p>
              Your profile
              strongly matches
              this opportunity
              based on trending
              industry skills.
            </p>

            <button
              className="btn btn-primary"
              style={{
                width: '100%',
                justifyContent:
                  'center'
              }}
              onClick={() =>
                setApplyOpen(
                  true
                )
              }
            >
              <ExternalLink
                size={15}
              />

              Quick Apply
            </button>
          </div>
        </div>
      </div>

      {applyOpen && (
        <ApplyModal
          job={job}
          onClose={() =>
            setApplyOpen(false)
          }
        />
      )}
    </div>
  );
}