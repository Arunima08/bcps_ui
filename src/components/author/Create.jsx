import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api';

export default function Create() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const editorRef = useRef(null);
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('Start writing your amazing blog post here...');
  const [visibility, setVisibility] = useState('public');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(null);

  // Use a local variable to store the initial HTML so we don't re-render on every keystroke
  const isInitialMount = useRef(true);

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

  // const handleAIAction = (action) => {
  //   if (!content && !['title', 'keywords'].includes(action)) {
  //     toast.warn("Please write some content first!");
  //     return;
  //   }
  //   setAiLoading(action);
    
  //   // Simulate AI processing
  //   setTimeout(() => {
  //     switch(action) {
  //       case 'summarize':
  //         toast.info("🤖 AI Summary of your draft:\n\nThis article discusses the key elements of the selected category, providing a comprehensive overview suitable for beginners and experts alike.");
  //         break;
  //       case 'translate':
  //         const hindiTranslation = "यह आपके ब्लॉग पोस्ट का एआई जनरेटेड हिंदी अनुवाद है। कृपया प्रकाशित करने से पहले समीक्षा करें।\n\n" + content;
  //         setContent(hindiTranslation);
  //         if(editorRef.current) editorRef.current.innerHTML = hindiTranslation;
  //         toast.success("🤖 Translated to Hindi!");
  //         break;
  //       case 'grammar':
  //         toast.success("🤖 AI Grammar Check: Perfect! No critical grammatical errors found.");
  //         break;
  //       case 'title':
  //         const catName = categories.find(c => c._id === category)?.name || "Amazing Topics";
  //         const suggestedTitles = [
  //           `Ultimate Guide: 10 Things You Didn't Know About ${catName}`,
  //           `Mastering ${catName}: From Beginner to Expert`,
  //           `Why ${catName} is the Future of Industry`,
  //           `${catName} Unlocked: Secrets to Success`
  //         ];
  //         const randomTitle = suggestedTitles[Math.floor(Math.random() * suggestedTitles.length)];
  //         setTitle(randomTitle);
  //         toast.success("🤖 Title Suggested!");
  //         break;
  //       case 'improve':
  //         const improved = "✨ [AI IMPROVED VERSION]\n\n" + content.replace(/amazing/g, 'extraordinary').replace(/good/g, 'exceptional');
  //         setContent(improved);
  //         if(editorRef.current) editorRef.current.innerHTML = improved;
  //         toast.success("🤖 Writing Improved!");
  //         break;
  //       case 'expand':
  //         const expanded = content + "\n\nFurthermore, it is essential to consider the broader implications of this topic. Many experts suggest that the integration of these concepts will lead to significant advancements in the field over the next decade...";
  //         setContent(expanded);
  //         if(editorRef.current) editorRef.current.innerHTML = expanded;
  //         toast.success("🤖 Content Expanded!");
  //         break;
  //       case 'keywords':
  //         const generatedTags = "AI, Future, Innovation, Trends, Guide";
  //         setTags(generatedTags);
  //         toast.success("🤖 SEO Keywords Generated!");
  //         break;
  //       case 'tone':
  //         const creativeContent = "🌟 Imagine a world where...\n\n" + content;
  //         setContent(creativeContent);
  //         if(editorRef.current) editorRef.current.innerHTML = creativeContent;
  //         toast.success("🤖 Tone changed to Creative!");
  //         break;
  //       case 'simplify':
  //         const simplified = "💡 In simple terms: " + content.substring(0, 100) + "... (Simplified for clarity)";
  //         setContent(simplified);
  //         if(editorRef.current) editorRef.current.innerHTML = simplified;
  //         toast.success("🤖 Content Simplified!");
  //         break;
  //       default:
  //         break;
  //     }
  //     setAiLoading(null);
  //   }, 1500);
  // };
// Replace your existing handleAIAction with this:

