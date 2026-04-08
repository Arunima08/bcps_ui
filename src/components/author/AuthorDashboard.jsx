import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';

export default function AuthorDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/author/dashboard');
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching author dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading dashboard...</div>;
  if (!data) return <div className="p-4 text-center text-danger">Failed to load dashboard</div>;

  const { stats, recentPosts, recentComments } = data;

  return (
    <> 
<div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-3">
  <div><h4 className="fw-800 mb-1">Author Dashboard</h4><p style={{color:'var(--gray-400)',fontSize:'13px'}}>Manage your posts and content</p></div>
  <span className="zone-strip author"><i className="fa-solid fa-pen-nib"></i> Author Zone</span>
</div>
<div className="row g-3 mb-4">
  <div className="col-sm-6 col-xl-3"><div className="stat-card-c"><div className="d-flex justify-content-between align-items-center mb-3"><div className="stat-icon-c" style={{background:'var(--blue-50)',color:'var(--blue-600)'}}><i className="fa-solid fa-newspaper"></i></div></div><div className="stat-val-c">{stats?.publishedPosts || 0}</div><div className="stat-label-c">Published Posts</div></div></div>
  <div className="col-sm-6 col-xl-3"><div className="stat-card-c"><div className="d-flex justify-content-between align-items-center mb-3"><div className="stat-icon-c" style={{background:'#fffbeb',color:'var(--amber)'}}><i className="fa-solid fa-file"></i></div></div><div className="stat-val-c">{stats?.totalComments || 0}</div><div className="stat-label-c">Total Comments</div></div></div>
  <div className="col-sm-6 col-xl-3"><div className="stat-card-c"><div className="d-flex justify-content-between align-items-center mb-3"><div className="stat-icon-c" style={{background:'#ecfdf5',color:'var(--green)'}}><i className="fa-solid fa-heart"></i></div></div><div className="stat-val-c">{stats?.totalLikes || 0}</div><div className="stat-label-c">Total Likes</div></div></div>
  <div className="col-sm-6 col-xl-3"><div className="stat-card-c"><div className="d-flex justify-content-between align-items-center mb-3"><div className="stat-icon-c" style={{background:'#f5f3ff',color:'var(--purple)'}}><i className="fa-solid fa-eye"></i></div></div><div className="stat-val-c">{stats?.totalViews || 0}</div><div className="stat-label-c">Total Views</div></div></div>
</div>
<div className="row g-3">
  <div className="col-lg-6"><div className="card-custom"><div className="card-head-custom"><span className="card-title-c">My Recent Posts</span><Link to="/author/create" className="btn-primary-c btn-sm-c"><i className="fa-solid fa-plus"></i> New Post</Link></div>
    <div className="table-responsive"><table><thead><tr><th>Title</th><th>Status</th><th>Views</th></tr></thead><tbody>
      {recentPosts && recentPosts.length > 0 ? recentPosts.map(post => {
        let statusClass = 'badge-draft';
        if (post.status === 'published') statusClass = 'badge-published';
        if (post.status === 'pending' || post.status === 'in-review') statusClass = 'badge-pending';
        if (post.status === 'rejected') statusClass = 'badge-rejected';

        return (
          <tr key={post._id} onClick={() => post.status === 'published' ? navigate(`/reader/blog/${post._id}`) : null} style={{cursor: post.status === 'published' ? 'pointer' : 'default'}}>
             <td><strong className="text-truncate" style={{display: 'inline-block', maxWidth: '200px'}}>{post.title}</strong></td>
             <td><span className={`badge-c ${statusClass}`}>{post.status.charAt(0).toUpperCase() + post.status.slice(1).replace('-', ' ')}</span></td>
             <td>{post.status === 'published' ? post.views : '—'}</td>
          </tr>
        );
      }) : <tr><td colSpan="3" className="text-center text-muted small py-3">No recent posts</td></tr>}
    </tbody></table></div>
  </div></div>
  <div className="col-lg-6"><div className="card-custom"><div className="card-head-custom"><span className="card-title-c">Recent Comments on Your Posts</span></div><div className="p-3">
    {recentComments && recentComments.length > 0 ? recentComments.map(comment => (
      <div key={comment._id} className="notif-item" onClick={() => navigate(`/reader/blog/${comment.post}`)} style={{cursor:'pointer'}}>
        <div className="notif-icon" style={{background:'var(--blue-50)',color:'var(--blue-600)'}}><i className="fa-regular fa-comment"></i></div>
        <div style={{flex: 1, minWidth: 0}}>
          <div className="notif-text text-truncate"><strong>{comment.user?.name || 'User'}</strong> commented on "{comment.post?.title || 'a post'}"</div>
          <div className="notif-time">{new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</div>
        </div>
      </div>
    )) : <div className="text-center text-muted small py-3">No recent comments</div>}
  </div></div></div>
</div>
    </>
  );
}
