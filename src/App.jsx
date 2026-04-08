import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, useNavigate, useLocation } from 'react-router-dom';
import './App.css';

// Layout
import ZoneLayout from './layouts/ZoneLayout';

// Public
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Admin
import AdminAnalytics from './components/admin/Analytics';
import AdminCategories from './components/admin/Categories';
import AdminComments from './components/admin/Comments';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminMedia from './components/admin/Media';
import AdminPosts from './components/admin/Posts';
import AdminUsers from './components/admin/Users';

// Author
import AuthorComments from './components/author/Comments';
import AuthorCreate from './components/author/Create';
import AuthorDrafts from './components/author/Drafts';
import AuthorDashboard from './components/author/AuthorDashboard';
import AuthorMedia from './components/author/Media';
import AuthorSubmit from './components/author/Submit';

// Reader
import ReaderBlog from './components/reader/Blog';
import ReaderBrowse from './components/reader/Browse';
import ReaderDashboard from './components/reader/ReaderDashboard';
import ReaderNotifications from './components/reader/Notifications';
import ReaderProfile from './components/reader/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<ZoneLayout zone="admin"><AdminDashboard /></ZoneLayout>} />
        <Route path="/admin/analytics" element={<ZoneLayout zone="admin"><AdminAnalytics /></ZoneLayout>} />
        <Route path="/admin/categories" element={<ZoneLayout zone="admin"><AdminCategories /></ZoneLayout>} />
        <Route path="/admin/comments" element={<ZoneLayout zone="admin"><AdminComments /></ZoneLayout>} />
        <Route path="/admin/media" element={<ZoneLayout zone="admin"><AdminMedia /></ZoneLayout>} />
        <Route path="/admin/posts" element={<ZoneLayout zone="admin"><AdminPosts /></ZoneLayout>} />
        <Route path="/admin/users" element={<ZoneLayout zone="admin"><AdminUsers /></ZoneLayout>} />

        {/* Author Routes */}
        <Route path="/author" element={<ZoneLayout zone="author"><AuthorDashboard /></ZoneLayout>} />
        <Route path="/author/comments" element={<ZoneLayout zone="author"><AuthorComments /></ZoneLayout>} />
        <Route path="/author/create" element={<ZoneLayout zone="author"><AuthorCreate /></ZoneLayout>} />
        <Route path="/author/drafts" element={<ZoneLayout zone="author"><AuthorDrafts /></ZoneLayout>} />
        <Route path="/author/media" element={<ZoneLayout zone="author"><AuthorMedia /></ZoneLayout>} />
        <Route path="/author/submit" element={<ZoneLayout zone="author"><AuthorSubmit /></ZoneLayout>} />

        {/* Reader Routes */}
        <Route path="/reader" element={<ZoneLayout zone="reader"><ReaderDashboard /></ZoneLayout>} />
        <Route path="/reader/blog/:id" element={<ZoneLayout zone="reader"><ReaderBlog /></ZoneLayout>} />
        <Route path="/reader/browse" element={<ZoneLayout zone="reader"><ReaderBrowse /></ZoneLayout>} />
        <Route path="/reader/notifications" element={<ZoneLayout zone="reader"><ReaderNotifications /></ZoneLayout>} />
        <Route path="/reader/profile" element={<ZoneLayout zone="reader"><ReaderProfile /></ZoneLayout>} />
      </Routes>
    </BrowserRouter>
  );
}
