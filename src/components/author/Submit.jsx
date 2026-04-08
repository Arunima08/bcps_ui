import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';

export default function Submit() {
  const navigate = useNavigate();
  const [submittedPosts, setSubmittedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmittedPosts();
  }, []);

  const fetchSubmittedPosts = async () => {
    try {
      const response = await api.get('/author/submit');
      if (response.data.success) {
        setSubmittedPosts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching submitted posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <> 
<div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-3">
  <div><h4 className="fw-800 mb-1">Submitted Posts</h4><p style={{color:'var(--gray-400)',fontSize:'13px'}}>Track submission status with timeline</p></div>
</div>
<div className="row g-3">
  <div className="col-lg-12">
    <div className="card-custom">
      <div className="card-head-custom">
        <span className="card-title-c">Submission History</span>
      </div>
      <div className="table-responsive">
        <table>
          <thead><tr><th>Title</th><th>Submitted</th><th>Status</th></tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="3" className="text-center py-4 text-muted">Loading submissions...</td></tr>
            ) : submittedPosts.length === 0 ? (
              <tr><td colSpan="3" className="text-center py-4 text-muted">No submitted posts found.</td></tr>
            ) : (
              submittedPosts.map(post => {
                let statusClass = 'badge-pending';
                if (post.status === 'published') statusClass = 'badge-published';
                if (post.status === 'rejected') statusClass = 'badge-rejected';
                
                return (
                  <tr key={post._id} onClick={() => navigate(`/reader/blog/${post._id}`)} style={{cursor:'pointer'}}>
                    <td><strong className="text-truncate" style={{maxWidth: '300px', display: 'inline-block'}}>{post.title}</strong></td>
                    <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td><span className={`badge-c ${statusClass}`}>{post.status.charAt(0).toUpperCase() + post.status.slice(1).replace('-', ' ')}</span></td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
  
    </>
  );
}
