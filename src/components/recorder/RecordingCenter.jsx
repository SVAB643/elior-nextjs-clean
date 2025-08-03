"use client";

import { useState } from "react";
import { Mic, MicOff, Play, MessageCircle, AlertCircle } from "lucide-react";

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
  
  // NOUVELLES PROPS pour l'IA temps réel
  partialTranscription = '',
  suggestedFollowUp = null,
  isAnalyzingResponse = false,
  onAcceptFollowUp = () => {},
  onDeclineFollowUp = () => {}
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 150);
    onMainClick();
  };

  return (
    <div className="flex-1 h-full bg-white flex items-center justify-center p-8">
      
      {/* Rectangle avec dégradé coucher de soleil de bas en haut */}
      <div 
        className="w-full max-w-4xl h-full max-h-[600px] rounded-3xl shadow-2xl p-8 flex flex-col justify-center relative"
        style={{
          background: 'linear-gradient(0deg, #e8967a 0%, #f4c2a1 25%, #e8d5c4 50%, #cdc4d8 75%, #b8b5c7 100%)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        
        {hasQuestionSelected ? (
          <div className="space-y-20">
            
            {/* Question plus discrète */}
            <div 
              className="backdrop-blur-lg rounded-2xl p-6 shadow-lg border mx-auto max-w-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="flex items-start gap-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))'
                  }}
                >
                  <MessageCircle size={14} className="text-white/80" />
                </div>
                <div className="flex-1">
                  <div 
                    className="inline-flex items-center px-2 py-1 rounded-full text-white/80 text-xs font-light mb-2"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))'
                    }}
                  >
                    Question 1/9
                  </div>
                  <h3 className="text-lg font-light text-white/90 mb-2 leading-tight">
                    {selectedQuestionTitle}
                  </h3>
                  <p className="text-white/70 leading-relaxed font-light text-sm">
                    {currentQuestion}
                  </p>
                </div>
              </div>
            </div>

            {/* Zone bouton parfaitement centrée avec flex-1 */}
            <div className="flex-1 flex items-center justify-center relative">
              
              {countdown !== null ? (
                /* Décompte simple et beau */
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
                /* Mode enregistrement avec bouton stable et classe */
                <div className="text-center space-y-8 w-full">
                  <div className="relative flex items-center justify-center">
                    {/* Vagues blanches fixes et élégantes */}
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
                    
                    {/* Bouton d'enregistrement premium et stable */}
                    <button
                      onClick={handleClick}
                      className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 group"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8))',
                        boxShadow: `
                          0 8px 32px rgba(0, 0, 0, 0.15),
                          0 4px 16px rgba(0, 0, 0, 0.1),
                          inset 0 1px 0 rgba(255, 255, 255, 0.5)
                        `,
                        border: '2px solid rgba(255, 255, 255, 0.4)',
                        backdropFilter: 'blur(20px)'
                      }}
                    >
                      {/* Indicateur d'enregistrement - point rouge élégant */}
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{
                          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                          boxShadow: '0 0 8px rgba(239, 68, 68, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                          animation: 'pulse 1.5s ease-in-out infinite'
                        }}
                      ></div>
                    </button>
                    
                    {/* Barre de progression circulaire élégante */}
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
                          style={{
                            filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.5))'
                          }}
                        />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Visualiseur audio minimaliste et stable */}
                  <div className="flex items-center justify-center gap-1.5 h-12">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-white/80 rounded-full transition-all duration-200"
                        style={{
                          height: `${Math.max(8, (audioLevel * 40 + Math.random() * 16))}px`,
                          opacity: audioLevel > 0.1 ? 0.9 : 0.4,
                          boxShadow: audioLevel > 0.1 ? '0 0 4px rgba(255, 255, 255, 0.5)' : 'none'
                        }}
                      ></div>
                    ))}
                  </div>
                  
                  {/* Texte fixe sans mouvement */}
                  <div className="h-6 flex items-center justify-center">
                    <p className="text-white/90 font-light text-sm">Enregistrement en cours...</p>
                  </div>

                  {/* NOUVEAU : Transcription en temps réel */}
                  {partialTranscription && (
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 max-w-md z-20">
                      <div 
                        className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg animate-in slide-in-from-bottom-2 duration-300"
                        style={{ maxHeight: '100px', overflow: 'auto' }}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse mt-2"></div>
                          <span className="text-xs font-medium text-gray-600">En cours de transcription...</span>
                        </div>
                        <p className="text-sm text-gray-700 italic leading-relaxed">
                          "{partialTranscription}..."
                        </p>
                      </div>
                    </div>
                  )}

                  {/* NOUVEAU : Indicateur d'analyse */}
                  {isAnalyzingResponse && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg animate-in fade-in duration-300 z-20">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-light">IA écoute...</span>
                      </div>
                    </div>
                  )}

                  {/* NOUVEAU : Question de suivi suggérée par l'IA */}
                  {suggestedFollowUp && (
                    <div className="absolute inset-0 flex items-center justify-center z-30 animate-in slide-in-from-top-4 duration-500">
                      <div 
                        className="bg-white rounded-2xl p-6 shadow-2xl border-l-4 max-w-sm"
                        style={{ 
                          borderLeftColor: '#f59e0b',
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 249, 237, 0.95) 100%)',
                          backdropFilter: 'blur(20px)'
                        }}
                      >
                        {/* Header avec icône magique */}
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg animate-pulse">
                            <span className="text-white text-lg">💡</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
                              IA détecte un point intéressant !
                              <div className="flex">
                                <div className="w-1 h-1 bg-orange-400 rounded-full animate-bounce"></div>
                                <div className="w-1 h-1 bg-orange-400 rounded-full animate-bounce mx-1" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-1 h-1 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </h4>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              "{suggestedFollowUp.trigger}"
                            </p>
                          </div>
                        </div>
                        
                        {/* Question proposée */}
                        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 mb-4 border border-orange-200">
                          <div className="text-xs text-orange-600 font-medium mb-1 flex items-center gap-1">
                            <span>🎯</span>
                            Question de suivi suggérée
                          </div>
                          <p className="text-sm font-semibold text-gray-800 leading-relaxed">
                            {suggestedFollowUp.question}
                          </p>
                        </div>
                        
                        {/* Boutons d'action */}
                        <div className="flex gap-3">
                          <button
                            onClick={onAcceptFollowUp}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                          >
                            <span>✓</span>
                            Oui, creuser maintenant !
                          </button>
                          <button
                            onClick={onDeclineFollowUp}
                            className="px-4 py-3 bg-gray-100 text-gray-700 text-sm rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium flex items-center justify-center"
                          >
                            <span>✗</span>
                          </button>
                        </div>
                        
                        {/* Indicateur de confiance */}
                        <div className="mt-3 text-center">
                          <div className="text-xs text-gray-500">
                            Confiance IA: <span className="font-medium text-orange-600">{Math.round(suggestedFollowUp.confidence * 100)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : isTranscribing ? (
                /* Mode transcription fluide */
                <div className="text-center space-y-6">
                  <div className="relative w-16 h-16 mx-auto">
                    <div 
                      className="absolute inset-0 border rounded-full"
                      style={{ borderColor: 'rgba(255, 255, 255, 0.2)', borderWidth: '1px' }}
                    ></div>
                    <div 
                      className="absolute inset-0 border rounded-full animate-spin"
                      style={{ 
                        borderColor: 'rgba(255, 255, 255, 0.8) transparent transparent transparent',
                        borderWidth: '1px'
                      }}
                    ></div>
                  </div>
                  <p className="text-white/80 font-light text-sm">Transcription...</p>
                </div>
              ) : isPlayingQuestion ? (
                /* Mode lecture fluide */
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
                /* Bouton principal centré et stable */
                <div className="text-center space-y-8">
                  <div className="relative flex items-center justify-center">
                    
                    <button
                      onClick={handleClick}
                      className="relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 group hover:scale-110"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
                        boxShadow: `
                          0 8px 32px rgba(0, 0, 0, 0.15),
                          0 4px 16px rgba(0, 0, 0, 0.1),
                          inset 0 1px 0 rgba(255, 255, 255, 0.4)
                        `,
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        backdropFilter: 'blur(20px)',
                        transform: isClicked ? 'scale(0.95)' : 'scale(1)'
                      }}
                    >
                      {/* Cercle intérieur avec icône */}
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center relative z-10 transition-all duration-300"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%)',
                          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <Mic size={24} className="text-gray-600 transition-all duration-300 group-hover:text-gray-700" />
                      </div>
                      
                      {/* Effet de ripple au clic */}
                      {isClicked && (
                        <div 
                          className="absolute inset-0 rounded-full animate-ping"
                          style={{
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.2))',
                            animationDuration: '600ms'
                          }}
                        ></div>
                      )}
                      
                      {/* Effet de hover doux */}
                      <div 
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))'
                        }}
                      ></div>
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
            </div>
          </div>
        ) : (
          /* Interface sans question sélectionnée avec style uniforme */
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
        @keyframes slide-in-from-bottom-2 {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in-from-top-4 {
          0% {
            opacity: 0;
            transform: translateY(-16px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        
        .animate-in {
          animation-fill-mode: both;
        }
        
        .slide-in-from-bottom-2 {
          animation: slide-in-from-bottom-2 0.3s ease-out;
        }
        
        .slide-in-from-top-4 {
          animation: slide-in-from-top-4 0.5s ease-out;
        }
        
        .fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};