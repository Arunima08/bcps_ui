import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
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
      toast.warn('Please accept the Terms & Conditions');
      setError('Please accept the Terms & Conditions');
      return;
    }
    if(!formData.name || !formData.username || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
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
        sessionStorage.setItem('user', JSON.stringify(response.data.data));
        toast.success('Registration successful! Welcome aboard.');
        navigate(formData.role === 'author' ? '/author' : '/reader');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card" style={{ maxWidth: '1100px' }}>
        {/* LEFT PANEL */}
        <div className="left-panel">
          <div className="left-panel-content">
            <h1 className="fw-bold mb-3">Blogging and Content Publishing System</h1>
            <p className="mb-5 fs-5">Start your blogging journey today</p>
            <ul className="auth-features-list">
              <li><i className="fas fa-check-circle"></i> Professional Profile</li>
              <li><i className="fas fa-check-circle"></i> Global Content Reach</li>
              <li><i className="fas fa-check-circle"></i> Real-time Analytics</li>
              <li><i className="fas fa-check-circle"></i> Custom Dashboard</li>
            </ul>
          </div>
        </div>

        {/* FORM PANEL */}
        <div className="auth-form-container" style={{ padding: '40px' }}>
          <h2 className="fw-bold mb-2">Create Account</h2>
          <p className="text-muted mb-4">Fill in the details to get started</p>

          {error && <div className="alert alert-danger p-2 small">{error}</div>}

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label-c mb-2">Full Name</label>
              <input type="text" className="form-input" placeholder="John Doe" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label-c mb-2">Username</label>
              <input type="text" className="form-input" placeholder="@johndoe" name="username" value={formData.username} onChange={handleChange} />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label-c mb-2">Email Address</label>
              <input type="email" className="form-input" placeholder="john@example.com" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label-c mb-2">Password</label>
              <input type="password" className="form-input" placeholder="••••••••" name="password" value={formData.password} onChange={handleChange} />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label-c mb-2">Select Role</label>
              <select className="form-input" name="role" value={formData.role} onChange={handleChange}>
                <option value="reader">Reader</option>
                <option value="author">Author</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label-c mb-2">Profile Picture</label>
              <input type="file" className="form-input" accept="image/*" onChange={(e) => setProfilePic(e.target.files[0])} />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label-c mb-2">Short Bio</label>
            <textarea className="form-input" rows="2" placeholder="Tell us about yourself..." name="bio" value={formData.bio} onChange={handleChange}></textarea>
          </div>

          <div className="form-check mb-4">
            <input className="form-check-input" type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} id="terms" />
            <label className="form-check-label small text-muted" htmlFor="terms">
              I agree to the <span className="text-primary fw-bold">Terms & Conditions</span>
            </label>
          </div>

          <button className="btn-main mb-3" onClick={handleRegister} disabled={loading}>
            {loading ? 'Creating Account...' : 'Get Started'}
          </button>

          <p className="text-center text-muted small">
            Already have an account? <Link to="/login" className="text-primary fw-bold">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
