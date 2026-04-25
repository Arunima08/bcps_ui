import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
          reveals[i].classList.add('active');
        }
      }
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
    return () => window.removeEventListener('scroll', revealOnScroll);
  }, []);

  return (
    <div className="landing-container">
      {/* Navigation Bar */}
      <nav className="landing-nav">
        <div className="nav-logo">
          <div className="logo-icon">B</div>
          <span>Blogging and Content Publishing System</span>
        </div>
        <div className="nav-links">
          <button className="btn-signin" onClick={() => navigate('/login')}>Sign In</button>
          <button className="btn-create" onClick={() => navigate('/register')}>Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <span className="badge">New Era of Blogging</span>
          <h1 className="hero-title">Publish your <span>passions</span>, your way</h1>
          <p className="hero-subtitle">
            The all-in-one platform for writers, readers, and creators. Build your brand, grow your audience, and share your stories.
          </p>
          <button className="hero-cta" onClick={() => navigate('/register')}>
            Create Your Blog
          </button>
        </div>
        <div className="hero-visual">
            <div className="hero-image-container">
                <img src="/hero.png" alt="Blogging Workspace" className="hero-image" />
                <div className="hero-blob"></div>
            </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="features-section reveal">
        <div className="feature-card">
          <div className="feature-icon design-icon">
            <i className="fas fa-pen-nib"></i>
          </div>
          <h3>Write & Inspire</h3>
          <p>Create stunning posts with our easy-to-use editor. Submit your stories for review and share them with the world.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon domain-icon">
            <i className="fas fa-comments"></i>
          </div>
          <h3>Engage & Connect</h3>
          <p>Build a community. Readers can follow, comment, and get real-time notifications on your latest updates.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon earn-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <h3>Manage & Grow</h3>
          <p>Powerful admin tools to manage content, users, and categories. Track growth with built-in analytics.</p>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="analytics-section reveal">
        <div className="analytics-text">
          <h2>Streamlined Publishing</h2>
          <p>From draft to live post, our system handles the entire workflow. Authors write, Admins approve, and Readers enjoy quality content.</p>
        </div>
        <div className="analytics-visual">
          <img src="/workflow.png" alt="Workflow Dashboard" className="workflow-img" />
          <div className="glass-card status-badge">
              <i className="fas fa-sync-alt fa-spin"></i>
              <span>Live Workflow</span>
          </div>
        </div>
      </section>

      {/* Media Section */}
      <section className="memory-section reveal">
        <div className="memory-visual">
            <div className="media-collage-container">
                <img src="/media-collage.png" alt="Media Assets" className="media-collage-img" />
                <div className="glass-card overlay-card">
                    <i className="fas fa-image"></i>
                    <span>Manage Assets</span>
                </div>
            </div>
        </div>
        <div className="memory-text">
          <span className="badge">Media Management</span>
          <h2>Centralized Media Library</h2>
          <p>Upload and manage all your images in one place. Authors can easily attach media to their posts for a richer reading experience. Organized, secure, and always accessible.</p>
          <ul className="feature-list">
              <li><i className="fas fa-check-circle"></i> Drag & Drop Uploads</li>
              <li><i className="fas fa-check-circle"></i> Multiple Image Formats</li>
              <li><i className="fas fa-check-circle"></i> Instant Preview</li>
          </ul>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="footer-cta">
        <h2>Join millions of others</h2>
        <p>Whether sharing your expertise, breaking news, or whatever's on your mind, you're in good company.</p>
        <button className="hero-cta" onClick={() => navigate('/register')}>
          Create Your Blog
        </button>
      </section>

      <footer className="landing-footer">
        <div className="footer-links">
          <a href="#">Help</a>
          <a href="#">Community</a>
          <a href="#">Developers</a>
        </div>
        <div className="footer-bottom">
          <span>&copy; 2026 Blogging and Content Publishing System</span>
          <div className="footer-legal">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
