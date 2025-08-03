"use client";

import { useState } from "react";
import { Edit2, Trash2, Plus, Sparkles, Book, ChevronDown, ChevronRight, MessageCircle, Play, Check, FileText, Send } from "lucide-react";

export const ChapterSidebar = ({ 
  chapters, 
  activeChapter, 
  activeQuestion,
  onChapterSelect, 
  onQuestionSelect,
  onChapterRename, 
  onChapterDelete, 
  onNewChapter, 
  onGenerateStory, 
  onSendToEditor, // Nouvelle fonction pour envoyer au BookEditor
  isGenerating, 
  totalSegments,
  bookTitle = "Mon Livre",
  authorName = ""
}) => {
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState("");
  const [expandedChapters, setExpandedChapters] = useState(new Set());
  const [generationComplete, setGenerationComplete] = useState(false);

  const startEdit = (id, currentTitle) => {
    setEditing(id);
    setTitle(currentTitle);
  };

  const saveEdit = () => {
    if (editing && title.trim()) {
      onChapterRename(editing, title.trim());
    }
    setEditing(null);
    setTitle("");
  };

  const toggleChapter = (chapterId) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const handleChapterClick = (chapterId) => {
    toggleChapter(chapterId);
    onChapterSelect(chapterId);
  };

  const handleQuestionClick = (e, chapterId, questionId) => {
    e.stopPropagation();
    onChapterSelect(chapterId);
    onQuestionSelect(questionId);
  };

  const getChapterStats = (chapter) => {
    const totalQuestions = chapter.questions?.length || 0;
    const answeredQuestions = chapter.segments?.length || 0;
    return { totalQuestions, answeredQuestions };
  };

  const getFormattedChapterTitle = (chapter, index) => {
    const cleanTitle = chapter.title.replace(/^[👶🎒💼🏗️🎈🧭🌟]\s*/, '');
    if (index === 0) {
      return `Préface : ${cleanTitle}`;
    } else {
      return `Chapitre ${index} : ${cleanTitle}`;
    }
  };

  // Calculer le pourcentage de completion global
  const getGlobalCompletion = () => {
    const totalQuestions = chapters.reduce((acc, chapter) => acc + (chapter.questions?.length || 0), 0);
    const totalAnswered = chapters.reduce((acc, chapter) => acc + (chapter.segments?.length || 0), 0);
    return totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0;
  };

  // Vérifier si le livre est prêt pour l'édition
  const isBookReady = () => {
    return chapters.some(chapter => chapter.segments && chapter.segments.length > 0);
  };

  const handleGenerateAndSend = async () => {
    try {
      setGenerationComplete(false);
      await onGenerateStory();
      setGenerationComplete(true);
      
      // Automatiquement envoyer au BookEditor après génération
      setTimeout(() => {
        if (onSendToEditor) {
          onSendToEditor(chapters, bookTitle, authorName);
        }
      }, 1000);
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
    }
  };

  return (
    <div className="w-80 h-full flex flex-col flex-shrink-0 relative"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(229, 231, 235, 0.3)'
      }}
    >
      {/* Header glassmorphisme avec stats */}
      <div className="p-6 flex-shrink-0 relative">
        <div 
          className="absolute inset-0 rounded-t-3xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.3) 100%)',
            backdropFilter: 'blur(40px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-xl flex items-center justify-center relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 2px 4px rgba(255, 255, 255, 0.2)'
                }}
              >
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(135deg, #fed7aa, #c7d2fe)',
                    opacity: 0.6
                  }}
                />
                <Book size={16} className="text-white relative z-10" />
              </div>
              <div>
                <h2 className="text-lg font-light text-gray-800 tracking-wide">Chapitres</h2>
                <p className="text-xs text-gray-600 font-light">{getGlobalCompletion()}% complété</p>
              </div>
            </div>
            
            <button
              onClick={onNewChapter}
              className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 text-sm font-light relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.4) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%)'
                }}
              />
              <Plus size={14} className="text-gray-600 relative z-10" />
              <span className="text-gray-700 relative z-10">Nouveau</span>
            </button>
          </div>

          {/* Barre de progression globale */}
          <div 
            className="h-2 rounded-full mb-4 overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div 
              className="h-full transition-all duration-1000 ease-out rounded-full"
              style={{
                width: `${getGlobalCompletion()}%`,
                background: 'linear-gradient(90deg, #fed7aa, #c7d2fe)',
                boxShadow: '0 0 8px rgba(254, 215, 170, 0.5)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Liste des chapitres avec scroll élégant */}
      <div className="flex-1 overflow-y-auto px-6 py-2 scrollbar-hide">
        <div className="space-y-2">
          {chapters.map((chapter, index) => {
            const isExpanded = expandedChapters.has(chapter.id);
            const isActiveChapter = activeChapter === chapter.id;
            const stats = getChapterStats(chapter);
            const isCompleted = stats.totalQuestions > 0 && stats.answeredQuestions === stats.totalQuestions;
            const hasStarted = stats.answeredQuestions > 0;
            const progressPercentage = stats.totalQuestions > 0 ? (stats.answeredQuestions / stats.totalQuestions) * 100 : 0;
            
            return (
              <div key={chapter.id} className="space-y-2">
                {/* Card chapitre compacte */}
                <div
                  className={`group relative rounded-xl transition-all duration-300 overflow-hidden ${
                    isActiveChapter ? 'transform scale-[1.02]' : 'hover:scale-[1.01]'
                  }`}
                  style={{
                    background: isActiveChapter 
                      ? 'linear-gradient(135deg, rgba(254, 215, 170, 0.15) 0%, rgba(199, 210, 254, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 100%)',
                    backdropFilter: 'blur(15px)',
                    border: isActiveChapter 
                      ? '1px solid rgba(254, 215, 170, 0.3)' 
                      : '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: isActiveChapter 
                      ? '0 4px 16px rgba(254, 215, 170, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.3)'
                      : '0 2px 8px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  {/* Barre de progression fine */}
                  <div 
                    className="absolute bottom-0 left-0 h-0.5 transition-all duration-500 rounded-full"
                    style={{
                      width: `${progressPercentage}%`,
                      background: isCompleted 
                        ? 'linear-gradient(90deg, #10b981, #059669)'
                        : hasStarted 
                          ? 'linear-gradient(90deg, #fed7aa, #c7d2fe)'
                          : 'transparent',
                      boxShadow: progressPercentage > 0 ? '0 0 4px rgba(0, 0, 0, 0.3)' : 'none'
                    }}
                  />

                  {editing === chapter.id ? (
                    <div className="p-4">
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit();
                          if (e.key === 'Escape') setEditing(null);
                        }}
                        className="w-full px-3 py-2 text-sm rounded-lg focus:outline-none transition-all font-light border-none"
                        style={{
                          background: 'rgba(255, 255, 255, 0.8)',
                          backdropFilter: 'blur(10px)',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                        autoFocus
                      />
                      <div className="flex gap-2 mt-3">
                        <button 
                          onClick={saveEdit}
                          className="px-3 py-1.5 text-white text-xs rounded-lg transition-all duration-300 font-light"
                          style={{
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                          }}
                        >
                          ✓
                        </button>
                        <button 
                          onClick={() => setEditing(null)}
                          className="px-3 py-1.5 text-gray-600 text-xs rounded-lg transition-all duration-300 font-light"
                          style={{
                            background: 'rgba(255, 255, 255, 0.6)',
                            backdropFilter: 'blur(10px)'
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleChapterClick(chapter.id)}
                        className="w-full p-4 text-left flex items-center justify-between transition-all duration-200 active:scale-[0.98]"
                        style={{
                          background: 'transparent'
                        }}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {/* Icône compacte */}
                          <div className={`transition-all duration-300 flex-shrink-0 ${
                            isActiveChapter ? 'text-gray-700' : 'text-gray-500'
                          }`}>
                            <div className={`transform transition-transform duration-200 ${
                              isExpanded ? 'rotate-90' : 'rotate-0'
                            }`}>
                              <ChevronRight size={16} />
                            </div>
                          </div>
                          
                          {/* Point de statut compact */}
                          <div 
                            className={`w-3 h-3 rounded-full transition-all duration-300 flex-shrink-0`} 
                            style={{
                              background: isCompleted 
                                ? 'linear-gradient(135deg, #10b981, #059669)'
                                : hasStarted 
                                  ? 'linear-gradient(135deg, #fed7aa, #c7d2fe)'
                                  : 'rgba(229, 231, 235, 0.8)',
                              boxShadow: isCompleted || hasStarted ? '0 2px 6px rgba(0, 0, 0, 0.2)' : 'none'
                            }}
                          />
                          
                          {/* Titre compact */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span 
                                className="text-xs px-2 py-0.5 rounded-full font-light"
                                style={{
                                  background: 'rgba(255, 255, 255, 0.5)',
                                  color: '#6b7280'
                                }}
                              >
                                {index === 0 ? 'Préface' : `Ch. ${index}`}
                              </span>
                              {isCompleted && (
                                <Check size={10} className="text-green-600" />
                              )}
                            </div>
                            <h3 className="text-sm font-light text-gray-800 truncate">
                              {chapter.title.replace(/^[👶🎒💼🏗️🎈🧭🌟]\s*/, '')}
                            </h3>
                          </div>
                        </div>
                        
                        {/* Statistiques compactes */}
                        <div 
                          className="px-2 py-1 rounded-full text-xs font-light flex-shrink-0"
                          style={{
                            background: 'rgba(255, 255, 255, 0.4)',
                            color: isCompleted ? '#059669' : hasStarted ? '#d97706' : '#6b7280'
                          }}
                        >
                          {stats.answeredQuestions}/{stats.totalQuestions}
                        </div>
                      </button>
                      
                      {/* Boutons d'action compacts */}
                      <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-1 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEdit(chapter.id, chapter.title);
                          }}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
                          style={{
                            background: 'rgba(255, 255, 255, 0.7)',
                            backdropFilter: 'blur(10px)'
                          }}
                        >
                          <Edit2 size={12} />
                        </button>
                        {chapters.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onChapterDelete(chapter.id);
                            }}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 transition-colors"
                            style={{
                              background: 'rgba(255, 255, 255, 0.7)',
                              backdropFilter: 'blur(10px)'
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Liste des questions compactes */}
                {isExpanded && chapter.questions && chapter.questions.length > 0 && (
                  <div className="ml-6 space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                    {chapter.questions.map((question, questionIndex) => {
                      const isActiveQuestion = activeQuestion === question.id;
                      const hasResponse = chapter.segments?.some(segment => segment.questionId === question.id);
                      
                      return (
                        <button
                          key={question.id}
                          onClick={(e) => handleQuestionClick(e, chapter.id, question.id)}
                          className={`w-full text-left p-3 rounded-lg transition-all duration-200 group/question relative overflow-hidden active:scale-[0.98] ${
                            isActiveQuestion ? 'transform scale-[1.02]' : ''
                          }`}
                          style={{
                            background: isActiveQuestion
                              ? 'linear-gradient(135deg, rgba(254, 215, 170, 0.2) 0%, rgba(199, 210, 254, 0.15) 100%)'
                              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)',
                            backdropFilter: 'blur(10px)',
                            border: isActiveQuestion 
                              ? '1px solid rgba(254, 215, 170, 0.4)' 
                              : '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: isActiveQuestion 
                              ? '0 3px 12px rgba(254, 215, 170, 0.25)'
                              : '0 1px 4px rgba(0, 0, 0, 0.05)'
                          }}
                        >
                          {/* Indicateur actif subtil */}
                          {isActiveQuestion && (
                            <div 
                              className="absolute left-0 top-0 bottom-0 w-0.5 rounded-r-full"
                              style={{
                                background: 'linear-gradient(135deg, #fed7aa, #c7d2fe)'
                              }}
                            />
                          )}
                          
                          <div className="flex items-start gap-3">
                            {/* Numéro compact */}
                            <div 
                              className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-light transition-all duration-200`}
                              style={{
                                background: isActiveQuestion 
                                  ? 'linear-gradient(135deg, #fed7aa, #c7d2fe)'
                                  : hasResponse
                                    ? 'linear-gradient(135deg, #dcfce7, #bbf7d0)'
                                    : 'rgba(255, 255, 255, 0.5)',
                                color: isActiveQuestion || hasResponse ? '#fff' : '#6b7280',
                                boxShadow: isActiveQuestion || hasResponse ? '0 2px 6px rgba(0, 0, 0, 0.15)' : 'none'
                              }}
                            >
                              {hasResponse ? (
                                <Check size={10} />
                              ) : (
                                questionIndex + 1
                              )}
                            </div>
                            
                            {/* Contenu question compact */}
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-light mb-1 ${
                                isActiveQuestion ? 'text-gray-800' : 'text-gray-700'
                              }`}>
                                {question.title}
                              </p>
                              <p className="text-xs text-gray-500 line-clamp-1 font-light">
                                {question.text.substring(0, 60)}...
                              </p>
                            </div>
                            
                            {/* Indicateur de lecture compact */}
                            {isActiveQuestion && (
                              <div 
                                className="flex-shrink-0 mt-1 p-1 rounded-full"
                                style={{
                                  background: 'rgba(255, 255, 255, 0.5)'
                                }}
                              >
                                <Play size={10} className="text-gray-600" />
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Message questions vides compact */}
                {isExpanded && (!chapter.questions || chapter.questions.length === 0) && (
                  <div 
                    className="ml-6 p-4 text-center rounded-lg"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <MessageCircle size={20} className="mx-auto mb-2 opacity-40 text-gray-500" />
                    <p className="text-sm font-light text-gray-600">Aucune question</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer glassmorphisme avec options étendues */}
      <div className="p-6 relative">
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.3) 100%)',
            backdropFilter: 'blur(40px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        />
        
        <div className="relative z-10 space-y-4">
          {/* Bouton principal de génération */}
          <button
            onClick={handleGenerateAndSend}
            disabled={totalSegments === 0 || isGenerating}
            className={`w-full flex items-center justify-center gap-3 px-6 py-4 font-light rounded-2xl transition-all duration-500 transform hover:scale-105 disabled:cursor-not-allowed text-white relative overflow-hidden group ${
              isGenerating ? 'animate-pulse' : ''
            }`}
            style={{
              background: totalSegments === 0 
                ? 'linear-gradient(135deg, rgba(156, 163, 175, 0.6) 0%, rgba(156, 163, 175, 0.4) 100%)'
                : 'linear-gradient(135deg, #fed7aa, #c7d2fe)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: totalSegments > 0 
                ? '0 12px 32px rgba(0, 0, 0, 0.15), inset 0 2px 4px rgba(255, 255, 255, 0.2)'
                : '0 4px 16px rgba(0, 0, 0, 0.1)'
            }}
          >
            {/* Effet de brillance au hover */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)'
              }}
            />
            
            <div className={`transition-transform duration-300 relative z-10 ${isGenerating ? 'animate-spin' : ''}`}>
              <Sparkles size={20} />
            </div>
            
            <span className="relative z-10 text-base">
              {isGenerating 
                ? 'Génération en cours...' 
                : generationComplete 
                  ? 'Envoi vers l\'éditeur...'
                  : 'Générer & Éditer'
              }
            </span>
          </button>

          {/* Bouton d'envoi direct vers l'éditeur */}
          {isBookReady() && (
            <button
              onClick={() => onSendToEditor && onSendToEditor(chapters, bookTitle, authorName)}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 font-light rounded-xl transition-all duration-300 transform hover:scale-105 text-gray-700 relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.4) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)'
              }}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%)'
                }}
              />
              
              <Send size={16} className="relative z-10" />
              <span className="relative z-10 text-sm">Envoyer vers l'éditeur</span>
            </button>
          )}
          
          <div 
            className="text-sm text-center font-light px-4 py-2 rounded-xl"
            style={{
              background: 'rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(10px)',
              color: '#6b7280'
            }}
          >
            {totalSegments} réponse{totalSegments > 1 ? 's' : ''} enregistrée{totalSegments > 1 ? 's' : ''} • {getGlobalCompletion()}% terminé
          </div>
        </div>
      </div>

      {/* Style pour scroll invisible */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes slide-in-from-top-2 {
          0% {
            opacity: 0;
            transform: translateY(-8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-in {
          animation-fill-mode: both;
        }
        
        .active\\:scale-\\[0\\.98\\]:active {
          transform: scale(0.98);
        }
        
        .scale-\\[1\\.01\\]:hover {
          transform: scale(1.01);
        }
        
        .scale-\\[1\\.02\\] {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};