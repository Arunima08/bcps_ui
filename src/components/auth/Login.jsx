import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
        localStorage.setItem('user', JSON.stringify(response.data.data));
        navigate(`/${role}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg d-flex align-items-center justify-content-center">
      <div className="container">
      <div className="row align-items-center justify-content-center">
        {/* LEFT */}
        <div className="col-lg-5 d-none d-lg-block text-white left-panel">
          <h1 className="fw-bold mb-3" style={{ fontSize: '42px' }}>BlogSphere</h1>
          <p className="text-info mb-4 fs-5">Write • Share • Inspire</p>
          <div className="mb-3"><i className="fas fa-pen me-2"></i>Create & publish blogs</div>
          <div className="mb-3"><i className="fas fa-users me-2"></i>Connect with readers</div>
          <div><i className="fas fa-chart-line me-2"></i>Track your growth</div>
        </div>

        {/* FORM */}
        <div className="col-lg-5 col-md-8">
          <div className="auth-card shadow-lg">
            <h4 className="text-center fw-bold mb-2">Welcome Back</h4>
            <p className="text-center text-muted mb-4">Login to continue</p>

            {error && <div className="alert alert-danger" style={{padding: '10px', fontSize: '14px', borderRadius: '4px'}}>{error}</div>}

            <p className="small text-muted fw-semibold">Select Role</p>
            
            <div className="row g-3 mb-4 text-center">
              <div className="col-4">
                <div 
                  className={`role-btn ${role === 'reader' ? 'selected' : ''}`} 
                  onClick={() => setRole('reader')}
                >
                  <i className="fas fa-book text-primary mb-2"></i>
                  <p className="small mb-0 fw-semibold">Reader</p>
                </div>
              </div>
              <div className="col-4">
                <div 
                  className={`role-btn ${role === 'author' ? 'selected' : ''}`} 
                  onClick={() => setRole('author')}
                >
                  <i className="fas fa-pen-nib text-success mb-2"></i>
                  <p className="small mb-0 fw-semibold">Author</p>
                </div>
              </div>
              <div className="col-4">
                <div 
                  className={`role-btn ${role === 'admin' ? 'selected' : ''}`} 
                  onClick={() => setRole('admin')}
                >
                  <i className="fas fa-user-shield text-dark mb-2"></i>
                  <p className="small mb-0 fw-semibold">Admin</p>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <div className="position-relative">
                <input 
                  type={showPw ? "text" : "password"} 
                  className="form-input pe-5" 
                  placeholder="••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <i 
                  className="fas fa-eye position-absolute top-50 end-0 translate-middle-y me-3" 
                  style={{ cursor: 'pointer' }} 
                  onClick={() => setShowPw(!showPw)}
                ></i>
              </div>
            </div>

            <button className="btn-main" onClick={handleLogin} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <p className="text-center mt-4 text-muted">
              Don't have account? <Link to="/register" className="text-primary fw-semibold">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
