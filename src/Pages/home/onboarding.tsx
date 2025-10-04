import React, { useEffect, useState } from "react";
import { Mixpanel } from "../../mixpanel/init";
import Loader from "../../components/Loader";
import { navigate } from "@reach/router";
import getStarted from "../../images/home/get-started.jpg";

interface Onboarding {
  setOnboarding: (val: boolean) => void;
}

const Onboarding: React.FC<Onboarding> = ({ setOnboarding }) => {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    Mixpanel.track("open_onboarding_page");
  }, []);

  const handleGetStarted = () => {
    setShowLoader(true);
    Mixpanel.track("clicked_get_started_on_onboarding_page");
    navigate('/login', { state: { signup: true } });
  };

  if (showLoader) return <Loader />;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${getStarted})`,
          filter: 'brightness(0.4) contrast(1.1)'
        }}
      />
      
      {/* Animated Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-transparent to-emerald-900/30 animate-pulse" />
      
      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        {/* Main Content */}
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Logo/Brand */}
          <div className="space-y-4 transform animate-fade-in-up">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-emerald-200 drop-shadow-2xl tracking-wider">
              ZenfitX
            </h1>
            
            {/* Tagline */}
            <div className="space-y-3">
              <p className="text-xl md:text-3xl lg:text-4xl font-bold text-white/90 tracking-wide">
                Track · Improve · Play
              </p>
              <p className="text-lg md:text-xl text-white/80 font-medium">
                smartly with <span className="font-bold text-emerald-300 bg-emerald-500/20 px-2 py-1 rounded-lg">ZenVision AI</span>
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4 transform animate-fade-in-up animation-delay-300">
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Explore & book any fitness or wellness activity near you with intelligent recommendations
            </p>
          </div>

          {/* CTA Button */}
          <div className="transform animate-fade-in-up animation-delay-600">
            <button
              onClick={handleGetStarted}
              className="group relative px-8 py-4 md:px-12 md:py-6 text-lg md:text-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300 ease-out border border-emerald-400/30 hover:border-emerald-300/50"
            >
              {/* Button Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Button Text */}
              <span className="relative z-10 flex items-center gap-3">
                Get Started
                <svg 
                  className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>

          {/* Features Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-12 transform animate-fade-in-up animation-delay-900">
            {['AI-Powered', 'Real-time Booking', 'Smart Recommendations', 'Community Driven'].map((feature, index) => (
              <span 
                key={feature}
                className="px-4 py-2 text-sm font-medium text-white/80 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300"
                style={{ animationDelay: `${900 + index * 100}ms` }}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-500/20 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-32 right-16 w-16 h-16 bg-purple-500/20 rounded-full blur-xl animate-float animation-delay-1000" />
      <div className="absolute top-1/3 right-20 w-12 h-12 bg-blue-500/20 rounded-full blur-xl animate-float animation-delay-2000" />
    </div>
  );
};

export default Onboarding;
