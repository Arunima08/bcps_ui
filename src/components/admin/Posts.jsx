import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';

export default function Posts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [statusFilter]);

  const fetchPosts = async () => {
    try {
      // Create query params
      const params = new URLSearchParams();
      if (statusFilter !== 'All') {
        params.append('status', statusFilter.toLowerCase());
      }
      
      const response = await api.get(`/admin/posts?${params.toString()}`);
      if (response.data.success) {
        setPosts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (postId, action) => {
    try {
      if(action === 'approve') {
        await api.put(`/admin/posts/${postId}/approve`);
      } else if (action === 'reject') {
        await api.put(`/admin/posts/${postId}/reject`);
      } else if (action === 'delete') {
        if(window.confirm("Delete this post permanently?")) {
          await api.delete(`/admin/posts/${postId}`);
        } else {
          return;
        }
      }
      fetchPosts();
    } catch (error) {
      console.error(`Error performing ${action} on post:`, error);
    }
  };

  const pendingCount = posts.filter(p => p.status === 'pending' || p.status === 'in-review').length;

  return (
    <> 
<div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-3">
  <div><h4 className="fw-800 mb-1">Post Approval &amp; Moderation</h4><p>Review and approve submitted blog posts</p></div>
  <span className="badge-c badge-pending">{pendingCount} Pending Review</span>
</div>
<div className="card-custom">
  <div className="card-head-custom">
    <span className="card-title-c">Submitted Posts</span>
    <div className="d-flex gap-2">
      <select 
        className="form-select form-select-sm" 
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option>All</option>
        <option>Pending</option>
        <option>In-Review</option>
        <option>Published</option>
        <option>Rejected</option>
      </select>
    </div>
  </div>
  <div className="table-responsive">
    <table>
      <thead><tr><th>#</th><th>Post Title</th><th>Author</th><th>Category</th><th>Submitted</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        {loading ? (
          <tr><td colSpan="7" className="text-center py-4">Loading posts...</td></tr>
        ) : posts.length === 0 ? (
          <tr><td colSpan="7" className="text-center py-4">No posts found</td></tr>
        ) : (
          posts.map((post, index) => {
            let statusClass = 'badge-progress';
            if (post.status === 'published') statusClass = 'badge-published';
            if (post.status === 'pending') statusClass = 'badge-pending';
            if (post.status === 'rejected') statusClass = 'badge-rejected';

            // words count approx
            const wordCount = post.content ? post.content.split(' ').length : 0;
            const readTime = Math.ceil(wordCount / 200) || 1;

            return (
              <tr key={post._id}>
                <td>{String(index + 1).padStart(2, '0')}</td>
                <td>
                  <div className="fw-600" onClick={() => navigate(`/reader/blog/${post._id}`)} style={{cursor: 'pointer'}}>{post.title}</div>
                  <div style={{fontSize: '11px', color: 'var(--gray-400)'}}>{wordCount} words · {readTime} min read</div>
                </td>
                <td>{post.author?.name || 'Unknown'}</td>
                <td><span className="tag-c">{post.category?.name || 'Uncategorized'}</span></td>
                <td>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td><span className={`badge-c ${statusClass}`}>{post.status.charAt(0).toUpperCase() + post.status.slice(1).replace('-', ' ')}</span></td>
                <td>
                  {(post.status === 'pending' || post.status === 'in-review') && (
                    <>
                      <button className="btn-success-c me-1" onClick={() => handleAction(post._id, 'approve')} title="Approve"><i className="fa-solid fa-check"></i></button>
                      <button className="btn-danger-c me-1" onClick={() => handleAction(post._id, 'reject')} title="Reject"><i className="fa-solid fa-xmark"></i></button>
                    </>
                  )}
                  {post.status === 'published' && <button className="btn-outline-c btn-sm-c me-1" onClick={() => navigate(`/reader/blog/${post._id}`)}>View</button>}
                  <button className="btn-outline-c btn-sm-c" style={{borderColor: 'var(--red)', color: 'var(--red)'}} onClick={() => handleAction(post._id, 'delete')} title="Delete"><i className="fa-solid fa-trash"></i></button>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>
</div>
  
    </>
  );
}
