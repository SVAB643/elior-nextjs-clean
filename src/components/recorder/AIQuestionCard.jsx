// src/components/interview/AIQuestionCard.jsx
"use client";

import { useState } from "react";
import { Sparkles, X, Check, Brain, ArrowRight } from "lucide-react";

export const AIQuestionCard = ({ 
  question, 
  trigger, 
  emotionalWeight = "medium",
  confidence = 0.8,
  onAccept, 
  onDecline,
  isVisible = true 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAccept = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onAccept();
    }, 200);
  };

  const handleDecline = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onDecline();
    }, 200);
  };

  if (!isVisible) return null;

  // Couleurs selon l'importance émotionnelle
  const getEmotionalColors = () => {
    switch (emotionalWeight) {
      case 'high':
        return {
          gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%)',
          border: 'rgba(251, 191, 36, 0.3)',
          accent: '#f59e0b'
        };
      case 'low':
        return {
          gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(124, 58, 237, 0.08) 100%)',
          border: 'rgba(139, 92, 246, 0.25)',
          accent: '#8b5cf6'
        };
      default: // medium
        return {
          gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%)',
          border: 'rgba(59, 130, 246, 0.3)',
          accent: '#3b82f6'
        };
    }
  };

  const colors = getEmotionalColors();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop avec blur */}
      <div 
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(8px)'
        }}
        onClick={handleDecline}
      />
      
      {/* Card principale */}
      <div 
        className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-500 ${
          isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        style={{
          background: colors.background,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${colors.border}`,
          boxShadow: `0 25px 50px rgba(0, 0, 0, 0.25), 0 0 30px ${colors.accent}20`
        }}
      >
        {/* Header magique */}
        <div className="p-6 pb-4">
          <div className="flex items-start gap-4">
            {/* Icône IA animée */}
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden group"
              style={{
                background: colors.gradient,
                boxShadow: `0 8px 25px ${colors.accent}40`
              }}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))'
                }}
              />
              <Sparkles size={20} className="text-white relative z-10 animate-pulse" />
              
              {/* Effet de particules */}
              <div className="absolute inset-0 overflow-hidden rounded-full">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white/60 rounded-full animate-bounce"
                    style={{
                      top: `${20 + i * 15}%`,
                      left: `${30 + i * 20}%`,
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: '1.5s'
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Titre */}
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                IA détecte un point intéressant !
                {/* Indicateur de confiance */}
                <div 
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    background: colors.gradient,
                    color: 'white',
                    opacity: 0.9
                  }}
                >
                  {Math.round(confidence * 100)}%
                </div>
              </h4>
              
              {/* Trigger qui a déclenché */}
              <div 
                className="text-sm p-3 rounded-xl mb-4"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: `1px solid ${colors.border}`
                }}
              >
                <div className="flex items-start gap-2">
                  <Brain size={14} className="mt-0.5 flex-shrink-0" style={{ color: colors.accent }} />
                  <div>
                    <span className="text-xs font-medium text-gray-600 block mb-1">Élément détecté :</span>
                    <p className="text-gray-800 font-medium leading-relaxed">"{trigger}"</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bouton fermer discret */}
            <button
              onClick={handleDecline}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-white/50 transition-all duration-200"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        
        {/* Question proposée */}
        <div className="px-6 pb-6">
          <div 
            className="p-4 rounded-xl border-l-4 mb-6"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderLeftColor: colors.accent,
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="flex items-start gap-3">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: colors.gradient }}
              >
                <span className="text-white text-xs font-bold">?</span>
              </div>
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                  <Sparkles size={10} />
                  Question de suivi suggérée
                </div>
                <p className="text-base font-semibold text-gray-900 leading-relaxed">
                  {question}
                </p>
              </div>
            </div>
          </div>
          
          {/* Boutons d'action */}
          <div className="flex gap-3">
            <button
              onClick={handleAccept}
              className="flex-1 px-6 py-4 text-white text-base rounded-xl transition-all duration-300 font-semibold transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden group"
              style={{
                background: colors.gradient,
                boxShadow: `0 8px 25px ${colors.accent}40`
              }}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))'
                }}
              />
              <Check size={18} className="relative z-10" />
              <span className="relative z-10">Oui, creuser maintenant !</span>
              <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            
            <button
              onClick={handleDecline}
              className="px-4 py-4 bg-white text-gray-700 text-base rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium border border-gray-200 hover:border-gray-300 flex items-center justify-center transform hover:scale-105 active:scale-95"
            >
              <X size={18} />
            </button>
          </div>
          
          {/* Indicateur en bas */}
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-1 rounded-full animate-pulse"
                    style={{
                      background: colors.accent,
                      animationDelay: `${i * 0.2}s`
                    }}
                  />
                ))}
              </div>
              <span>Poids émotionnel : {emotionalWeight === 'high' ? 'Élevé' : emotionalWeight === 'low' ? 'Faible' : 'Moyen'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};