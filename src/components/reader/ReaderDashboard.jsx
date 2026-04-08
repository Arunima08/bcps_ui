import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';

export default function ReaderDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/reader/dashboard');
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching reader dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading dashboard...</div>;
  if (!data) return <div className="p-4 text-center text-danger">Failed to load dashboard</div>;

  const { stats, recentPosts } = data;

  const gradients = [
    'linear-gradient(135deg,#dbeafe,#eff6ff)',
    'linear-gradient(135deg,#ecfdf5,#f0fdf4)',
    'linear-gradient(135deg,#f5f3ff,#faf5ff)',
    'linear-gradient(135deg,#fef2f2,#fff1f1)',
    'linear-gradient(135deg,#fffbeb,#fefce8)',
    'linear-gradient(135deg,#f0fdfa,#ccfbf1)',
  ];
  const emojis = ['💻', '🌱', '🧠', '💰', '🎨', '📱'];

  return (
    <> 
<div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-3">
  <div><h4 className="fw-800 mb-1">Reader Dashboard</h4><p style={{color:'var(--gray-400)',fontSize:'13px'}}>Discover and follow your favorite authors</p></div>
  <span className="zone-strip reader"><i className="fa-solid fa-book-open"></i> Reader Zone</span>
</div>
<div className="row g-3 mb-4">
  <div className="col-sm-6 col-xl-4"><div className="stat-card-c"><div className="d-flex justify-content-between align-items-center mb-3"><div className="stat-icon-c" style={{background:'var(--blue-50)',color:'var(--blue-600)'}}><i className="fa-solid fa-users"></i></div></div><div className="stat-val-c">{stats?.followingCount || 0}</div><div className="stat-label-c">Following Authors</div></div></div>
  <div className="col-sm-6 col-xl-4"><div className="stat-card-c"><div className="d-flex justify-content-between align-items-center mb-3"><div className="stat-icon-c" style={{background:'#ecfdf5',color:'var(--green)'}}><i className="fa-solid fa-heart"></i></div></div><div className="stat-val-c">{stats?.likedPosts || 0}</div><div className="stat-label-c">Liked Posts</div></div></div>
 
  <div className="col-sm-6 col-xl-4"><div className="stat-card-c"><div className="d-flex justify-content-between align-items-center mb-3"><div className="stat-icon-c" style={{background:'#f5f3ff',color:'var(--purple)'}}><i className="fa-solid fa-bell"></i></div></div><div className="stat-val-c">{stats?.newNotifications || 0}</div><div className="stat-label-c">New Notifications</div></div></div>
</div>
<h5 className="fw-700 mb-3" style={{fontSize:'16px'}}>Recent Posts from Followed Authors</h5>
{recentPosts && recentPosts.length > 0 ? (
<div className="blog-grid">
  {recentPosts.map((post, index) => {
    const wordCount = post.content ? post.content.split(' ').length : 0;
    const readTime = Math.ceil(wordCount / 200) || 1;
    return (
      <Link key={post._id} to={`/reader/blog/${post._id}`} className="blog-card text-decoration-none">
        <div className="blog-thumb" style={{background: gradients[index % gradients.length]}}>{emojis[index % emojis.length]}</div>
        <div className="blog-body">
          <div className="blog-cat">{post.category?.name || 'Uncategorized'}</div>
          <div className="blog-title">{post.title}</div>
          <div className="blog-meta">
            <span>By {post.author?.name || 'Unknown'}</span>
            <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {readTime} min</span>
          </div>
        </div>
        <div className="blog-actions">
          <button className="btn-outline-c btn-sm-c"><i className="fa-solid fa-heart"></i> {post.likes?.length || 0}</button>
          <button className="btn-outline-c btn-sm-c"><i className="fa-solid fa-share-nodes"></i></button>
        </div>
      </Link>
    );
  })}
</div>
) : (
  <div className="card-custom p-4 text-center text-muted">
    <i className="fa-solid fa-book-open fs-1 mb-3 d-block" style={{color:'var(--gray-300)'}}></i>
    <p>No posts from followed authors yet.</p>
    <Link to="/reader/browse" className="btn-primary-c">Browse Posts</Link>
  </div>
)}
    </>
  );
}
