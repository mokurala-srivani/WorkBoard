import {
  useEffect,
  useState
} from 'react';

import {
  Bookmark
} from 'lucide-react';

import { api } from '../api';

import JobCard from '../components/JobCard';

export default function SavedJobsPage({
  navigate
}) {
  const [jobs, setJobs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadSavedJobs =
      async () => {
        try {
          setLoading(true);

          const savedIds =
            JSON.parse(
              localStorage.getItem(
                'savedJobs'
              ) || '[]'
            );

          const data =
            await api.getJobs({
              limit: 100
            });

          const filtered =
            (
              data.jobs || []
            ).filter((job) =>
              savedIds.includes(
                job.id
              )
            );

          setJobs(filtered);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

    loadSavedJobs();

    window.addEventListener(
      'storage',
      loadSavedJobs
    );

    return () => {
      window.removeEventListener(
        'storage',
        loadSavedJobs
      );
    };
  }, []);

  return (
    <div className="container saved-page">
      <div className="saved-header">
        <h1>Saved Jobs</h1>

        <p>
          Your bookmarked
          opportunities
        </p>
      </div>

      {loading ? (
        <div className="loader-wrap">
          <div className="spinner" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <Bookmark
            size={60}
            style={{
              opacity: 0.15,
              marginBottom: 20
            }}
          />

          <h3>
            No Saved Jobs
          </h3>

          <p>
            Bookmark jobs to
            view them later
          </p>
        </div>
      ) : (
        <>
          <div className="saved-count">
            {jobs.length} Saved
            Opportunities
          </div>

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
  );
}