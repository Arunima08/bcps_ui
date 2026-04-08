import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';

export default function Comments() {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await api.get('/author/comments');
      if (response.data.success) {
        setComments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReplyChange = (commentId, text) => {
    setReplyText({ ...replyText, [commentId]: text });
  };

  const handleReplySubmit = async (commentId) => {
    const text = replyText[commentId];
    if (!text || !text.trim()) return;

    try {
      await api.post(`/author/comments/${commentId}/reply`, { text });
      setReplyText({ ...replyText, [commentId]: '' });
      fetchComments();
    } catch (error) {
      console.error('Error replying to comment:', error);
      alert('Failed to reply to comment.');
    }
  };

  return (
    <> 
<div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-3">
  <div><h4 className="fw-800 mb-1">Comment Responses</h4><p>Reply to readers on your posts</p></div>
</div>
<div className="card-custom"><div className="p-3">
  {loading ? (
    <div className="text-center py-4 text-muted">Loading comments...</div>
  ) : comments.length === 0 ? (
    <div className="text-center py-4 text-muted">No comments on your posts yet.</div>
  ) : (
    comments.map((comment, index) => {
      const isUnread = comment.status === 'pending'; // or some other logic
      const bgColors = ['var(--blue-500)', 'var(--green)', 'var(--amber)', 'var(--purple)', 'var(--red)'];
      const bgColor = bgColors[index % bgColors.length];
      
      return (
        <div key={comment._id} className={`notif-item ${isUnread ? 'unread' : ''}`}>
          <div className="avatar-c d-flex align-items-center justify-content-center text-white fw-bold" style={{background: bgColor}}>
            {comment.user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-grow-1">
            <div className="notif-text">
              <strong>{comment.user?.name || 'Guest'}</strong> on "<Link to={`/reader/blog/${comment.post?._id}`}>{comment.post?.title || 'Unknown Post'}</Link>" — "{comment.text}"
            </div>
            <div className="notif-time">{new Date(comment.createdAt).toLocaleString()}</div>
            
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-2 pl-3 border-start ps-3 py-1">
                {comment.replies.map((reply, i) => (
                  <div key={i} className="notif-text text-muted mb-1">
                    <strong>You replied:</strong> {reply.text}
                  </div>
                ))}
              </div>
            )}

            <div className="d-flex gap-2 mt-2">
              <input 
                className="form-control-c" 
                placeholder="Write a reply..." 
                value={replyText[comment._id] || ''}
                onChange={(e) => handleReplyChange(comment._id, e.target.value)}
              />
              <button className="btn-primary-c btn-sm-c" onClick={() => handleReplySubmit(comment._id)}>Reply</button>
            </div>
          </div>
        </div>
      );
    })
  )}
</div></div>
  
    </>
  );
}
