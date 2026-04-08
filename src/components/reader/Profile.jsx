import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Profile form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState('');
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/reader/profile');
      if (response.data.success) {
        const user = response.data.data;
        setProfile(user);
        setName(user.name || '');
        setEmail(user.email || '');
        setBio(user.bio || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setSuccessMsg('');
      setErrorMsg('');

      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('bio', bio);
      if (profilePic) {
        formData.append('profilePic', profilePic);
      }

      const response = await api.put('/reader/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setSuccessMsg('Profile updated successfully!');
        setProfile(response.data.data);
        // Update localStorage
        const stored = JSON.parse(localStorage.getItem('user'));
        if (stored) {
          stored.name = response.data.data.name;
          stored.email = response.data.data.email;
          stored.bio = response.data.data.bio;
          stored.profilePic = response.data.data.profilePic;
          localStorage.setItem('user', JSON.stringify(stored));
        }
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      setPwLoading(true);
      setPwMsg('');
      setPwError('');

      const response = await api.put('/reader/profile/password', {
        currentPassword,
        newPassword,
        confirmPassword
      });

      if (response.data.success) {
        setPwMsg('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPwMsg(''), 3000);
      }
    } catch (error) {
      setPwError(error.response?.data?.message || 'Failed to update password');
    } finally {
      setPwLoading(false);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading profile...</div>;
  if (!profile) return <div className="p-4 text-center text-danger">Failed to load profile</div>;

  return (
    <> 
<div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-3">
  <div><h4 className="fw-800 mb-1">Profile Management</h4></div>
  <button className="btn-primary-c" onClick={handleSaveProfile} disabled={saving}>
    <i className="fa-solid fa-save"></i> {saving ? 'Saving...' : 'Save Changes'}
  </button>
</div>

{successMsg && <div className="alert alert-success" style={{padding:'10px',fontSize:'14px',borderRadius:'8px',marginBottom:'16px',background:'#ecfdf5',color:'var(--green)',border:'1px solid #a7f3d0'}}>{successMsg}</div>}
{errorMsg && <div className="alert alert-danger" style={{padding:'10px',fontSize:'14px',borderRadius:'8px',marginBottom:'16px'}}>{errorMsg}</div>}

<div className="row g-3">
  <div className="col-lg-6"><div className="card-custom"><div className="card-head-custom"><span className="card-title-c">Personal Information</span></div><div className="p-3">
    <div className="text-center mb-3">
      <div className="avatar-c d-flex align-items-center justify-content-center text-white fw-bold mx-auto mb-2" style={{width:'64px',height:'64px',fontSize:'24px',background:'var(--blue-500)'}}>
        {profile.profilePic ? (
          <img src={`http://localhost:5001/${profile.profilePic}`} alt="Profile" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}} />
        ) : (
          name.charAt(0).toUpperCase()
        )}
      </div>
      <label style={{cursor:'pointer'}}>
        <button className="btn-outline-c btn-sm-c" onClick={(e) => { e.preventDefault(); e.target.closest('label').querySelector('input').click(); }}>
          <i className="fa-solid fa-camera"></i> Change Photo
        </button>
        <input type="file" className="d-none" accept="image/*" onChange={(e) => setProfilePic(e.target.files[0])} />
      </label>
      {profilePic && <div className="small text-success mt-1">{profilePic.name} selected</div>}
    </div>
    <div className="mb-3">
      <label className="form-label-c">Full Name</label>
      <input 
        className="form-control-c" 
        value={name} 
        onChange={(e) => setName(e.target.value)}
        style={{width:'100%',padding:'10px 12px',borderRadius:'8px',border:'1px solid var(--gray-200)',fontSize:'14px'}}
      />
    </div>
    <div className="mb-3">
      <label className="form-label-c">Email</label>
      <input 
        className="form-control-c" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{width:'100%',padding:'10px 12px',borderRadius:'8px',border:'1px solid var(--gray-200)',fontSize:'14px'}}
      />
    </div>
    <div>
      <label className="form-label-c">Bio</label>
      <textarea 
        className="form-control-c"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        rows="3"
        style={{width:'100%',padding:'10px 12px',borderRadius:'8px',border:'1px solid var(--gray-200)',fontSize:'14px'}}
      ></textarea>
    </div>
    <div className="mt-2" style={{fontSize:'12px',color:'var(--gray-400)'}}>
      <strong>Username:</strong> @{profile.username} &nbsp;·&nbsp; <strong>Role:</strong> {profile.role} &nbsp;·&nbsp; <strong>Joined:</strong> {new Date(profile.createdAt).toLocaleDateString()}
    </div>
  </div></div></div>
  
  <div className="col-lg-6"><div className="card-custom"><div className="card-head-custom"><span className="card-title-c">Security Settings</span></div><div className="p-3">
    {pwMsg && <div className="alert alert-success" style={{padding:'10px',fontSize:'14px',borderRadius:'8px',marginBottom:'12px',background:'#ecfdf5',color:'var(--green)',border:'1px solid #a7f3d0'}}>{pwMsg}</div>}
    {pwError && <div className="alert alert-danger" style={{padding:'10px',fontSize:'14px',borderRadius:'8px',marginBottom:'12px'}}>{pwError}</div>}
    
    <div className="mb-3">
      <label className="form-label-c">Current Password</label>
      <input 
        className="form-control-c" 
        type="password" 
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        style={{width:'100%',padding:'10px 12px',borderRadius:'8px',border:'1px solid var(--gray-200)',fontSize:'14px'}}
      />
    </div>
    <div className="mb-3">
      <label className="form-label-c">New Password</label>
      <input 
        className="form-control-c" 
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        style={{width:'100%',padding:'10px 12px',borderRadius:'8px',border:'1px solid var(--gray-200)',fontSize:'14px'}}
      />
    </div>
    <div className="mb-3">
      <label className="form-label-c">Confirm Password</label>
      <input 
        className="form-control-c" 
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={{width:'100%',padding:'10px 12px',borderRadius:'8px',border:'1px solid var(--gray-200)',fontSize:'14px'}}
      />
    </div>
    <button className="btn-primary-c w-100 justify-content-center" onClick={handleUpdatePassword} disabled={pwLoading}>
      {pwLoading ? 'Updating...' : 'Update Password'}
    </button>
  </div></div></div>
</div>
  
    </>
  );
}
