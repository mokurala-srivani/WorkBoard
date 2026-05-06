import {
  Briefcase,
  Plus,
} from 'lucide-react';

export default function Nav({
  page,
  navigate
}) {
  return (
    <nav className="nav">
      <div className="container">
        <div className="nav-inner">
          <button
            className="nav-logo"
            onClick={() => navigate('jobs')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Briefcase
              size={20}
              color="#a855f7"
            />

            <span>WorkBoard</span>
          </button>

          <div className="nav-links">
            <button
              className={`nav-link ${
                page === 'jobs'
                  ? 'active'
                  : ''
              }`}
              onClick={() =>
                navigate('jobs')
              }
            >
              Browse Jobs
            </button>

            <button
              className={`nav-link ${
                page === 'saved'
                  ? 'active'
                  : ''
              }`}
              onClick={() =>
                navigate('saved')
              }
            >
              Saved Jobs
            </button>

            <button
              className={`nav-link ${
                page === 'post'
                  ? 'active'
                  : ''
              }`}
              onClick={() =>
                navigate('post')
              }
            >
              Post Job
            </button>
          </div>

          <button
            className="btn btn-primary"
            onClick={() =>
              navigate('post')
            }
          >
            <Plus size={16} />
            Post Job
          </button>
        </div>
      </div>
    </nav>
  );
}