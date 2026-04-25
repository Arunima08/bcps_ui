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
    <div className="main-wrap-inner p-4">
      {/* HEADER ACTION BAR */}
      <div className="d-flex align-items-center justify-content-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="fw-800 mb-1" style={{ letterSpacing: '-1px' }}>Reader Dashboard</h2>
          <p className="text-muted mb-0">Discover top stories and follow your favorite authors</p>
        </div>
        <div>
          <Link to="/reader/browse" className="btn-primary-c py-3 px-4">
            <i className="fas fa-search me-2"></i> Browse Content
          </Link>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="row g-4 mb-5">
        <div className="col-sm-6 col-xl-4">
          <div className="stat-card-c">
            <div className="stat-icon-c blue"><i className="fas fa-user-check"></i></div>
            <div className="stat-val-c">{stats?.followingCount || 0}</div>
            <div className="stat-label-c">Following Authors</div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-4">
          <div className="stat-card-c">
            <div className="stat-icon-c green"><i className="fas fa-heart"></i></div>
            <div className="stat-val-c">{stats?.likedPosts || 0}</div>
            <div className="stat-label-c">Liked Posts</div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-4">
          <div className="stat-card-c">
            <div className="stat-icon-c purple"><i className="fas fa-bell"></i></div>
            <div className="stat-val-c">{stats?.newNotifications || 0}</div>
            <div className="stat-label-c">New Notifications</div>
          </div>
        </div>
      </div>

      <h5 className="fw-800 mb-4" style={{ fontSize: '18px', letterSpacing: '-0.5px' }}>
        <i className="fas fa-stream me-2 text-primary"></i> Recent from Followed Authors
      </h5>

      {recentPosts && recentPosts.length > 0 ? (
        <div className="blog-grid">
          {recentPosts.map((post, index) => {
            const wordCount = post.content ? post.content.split(' ').length : 0;
            const readTime = Math.ceil(wordCount / 200) || 1;
            return (
              <Link key={post._id} to={`/reader/blog/${post._id}`} className="blog-card text-decoration-none">
                <div className="blog-thumb" style={{ background: gradients[index % gradients.length], fontSize: '40px' }}>
                  {emojis[index % emojis.length]}
                </div>
                <div className="blog-body p-4">
                  <div className="blog-cat mb-2">{post.category?.name || 'Uncategorized'}</div>
                  <div className="blog-title h5 fw-bold mb-3" style={{ color: '#1e293b', lineSize: '1.4' }}>{post.title}</div>
                  <div className="blog-meta d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                        <div className="avatar-sm" style={{ width: '24px', height: '24px', background: '#ff5722', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#fff', fontWeight: 'bold' }}>
                            {post.author?.name?.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>{post.author?.name || 'Unknown'}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{readTime} min read</span>
                  </div>
                </div>
                <div className="blog-actions p-3 border-top d-flex gap-2">
                  <button className="btn-outline-c btn-sm-c flex-fill justify-content-center">
                    <i className="fas fa-heart me-1"></i> {post.likes?.length || 0}
                  </button>
                  <button className="btn-outline-c btn-sm-c">
                    <i className="fas fa-share-alt"></i>
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="card-custom p-5 text-center text-muted">
          <div className="mb-4" style={{ opacity: 0.2 }}>
            <i className="fas fa-book-reader" style={{ fontSize: '80px' }}></i>
          </div>
          <h5 className="fw-bold text-dark">Your feed is quiet</h5>
          <p className="mb-4">Follow authors to see their latest stories here.</p>
          <Link to="/reader/browse" className="btn-primary-c">
            Explore Authors
          </Link>
        </div>
      )}
    </div>
  );
}
