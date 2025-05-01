import React from 'react';
import { Helmet } from 'react-helmet-async'; // You'll need to install react-helmet-async

interface SEOHeadProps {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage?: string;
  structuredData?: Record<string, any>;
}

/**
 * SEO Head component for optimizing pages for search engines
 */
export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = '/images/default-og-image.jpg',
  structuredData,
}) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Social Media */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

/**
 * Example page layout with SEO optimization for racket sports
 */
const SEOOptimizedPage: React.FC = () => {
  // Sports event structured data
  const sportingEventStructuredData = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "2023 Pickleball & Badminton Championship",
    "description": "Professional pickleball and badminton tournament featuring top players from around the world",
    "startDate": "2023-08-15T09:00",
    "endDate": "2023-08-20T18:00",
    "location": {
      "@type": "Place",
      "name": "Sports Arena",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Sports Ave",
        "addressLocality": "Sports City",
        "addressRegion": "SC",
        "postalCode": "12345",
        "addressCountry": "US"
      }
    },
    "sport": ["Pickleball", "Badminton"],
    "competitor": [
      {
        "@type": "SportsTeam",
        "name": "Team Eagles"
      },
      {
        "@type": "SportsTeam",
        "name": "Team Hawks"
      }
    ]
  };

  return (
    <>
      <SEOHead
        title="Professional Pickleball & Badminton Training | Expert Coaching"
        description="Get expert coaching in pickleball and badminton. Improve your skills with professional training programs for all skill levels. Join our top-rated racket sports academy today."
        keywords={[
          'pickleball training', 
          'badminton coaching', 
          'pickleball lessons', 
          'badminton classes', 
          'racket sports', 
          'pickleball techniques', 
          'badminton skills',
          'professional pickleball',
          'badminton training program'
        ]}
        canonicalUrl="https://yourwebsite.com/training"
        ogImage="https://yourwebsite.com/images/training-session.jpg"
        structuredData={sportingEventStructuredData}
      />

      <main>
        {/* Semantic HTML Structure */}
        <header>
          <h1>Professional Pickleball & Badminton Training</h1>
          <p className="subtitle">Expert coaching for all skill levels</p>
        </header>

        <section aria-labelledby="overview">
          <h2 id="overview">Our Racket Sports Programs</h2>
          <p>Our comprehensive training programs cover both <strong>pickleball</strong> and <strong>badminton</strong>, two of the fastest-growing racket sports in the world. Whether you're a beginner or looking to compete professionally, our expert coaches can help you reach your goals.</p>
        </section>

        <section aria-labelledby="pickleball">
          <h2 id="pickleball">Pickleball Training</h2>
          <img 
            src="/images/pickleball-training.jpg" 
            alt="Coach demonstrating proper pickleball serve technique to students" 
            width="800" 
            height="500"
          />
          <p>Our <strong>pickleball training program</strong> focuses on developing fundamental skills like dinking, serving, and court positioning. We offer specialized sessions for both singles and doubles play.</p>
          <h3>Pickleball Classes Include:</h3>
          <ul>
            <li>Beginner pickleball fundamentals</li>
            <li>Intermediate shot selection and strategy</li>
            <li>Advanced pickleball techniques</li>
            <li>Tournament preparation</li>
            <li>Senior pickleball coaching</li>
          </ul>
        </section>

        <section aria-labelledby="badminton">
          <h2 id="badminton">Badminton Training</h2>
          <img 
            src="/images/badminton-coaching.jpg" 
            alt="Professional badminton player demonstrating smash technique" 
            width="800" 
            height="500"
          />
          <p>Our <strong>badminton coaching</strong> programs are designed to improve your technical skills, footwork, and match strategy. Our coaches have international experience and can help players of all levels.</p>
          <h3>Badminton Classes Include:</h3>
          <ul>
            <li>Footwork and court movement</li>
            <li>Serve and return techniques</li>
            <li>Smash and drop shot mastery</li>
            <li>Doubles strategy and positioning</li>
            <li>Competitive badminton training</li>
          </ul>
        </section>

        <section aria-labelledby="testimonials">
          <h2 id="testimonials">What Our Students Say</h2>
          <div className="testimonials">
            <blockquote>
              <p>"The pickleball training completely transformed my game. I went from a beginner to winning local tournaments in just 6 months!"</p>
              <cite>— Sarah Johnson, Pickleball Enthusiast</cite>
            </blockquote>
            <blockquote>
              <p>"As a competitive badminton player, the advanced techniques I learned here gave me the edge I needed in regional competitions."</p>
              <cite>— Michael Chen, Regional Badminton Champion</cite>
            </blockquote>
          </div>
        </section>

        <section aria-labelledby="facilities">
          <h2 id="facilities">Our Training Facilities</h2>
          <p>We offer state-of-the-art courts for both pickleball and badminton, with professional-grade equipment and video analysis technology.</p>
          <div className="facility-features">
            <div className="feature">
              <h3>6 Dedicated Pickleball Courts</h3>
              <p>Professional-grade surfaces with proper spacing and lighting</p>
            </div>
            <div className="feature">
              <h3>8 Badminton Courts</h3>
              <p>International standard courts with proper height clearance</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="coaches">
          <h2 id="coaches">Our Expert Coaches</h2>
          <div className="coaches">
            <div className="coach">
              <img src="/images/coach-jennifer.jpg" alt="Coach Jennifer Smith, Head Pickleball Instructor" />
              <h3>Jennifer Smith</h3>
              <p>Head Pickleball Instructor</p>
              <p>Former National Pickleball Champion with 15+ years of coaching experience</p>
            </div>
            <div className="coach">
              <img src="/images/coach-david.jpg" alt="Coach David Wong, Head Badminton Instructor" />
              <h3>David Wong</h3>
              <p>Head Badminton Instructor</p>
              <p>International badminton player with Olympic training experience</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="booking">
          <h2 id="booking">Book Your Training Session</h2>
          <p>Ready to improve your pickleball or badminton skills? Contact us today to schedule your first session.</p>
          <button className="cta-button">Book Now</button>
        </section>
      </main>

      <footer>
        <p>© 2023 Racket Sports Academy. All rights reserved.</p>
        <nav>
          <a href="/pickleball">Pickleball</a>
          <a href="/badminton">Badminton</a>
          <a href="/schedule">Class Schedule</a>
          <a href="/contact">Contact Us</a>
        </nav>
      </footer>
    </>
  );
};

export default SEOOptimizedPage; 