import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';

export default function Comments() {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [statusFilter]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'All') {
        params.append('status', statusFilter.toLowerCase());
      }
      
      const response = await api.get(`/admin/comments?${params.toString()}`);
      if (response.data.success) {
        setComments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (commentId, action) => {
    try {
      if (action === 'approve') {
        await api.put(`/admin/comments/${commentId}/approve`);
      } else if (action === 'delete') {
        if(window.confirm("Are you sure you want to delete this comment?")) {
          await api.delete(`/admin/comments/${commentId}`);
        } else {
          return;
        }
      }
      fetchComments();
    } catch (error) {
      console.error(`Error performing ${action} on comment:`, error);
    }
  };

  const handleClearFlagged = async () => {
    if(window.confirm("Are you sure you want to delete all flagged comments?")) {
      try {
        await api.delete('/admin/comments/flagged');
        fetchComments();
      } catch (error) {
        console.error('Error clearing flagged comments:', error);
      }
    }
  };

  return (
    <> 
<div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-3">
  <div><h4 className="fw-800 mb-1">Comment Moderation</h4><p>Review and manage all user comments</p></div>
  <button className="btn-danger-c" onClick={handleClearFlagged}><i className="fa-solid fa-trash"></i> Clear Flagged</button>
</div>
<div className="card-custom">
  <div className="card-head-custom">
    <span className="card-title-c">All Comments</span>
    <select 
      className="form-select form-select-sm" 
      style={{width: 'auto', borderRadius: '8px', fontSize: '13px'}}
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      <option>All</option>
      <option>Pending</option>
      <option>Flagged</option>
      <option>Approved</option>
    </select>
  </div>
  <div className="table-responsive">
    <table>
      <thead><tr><th>User</th><th>Comment</th><th>Post</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        {loading ? (
          <tr><td colSpan="6" className="text-center py-4">Loading comments...</td></tr>
        ) : comments.length === 0 ? (
          <tr><td colSpan="6" className="text-center py-4">No comments found</td></tr>
        ) : (
          comments.map((comment, index) => {
            let statusClass = 'badge-pending';
            if(comment.status === 'approved') statusClass = 'badge-published';
            if(comment.status === 'flagged') statusClass = 'badge-rejected';

            const bgColors = ['var(--blue-500)', 'var(--green)', 'var(--amber)', 'var(--purple)', 'var(--red)'];
            const bgColor = bgColors[index % bgColors.length];

            return (
              <tr key={comment._id}>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <div className="avatar-c d-flex align-items-center justify-content-center text-white fw-bold" style={{width:'28px',height:'28px',fontSize:'11px', background: bgColor}}>
                      {comment.user?.name?.charAt(0) || 'G'}
                    </div> 
                    {comment.user?.name || 'Guest'}
                  </div>
                </td>
                <td style={{maxWidth: '300px'}}><div className="text-truncate">{comment.text}</div></td>
                <td>{comment.post?.title || 'Unknown Post'}</td>
                <td>{new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                <td><span className={`badge-c ${statusClass}`}>{comment.status.charAt(0).toUpperCase() + comment.status.slice(1)}</span></td>
                <td>
                  {(comment.status === 'pending' || comment.status === 'flagged') && (
                    <button className="btn-success-c me-1" onClick={() => handleAction(comment._id, 'approve')}>Approve</button>
                  )}
                  <button className="btn-danger-c" onClick={() => handleAction(comment._id, 'delete')}>Remove</button>
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
