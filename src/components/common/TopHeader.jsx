import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  }, []);

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
            <span className="notif-dot"></span>
          </button>
          {notifOpen && (
            <div className="dropdown-menu show position-absolute end-0 mt-2 shadow-sm p-3" style={{ minWidth: '250px', border: '1px solid var(--gray-200)', borderRadius: '8px', zIndex: 1050, background: '#fff' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0 fw-bold" style={{fontSize: '14px', color:'var(--gray-900)'}}>Notifications</h6>
                <span style={{fontSize:'11px', color:'var(--blue-500)', cursor:'pointer'}}>Mark all read</span>
              </div>
              <div className="text-center py-3 text-muted" style={{fontSize: '12px'}}>
                <i className="fa-regular fa-bell-slash mb-2" style={{fontSize: '20px', color: 'var(--gray-300)'}}></i>
                <div>No new notifications.</div>
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
