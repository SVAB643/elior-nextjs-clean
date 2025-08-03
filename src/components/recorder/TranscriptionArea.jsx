"use client";

import { useState } from "react";
import { Edit2, Mic, Play, Plus, Trash2 } from "lucide-react";

export const TranscriptionArea = ({ chapter, activeQuestion, onSegmentEdit, onSegmentDelete }) => {
  const [editing, setEditing] = useState(null);
  const [text, setText] = useState("");

  const startEdit = (id, currentText) => {
    setEditing(id);
    setText(currentText);
  };

  const saveEdit = () => {
    if (editing && text.trim()) {
      onSegmentEdit(editing, text.trim());
    }
    setEditing(null);
    setText("");
  };

  if (!chapter) {
    return (
      <div className="flex-1 h-full bg-white flex items-center justify-center">
        <div className="text-center text-gray-400 max-w-md">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(254, 215, 170, 0.3), rgba(199, 210, 254, 0.3))'
            }}
          >
            <Edit2 size={20} className="text-gray-500" />
          </div>
          <p className="text-base font-light mb-2 text-gray-600">Sélectionnez un chapitre</p>
          <p className="text-sm text-gray-500 font-light">Vos transcriptions apparaîtront ici</p>
        </div>
      </div>
    );
  }

  // Grouper les segments par question
  const segmentsByQuestion = chapter.segments.reduce((acc, segment) => {
    const questionId = segment.questionId;
    if (!acc[questionId]) {
      acc[questionId] = [];
    }
    acc[questionId].push(segment);
    return acc;
  }, {});

  // Obtenir les questions répondues dans l'ordre
  const answeredQuestions = chapter.questions.filter(q => segmentsByQuestion[q.id]);

  return (
    <div className="flex-1 h-full bg-white overflow-y-auto border-l border-gray-100">
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header épuré */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
            <h2 className="text-2xl font-light text-gray-900">
              {chapter.title}
            </h2>
            <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 font-light">
              {Object.keys(segmentsByQuestion).length} question{Object.keys(segmentsByQuestion).length > 1 ? 's' : ''} répondue{Object.keys(segmentsByQuestion).length > 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="space-y-8">
            {answeredQuestions.map((question) => {
              const questionSegments = segmentsByQuestion[question.id] || [];
              const isActiveQuestion = activeQuestion === question.id;
              
              return (
                <div
                  key={question.id}
                  className={`bg-white rounded-2xl p-6 border transition-all duration-300 shadow-sm ${
                    isActiveQuestion 
                      ? 'border-orange-200 bg-orange-50/30 shadow-lg' 
                      : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
                  }`}
                >
                  {/* En-tête de la question */}
                  <div className="flex items-start gap-4 mb-6">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                        isActiveQuestion ? 'text-white' : 'text-gray-600'
                      }`}
                      style={{
                        background: isActiveQuestion 
                          ? 'linear-gradient(135deg, #fed7aa, #c7d2fe)'
                          : 'linear-gradient(135deg, #f3f4f6, #e5e7eb)'
                      }}
                    >
                      <Mic size={16} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-light text-gray-900 mb-2">
                        {question.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed font-light">
                        {question.text}
                      </p>
                      {isActiveQuestion && (
                        <div className="mt-3 flex items-center gap-2 text-orange-600 text-sm">
                          <Play size={14} />
                          <span className="font-light">Question active</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full border border-gray-100 font-light">
                      {questionSegments.length} réponse{questionSegments.length > 1 ? 's' : ''}
                    </div>
                  </div>

                  {/* Liste des enregistrements pour cette question */}
                  <div className="space-y-4 ml-12">
                    {questionSegments.map((segment, segmentIndex) => (
                      <div
                        key={segment.id}
                        className="group bg-gray-50/50 rounded-xl p-4 border border-gray-100 hover:bg-white hover:border-gray-200 hover:shadow-md transition-all duration-300"
                      >
                        {editing === segment.id ? (
                          <div className="space-y-4">
                            <textarea
                              value={text}
                              onChange={(e) => setText(e.target.value)}
                              className="w-full p-4 bg-white rounded-lg border border-gray-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-200 resize-none transition-all text-gray-700 leading-relaxed focus:outline-none font-light"
                              rows={3}
                              placeholder="Modifiez votre transcription..."
                            />
                            <div className="flex gap-3">
                              <button 
                                onClick={saveEdit} 
                                className="px-4 py-2 text-white rounded-lg transition-all text-sm font-light shadow-lg"
                                style={{
                                  background: 'linear-gradient(135deg, #fed7aa, #c7d2fe)'
                                }}
                              >
                                Enregistrer
                              </button>
                              <button 
                                onClick={() => setEditing(null)} 
                                className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all text-sm font-light border border-gray-200"
                              >
                                Annuler
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start gap-3 mb-3">
                              <div 
                                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg text-white"
                                style={{
                                  background: 'linear-gradient(135deg, #fed7aa, #c7d2fe)'
                                }}
                              >
                                <span className="text-xs font-light">
                                  {segmentIndex + 1}
                                </span>
                              </div>
                              <p className="text-gray-700 leading-relaxed flex-1 font-light">
                                {segment.text}
                              </p>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-400 font-light">
                                {new Date(segment.timestamp).toLocaleString('fr-FR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <button
                                  onClick={() => startEdit(segment.id, segment.text)}
                                  className="px-3 py-1.5 text-white rounded hover:shadow-lg transition-all text-xs flex items-center gap-1 font-light"
                                  style={{
                                    background: 'linear-gradient(135deg, #fed7aa, #c7d2fe)'
                                  }}
                                >
                                  <Edit2 size={12} />
                                  Modifier
                                </button>
                                <button
                                  onClick={() => onSegmentDelete(segment.id)}
                                  className="px-3 py-1.5 bg-white text-red-600 rounded hover:bg-red-50 hover:shadow-md transition-all text-xs flex items-center gap-1 border border-gray-200 font-light"
                                >
                                  <Trash2 size={12} />
                                  Supprimer
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}

                    {/* Message pour ajouter un nouvel enregistrement */}
                    {isActiveQuestion && (
                      <div className="border-2 border-dashed border-orange-200 bg-orange-50/30 rounded-xl p-4 text-center">
                        <div className="text-orange-600 mb-2">
                          <Plus size={20} className="mx-auto" />
                        </div>
                        <p className="text-sm text-orange-700 font-light">
                          Question active
                        </p>
                        <p className="text-xs text-orange-600 font-light">
                          Cliquez sur enregistrer pour ajouter une nouvelle réponse
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {answeredQuestions.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(254, 215, 170, 0.3), rgba(199, 210, 254, 0.3))'
                  }}
                >
                  <Mic size={20} className="text-gray-500" />
                </div>
                <p className="text-base font-light mb-2 text-gray-600">Aucun enregistrement</p>
                <p className="text-sm font-light text-gray-500">Sélectionnez une question et commencez à enregistrer</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};