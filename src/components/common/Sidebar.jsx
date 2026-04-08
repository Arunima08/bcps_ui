import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar({ zone, sidebarOpen, closeSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const getStyle = (z) => {
    if (z === zone) {
        if (z === 'admin') return 'zone-btn active-admin';
        if (z === 'author') return 'zone-btn active-author';
        if (z === 'reader') return 'zone-btn active-reader';
    }
    return 'zone-btn';
  }
  
  const iLink = (p) => {
    const currentPath = location.pathname;
    const targetPath = p === '' ? `/${zone}` : `/${zone}/${p}`;
    return currentPath === targetPath ? 'nav-item-custom active' : 'nav-item-custom';
  };

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      {/* Logo */}
      <div className="d-flex align-items-center gap-2 p-3 border-bottom border-secondary border-opacity-25">
        <div className="logo-icon">🛒</div>
        <div>
          <div className="logo-text">E-Cart</div>
          <div className="logo-sub">Blog Portal</div>
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
            <span className="nav-icon-c"><i className="fa-solid fa-users"></i></span>User Management<span className="nav-badge-c">12</span>
          </Link>
          <Link to="/admin/categories" className={iLink('categories')} onClick={closeSidebar}>
            <span className="nav-icon-c"><i className="fa-solid fa-tags"></i></span>Categories
          </Link>
          <Link to="/admin/posts" className={iLink('posts')} onClick={closeSidebar}>
            <span className="nav-icon-c"><i className="fa-solid fa-file-pen"></i></span>Post Approval<span className="nav-badge-c amber">7</span>
          </Link>
          <div className="sidebar-section-label mt-2">Insights</div>
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
            <span className="nav-icon-c"><i className="fa-solid fa-file-lines"></i></span>Comments<span className="nav-badge-c amber">3</span>
          </Link>
          <Link to="/author/submit" className={iLink('submit')} onClick={closeSidebar}>
            <span className="nav-icon-c"><i className="fa-solid fa-paper-plane"></i></span>Submitted Posts
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
            <span className="nav-icon-c"><i className="fa-solid fa-bell"></i></span>Notifications<span className="nav-badge-c">4</span>
          </Link>
          <Link to="/reader/profile" className={iLink('profile')} onClick={closeSidebar}>
            <span className="nav-icon-c"><i className="fa-solid fa-circle-user"></i></span>Profile
          </Link>
        </div>
      )}

      <div className="sidebar-footer p-3">
        <div className="d-flex align-items-center gap-2 p-2 rounded-3" style={{cursor:'pointer'}}>
          <div className="avatar-c d-flex align-items-center justify-content-center fw-bold text-white overflow-hidden" style={{width:'36px', height:'36px', fontSize:'14px', background: zone === 'admin' ? '#2563eb' : (zone === 'author' ? '#059669' : '#f59e0b')}}>
            {user.profilePic && user.profilePic !== '' ? (
              <img src={`http://localhost:5001/${user.profilePic}`} alt="avatar" style={{width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover'}} />
            ) : (
              (user.name?.charAt(0) || zone.charAt(0)).toUpperCase()
            )}
          </div>
          <div>
            <div style={{fontSize:'13px', fontWeight:600, color:'#fff'}} id="nav-user-name">
                {user.name || 'Guest User'}
            </div>
            <div style={{fontSize:'11px', color:'var(--blue-400)', textTransform: 'capitalize'}} id="nav-user-role">
                {user.role || zone}
            </div>
          </div>
          <i className="fa-solid fa-ellipsis-vertical ms-auto" style={{color:'rgba(255,255,255,.3)', fontSize:'12px'}}></i>
        </div>
      </div>
    </aside>
  );
}
