import React, { useState } from 'react';
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

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user session
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
          / E-Cart Blog Portal
        </span>
      </div>
      <div className="d-flex align-items-center gap-2">
        <button className="header-btn-c"><i className="fa-solid fa-magnifying-glass"></i></button>
        <button className="header-btn-c"><i className="fa-solid fa-bell"></i><span className="notif-dot"></span></button>
        <button className="header-btn-c"><i className="fa-solid fa-gear"></i></button>
        <div className="position-relative">
          <div 
            className="d-flex align-items-center gap-2 px-3 py-1 rounded-3" 
            style={{background: 'var(--gray-100)', border: '1px solid var(--gray-200)', cursor: 'pointer'}}
            onClick={() => setDropdownOpen(!dropdownOpen)}
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
