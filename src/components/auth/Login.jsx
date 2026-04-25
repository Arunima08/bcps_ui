import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api';

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState('reader');
  const [showPw, setShowPw] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if(!email || !password) {
      toast.warn('Please provide email and password');
      setError('Please provide email and password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await api.post('/auth/login', {
        email, password, role
      });

      if(response.data.success) {
        sessionStorage.setItem('user', JSON.stringify(response.data.data));
        toast.success(`Welcome back, ${response.data.data.name}!`);
        navigate(`/${role}`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        {/* LEFT PANEL */}
        <div className="left-panel">
          <div className="left-panel-content">
            <h1 className="fw-bold mb-3">Blogging and Content Publishing System</h1>
            <p className="mb-5 fs-5">Write • Share • Inspire</p>
            <ul className="auth-features-list">
              <li><i className="fas fa-pen"></i> Create & publish blogs</li>
              <li><i className="fas fa-users"></i> Connect with readers</li>
              <li><i className="fas fa-chart-line"></i> Track your growth</li>
            </ul>
          </div>
        </div>

        {/* FORM PANEL */}
        <div className="auth-form-container">
          <h2 className="fw-bold mb-2">Welcome Back</h2>
          <p className="text-muted mb-4">Login to your account to continue</p>

          {error && <div className="alert alert-danger p-2 small">{error}</div>}

          <p className="small text-muted fw-bold mb-3 uppercase-tracking">Select Role</p>
          
          <div className="row g-3 mb-4">
            <div className="col-4">
              <div 
                className={`role-btn ${role === 'reader' ? 'selected' : ''}`} 
                onClick={() => setRole('reader')}
              >
                <i className="fas fa-book"></i>
                <span>Reader</span>
              </div>
            </div>
            <div className="col-4">
              <div 
                className={`role-btn ${role === 'author' ? 'selected' : ''}`} 
                onClick={() => setRole('author')}
              >
                <i className="fas fa-pen-nib"></i>
                <span>Author</span>
              </div>
            </div>
            <div className="col-4">
              <div 
                className={`role-btn ${role === 'admin' ? 'selected' : ''}`} 
                onClick={() => setRole('admin')}
              >
                <i className="fas fa-user-shield"></i>
                <span>Admin</span>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label-c mb-2">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label-c mb-2">Password</label>
            <div className="position-relative">
              <input 
                type={showPw ? "text" : "password"} 
                className="form-input" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i 
                className={`fas ${showPw ? 'fa-eye-slash' : 'fa-eye'} position-absolute top-50 end-0 translate-middle-y me-3`} 
                style={{ cursor: 'pointer', color: '#94a3b8' }} 
                onClick={() => setShowPw(!showPw)}
              ></i>
            </div>
          </div>

          <button className="btn-main mb-4" onClick={handleLogin} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>

          <p className="text-center text-muted small">
            Don't have an account? <Link to="/register" className="text-primary fw-bold">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
