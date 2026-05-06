import { useState } from 'react';
import './index.css';

import Nav from './components/Nav';

import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import PostJobPage from './pages/PostJobPage';
import SavedJobsPage from './pages/SavedJobsPage';

export default function App() {
  const [page, setPage] = useState('jobs');
  const [selectedJobId, setSelectedJobId] = useState(null);

  const navigate = (to, jobId = null) => {
    setPage(to);

    if (jobId) {
      setSelectedJobId(jobId);
    }

    window.scrollTo(0, 0);
  };

  return (
    <>
      <Nav page={page} navigate={navigate} />

      {page === 'jobs' && (
        <JobsPage navigate={navigate} />
      )}

      {page === 'detail' && (
        <JobDetailPage
          jobId={selectedJobId}
          navigate={navigate}
        />
      )}

      {page === 'post' && (
        <PostJobPage navigate={navigate} />
      )}

      {page === 'saved' && (
        <SavedJobsPage navigate={navigate} />
      )}
    </>
  );
}