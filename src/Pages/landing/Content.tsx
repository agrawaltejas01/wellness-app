import "./style.css";

const LandingContent: React.FC = () => {
  const handleAppStoreClick = () => {
    window.location.href = "https://apps.apple.com/in/app/zenfitx/id6736351969";
  };

  const handlePlayStoreClick = () => {
    window.location.href = "https://play.google.com/store/apps/details?id=com.zenfitx.zenfitxapp";
  };

  return (
    <main className="landing-content">
      <div className="content-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-badge">
            <span className="badge-icon">✨</span>
            <span>Powered by AI</span>
          </div>

          <h1 className="hero-title">
            Play Smarter.
            <br />
            <span className="hero-gradient">Get Better.</span>
            <br />
            Every Match.
          </h1>

          <p className="hero-description">
            ZenfitX uses AI to match you with players at your skill level,
            generates personalized game highlights, and provides an AI coach
            to help you improve your badminton game.
          </p>

          <div className="store-badges">
            <img
              onClick={handleAppStoreClick}
              src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83"
              alt="Download on the App Store"
              className="store-badge"
            />
            <img
              onClick={handlePlayStoreClick}
              src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
              alt="Get it on Google Play"
              className="store-badge play-badge"
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="section-header">
            <p className="section-label">FEATURES</p>
            <h2 className="section-title">Everything you need to level up</h2>
          </div>

          <div className="features-grid">
            <div className="feature-card feature-card-primary">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>AI-Powered Highlights</h3>
              <p>Get instant, professionally edited highlights of your best plays. Our AI analyzes every rally and creates shareable clips automatically.</p>
              <div className="feature-tags">
                <span className="tag">Auto-Generated</span>
                <span className="tag">HD Quality</span>
                <span className="tag">Shareable</span>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="5" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 13C8.13401 13 5 16.134 5 20H19C19 16.134 15.866 13 12 13Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Smart Player Matching</h3>
              <p>Play with opponents who match your skill level. Our algorithm ensures balanced, competitive matches every time you step on court.</p>
              <div className="feature-tags">
                <span className="tag">Skill-Based</span>
                <span className="tag">Fair Matches</span>
              </div>
            </div>

            <div className="feature-card feature-card-accent">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 3V21M3 12H21" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                </svg>
              </div>
              <h3>AI Coach (Coming Soon)</h3>
              <p>Chat with your personal AI badminton coach. Get real-time analysis, technique tips, and personalized training recommendations.</p>
              <div className="feature-tags">
                <span className="tag tag-new">Coming Soon</span>
                <span className="tag">24/7 Available</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10k+</div>
              <div className="stat-label">Active Players</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50k+</div>
              <div className="stat-label">Matches Played</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100k+</div>
              <div className="stat-label">Highlights Generated</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4.8★</div>
              <div className="stat-label">App Rating</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">Ready to elevate your game?</h2>
            <p className="cta-description">
              Join thousands of players already using ZenfitX to improve their badminton skills.
            </p>
            <div className="cta-buttons">
              <button onClick={handleAppStoreClick} className="btn-primary btn-large">
                <span>Get Started Free</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LandingContent;
