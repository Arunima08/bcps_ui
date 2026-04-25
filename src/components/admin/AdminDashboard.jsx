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
        <div className="main-wrap-inner p-4">
      {/* HEADER ACTION BAR */}
      <div className="d-flex align-items-center justify-content-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="fw-800 mb-1" style={{ letterSpacing: '-1px' }}>Admin Overview</h2>
          <p className="text-muted mb-0">Here's what's happening on your Blogging and Content Publishing System today</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn-primary-c py-3 px-4" onClick={() => navigate('/admin/posts')}>
            <i className="fas fa-check-circle me-2"></i> Review Posts
          </button>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="row g-4 mb-5">
        <div className="col-sm-6 col-xl-3">
          <div className="stat-card-c">
            <div className="stat-icon-c blue"><i className="fas fa-users"></i></div>
            <div className="stat-val-c">{stats?.totalUsers || 0}</div>
            <div className="stat-label-c">Total Users</div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="stat-card-c">
            <div className="stat-icon-c green"><i className="fas fa-newspaper"></i></div>
            <div className="stat-val-c">{stats?.publishedPosts || 0}</div>
            <div className="stat-label-c">Published Posts</div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="stat-card-c">
            <div className="stat-icon-c purple"><i className="fas fa-comments"></i></div>
            <div className="stat-val-c">{stats?.totalComments || 0}</div>
            <div className="stat-label-c">Total Comments</div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="stat-card-c">
            <div className="stat-icon-c amber"><i className="fas fa-clock"></i></div>
            <div className="stat-val-c">{stats?.pendingApproval || 0}</div>
            <div className="stat-label-c">Pending Approval</div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* LEFT: RECENT ACTIVITY */}
        <div className="col-lg-8">
          <div className="card-custom">
            <div className="card-head-custom border-bottom p-4">
              <span className="card-title-c fw-800">Recent System Activity</span>
              <button className="btn-outline-c btn-sm-c" onClick={() => navigate('/admin/posts')}>View All</button>
            </div>
            <div className="p-3">
              {recentPosts && recentPosts.map((post, index) => (
                <div key={post._id} className="activity-row p-3 mb-2 rounded-4" onClick={() => navigate(`/admin/posts`)} style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="activity-dot" style={{ background: post.status === 'published' ? 'var(--green)' : 'var(--amber)', width: '10px', height: '10px' }}></div>
                    <div className="avatar-c d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: '36px', height: '36px', fontSize: '13px', background: '#ff5722', borderRadius: '12px' }}>
                      {post.author?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-grow-1">
                      <div style={{ fontSize: '14px', color: '#1e293b' }}>
                        <strong>{post.author?.name}</strong> {post.status === 'published' ? 'published' : 'submitted'} a post: <span className="text-primary fw-600">"{post.title}"</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                        <i className="far fa-clock me-1"></i> {new Date(post.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <i className="fas fa-chevron-right text-muted small"></i>
                  </div>
                </div>
              ))}
              {(!recentPosts || recentPosts.length === 0) && <div className="text-center text-muted small py-5">No recent activity detected</div>}
            </div>
          </div>
        </div>
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
    </div>
  );
}
