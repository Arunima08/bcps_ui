import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

export default function TopHeader({ zone, toggleSidebar }) {
  const titles = {
    admin: 'Admin Dashboard',
    author: 'Author Dashboard',
    reader: 'Reader Dashboard'
  };

  const icons = {
    admin: 'fa-shield-halved',
    author: 'fa-pen-nib',
    reader: 'fa-book-open'
  };

  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const savedTheme = localStorage.getItem('dark-mode');
    if (savedTheme === 'true') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      setLanguage(savedLang);
    }
    fetchNotifications();
    // Poll for notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/common/notifications');
      if (response.data.success) {
        setNotifications(response.data.data);
        setUnreadCount(response.data.data.filter(n => !n.isRead).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/common/notifications/read');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all read:', error);
    }
  };

  const handleMarkOneRead = async (id) => {
    try {
      await api.put(`/common/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('dark-mode', 'true');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('dark-mode', 'false');
    }
  };



  const handleLogout = () => {
    sessionStorage.removeItem('user'); // Clear user session
    navigate('/'); // Redirect to login
  };

  return (
    <header className="top-header d-flex align-items-center px-4 gap-3">
      <button className="header-btn-c d-md-none" onClick={toggleSidebar}>
        <i className="fa-solid fa-bars"></i>
      </button>
      <div className="flex-grow-1">
        <span style={{fontSize: '16px', fontWeight: 700, color: 'var(--gray-900)'}}>
          {titles[zone] || 'Dashboard'}
        </span>
        <span style={{fontSize: '12px', fontWeight: 400, color: 'var(--gray-400)', marginLeft: '8px'}}>
          / Blogging and Content Publishing System
        </span>
      </div>
      <div className="d-flex align-items-center gap-2">
        {/* Search */}
        {/* <div className="position-relative">
          <button className="header-btn-c" onClick={() => { setSearchOpen(!searchOpen); setNotifOpen(false); setSettingsOpen(false); setDropdownOpen(false); }}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
          {searchOpen && (
            <div className="dropdown-menu show position-absolute end-0 mt-2 shadow-sm p-2" style={{ minWidth: '250px', border: '1px solid var(--gray-200)', borderRadius: '8px', zIndex: 1050, background: '#fff' }}>
              <input type="text" className="form-control-c w-100" placeholder="Search..." style={{padding:'8px 12px', borderRadius:'6px', border:'1px solid var(--gray-200)', fontSize: '14px', outline: 'none'}} autoFocus />
            </div>
          )}fkhjdfjkhgkdj
        </div> */}

        {/* Notifications */}
        <div className="position-relative">
          <button className="header-btn-c" onClick={() => { setNotifOpen(!notifOpen); setSearchOpen(false); setSettingsOpen(false); setDropdownOpen(false); }}>
            <i className="fa-solid fa-bell"></i>
            {unreadCount > 0 && <span className="notif-dot"></span>}
          </button>
          {notifOpen && (
            <div className="dropdown-menu show position-absolute end-0 mt-2 shadow-sm p-0" style={{ minWidth: '300px', border: '1px solid var(--gray-200)', borderRadius: '12px', zIndex: 1050, background: '#fff', overflow: 'hidden' }}>
              <div className="d-flex justify-content-between align-items-center p-3 border-bottom border-light">
                <h6 className="mb-0 fw-bold" style={{fontSize: '14px', color:'var(--gray-900)'}}>Notifications</h6>
                {unreadCount > 0 && (
                  <span style={{fontSize:'11px', color:'var(--blue-500)', cursor:'pointer', fontWeight: 600}} onClick={handleMarkAllRead}>Mark all read</span>
                )}
              </div>
              <div style={{maxHeight: '350px', overflowY: 'auto'}}>
                {notifications.length === 0 ? (
                  <div className="text-center py-4 text-muted" style={{fontSize: '12px'}}>
                    <i className="fa-regular fa-bell-slash mb-2 d-block" style={{fontSize: '24px', color: 'var(--gray-300)'}}></i>
                    <div>No notifications yet.</div>
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div 
                      key={notif._id} 
                      className={`notif-item-header d-flex gap-3 p-3 border-bottom border-light ${!notif.isRead ? 'bg-light' : ''}`}
                      onClick={() => {
                        if (!notif.isRead) handleMarkOneRead(notif._id);
                        if (notif.relatedPost?._id) navigate(`/${zone}/blog/${notif.relatedPost._id}`);
                      }}
                      style={{cursor: 'pointer', transition: 'background 0.2s', fontSize: '13px'}}
                    >
                      <div className="d-flex flex-column gap-1 flex-grow-1">
                        <div style={{color: 'var(--gray-800)', lineHeight: '1.4'}}>
                          {notif.message}
                        </div>
                        <div style={{fontSize: '11px', color: 'var(--gray-400)'}}>
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      {!notif.isRead && (
                        <div style={{width: '6px', height: '6px', background: 'var(--blue-500)', borderRadius: '50%', marginTop: '6px', flexShrink: 0}}></div>
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="p-2 border-top border-light bg-light text-center">
                <span 
                   style={{fontSize: '12px', color: 'var(--gray-600)', cursor: 'pointer', fontWeight: 500}} 
                   onClick={() => { navigate(`/${zone}/notifications`); setNotifOpen(false); }}
                >
                  View all notifications
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="position-relative">
          <button className="header-btn-c" onClick={() => { setSettingsOpen(!settingsOpen); setSearchOpen(false); setNotifOpen(false); setDropdownOpen(false); }}>
            <i className="fa-solid fa-gear"></i>
          </button>
          {settingsOpen && (
            <div className="dropdown-menu show position-absolute end-0 mt-2 shadow-sm p-2" style={{ minWidth: '200px', border: '1px solid var(--gray-200)', borderRadius: '8px', zIndex: 1050, background: '#fff' }}>
              <h6 className="px-2 mb-2 pt-1 fw-bold" style={{fontSize: '14px', color:'var(--gray-900)'}}>Quick Settings</h6>
              <div className="dropdown-item d-flex align-items-center gap-2" style={{ padding: '8px 10px', fontSize: '13px', cursor: 'pointer', borderRadius: '6px', color: 'var(--gray-900)' }} onClick={(e) => { e.stopPropagation(); toggleDarkMode(); }}>
                <i className="fa-solid fa-moon text-muted"></i> Dark Mode
                <div className="form-check form-switch ms-auto mb-0">
                  <input className="form-check-input" type="checkbox" style={{cursor:'pointer'}} checked={isDarkMode} readOnly />
                </div>
              </div>
              {/* <div className="dropdown-item d-flex align-items-center gap-2" style={{ padding: '8px 10px', fontSize: '13px', cursor: 'default', borderRadius: '6px', color: 'var(--gray-900)' }} onClick={(e) => e.stopPropagation()}>
                <i className="fa-solid fa-globe text-muted"></i> Language
                <select 
                  className="form-select ms-auto mb-0" 
                  value={language}
                  onChange={(e) => {
                    const newLang = e.target.value;
                    setLanguage(newLang);
                    localStorage.setItem('language', newLang);
                  }}
                  style={{ width: 'auto', padding: '2px 24px 2px 8px', fontSize: '12px', cursor: 'pointer', border: '1px solid var(--gray-200)', borderRadius: '4px', background: 'transparent', color: 'inherit' }}
                >
                  <option value="English" style={{color: '#000'}}>English</option>
                  <option value="Hindi" style={{color: '#000'}}>Hindi</option>
                  <option value="Spanish" style={{color: '#000'}}>Spanish</option>
                  <option value="French" style={{color: '#000'}}>French</option>
                </select>
              </div> */}
            </div>
          )}
        </div>
        <div className="position-relative">
          <div 
            className="d-flex align-items-center gap-2 px-3 py-1 rounded-3" 
            style={{background: 'var(--gray-100)', border: '1px solid var(--gray-200)', cursor: 'pointer'}}
            onClick={() => { setDropdownOpen(!dropdownOpen); setSearchOpen(false); setNotifOpen(false); setSettingsOpen(false); }}
          >
            <span className={`zone-strip ${zone}`}>
              <i className={`fa-solid ${icons[zone]}`}></i> {zone.charAt(0).toUpperCase() + zone.slice(1)} Zone
            </span>
            <i className={`fa-solid fa-chevron-${dropdownOpen ? 'up' : 'down'}`} style={{fontSize: '10px', color: 'var(--gray-400)'}}></i>
          </div>

          {dropdownOpen && (
            <div className="dropdown-menu show position-absolute end-0 mt-2 shadow-sm" style={{ minWidth: '150px', border: '1px solid var(--gray-200)', borderRadius: '8px', zIndex: 1050, background: '#fff' }}>
              <div 
                className="dropdown-item text-danger d-flex align-items-center gap-2" 
                style={{ cursor: 'pointer', padding: '10px 15px', fontWeight: 500 }}
                onClick={handleLogout}
              >
                <i className="fa-solid fa-right-from-bracket"></i> Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
