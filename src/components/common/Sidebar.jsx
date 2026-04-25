import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../api';

export default function Sidebar({ zone, sidebarOpen, closeSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(sessionStorage.getItem('user')) || {};
  // console.log(user, "#######################");

  const getStyle = (z) => {
    if (z === zone) {
      if (z === 'admin') return 'zone-btn active-admin';
      if (z === 'author') return 'zone-btn active-author';
      if (z === 'reader') return 'zone-btn active-reader';
    }
    return 'zone-btn';
  }

  const [counts, setCounts] = useState({});

  useEffect(() => {
    fetchCounts();
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, [zone]);

  const fetchCounts = async () => {
    try {
      const response = await api.get('/common/counts');
      if (response.data.success) {
        setCounts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const iLink = (p) => {
    const currentPath = location.pathname;
    const targetPath = p === '' ? `/${zone}` : `/${zone}/${p}`;
    return currentPath === targetPath ? 'nav-item-custom active' : 'nav-item-custom';
  };

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      {/* Logo */}
      <div className="d-flex align-items-center gap-3 p-4 border-bottom">
        <div className="logo-icon">B</div>
        <div>
          <div className="logo-text" style={{ fontSize: '13px', color: '#1e293b' }}>Blogging & Content</div>
          <div className="logo-sub" style={{ fontSize: '10px', color: '#64748b' }}>Publishing System</div>
        </div>
      </div>



      {/* Nav Links - Strictly matching HTML per-zone files */}
      {zone === 'admin' && (
        <div className="px-3 pt-2">
          <div className="sidebar-section-label">Main</div>
          <Link to="/admin" className={iLink('')} onClick={closeSidebar}>
            <span className="nav-icon-c"><i className="fa-solid fa-gauge-high"></i></span>Dashboard
          </Link>
          <div className="sidebar-section-label mt-2">Management</div>
          <Link to="/admin/users" className={iLink('users')} onClick={closeSidebar}>
            <span className="nav-icon-c"><i className="fa-solid fa-users"></i></span>User Management
            {counts.totalUsers > 0 && <span className="nav-badge-c">{counts.totalUsers}</span>}
          </Link>
          <Link to="/admin/categories" className={iLink('categories')} onClick={closeSidebar}>
            <span className="nav-icon-c"><i className="fa-solid fa-tags"></i></span>Categories
          </Link>
          <Link to="/admin/posts" className={iLink('posts')} onClick={closeSidebar}>
            <span className="nav-icon-c"><i className="fa-solid fa-file-pen"></i></span>Post Approval
            {counts.pendingPosts > 0 && <span className="nav-badge-c amber">{counts.pendingPosts}</span>}
          </Link>
          <Link to="/admin/notifications" className={iLink('notifications')} onClick={closeSidebar}>
            <span className="nav-icon-c"><i className="fa-solid fa-bell"></i></span>Notifications
            {counts.unreadNotifications > 0 && <span className="nav-badge-c">{counts.unreadNotifications}</span>}
          </Link>
          {/* <div className="sidebar-section-label mt-2">Insights</div> */}
        </div>
      )}

      {zone === 'author' && (
        <div className="px-3 pt-2">
          <div className="sidebar-section-label">Author</div>
          <Link to="/author" className={iLink('')} onClick={closeSidebar}>
            <span className="nav-icon-c"><i className="fa-solid fa-gauge-high"></i></span>Dashboard
          </Link>
          <Link to="/author/create" className={iLink('create')} onClick={closeSidebar}>
            <span className="nav-icon-c"><i className="fa-solid fa-plus"></i></span>Create Blog
          </Link>
          <Link to="/author/comments" className={iLink('comments')} onClick={closeSidebar}>
            <span className="nav-icon-c"><i className="fa-solid fa-file-lines"></i></span>Comments
            {counts.pendingComments > 0 && <span className="nav-badge-c amber">{counts.pendingComments}</span>}
          </Link>
          <Link to="/author/submit" className={iLink('submit')} onClick={closeSidebar}>
            <span className="nav-icon-c"><i className="fa-solid fa-paper-plane"></i></span>Submitted Posts
          </Link>
          <Link to="/author/notifications" className={iLink('notifications')} onClick={closeSidebar}>
            <span className="nav-icon-c"><i className="fa-solid fa-bell"></i></span>Notifications
            {counts.unreadNotifications > 0 && <span className="nav-badge-c">{counts.unreadNotifications}</span>}
          </Link>
        </div>
      )}

      {zone === 'reader' && (
        <div className="px-3 pt-2">
          <div className="sidebar-section-label">Reader</div>
          <Link to="/reader" className={iLink('')} onClick={closeSidebar}>
            <span className="nav-icon-c"><i className="fa-solid fa-gauge-high"></i></span>Dashboard
          </Link>
          <Link to="/reader/browse" className={iLink('browse')} onClick={closeSidebar}>
            <span className="nav-icon-c"><i className="fa-solid fa-magnifying-glass"></i></span>Browse Content
          </Link>
          <Link to="/reader/notifications" className={iLink('notifications')} onClick={closeSidebar}>
            <span className="nav-icon-c"><i className="fa-solid fa-bell"></i></span>Notifications
            {counts.unreadNotifications > 0 && <span className="nav-badge-c">{counts.unreadNotifications}</span>}
          </Link>
          <Link to="/reader/profile" className={iLink('profile')} onClick={closeSidebar}>
            <span className="nav-icon-c"><i className="fa-solid fa-circle-user"></i></span>Profile
          </Link>
        </div>
      )}

      <div className="sidebar-footer p-3">
        <div className="d-flex align-items-center gap-3 p-2 rounded-4" style={{ cursor: 'pointer', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div className="avatar-c d-flex align-items-center justify-content-center fw-bold text-white overflow-hidden" style={{ width: '40px', height: '40px', fontSize: '15px', background: '#ff5722', boxShadow: '0 4px 12px rgba(255, 87, 34, 0.3)' }}>
            {user.profilePic && user.profilePic !== '' ? (
              <img src={`http://localhost:5001/${user.profilePic}`} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              'A'
            )}
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }} id="nav-user-name">
              {/* Arunima */}
              {user?.name}
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'capitalize', letterSpacing: '0.5px' }} id="nav-user-role">
              {user.role || zone}
            </div>
          </div>
          <i className="fa-solid fa-ellipsis-vertical ms-auto" style={{ color: 'rgba(255,255,255,.3)', fontSize: '12px' }}></i>
        </div>
      </div>
    </aside>
  );
}
