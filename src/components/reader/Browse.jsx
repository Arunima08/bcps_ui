import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';

export default function Browse() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [sortFilter, setSortFilter] = useState('Latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [searchTerm, categoryFilter, sortFilter, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/reader/browse/categories');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (categoryFilter !== 'All Categories') params.append('category', categoryFilter);
      if (sortFilter !== 'Latest') params.append('sort', sortFilter);
      params.append('page', currentPage);
      params.append('limit', 12);

      const response = await api.get(`/reader/browse?${params.toString()}`);
      if (response.data.success) {
        setPosts(response.data.data);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const gradients = [
    'linear-gradient(135deg,#dbeafe,#eff6ff)',
    'linear-gradient(135deg,#ecfdf5,#f0fdf4)',
    'linear-gradient(135deg,#f5f3ff,#faf5ff)',
    'linear-gradient(135deg,#fef2f2,#fff1f1)',
    'linear-gradient(135deg,#fffbeb,#fefce8)',
    'linear-gradient(135deg,#f0fdfa,#ccfbf1)',
  ];
  const emojis = ['💻', '🌱', '🧠', '💰', '🎨', '📱'];

  return (
    <> 
<div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-3">
  <div><h4 className="fw-800 mb-1">Browse Content</h4><p style={{color:'var(--gray-400)',fontSize:'13px'}}>Discover blogs across categories</p></div>
</div>
<div className="d-flex gap-2 mb-4 flex-wrap">
  <div className="search-box">
    <i className="fa-solid fa-search"></i>
    <input 
      type="text" 
      placeholder="Search posts, authors, tags..." 
      value={searchTerm}
      onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
    />
  </div>
  <select 
    className="form-select form-select-sm" 
    style={{width:'auto',borderRadius:'8px',fontSize:'13px',borderColor:'var(--gray-200)'}}
    value={categoryFilter}
    onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
  >
    <option>All Categories</option>
    {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
  </select>
  <select 
    className="form-select form-select-sm" 
    style={{width:'auto',borderRadius:'8px',fontSize:'13px',borderColor:'var(--gray-200)'}}
    value={sortFilter}
    onChange={(e) => { setSortFilter(e.target.value); setCurrentPage(1); }}
  >
    <option>Latest</option>
    <option>Most Liked</option>
    <option>Most Viewed</option>
  </select>
</div>

{loading ? (
  <div className="text-center py-5 text-muted">Loading posts...</div>
) : posts.length === 0 ? (
  <div className="card-custom p-4 text-center text-muted">
    <i className="fa-solid fa-search fs-1 mb-3 d-block" style={{color:'var(--gray-300)'}}></i>
    <p>No posts found. Try different filters.</p>
  </div>
) : (
  <>
    <div className="blog-grid">
      {posts.map((post, index) => {
        const readTime = post.readTime || Math.ceil((post.content?.split(' ').length || 0) / 200) || 1;
        return (
          <Link key={post._id} to={`/reader/blog/${post._id}`} className="blog-card text-decoration-none">
            <div className="blog-thumb" style={{background: gradients[index % gradients.length]}}>{emojis[index % emojis.length]}</div>
            <div className="blog-body">
              <div className="blog-cat">{post.category?.name || 'Uncategorized'}</div>
              <div className="blog-title">{post.title}</div>
              <div className="blog-meta">
                <span>{post.author?.name || 'Unknown'}</span>
                <span>{readTime} min</span>
              </div>
            </div>
            <div className="blog-actions">
              <button className="btn-outline-c btn-sm-c"><i className="fa-solid fa-heart"></i> {post.likes?.length || 0}</button>
            </div>
          </Link>
        );
      })}
    </div>

    {/* Pagination */}
    {totalPages > 1 && (
      <div className="d-flex justify-content-center gap-2 mt-4">
        <button 
          className="btn-outline-c btn-sm-c" 
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          <i className="fa-solid fa-chevron-left"></i> Prev
        </button>
        <span className="d-flex align-items-center" style={{fontSize:'13px',color:'var(--gray-500)'}}>
          Page {currentPage} of {totalPages}
        </span>
        <button 
          className="btn-outline-c btn-sm-c" 
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    )}
  </>
)}
  
    </>
  );
}
