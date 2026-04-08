import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

export default function Create() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('Start writing your amazing blog post here...');
  const [visibility, setVisibility] = useState('public');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Fetch categories for dropdown
    const fetchCategories = async () => {
      try {
        const response = await api.get('/reader/browse/categories');
        if(response.data.success) {
          setCategories(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (status) => {
    if(!title || !category || !content) {
      alert("Please fill all required fields (Title, Category, Content)");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('content', content);
      formData.append('visibility', visibility);
      formData.append('status', status);
      
      const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      tagArray.forEach(tag => formData.append('tags[]', tag)); // if backend supports this, or JSON schema? Wait, backend needs string array or comma separated? Wait, let's just send JSON if no file, or if file use append. 

      // Our backend Post model: tags: [{ type: String }]
      if (tags) formData.append('tags', tagArray.join(','));

      if (file) {
        formData.append('featuredImage', file);
      }

      await api.post('/author/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setSuccessMessage(status === 'draft' ? 'Draft saved successfully!' : 'Post submitted for review successfully!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch(err) {
      console.error('Submit error:', err);
      alert('Failed to submit post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <> 
<div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-3">
  <div><h4 className="fw-800 mb-1">Create New Blog Post</h4><p>Write and publish your content</p></div>
  <div className="d-flex gap-2">
    <button className="btn-outline-c" onClick={() => handleSubmit('draft')} disabled={loading}>Save Draft</button>
    <button className="btn-primary-c" onClick={() => handleSubmit('in-review')} disabled={loading}><i className="fa-solid fa-paper-plane"></i> Submit for Review</button>
  </div>
</div>
{successMessage && <div className="alert alert-success" style={{padding:'10px',fontSize:'14px',borderRadius:'8px',marginBottom:'16px',background:'#ecfdf5',color:'var(--green)',border:'1px solid #a7f3d0'}}>{successMessage}</div>}
<div className="ai-panel"><div className="ai-panel-head"><div className="ai-icon-c"><i className="fa-solid fa-wand-magic-sparkles"></i></div><div><div className="ai-title-c">AI Writing Assistant</div><div className="ai-sub-c">Powered by BlogSphere AI · Available in Author Zone</div></div></div>
  <div className="d-flex gap-2 flex-wrap">
    <button className="btn-purple-c btn-sm-c"><i className="fa-solid fa-compress"></i> Summarize Draft</button>
    <button className="btn-purple-c btn-sm-c"><i className="fa-solid fa-language"></i> Translate to Hindi</button>
    <button className="btn-purple-c btn-sm-c"><i className="fa-solid fa-spell-check"></i> Check Grammar</button>
    <button className="btn-outline-c btn-sm-c"><i className="fa-solid fa-lightbulb"></i> Suggest Title</button>
  </div>
</div>
<div className="row g-3">
  <div className="col-lg-8">
    <div className="mb-3">
      <label className="form-label-c">Blog Title *</label>
      <input className="form-control-c" type="text" placeholder="Enter an engaging title..." value={title} onChange={e => setTitle(e.target.value)} />
    </div>
    <div className="row g-3 mb-3">
      <div className="col-6">
        <label className="form-label-c">Category *</label>
        <select className="form-control-c" value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">Select category</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>
      <div className="col-6">
        <label className="form-label-c">Tags</label>
        <input className="form-control-c" type="text" placeholder="AI, Tech, 2025 (comma separated)" value={tags} onChange={e => setTags(e.target.value)} />
      </div>
    </div>
    <label className="form-label-c">Blog Content *</label>
    <div className="editor-toolbar"><button className="editor-btn"><i className="fa-solid fa-bold"></i></button><button className="editor-btn"><i className="fa-solid fa-italic"></i></button><button className="editor-btn"><i className="fa-solid fa-underline"></i></button><button className="editor-btn"><i className="fa-solid fa-list-ul"></i></button><button className="editor-btn"><i className="fa-solid fa-list-ol"></i></button><button className="editor-btn"><i className="fa-solid fa-link"></i></button><button className="editor-btn"><i className="fa-solid fa-image"></i></button><button className="editor-btn"><i className="fa-solid fa-heading"></i></button><button className="editor-btn"><i className="fa-solid fa-code"></i></button></div>
    <div 
      className="editor-area" 
      contentEditable="true" 
      onInput={(e) => setContent(e.currentTarget.textContent)}
      suppressContentEditableWarning={true}
    >
      Start writing your amazing blog post here...
    </div>
  </div>
  <div className="col-lg-4">
    <div className="card-custom mb-3">
      <div className="card-head-custom"><span className="card-title-c">Featured Image</span></div>
      <div className="p-3">
        <label className="w-100 mb-0" style={{cursor: 'pointer'}}>
          <div className="chart-area d-flex flex-column align-items-center py-4" style={{border: '2px dashed var(--gray-300)', borderRadius: '8px', background: 'var(--gray-50)'}}>
            <i className="fa-solid fa-cloud-arrow-up fs-2 text-primary mb-2"></i>
            <span className="text-muted small">{file ? file.name : "Click to upload image"}</span>
            <input type="file" className="d-none" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
          </div>
        </label>
      </div>
    </div>
    
    <div className="card-custom">
      <div className="card-head-custom"><span className="card-title-c">Publishing</span></div>
      <div className="p-3">
        <div className="mb-3">
          <label className="form-label-c">Visibility</label>
          <select className="form-control-c" value={visibility} onChange={e => setVisibility(e.target.value)}>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <button className="btn-primary-c w-100 justify-content-center" onClick={() => handleSubmit('in-review')} disabled={loading}>
          <i className="fa-solid fa-paper-plane"></i> {loading ? 'Submitting...' : 'Submit for Approval'}
        </button>
      </div>
    </div>
  </div>
</div>
  
    </>
  );
}
