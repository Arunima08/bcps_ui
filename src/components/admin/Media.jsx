import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';

export default function Media() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const response = await api.get('/admin/media');
      if (response.data.success) {
        setMediaFiles(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const response = await api.post('/admin/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if(response.data.success) {
        fetchMedia();
      }
    } catch (error) {
      console.error('Error uploading media:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
      e.target.value = null; // reset
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if(window.confirm('Delete this file permanently?')) {
      try {
        await api.delete(`/admin/media/${id}`);
        fetchMedia();
      } catch (error) {
        console.error('Error deleting media:', error);
      }
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getIcon = (type) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎬';
    if (type.includes('pdf')) return '📄';
    return '📁';
  };

  const filteredMedia = mediaFiles.filter(item => 
    item.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <> 
<div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-3">
  <div><h4 className="fw-800 mb-1">Media Library</h4><p>All uploaded files and images</p></div>
  <button className="btn-primary-c" onClick={handleUploadClick} disabled={uploading}>
    <i className="fa-solid fa-upload"></i> {uploading ? 'Uploading...' : 'Upload Files'}
  </button>
  <input 
    type="file" 
    ref={fileInputRef} 
    style={{ display: 'none' }} 
    onChange={handleFileChange} 
  />
</div>
<div className="d-flex gap-2 mb-4 flex-wrap">
  <div className="search-box">
    <i className="fa-solid fa-search"></i>
    <input 
      type="text" 
      placeholder="Search files..." 
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>
</div>
{loading ? (
  <div className="text-center py-5 text-muted">Loading media...</div>
) : filteredMedia.length === 0 ? (
  <div className="text-center py-5 text-muted">No media files found</div>
) : (
  <div className="media-grid">
    {filteredMedia.map(item => (
      <div key={item._id} className="media-item position-relative">
        <div className="media-thumb position-relative">
          {item.mimetype.startsWith('image/') ? (
            <img src={`http://localhost:5001/${item.path}`} alt={item.filename} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px'}} />
          ) : (
            getIcon(item.mimetype)
          )}
          <button 
            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1" 
            style={{padding: '2px 6px', fontSize: '10px'}}
            onClick={(e) => handleDelete(item._id, e)}
          >
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
        <div className="media-info">
          <div className="media-name text-truncate" title={item.filename}>{item.filename}</div>
          <div className="media-size">{formatSize(item.size)} · {item.mimetype.split('/')[1]?.toUpperCase() || 'FILE'}</div>
        </div>
      </div>
    ))}
  </div>
)}
  
    </>
  );
}
