import {
  MapPin,
  Bookmark
} from 'lucide-react';

import { fmt } from '../api';

export default function JobCard({
  job,
  onClick
}) {
  const savedJobs = JSON.parse(
    localStorage.getItem('savedJobs') || '[]'
  );

  const isSaved = savedJobs.includes(job.id);

  const toggleSave = (e) => {
    e.stopPropagation();

    let updated = [...savedJobs];

    if (isSaved) {
      updated = updated.filter(
        id => id !== job.id
      );
    } else {
      updated.push(job.id);
    }

    localStorage.setItem(
      'savedJobs',
      JSON.stringify(updated)
    );

    window.location.reload();
  };

  return (
    <div
      className={`job-card ${
        job.featured
          ? 'featured'
          : ''
      }`}
      onClick={onClick}
    >
      <div className="card-header">
        <div
          className="company-logo"
          style={{
            background: job.logo_color
          }}
        >
          <img
            src={`https://logo.clearbit.com/${job.company.toLowerCase()}.com`}
            alt={job.company}
            style={{
              width: 28,
              height: 28,
              objectFit: 'contain'
            }}
          />
        </div>

        <div className="card-title-group">
          <div className="card-title">
            {job.title}
          </div>

          <div className="card-company">
            {job.company}
          </div>
        </div>

        <button
          onClick={toggleSave}
          style={{
            background: 'none',
            border: 'none',
            color: isSaved
              ? '#a855f7'
              : 'var(--text-muted)'
          }}
        >
          <Bookmark
            size={18}
            fill={
              isSaved
                ? '#a855f7'
                : 'none'
            }
          />
        </button>
      </div>

      <div className="card-tags">
        <span className="tag tag-location">
          <MapPin
            size={10}
            style={{
              display: 'inline',
              marginRight: 3
            }}
          />

          {job.location}
        </span>

        <span className="tag tag-type">
          {job.type}
        </span>

        <span className="tag tag-category">
          {job.category}
        </span>
      </div>

      <p className="card-desc">
        {job.description}
      </p>

      <div className="card-footer">
        <span className="salary">
          {fmt.salary(
            job.salary_min,
            job.salary_max
          )}
        </span>

        <span className="posted-date">
          {fmt.date(job.posted_at)}
        </span>
      </div>
    </div>
  );
}