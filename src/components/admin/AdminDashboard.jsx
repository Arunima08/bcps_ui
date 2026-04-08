import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading dashboard...</div>;
  if (!data) return <div className="p-4 text-center text-danger">Failed to load dashboard</div>;

  const { stats, recentPosts, contentDistribution } = data;

  return (
    <> 
<div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-3">
  <div><h4 className="fw-800 mb-1" style={{color:'var(--gray-900)'}}>Welcome back, Admin 👋</h4>
  <p style={{color:'var(--gray-400)',fontSize:'13px'}}>Here's what's happening on BlogSphere today</p></div>
  <span className="zone-strip admin"><i className="fa-solid fa-shield-halved"></i> Admin Zone</span>
</div>
<div className="row g-3 mb-4">
  <div className="col-sm-6 col-xl-3"><div className="stat-card-c"><div className="d-flex justify-content-between align-items-center mb-3"><div className="stat-icon-c" style={{background:'var(--blue-50)',color:'var(--blue-600)'}}><i className="fa-solid fa-users"></i></div><span className="stat-delta-c up">↑ 12%</span></div><div className="stat-val-c">{stats?.totalUsers || 0}</div><div className="stat-label-c">Total Users</div></div></div>
  <div className="col-sm-6 col-xl-3"><div className="stat-card-c"><div className="d-flex justify-content-between align-items-center mb-3"><div className="stat-icon-c" style={{background:'#ecfdf5',color:'var(--green)'}}><i className="fa-solid fa-newspaper"></i></div><span className="stat-delta-c up">↑ 8%</span></div><div className="stat-val-c">{stats?.publishedPosts || 0}</div><div className="stat-label-c">Published Posts</div></div></div>
  
  <div className="col-sm-6 col-xl-3"><div className="stat-card-c"><div className="d-flex justify-content-between align-items-center mb-3"><div className="stat-icon-c" style={{background:'#f5f3ff',color:'var(--purple)'}}><i className="fa-solid fa-comments"></i></div><span className="stat-delta-c up">↑ 22%</span></div><div className="stat-val-c">{stats?.totalComments || 0}</div><div className="stat-label-c">Total Comments</div></div></div>
  <div className="col-sm-6 col-xl-3"><div className="stat-card-c"><div className="d-flex justify-content-between align-items-center mb-3"><div className="stat-icon-c" style={{background:'#fef2f2',color:'var(--red)'}}><i className="fa-solid fa-clock"></i></div><span className="stat-delta-c warn">↑ 5%</span></div><div className="stat-val-c">{stats?.pendingApproval || 0}</div><div className="stat-label-c">Pending Approval</div></div></div>
</div>
<div className="row g-3">
  <div className="col-lg-8"><div className="card-custom"><div className="card-head-custom"><span className="card-title-c">Recent Posts Activity</span><button className="btn-outline-c btn-sm-c" onClick={() => navigate('/admin/posts')}>View All</button></div><div className="p-3">
    {recentPosts && recentPosts.map((post, index) => (
      <div key={post._id} className="activity-row" onClick={() => navigate(`/reader/blog/${post._id}`)} style={{cursor:'pointer'}}>
        <div className="activity-dot" style={{background: post.status === 'published' ? 'var(--green)' : 'var(--amber)'}}></div>
        <div className="avatar-c d-flex align-items-center justify-content-center text-white fw-bold" style={{width:'28px',height:'28px',fontSize:'11px', background: 'var(--blue-500)'}}>
          {post.author?.name?.charAt(0) || 'U'}
        </div>
        <div className="flex-grow-1">
          <div style={{fontSize:'13px',color:'var(--gray-700)'}}><strong>{post.author?.name}</strong> {post.status === 'published' ? 'published' : 'submitted'} a post: "{post.title}"</div>
          <div style={{fontSize:'11px',color:'var(--gray-400)'}}>{new Date(post.createdAt).toLocaleString()}</div>
        </div>
      </div>
    ))}
    {(!recentPosts || recentPosts.length === 0) && <div className="text-center text-muted small py-3">No recent activity</div>}
  </div></div></div>
  <div className="col-lg-4">
    <div className="card-custom"><div className="card-head-custom"><span className="card-title-c">Content Distribution</span></div><div className="p-3">
      {contentDistribution && contentDistribution.map((dist, idx) => {
        const colors = ['var(--blue-500)', 'var(--green)', 'var(--amber)', 'var(--purple)', 'var(--red)'];
        const color = colors[idx % colors.length];
        return (
          <div key={idx} className="mb-2">
            <div className="d-flex justify-content-between" style={{fontSize:'12px',marginBottom:'4px'}}>
              <span style={{color:'var(--gray-600)'}}>{dist.name}</span>
              <span className="fw-bold">{dist.percentage}%</span>
            </div>
            <div className="progress-bar-c">
              <div className="progress-fill-c" style={{width:`${dist.percentage}%`,background: color}}></div>
            </div>
          </div>
        )
      })}
      {(!contentDistribution || contentDistribution.length === 0) && <div className="text-center text-muted small py-3">No data available</div>}
    </div></div>
  </div>
</div>
    </>
  );
}
