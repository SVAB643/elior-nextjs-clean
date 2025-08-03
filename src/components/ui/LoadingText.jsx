"use client";

import { useState, useEffect } from "react";

export const LoadingText = ({ 
  text, 
  variant = "typewriter", 
  className = "",
  showCursor = true,
  speed = 100 
}) => {
  const [currentText, setCurrentText] = useState('');
  const [direction, setDirection] = useState(1);
  const [showCursorBlink, setShowCursorBlink] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText(prev => {
        if (direction === 1) {
          if (prev.length < text.length) {
            return text.slice(0, prev.length + 1);
          } else {
            setTimeout(() => setDirection(-1), 1000); // Pause avant effacement
            return prev;
          }
        } else {
          if (prev.length > 0) {
            return prev.slice(0, -1);
          } else {
            setTimeout(() => setDirection(1), 500); // Pause avant réécriture
            return prev;
          }
        }
      });
    }, speed);

    return () => clearInterval(interval);
  }, [text, direction, speed]);

  // Animation du curseur
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursorBlink(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  if (variant === "fade") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span 
          className="text-2xl font-light transition-all duration-500"
          style={{
            background: 'linear-gradient(135deg, #fed7aa, #c7d2fe)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            opacity: currentText.length > 0 ? 1 : 0.5
          }}
        >
          {text}
        </span>
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span 
          className="text-2xl font-light animate-pulse"
          style={{
            background: 'linear-gradient(135deg, #fed7aa, #c7d2fe)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          {text}
        </span>
      </div>
    );
  }

  if (variant === "shimmer") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span 
          className="text-2xl font-light relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #fed7aa, #c7d2fe)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          {text}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
            style={{ 
              animation: 'shimmer 2s ease-in-out infinite',
              backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
            }}
          />
        </span>
      </div>
    );
  }

  // Variant par défaut : typewriter amélioré
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        <span 
          className="text-2xl font-light tracking-wide"
          style={{
            background: 'linear-gradient(135deg, #fed7aa, #c7d2fe)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'system-ui, -apple-system'
          }}
        >
          {currentText}
          {showCursor && (
            <span 
              className={`ml-0.5 transition-opacity duration-150 ${
                showCursorBlink ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                background: 'linear-gradient(135deg, #fed7aa, #c7d2fe)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              |
            </span>
          )}
        </span>
        
        {/* Effet de glow subtil */}
        <div 
          className="absolute inset-0 blur-sm opacity-30 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #fed7aa, #c7d2fe)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          {currentText}
        </div>
      </div>
    </div>
  );
};