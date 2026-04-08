import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      const response = await api.get(`/admin/users?search=${searchTerm}&role=${roleFilter}`);
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId, action) => {
    try {
      if(action === 'ban') {
        await api.put(`/admin/users/${userId}/ban`);
      } else if (action === 'approve') {
        await api.put(`/admin/users/${userId}/approve`);
      } else if (action === 'restore') {
        await api.put(`/admin/users/${userId}/restore`);
      }
      fetchUsers();
    } catch (error) {
      console.error(`Error performing ${action} on user:`, error);
    }
  };

  return (
    <> 
<div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-3">
  <div><h4 className="fw-800 mb-1">User Management</h4><p style={{color:'var(--gray-400)',fontSize:'13px'}}>Manage all registered users</p></div>
</div>
<div className="card-custom">
  <div className="card-head-custom">
    <span className="card-title-c">All Users</span>
    <div className="d-flex gap-2 flex-wrap">
      <div className="search-box">
        <i className="fa-solid fa-search"></i>
        <input 
          type="text" 
          placeholder="Search users..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <select 
        className="form-select form-select-sm" 
        style={{width:'auto',borderRadius:'8px',fontSize:'13px',borderColor:'var(--gray-200)'}}
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
      >
        <option>All Roles</option>
        <option>Admin</option>
        <option>Author</option>
        <option>Reader</option>
      </select>
    </div>
  </div>
  <div className="table-responsive">
    <table>
      <thead><tr><th>#</th><th>User</th><th>Role</th><th>Email</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        {loading ? (
          <tr><td colSpan="7" className="text-center py-4">Loading users...</td></tr>
        ) : users.length === 0 ? (
          <tr><td colSpan="7" className="text-center py-4">No users found</td></tr>
        ) : (
          users.map((user, index) => {
            let roleClass = 'badge-draft';
            if(user.role === 'author') roleClass = 'badge-progress';
            if(user.role === 'admin') roleClass = 'badge-published'; // fallback matching styling
            
            let statusClass = 'badge-published'; // active
            if(user.status === 'pending') statusClass = 'badge-pending';
            if(user.status === 'banned') statusClass = 'badge-rejected';

            const bgColors = ['var(--blue-500)', 'var(--green)', 'var(--amber)', 'var(--purple)', 'var(--red)'];
            const bgColor = bgColors[index % bgColors.length];

            return (
              <tr key={user._id}>
                <td>{String(index + 1).padStart(2, '0')}</td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <div className="avatar-c d-flex align-items-center justify-content-center text-white fw-bold" style={{width:'28px',height:'28px',fontSize:'11px', background: bgColor}}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="fw-600">{user.name}</div>
                      <div style={{fontSize:'11px',color:'var(--gray-400)'}}>@{user.username}</div>
                    </div>
                  </div>
                </td>
                <td><span className={`badge-c ${roleClass}`}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span></td>
                <td>{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td><span className={`badge-c ${statusClass}`}>{user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span></td>
                <td>
                  <button className="btn-outline-c btn-sm-c me-1">Edit</button>
                  {user.status === 'active' && user.role !== 'admin' && <button className="btn-danger-c" onClick={() => handleAction(user._id, 'ban')}>Ban</button>}
                  {user.status === 'pending' && <button className="btn-success-c" onClick={() => handleAction(user._id, 'approve')}>Approve</button>}
                  {user.status === 'banned' && <button className="btn-success-c" onClick={() => handleAction(user._id, 'restore')}>Restore</button>}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>
</div>
    </>
  );
}
