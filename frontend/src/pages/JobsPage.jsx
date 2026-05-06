import { useState, useEffect } from 'react';

import {
  Search,
  Sparkles,
  Briefcase,
  Building2,
  Globe,
  TrendingUp
} from 'lucide-react';

import { api } from '../api';

import JobCard from '../components/JobCard';

const TYPES = [
  'All',
  'full-time',
  'part-time',
  'contract',
  'remote'
];

export default function JobsPage({
  navigate
}) {
  const [jobs, setJobs] = useState([]);

  const [stats, setStats] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState('');

  const [type, setType] =
    useState('All');

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);

        const jobsData =
          await api.getJobs({
            search,
            type
          });

        setJobs(
          jobsData.jobs || []
        );

        const statsData =
          await api.getStats();

        setStats(statsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [search, type]);

  return (
    <>
      <section className="hero-modern">
        <div className="container">
          <div className="hero-grid">
            {/* LEFT */}
            <div>
              <div className="hero-pill">
                <Sparkles size={14} />

                AI Powered Job
                Discovery
              </div>

              <h1 className="hero-big-title">
                Discover Your
                <br />

                <span>
                  Dream Career
                </span>
              </h1>

              <p className="hero-desc">
                Explore premium
                opportunities from
                world-class companies
                around the globe.
              </p>

              {/* SEARCH */}
              <div className="hero-search">
                <Search size={18} />

                <input
                  type="text"
                  placeholder="Search jobs, companies, skills..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />

                <button>
                  Search
                </button>
              </div>

              {/* STATS */}
              <div className="stats-row">
                <div className="stat-card">
                  <Briefcase
                    size={18}
                  />

                  <div>
                    <strong>
                      {
                        stats.total_jobs ||
                        0
                      }
                    </strong>

                    <span>
                      Open Jobs
                    </span>
                  </div>
                </div>

                <div className="stat-card">
                  <Building2
                    size={18}
                  />

                  <div>
                    <strong>
                      {
                        stats.companies ||
                        0
                      }
                    </strong>

                    <span>
                      Companies
                    </span>
                  </div>
                </div>

                <div className="stat-card">
                  <Globe
                    size={18}
                  />

                  <div>
                    <strong>
                      {
                        stats.remote_jobs ||
                        0
                      }
                    </strong>

                    <span>
                      Remote Roles
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="hero-right">
              <div className="hero-card">
                <div className="hero-card-top">
                  <span>
                    Trending Role
                  </span>

                  <TrendingUp
                    size={18}
                  />
                </div>

                <h3>
                  Senior AI Engineer
                </h3>

                <p>
                  OpenAI · Remote
                </p>

                <div className="match-score">
                  96% Match
                </div>
              </div>

              <div className="hero-card secondary">
                <div className="hero-card-top">
                  <span>
                    Featured Company
                  </span>
                </div>

                <h3>Stripe</h3>

                <p>
                  Hiring across 12
                  teams globally
                </p>

                <div className="match-score">
                  Fast Hiring
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <div className="container">
        <div className="filter-row-modern">
          {TYPES.map((t) => (
            <button
              key={t}
              className={`modern-filter ${
                type === t
                  ? 'active'
                  : ''
              }`}
              onClick={() =>
                setType(t)
              }
            >
              {t}
            </button>
          ))}
        </div>

        {/* LOADER */}
        {loading ? (
          <div className="loader-wrap">
            <div className="spinner" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <Briefcase
              size={50}
              style={{
                opacity: 0.2,
                marginBottom: 20
              }}
            />

            <h3>
              No Jobs Found
            </h3>

            <p>
              Try changing your
              search or filters
            </p>
          </div>
        ) : (
          <>
            {/* RESULTS */}
            <div
              style={{
                marginBottom: 24,
                color:
                  'var(--text-muted)'
              }}
            >
              Showing{' '}
              <strong>
                {jobs.length}
              </strong>{' '}
              opportunities
            </div>

            {/* GRID */}
            <div className="jobs-grid">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onClick={() =>
                    navigate(
                      'detail',
                      job.id
                    )
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}