// src/components/recorder/RecordingCenter.jsx
"use client";

import { useState } from "react";
import { Mic, Play, MessageCircle, AlertCircle, Sparkles, Zap } from "lucide-react";

export const RecordingCenter = ({ 
  isRecording, 
  countdown, 
  isPlayingQuestion, 
  isTranscribing, 
  audioLevel, 
  recordingProgress,
  onMainClick,
  currentQuestion,
  hasQuestionSelected,
  selectedQuestionTitle,
  
  // Props pour l'IA
  isAnalyzingResponse = false,
  suggestedFollowUp = null,
  onAcceptFollowUp = null,
  onDeclineFollowUp = null
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 150);
    onMainClick();
  };

  // Détecter si la question actuelle est une question IA
  const isAIQuestion = typeof currentQuestion === 'object' && currentQuestion?.isAI;

  // Debug logs pour comprendre pourquoi la bulle n'apparaît pas
  console.log('🔍 Debug RecordingCenter:', {
    suggestedFollowUp,
    isRecording,
    isTranscribing,
    isPlayingQuestion,
    shouldShowBubble: suggestedFollowUp && !isRecording && !isTranscribing && !isPlayingQuestion
  });

  return (
    <div className="flex-1 h-full bg-white flex items-center justify-center p-8 relative">
      
      {/* Rectangle avec dégradé coucher de soleil de bas en haut */}
      <div 
        className="w-full max-w-4xl h-full max-h-[600px] rounded-3xl shadow-2xl p-8 flex flex-col justify-center relative"
        style={{
          background: 'linear-gradient(0deg, #e8967a 0%, #f4c2a1 25%, #e8d5c4 50%, #cdc4d8 75%, #b8b5c7 100%)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        
        {hasQuestionSelected ? (
          <div className="space-y-12">
            
            {/* Question avec indicateur IA si applicable */}
            <div 
              className="backdrop-blur-lg rounded-2xl p-6 shadow-lg border mx-auto max-w-xl relative"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)'
              }}
            >
              {/* Badge IA si c'est une question générée */}
              {isAIQuestion && (
                <div className="absolute -top-3 -right-3 z-10">
                  <div 
                    className="px-3 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1 animate-pulse"
                    style={{
                      background: 'linear-gradient(135deg, #fb7185, #f97316, #3b82f6)',
                      boxShadow: '0 4px 15px rgba(251, 113, 133, 0.4), 0 0 20px rgba(59, 130, 246, 0.3)'
                    }}
                  >
                    <Sparkles size={10} />
                    Question IA
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: isAIQuestion 
                      ? 'linear-gradient(135deg, #fb7185, #f97316, #3b82f6)'
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))',
                    boxShadow: isAIQuestion 
                      ? '0 4px 15px rgba(251, 113, 133, 0.4)'
                      : '0 4px 15px rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {isAIQuestion ? (
                    <Zap size={14} className="text-white" />
                  ) : (
                    <MessageCircle size={14} className="text-white/80" />
                  )}
                </div>
                <div className="flex-1">
                  <div 
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-white/90 text-xs font-medium mb-3"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {isAIQuestion ? '🤖 Question de suivi' : 'Question'}
                  </div>
                  <h3 className="text-lg font-light text-white/95 mb-2 leading-tight">
                    {selectedQuestionTitle}
                  </h3>
                  <p className="text-white/80 leading-relaxed font-light text-sm">
                    {typeof currentQuestion === 'string' ? currentQuestion : currentQuestion?.text || ''}
                  </p>
                  
                  {/* Trigger IA si applicable */}
                  {isAIQuestion && currentQuestion?.trigger && (
                    <div 
                      className="mt-3 p-3 rounded-lg text-xs text-white/90"
                      style={{
                        background: 'linear-gradient(135deg, rgba(251, 113, 133, 0.2), rgba(59, 130, 246, 0.2))',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      💡 Basé sur : "{currentQuestion.trigger}"
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* BULLE IA - Question de suivi suggérée */}
            {suggestedFollowUp && !isRecording && !isTranscribing && !isPlayingQuestion && (
              <div className="mx-auto max-w-xl animate-in slide-in-from-bottom duration-500">
                <div 
                  className="backdrop-blur-lg rounded-2xl p-4 shadow-lg border"
                  style={{
                    background: 'rgba(0, 0, 0, 0.7)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Icône IA avec dégradé orange/bleu */}
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse"
                      style={{
                        background: 'linear-gradient(135deg, #fb7185, #f97316, #3b82f6)',
                        boxShadow: '0 4px 15px rgba(251, 113, 133, 0.4)'
                      }}
                    >
                      <Zap size={14} className="text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-white">L'IA suggère une question de suivi</span>
                        {isAnalyzingResponse && (
                          <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                        )}
                      </div>
                      
                      {/* Élément détecté */}
                      {suggestedFollowUp.specificElement && (
                        <div className="mb-2 text-xs text-orange-200 font-light">
                          Élément détecté : "{suggestedFollowUp.specificElement}"
                        </div>
                      )}
                      
                      {/* Question suggérée */}
                      <p className="text-sm text-white leading-relaxed mb-3 font-light">
                        {suggestedFollowUp.question}
                      </p>
                      
                      {/* Boutons d'action */}
                      <div className="flex gap-2">
                        <button
                          onClick={onAcceptFollowUp}
                          className="flex-1 py-2 px-3 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Poser cette question
                        </button>
                        <button
                          onClick={onDeclineFollowUp}
                          className="py-2 px-3 bg-white/10 hover:bg-white/20 text-white/80 rounded-lg text-xs transition-all duration-200 flex items-center justify-center"
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Zone bouton parfaitement centrée */}
            <div className="flex-1 flex items-center justify-center relative">
              
              {countdown !== null ? (
                /* Décompte */
                <div className="text-center space-y-6">
                  <div 
                    className="text-8xl font-extralight tracking-tight transition-all duration-500" 
                    style={{ 
                      fontFamily: 'system-ui, -apple-system',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
                    }}
                  >
                    {countdown}
                  </div>
                  <p className="text-white/80 font-light text-base tracking-wide">Préparez-vous...</p>
                </div>
              ) : isRecording ? (
                /* Mode enregistrement */
                <div className="text-center space-y-8 w-full">
                  <div className="relative flex items-center justify-center">
                    {/* Vagues d'animation */}
                    <div 
                      className="absolute w-32 h-32 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                      }}
                    ></div>
                    <div 
                      className="absolute w-24 h-24 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        animationDelay: '0.5s'
                      }}
                    ></div>
                    
                    {/* Bouton d'enregistrement */}
                    <button
                      onClick={handleClick}
                      className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8))',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                        border: '2px solid rgba(255, 255, 255, 0.4)',
                        backdropFilter: 'blur(20px)'
                      }}
                    >
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{
                          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                          boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)',
                          animation: 'pulse 1.5s ease-in-out infinite'
                        }}
                      ></div>
                    </button>
                    
                    {/* Barre de progression circulaire */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 96 96">
                        <circle cx="48" cy="48" r="44" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2" fill="none" />
                        <circle
                          cx="48" cy="48" r="44"
                          stroke="rgba(255, 255, 255, 0.8)" strokeWidth="2" fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 44}`}
                          strokeDashoffset={`${2 * Math.PI * 44 * (1 - recordingProgress / 100)}`}
                          className="transition-all duration-300"
                        />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Visualiseur audio */}
                  <div className="flex items-center justify-center gap-1.5 h-12">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-white/80 rounded-full transition-all duration-200"
                        style={{
                          height: `${Math.max(8, (audioLevel * 40 + Math.random() * 16))}px`,
                          opacity: audioLevel > 0.1 ? 0.9 : 0.4
                        }}
                      ></div>
                    ))}
                  </div>
                  
                  <div className="h-6 flex items-center justify-center">
                    <p className="text-white/90 font-light text-sm">Enregistrement en cours...</p>
                  </div>
                </div>
              ) : isTranscribing ? (
                /* Mode transcription */
                <div className="text-center space-y-6">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 border rounded-full border-white/20"></div>
                    <div className="absolute inset-0 border rounded-full animate-spin border-white/80 border-t-transparent"></div>
                  </div>
                  <p className="text-white/80 font-light text-sm">Transcription...</p>
                </div>
              ) : isPlayingQuestion ? (
                /* Mode lecture */
                <div className="text-center space-y-6">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto transition-all duration-500"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15))',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <Play size={20} className="text-white ml-1" />
                  </div>
                  <p className="text-white/80 font-light text-sm">Lecture...</p>
                </div>
              ) : (
                /* Bouton principal */
                <div className="text-center space-y-8">
                  <div className="relative flex items-center justify-center">
                    <button
                      onClick={handleClick}
                      className="relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 group hover:scale-110"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        backdropFilter: 'blur(20px)',
                        transform: isClicked ? 'scale(0.95)' : 'scale(1)'
                      }}
                    >
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center relative z-10 transition-all duration-300"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%)',
                          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <Mic size={24} className="text-gray-600 transition-all duration-300 group-hover:text-gray-700" />
                      </div>
                      
                      {isClicked && (
                        <div 
                          className="absolute inset-0 rounded-full animate-ping"
                          style={{
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.2))',
                            animationDuration: '600ms'
                          }}
                        ></div>
                      )}
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-white font-light text-base tracking-wide">Cliquez pour commencer</p>
                    <p className="text-white/60 font-light text-xs">
                      La question sera lue automatiquement
                    </p>
                  </div>
                </div>
              )}

              {/* Indicateur d'analyse IA */}
              {isAnalyzingResponse && (
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg z-20">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-light">IA analyse...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Interface sans question sélectionnée */
          <div className="flex items-center justify-center h-full">
            <div 
              className="backdrop-blur-xl rounded-2xl p-12 shadow-xl border text-center max-w-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))',
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
              >
                <AlertCircle size={24} className="text-white/70" />
              </div>
              
              <h3 className="text-xl font-medium text-white mb-3 tracking-tight">Aucune question sélectionnée</h3>
              <p className="text-white/80 font-light text-base leading-relaxed">
                Choisissez une question dans la liste de gauche pour commencer l'enregistrement
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Styles CSS pour animations */}
      <style jsx>{`
        @keyframes slide-in-from-bottom {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-in {
          animation-fill-mode: both;
        }
        
        .slide-in-from-bottom {
          animation: slide-in-from-bottom 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};