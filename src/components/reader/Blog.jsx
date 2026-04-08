import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import api from '../../api';

export default function Blog() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (id) {
      fetchBlogPost();
    }
  }, [id]);

  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reader/blog/${id}`);
      if (response.data.success) {
        const data = response.data.data;
        setPost(data.post);
        setComments(data.comments || []);
        setRelatedPosts(data.relatedPosts || []);
        setLikesCount(data.post.likes?.length || 0);
        setLiked(data.post.likes?.includes(user?._id) || false);
        setBookmarked(data.post.bookmarks?.includes(user?._id) || false);
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const response = await api.put(`/reader/blog/${id}/like`);
      if (response.data.success) {
        setLiked(!liked);
        setLikesCount(response.data.likesCount);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleBookmark = async () => {
    try {
      const response = await api.put(`/reader/blog/${id}/bookmark`);
      if (response.data.success) {
        setBookmarked(!bookmarked);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    try {
      setSubmittingComment(true);
      const response = await api.post(`/reader/blog/${id}/comment`, { text: commentText });
      if (response.data.success) {
        setComments([response.data.data, ...comments]);
        setCommentText('');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleFollow = async (authorId) => {
    try {
      const response = await api.put(`/reader/blog/follow/${authorId}`);
      if (response.data.success) {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading blog post...</div>;
  if (!post) return <div className="p-4 text-center text-danger">Post not found or unavailable</div>;

  const bgColors = ['var(--blue-500)', 'var(--green)', 'var(--amber)', 'var(--purple)', 'var(--red)'];

  return (
    <>
      <div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-3">
        <div><h4 className="fw-800 mb-1">Blog View</h4></div>
        <button className="btn-outline-c" onClick={() => navigate(-1)}><i className="fa-solid fa-arrow-left"></i> Back</button>
      </div>

      <div className="row g-3">
        <div className="col-lg-8">
          <div className="card-custom mb-3">
            {post.featuredImage && (
              <div className="blog-thumb" style={{ background: `url(http://localhost:5001/${post.featuredImage}) center/cover no-repeat`, height: '250px' }}></div>
            )}
            {!post.featuredImage && (
              <div className="blog-thumb" style={{ background: 'linear-gradient(135deg,#dbeafe,#eff6ff)' }}>💻</div>
            )}
            <div className="p-4">
              <div className="d-flex gap-2 mb-3">
                <span className="tag-c">{post.category?.name || 'Uncategorized'}</span>
                {post.tags && post.tags.map((tag, i) => <span key={i} className="tag-c">{tag}</span>)}
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '12px' }}>{post.title}</h2>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="avatar-c d-flex align-items-center justify-content-center text-white fw-bold" style={{ background: 'var(--blue-500)', width: '36px', height: '36px' }}>
                  {post.author?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>{post.author?.name || 'Unknown Author'}</div>
                  <div style={{ fontSize: '12px', color: 'var(--gray-400)' }}>
                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · {post.readTime || Math.ceil((post.content?.split(' ').length || 0) / 200)} min read · {post.views?.toLocaleString() || 0} views
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '15px', lineHeight: '1.8', color: 'var(--gray-700)', whiteSpace: 'pre-wrap' }}>{post.content}</div>
              <hr style={{ border: '1px solid var(--gray-200)', margin: '20px 0' }} />
              <div className="d-flex gap-2 flex-wrap">
                <button className={`btn-outline-c ${liked ? 'active' : ''}`} onClick={handleLike} style={liked ? { background: 'var(--red)', color: '#fff', borderColor: 'var(--red)' } : {}}>
                  <i className={`fa-${liked ? 'solid' : 'regular'} fa-heart`}></i> Like ({likesCount})
                </button>
                <button className={`btn-outline-c ${bookmarked ? 'active' : ''}`} onClick={handleBookmark} style={bookmarked ? { background: 'var(--blue-500)', color: '#fff', borderColor: 'var(--blue-500)' } : {}}>
                  <i className={`fa-${bookmarked ? 'solid' : 'regular'} fa-bookmark`}></i> {bookmarked ? 'Saved' : 'Save'}
                </button>
                <button className="btn-outline-c" onClick={() => navigator.clipboard.writeText(window.location.href).then(() => alert('Link copied!'))}>
                  <i className="fa-solid fa-share-nodes"></i> Share
                </button>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="card-custom"><div className="card-head-custom"><span className="card-title-c">Comments ({comments.length})</span></div><div className="p-3">
            <div className="mb-3">
              <textarea
                className="form-control-c"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows="3"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--gray-200)', fontSize: '14px' }}
              ></textarea>
            </div>
            <button className="btn-primary-c btn-sm-c mb-3" onClick={handlePostComment} disabled={submittingComment}>
              <i className="fa-solid fa-paper-plane"></i> {submittingComment ? 'Posting...' : 'Post Comment'}
            </button>
            <hr style={{ border: '1px solid var(--gray-200)' }} />
            {comments.length === 0 ? (
              <div className="text-center text-muted small py-3">No comments yet. Be the first to comment!</div>
            ) : (
              comments.map((comment, index) => (
                <div key={comment._id} className="notif-item">
                  <div className="avatar-c d-flex align-items-center justify-content-center text-white fw-bold" style={{ background: bgColors[index % bgColors.length], width: '28px', height: '28px', fontSize: '11px' }}>
                    {comment.user?.name?.charAt(0) || 'G'}
                  </div>
                  <div>
                    <div className="notif-text"><strong>{comment.user?.name || 'Guest'}</strong> — {comment.text}</div>
                    <div className="notif-time">{new Date(comment.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              ))
            )}
          </div></div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          <div className="card-custom mb-3"><div className="card-head-custom"><span className="card-title-c">About the Author</span></div><div className="p-3 text-center">
            <div className="avatar-c d-flex align-items-center justify-content-center text-white fw-bold mx-auto mb-2" style={{ width: '56px', height: '56px', fontSize: '20px', background: 'var(--blue-500)' }}>
              {post.author?.name?.charAt(0) || 'U'}
            </div>
            <div className="fw-700" style={{ fontSize: '16px' }}>{post.author?.name || 'Unknown'}</div>
            <div style={{ fontSize: '13px', color: 'var(--gray-400)', marginBottom: '12px' }}>{post.author?.bio || 'Blog Author'}</div>
            <div className="mb-2" style={{ fontSize: '12px', color: 'var(--gray-500)' }}>
              {post.author?.followers?.length || 0} followers
            </div>
            <button className="btn-primary-c w-100 justify-content-center" onClick={() => handleFollow(post.author?._id)}>
              <i className="fa-solid fa-user-plus"></i> Follow Author
            </button>
          </div></div>

          {relatedPosts.length > 0 && (
            <div className="card-custom"><div className="card-head-custom"><span className="card-title-c">Related Posts</span></div><div className="p-3">
              {relatedPosts.map((rp, i) => (
                <Link key={rp._id} to={`/reader/blog/${rp._id}`} className="d-flex gap-2 mb-3 text-decoration-none" style={{ cursor: 'pointer' }}>
                  <div style={{ fontSize: '24px' }}>📝</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-700)' }}>{rp.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--gray-400)' }}>{rp.readTime || 3} min read</div>
                  </div>
                </Link>
              ))}
            </div></div>
          )}
        </div>
      </div>

    </>
  );
}
