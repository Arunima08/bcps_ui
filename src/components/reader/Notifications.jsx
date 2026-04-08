import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/reader/notifications');
      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/reader/notifications/read');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all read:', error);
    }
  };

  const handleMarkOneRead = async (id) => {
    try {
      await api.put(`/reader/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotifIcon = (type) => {
    switch(type) {
      case 'new_post': return { icon: 'fa-newspaper', bg: 'var(--blue-50)', color: 'var(--blue-600)' };
      case 'like': return { icon: 'fa-heart', bg: '#fef2f2', color: 'var(--red)' };
      case 'comment': return { icon: 'fa-comment', bg: '#ecfdf5', color: 'var(--green)' };
      case 'reply': return { icon: 'fa-reply', bg: '#f5f3ff', color: 'var(--purple)' };
      case 'follow': return { icon: 'fa-user-plus', bg: '#fffbeb', color: 'var(--amber)' };
      case 'category': return { icon: 'fa-tag', bg: 'var(--blue-50)', color: 'var(--blue-600)' };
      default: return { icon: 'fa-bell', bg: 'var(--gray-100)', color: 'var(--gray-600)' };
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <> 
<div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-3">
  <div>
    <h4 className="fw-800 mb-1">Notifications</h4>
    <p style={{color:'var(--gray-400)',fontSize:'13px'}}>Stay updated with activity {unreadCount > 0 && <span className="badge-c badge-pending" style={{marginLeft:'8px'}}>{unreadCount} unread</span>}</p>
  </div>
  {unreadCount > 0 && (
    <button className="btn-outline-c btn-sm-c" onClick={handleMarkAllRead}>Mark All Read</button>
  )}
</div>
<div className="card-custom"><div className="p-3">
  {loading ? (
    <div className="text-center py-4 text-muted">Loading notifications...</div>
  ) : notifications.length === 0 ? (
    <div className="text-center py-4 text-muted">
      <i className="fa-solid fa-bell-slash fs-1 mb-3 d-block" style={{color:'var(--gray-300)'}}></i>
      <p>No notifications yet</p>
    </div>
  ) : (
    notifications.map(notif => {
      const { icon, bg, color } = getNotifIcon(notif.type);
      return (
        <div 
          key={notif._id} 
          className={`notif-item ${!notif.isRead ? 'unread' : ''}`}
          onClick={() => {
            if (!notif.isRead) handleMarkOneRead(notif._id);
            if (notif.relatedPost?._id) navigate(`/reader/blog/${notif.relatedPost._id}`);
          }}
          style={{cursor: 'pointer'}}
        >
          <div className="notif-icon" style={{background: bg, color: color}}>
            <i className={`fa-solid ${icon}`}></i>
          </div>
          <div style={{flex:1}}>
            <div className="notif-text">
              {notif.relatedUser && <strong>{notif.relatedUser.name} </strong>}
              {notif.message}
            </div>
            <div className="notif-time">{getTimeAgo(notif.createdAt)}</div>
          </div>
          {!notif.isRead && <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'var(--blue-500)',flexShrink:0}}></div>}
        </div>
      );
    })
  )}
</div></div>
  
    </>
  );
}
