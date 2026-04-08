import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import TopHeader from '../components/common/TopHeader';

export default function ZoneLayout({ children, zone }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      <Sidebar zone={zone} sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
      <div className={`overlay-c ${sidebarOpen ? 'show' : ''}`} onClick={closeSidebar}></div>
      <div className="main-wrap">
        <TopHeader zone={zone} toggleSidebar={toggleSidebar} />
        <div className="p-4">
          {children}
        </div>
      </div>
    </>
  );
}