const handleAIAction = async (action) => {
  // Prevent calling the API if there's no content (save quota!)
  if (!content && !['title', 'keywords'].includes(action)) {
    toast.warn("Please write some content first!");
    return;
  }
  
  setAiLoading(action);
  
  try {
    const catName = categories.find(c => c._id === category)?.name || "General";
    
    // Call our newly created backend route
    const response = await api.post('/author/ai/process', {
      action,
      content,
      categoryName: catName
    });

    if (response.data.success) {
      const aiResult = response.data.data;

      // Handle the result based on the action
      switch(action) {
        case 'title':
          setTitle(aiResult.trim().replace(/["*]/g, '')); // Clean up quotes/markdown
          toast.success("🤖 Title Applied!");
          break;
        case 'keywords':
          setTags(aiResult.trim());
          toast.success("🤖 SEO Keywords Applied!");
          break;
        case 'summarize':
        case 'grammar':
          // These actions are better suited for an informational alert rather than replacing the editor content
          alert(`🤖 AI Feedback:\n\n${aiResult}`);
          toast.success(`🤖 ${action.charAt(0).toUpperCase() + action.slice(1)} generated!`);
          break;
        default:
          // For improve, expand, simplify, tone, and translate: replace the editor content
          setContent(aiResult);
          if (editorRef.current) {
             editorRef.current.innerHTML = aiResult;
          }
          toast.success(`🤖 Text successfully updated!`);
          break;
      }
    }
  } catch (error) {
    console.error("AI Action failed:", error);
    toast.error("Failed to connect to the AI assistant.");
  } finally {
    setAiLoading(null);
  }
};
  const applyCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handleInsertLink = () => {
    const url = prompt("Enter the URL:");
    if (url) applyCommand('createLink', url);
  };

  useEffect(() => {
    if (editorRef.current && isInitialMount.current) {
        editorRef.current.innerHTML = content;
        isInitialMount.current = false;
    }
  }, []);

  const handleEditorInput = (e) => {
    setContent(e.currentTarget.innerHTML);
  };

  const handleSubmit = async (status) => {
    if(!title || !category || !content) {
      toast.error("Please fill all required fields (Title, Category, Content)");
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
      
      if (tags) {
        const tagString = tags.split(',').map(t => t.trim()).filter(Boolean).join(',');
        formData.append('tags', tagString);
      }

      if (file) {
        formData.append('featuredImage', file);
      }

      await api.post('/author/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success(status === 'draft' ? 'Draft saved successfully!' : 'Post submitted for review!');
      navigate(status === 'draft' ? '/author/drafts' : '/author/submit');
    } catch(err) {
      console.error('Submit error:', err);
      toast.error(err.response?.data?.message || 'Failed to submit post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-wrap-inner p-4">
      {/* HEADER ACTION BAR */}
      <div className="d-flex align-items-center justify-content-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="fw-800 mb-1" style={{ letterSpacing: '-1px' }}>Create New Post</h2>
          <p className="text-muted mb-0">Craft your next masterpiece with AI assistance</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn-outline-c" onClick={() => handleSubmit('draft')} disabled={loading}>
            <i className="fas fa-save me-2"></i> Save Draft
          </button>
          <button className="btn-primary-c" onClick={() => handleSubmit('pending')} disabled={loading}>
            <i className="fas fa-paper-plane me-2"></i> {loading ? 'Submitting...' : 'Submit Post'}
          </button>
        </div>
      </div>

      {/* AI ASSISTANT TOOLBAR */}
      <div className="ai-panel mb-5">
        <div className="ai-panel-head">
          <div className="ai-icon-c"><i className="fas fa-magic"></i></div>
          <div>
            <h5 className="ai-title-c">AI Writing Assistant</h5>
            <small className="ai-sub-c">Available tools to refine your content</small>
          </div>
        </div>
        <div className="ai-buttons-group">
          <button className="ai-btn-c" onClick={() => handleAIAction('summarize')} disabled={aiLoading !== null}>
            <i className={`fas ${aiLoading === 'summarize' ? 'fa-spinner fa-spin' : 'fa-compress-alt'}`}></i> Summarize
          </button>
          <button className="ai-btn-c" onClick={() => handleAIAction('improve')} disabled={aiLoading !== null}>
            <i className={`fas ${aiLoading === 'improve' ? 'fa-spinner fa-spin' : 'fa-magic'}`}></i> Improve
          </button>
          <button className="ai-btn-c" onClick={() => handleAIAction('expand')} disabled={aiLoading !== null}>
            <i className={`fas ${aiLoading === 'expand' ? 'fa-spinner fa-spin' : 'fa-expand-arrows-alt'}`}></i> Expand
          </button>
          <button className="ai-btn-c" onClick={() => handleAIAction('simplify')} disabled={aiLoading !== null}>
            <i className={`fas ${aiLoading === 'simplify' ? 'fa-spinner fa-spin' : 'fa-baby'}`}></i> Simplify
          </button>
          <button className="ai-btn-c" onClick={() => handleAIAction('tone')} disabled={aiLoading !== null}>
            <i className={`fas ${aiLoading === 'tone' ? 'fa-spinner fa-spin' : 'fa-theater-masks'}`}></i> Tone
          </button>
          <button className="ai-btn-c" onClick={() => handleAIAction('translate')} disabled={aiLoading !== null}>
            <i className={`fas ${aiLoading === 'translate' ? 'fa-spinner fa-spin' : 'fa-language'}`}></i> Hindi
          </button>
          <button className="ai-btn-c" onClick={() => handleAIAction('keywords')} disabled={aiLoading !== null}>
            <i className={`fas ${aiLoading === 'keywords' ? 'fa-spinner fa-spin' : 'fa-tags'}`}></i> SEO Tags
          </button>
          <button className="ai-btn-c" onClick={() => handleAIAction('grammar')} disabled={aiLoading !== null}>
            <i className={`fas ${aiLoading === 'grammar' ? 'fa-spinner fa-spin' : 'fa-spell-check'}`}></i> Grammar
          </button>
          <button className="ai-btn-c" onClick={() => handleAIAction('title')} disabled={aiLoading !== null}>
            <i className={`fas ${aiLoading === 'title' ? 'fa-spinner fa-spin' : 'fa-lightbulb'}`}></i> Suggest Title
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* LEFT: MAIN EDITOR */}
        <div className="col-lg-8">
          <div className="card-custom p-4 mb-4" style={{ background: '#fff' }}>
            <div className="mb-4">
              <label className="form-label-c">Post Title *</label>
              <input 
                className="form-control-c" 
                type="text" 
                placeholder="Enter an engaging title..." 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                style={{ fontSize: '1.2rem', fontWeight: '700' }}
              />
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label-c">Category *</label>
                <select className="form-control-c" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label-c">Tags</label>
                <input className="form-control-c" type="text" placeholder="AI, Tech, 2025" value={tags} onChange={e => setTags(e.target.value)} />
              </div>
            </div>

            <div className="editor-container">
              <label className="form-label-c">Content Body *</label>
              <div className="editor-toolbar mb-0">
                <button className="editor-btn" onClick={() => applyCommand('bold')} title="Bold"><i className="fas fa-bold"></i></button>
                <button className="editor-btn" onClick={() => applyCommand('italic')} title="Italic"><i className="fas fa-italic"></i></button>
                <button className="editor-btn" onClick={() => applyCommand('formatBlock', 'h2')} title="Heading"><i className="fas fa-heading"></i></button>
                <button className="editor-btn ms-auto" onClick={handleInsertLink} title="Insert Link"><i className="fas fa-link"></i></button>
                <button className="editor-btn" onClick={() => applyCommand('insertImage', prompt('Enter Image URL:'))} title="Insert Image"><i className="fas fa-image"></i></button>
                <button className="editor-btn" onClick={() => applyCommand('formatBlock', 'pre')} title="Code Block"><i className="fas fa-code"></i></button>
              </div>
              <div 
                ref={editorRef}
                id="rich-editor"
                className="editor-area p-4" 
                contentEditable="true" 
                onInput={handleEditorInput}
                suppressContentEditableWarning={true}
                style={{ 
                  minHeight: '400px', 
                  border: '1.5px solid #f1f5f9', 
                  borderTop: 'none', 
                  borderRadius: '0 0 16px 16px', 
                  outline: 'none',
                  textAlign: 'left',
                  direction: 'ltr' 
                }}
              >
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: SETTINGS */}
        <div className="col-lg-4">
          <div className="card-custom p-4 mb-4">
            <h6 className="fw-bold mb-3"><i className="fas fa-image me-2 text-primary"></i> Featured Image</h6>
            <label className="w-100 mb-0" style={{cursor: 'pointer'}}>
              <div className="upload-zone">
                <i className="fas fa-cloud-upload-alt upload-icon"></i>
                <p className="small fw-bold mb-1">{file ? file.name : "Click to upload image"}</p>
                <p className="text-muted extra-small">Supports PNG, JPG (Max 5MB)</p>
                <input type="file" className="d-none" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
              </div>
            </label>
          </div>

          <div className="card-custom p-4">
            <h6 className="fw-bold mb-3"><i className="fas fa-cog me-2 text-primary"></i> Settings</h6>
            <div className="mb-4">
              <label className="form-label-c">Post Visibility</label>
              <select className="form-control-c" value={visibility} onChange={e => setVisibility(e.target.value)}>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div className="d-grid gap-3">
              <button className="btn-primary-c w-100 py-3 justify-content-center" onClick={() => handleSubmit('pending')} disabled={loading}>
                Submit for Approval
              </button>
              <p className="text-center text-muted extra-small mb-0">
                <i className="fas fa-info-circle me-1"></i> Submitting will send the post to Admin for review.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
