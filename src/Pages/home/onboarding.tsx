import React, { useEffect, useState } from "react";
import { Mixpanel } from "../../mixpanel/init";
import Loader from "../../components/Loader";
import { navigate } from "@reach/router";

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
          backgroundImage: `url('https://zfx-gyms.zenfitx.link/images/onboarding/login.jpg')`,
          filter: 'brightness(0.4) contrast(1.1)'
        }}
      />
      
      {/* Animated Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-transparent to-emerald-900/30 animate-pulse" />
      
      {/* Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen px-6 py-12">
        {/* Main Content - Centered */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-8 max-w-4xl mx-auto flex flex-col items-center justify-center">
            {/* Logo/Brand */}
            <div className="space-y-4 transform animate-fade-in-up">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-emerald-200 drop-shadow-2xl tracking-wider">
                ZenfitX
              </h1>
              
              {/* Tagline */}
              <div className="space-y-3">
                <p className="text-lg md:text-3xl lg:text-4xl font-bold text-white/90 tracking-wider">
                  TRACK · IMPROVE · PLAY
                </p>
                <p className="text-lg md:text-xl text-white/80 font-medium">
                  smartly with <span className="font-bold bg-emerald-500/20 px-2 py-1 rounded-lg" style={{ color: 'rgba(238, 255, 183, 1)' }}>ZenVision AI</span>
                </p>
              </div>
            </div>

            {/* Description */}
            {/* <div className="space-y-4 transform animate-fade-in-up animation-delay-300">
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                Explore & book any fitness or wellness activity near you with intelligent recommendations
              </p>
            </div> */}

            {/* Features Pills */}
            {/* <div className="flex flex-wrap justify-center gap-3 mt-12 transform animate-fade-in-up animation-delay-900">
              {['AI-Powered', 'Real-time Booking', 'Smart Recommendations', 'Community Driven'].map((feature, index) => (
                <span 
                  key={feature}
                  className="px-4 py-2 text-sm font-medium text-white/80 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300"
                  style={{ animationDelay: `${900 + index * 100}ms` }}
                >
                  {feature}
                </span>
              ))}
            </div> */}
          </div>
        </div>

        {/* CTA Button - Fixed at Bottom */}
        <div className="pb-2 px-4 transform animate-fade-in-up animation-delay-300 flex justify-center">
          <button
            onClick={handleGetStarted}
            className="group relative w-full md:w-auto md:px-16 lg:px-20 py-4 md:py-6 text-lg md:text-xl font-bold text-black rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out border border-gray-300/30 hover:border-gray-400/50"
            style={{ background: 'linear-gradient(to right, rgba(199, 255, 202, 1), rgba(238, 255, 183, 1))' }}
          >
            {/* Button Background Effects */}
            <div className="absolute inset-0 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" style={{ background: 'linear-gradient(to right, rgba(199, 255, 202, 0.3), rgba(238, 255, 183, 0.3))' }} />
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Button Text */}
            <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
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
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-500/20 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-32 right-16 w-16 h-16 bg-purple-500/20 rounded-full blur-xl animate-float animation-delay-1000" />
      <div className="absolute top-1/3 right-20 w-12 h-12 bg-blue-500/20 rounded-full blur-xl animate-float animation-delay-2000" />
    </div>
  );
};

export default Onboarding;
