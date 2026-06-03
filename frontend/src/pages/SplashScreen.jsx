import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SplashScreen() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('INITIALIZING SYNAPTIC LINK...');
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Progress bar animation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        
        // Dynamic loading texts as loading progresses
        const next = prev + Math.floor(Math.random() * 15) + 5;
        const val = next > 100 ? 100 : next;
        
        if (val < 30) {
          setLoadingText('CONNECTING TO XEPHORA CORE...');
        } else if (val < 65) {
          setLoadingText('MAPPING COGNITIVE NODES...');
        } else if (val < 90) {
          setLoadingText('ESTABLISHING SECURE PROTOCOLS...');
        } else {
          setLoadingText('NEURAL NEXUS READY.');
        }
        
        return val;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Navigate once progress reaches 100 and Auth is done loading
    if (progress === 100 && !loading) {
      const timer = setTimeout(() => {
        if (user) {
          navigate('/app/dashboard', { replace: true });
        } else {
          navigate('/home', { replace: true });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, loading, user, navigate]);

  return (
    <div className="splash-container">
      <div className="splash-background-overlay" />
      <div className="splash-content">
        <div className="splash-logo-wrapper">
          <svg className="splash-logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="50%" stopColor="#7000ff" />
                <stop offset="100%" stopColor="#ff007b" />
              </linearGradient>
            </defs>
            <path 
              d="M50 5 L90 28 L90 72 L50 95 L10 72 L10 28 Z" 
              fill="none" 
              stroke="url(#neonGlow)" 
              strokeWidth="6" 
              filter="drop-shadow(0 0 15px rgba(0, 240, 255, 0.6))"
            />
            <path 
              d="M50 20 L76 35 L76 65 L50 80 L24 65 L24 35 Z" 
              fill="none" 
              stroke="#7000ff" 
              strokeWidth="3" 
              opacity="0.7"
            />
            <circle cx="50" cy="50" r="12" fill="#ff007b" filter="drop-shadow(0 0 8px #ff007b)" />
          </svg>
        </div>

        <h1 className="splash-title">XEPHORA</h1>
        <div className="splash-subtitle">NEURAL STRATEGY NEXUS</div>

        <div className="loader-track">
          <div className="loader-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="loader-text">{loadingText} ({progress}%)</div>
      </div>
    </div>
  );
}
