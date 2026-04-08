import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    bio: '',
    role: 'reader'
  });
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if(!termsAccepted) {
      setError('Please accept the Terms & Conditions');
      return;
    }
    if(!formData.name || !formData.username || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('bio', formData.bio);
    data.append('role', formData.role);
    if(profilePic) {
      data.append('profilePic', profilePic);
    }

    try {
      setLoading(true);
      setError('');
      const response = await api.post('/auth/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if(response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
        navigate(formData.role === 'author' ? '/author' : '/reader');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg d-flex align-items-center justify-content-center min-vh-100 py-5" style={{ overflowX: 'hidden' }}>
      {/* ORBS */}
      <div className="auth-orb" style={{ width: '350px', height: '350px', background: '#6366f1', top: '-120px', right: '-120px' }}></div>
      <div className="auth-orb" style={{ width: '250px', height: '250px', background: '#818cf8', bottom: '-100px', left: '-100px' }}></div>
      
      <div className="container">
        <div className="row align-items-center justify-content-center">
          
          {/* LEFT TEXT PANEL */}
          <div className="col-lg-5 d-none d-lg-block text-white">
            <h1 className="fw-bold mb-3" style={{ fontSize: '42px' }}>BlogSphere</h1>
            <p className="text-info mb-4 fs-5">Write • Share • Inspire</p>
            <div className="mb-3"><i className="fas fa-pen me-2"></i>Create & publish blogs</div>
            <div className="mb-3"><i className="fas fa-users me-2"></i>Connect with readers</div>
            <div><i className="fas fa-chart-line me-2"></i>Track your growth</div>
          </div>

          {/* RIGHT REGISTER FORM */}
          <div className="col-lg-5 col-md-8 col-sm-10 col-12">
            <div className="auth-card shadow-lg p-4 p-md-5">
              
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="bg-primary text-white d-flex align-items-center justify-content-center rounded" style={{ width: '50px', height: '50px' }}>
                  <i className="fas fa-blog"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-0">BlogSphere</h5>
                  <small className="text-primary">Blogging Platform</small>
                </div>
              </div>

              <h4 className="fw-bold mb-1">Create your account</h4>
              <p className="text-muted mb-3">Start your blogging journey</p>

              {error && <div className="alert alert-danger" style={{padding: '10px', fontSize: '14px', borderRadius: '4px'}}>{error}</div>}

              <div className="mb-2">
                <label className="form-label">Name</label>
                <input type="text" className="form-input" placeholder="Your full name" name="name" value={formData.name} onChange={handleChange} />
              </div>
              <div className="mb-2">
                <label className="form-label">Username</label>
                <input type="text" className="form-input" placeholder="@username" name="username" value={formData.username} onChange={handleChange} />
              </div>
              <div className="mb-2">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" placeholder="you@example.com" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="mb-2">
                <label className="form-label">Password</label>
                <input type="password" className="form-input" placeholder="••••••" name="password" value={formData.password} onChange={handleChange} />
              </div>
              <div className="mb-2">
                <label className="form-label">Role</label>
                <select className="form-input" name="role" value={formData.role} onChange={handleChange} style={{ height: 'auto', padding: '10px 15px' }}>
                  <option value="reader">Reader</option>
                  <option value="author">Author</option>
                </select>
              </div>
              <div className="mb-2">
                <label className="form-label">Profile Picture</label>
                <input type="file" className="form-input" accept="image/*" onChange={(e) => setProfilePic(e.target.files[0])} />
              </div>
              <div className="mb-2">
                <label className="form-label">Bio</label>
                <textarea className="form-input" rows="2" placeholder="Write something..." name="bio" value={formData.bio} onChange={handleChange}></textarea>
              </div>

              <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
                <label className="form-check-label small">
                  I agree to Terms & Conditions
                </label>
              </div>

              <button className="btn-main mb-2" onClick={handleRegister} disabled={loading}>
                <i className="fas fa-user-plus me-2"></i>{loading ? 'Creating...' : 'Create Account'}
              </button>

              <p className="text-center text-muted small">
                Already have an account? <Link to="/" className="text-primary fw-semibold">Login</Link>
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
