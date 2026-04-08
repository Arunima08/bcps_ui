import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';

export default function Drafts() {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const response = await api.get('/author/drafts');
      if (response.data.success) {
        setDrafts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching drafts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <> 
<div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-3">
  <div><h4 className="fw-800 mb-1">Drafts &amp; Edits</h4><p>Continue working on saved drafts</p></div>
  <Link to="/author/create" className="btn-primary-c"><i className="fa-solid fa-plus"></i> New Draft</Link>
</div>
<div className="card-custom"><div className="table-responsive"><table><thead><tr><th>Title</th><th>Category</th><th>Last Edited</th><th>Words</th><th>Status</th><th>Actions</th></tr></thead><tbody>
  {loading ? (
    <tr><td colSpan="6" className="text-center py-4 text-muted">Loading drafts...</td></tr>
  ) : drafts.length === 0 ? (
    <tr><td colSpan="6" className="text-center py-4 text-muted">No drafts found. <Link to="/author/create">Create one</Link></td></tr>
  ) : (
    drafts.map(draft => {
      const wordCount = draft.content ? draft.content.split(' ').length : 0;
      return (
        <tr key={draft._id}>
          <td><strong className="text-truncate" style={{maxWidth: '250px', display: 'inline-block'}}>{draft.title || 'Untitled'}</strong></td>
          <td><span className="tag-c">{draft.category?.name || 'Uncategorized'}</span></td>
          <td>{new Date(draft.updatedAt).toLocaleDateString()}</td>
          <td>{wordCount}</td>
          <td><span className="badge-c badge-draft">Draft</span></td>
          <td><button onClick={() => alert("Edit Draft capability to be connected to Editor component")} className="btn-primary-c btn-sm-c">Edit</button></td>
        </tr>
      );
    })
  )}
</tbody></table></div></div>
  
    </>
  );
}
