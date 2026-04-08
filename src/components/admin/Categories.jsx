import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';

export default function Categories() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    postCount: 0,
    status: 'active'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/admin/categories');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const response = await api.post('/admin/categories', formData);
      if (response.data.success) {
        setShowModal(false);
        setFormData({ name: '', slug: '', postCount: 0, status: 'active' });
        fetchCategories();
      }
    } catch (error) {
      console.error('Error creating category:', error);
      alert(error.response?.data?.message || 'Failed to create category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await api.delete(`/admin/categories/${id}`);
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  return (
    <> 
      <div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-3">
        <div><h4 className="fw-800 mb-1">Category Management</h4><p style={{color:'var(--gray-400)',fontSize:'13px'}}>Manage blog content categories</p></div>
        <button className="btn-primary-c" onClick={() => setShowModal(true)}>
          <i className="fa-solid fa-plus"></i> Add Category
        </button>
      </div>
      
      <div className="card-custom">
        <div className="table-responsive">
          <table>
            <thead><tr><th>#</th><th>Category Name</th><th>Slug</th><th>Posts</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-4">Loading categories...</td></tr>
              ) : categories.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4">No categories found</td></tr>
              ) : (
                categories.map((category, index) => (
                  <tr key={category._id}>
                    <td>{String(index + 1).padStart(2, '0')}</td>
                    <td><strong>{category.name}</strong></td>
                    <td><code style={{background:'var(--gray-100)',padding:'2px 7px',borderRadius:'4px',fontSize:'11px'}}>{category.slug}</code></td>
                    <td>{category.postCount}</td>
                    <td><span className={`badge-c ${category.status === 'active' ? 'badge-published' : 'badge-pending'}`}>{category.status.charAt(0).toUpperCase() + category.status.slice(1)}</span></td>
                    <td>
                      <button className="btn-outline-c btn-sm-c me-1">Edit</button>
                      <button className="btn-danger-c" onClick={() => handleDelete(category._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Premium Design */}
      {showModal && (
        <div className="modal-overlay-c" style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1050,
          backdropFilter: 'blur(4px)'
        }} onClick={() => setShowModal(false)}>
          <div className="modal-content-c card-custom" style={{
            width: '100%',
            maxWidth: '500px',
            padding: '0',
            animation: 'modalSlideUp 0.3s ease-out'
          }} onClick={e => e.stopPropagation()}>
            <div className="card-head-custom" style={{borderBottom: '1px solid var(--gray-200)', padding: '15px 20px'}}>
              <span className="card-title-c">Add New Category</span>
              <button className="btn-outline-c btn-sm-c" onClick={() => setShowModal(false)}>
                 <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="p-4">
              <div className="mb-3">
                <label className="form-label fw-600" style={{fontSize: '13px', color: 'var(--gray-700)'}}>Category Name</label>
                <input type="text" className="form-control-c" placeholder="e.g. Technology" name="name" value={formData.name} onChange={handleInputChange} style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--gray-200)',
                  fontSize: '14px'
                }} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-600" style={{fontSize: '13px', color: 'var(--gray-700)'}}>Slug</label>
                <input type="text" className="form-control-c" placeholder="e.g. technology" name="slug" value={formData.slug} onChange={handleInputChange} style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--gray-200)',
                  fontSize: '14px'
                }} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-600" style={{fontSize: '13px', color: 'var(--gray-700)'}}>Initial Post Count</label>
                <input type="number" className="form-control-c" placeholder="0" name="postCount" value={formData.postCount} onChange={handleInputChange} style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--gray-200)',
                  fontSize: '14px'
                }} />
              </div>
              <div className="mb-4">
                <label className="form-label fw-600" style={{fontSize: '13px', color: 'var(--gray-700)'}}>Status</label>
                <select className="form-select-c" name="status" value={formData.status} onChange={handleInputChange} style={{
                   width: '100%',
                   padding: '10px 12px',
                   borderRadius: '8px',
                   border: '1px solid var(--gray-200)',
                   fontSize: '14px',
                   background: '#fff'
                }}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="d-flex gap-2">
                <button className="btn-primary-c flex-grow-1" style={{padding: '12px'}} onClick={handleSubmit} disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Category'}
                </button>
                <button className="btn-outline-c" style={{padding: '12px'}} onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </>
  );
}
