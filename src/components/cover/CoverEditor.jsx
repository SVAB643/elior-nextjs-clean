"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  ImageIcon, Save, Type, Palette, Move, Trash2,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Layers,
  X, Plus, Eye, EyeOff, Copy, Undo, Redo, Grid, ZoomIn, ZoomOut,
  RotateCw, Minus, SquarePlus, ChevronDown, Settings, Sparkles
} from "lucide-react";

// Templates sophistiqués pour la première de couverture
const FRONT_TEMPLATES = [
  {
    id: 'family_memories',
    name: 'Souvenirs de Famille',
    preview: '',
    category: 'Famille',
    elements: [
      {
        id: 1,
        type: 'text',
        content: 'FAMILLE',
        x: 40, y: 40, width: 220, height: 50,
        fontSize: 36, fontFamily: 'Playfair Display, serif', fontWeight: 'bold',
        color: '#2c1810', textAlign: 'center', letterSpacing: '3px'
      },
      {
        id: 2,
        type: 'text',
        content: 'NOS PLUS BEAUX\nSOUVENIRS',
        x: 40, y: 320, width: 220, height: 80,
        fontSize: 22, fontFamily: 'Playfair Display, serif', fontWeight: 'normal',
        color: '#8b4513', textAlign: 'center', lineHeight: 1.3
      },
      {
        id: 3,
        type: 'text',
        content: 'Une histoire de générations\nracontée avec amour',
        x: 40, y: 410, width: 220, height: 30,
        fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: 'normal',
        color: '#6b7280', textAlign: 'center', lineHeight: 1.4
      }
    ],
    backgroundColor: '#faf7f2'
  },
  {
    id: 'love_story',
    name: 'Histoire d\'Amour',
    preview: '',
    category: 'Romance',
    elements: [
      {
        id: 1,
        type: 'text',
        content: 'NOTRE',
        x: 30, y: 60, width: 240, height: 40,
        fontSize: 28, fontFamily: 'Playfair Display, serif', fontWeight: 'normal',
        color: '#ffffff', textAlign: 'left', letterSpacing: '4px'
      },
      {
        id: 2,
        type: 'text',
        content: 'HISTOIRE\nD\'AMOUR',
        x: 30, y: 100, width: 240, height: 80,
        fontSize: 32, fontFamily: 'Playfair Display, serif', fontWeight: 'bold',
        color: '#ffffff', textAlign: 'left', lineHeight: 1.2
      },
      {
        id: 3,
        type: 'text',
        content: 'Marie & Jean Dupont',
        x: 30, y: 380, width: 240, height: 30,
        fontSize: 16, fontFamily: 'Dancing Script, cursive', fontWeight: 'normal',
        color: '#ffffff', textAlign: 'left', fontStyle: 'italic'
      }
    ],
    backgroundColor: '#1f2937'
  },
  {
    id: 'life_journey',
    name: 'Parcours de Vie',
    preview: '',
    category: 'Biographie',
    elements: [
      {
        id: 1,
        type: 'text',
        content: 'MON PARCOURS',
        x: 50, y: 80, width: 200, height: 40,
        fontSize: 24, fontFamily: 'Inter, sans-serif', fontWeight: 'bold',
        color: '#1f2937', textAlign: 'center', letterSpacing: '2px'
      },
      {
        id: 2,
        type: 'text',
        content: 'Souvenirs d\'une vie\nbien remplie',
        x: 50, y: 350, width: 200, height: 50,
        fontSize: 18, fontFamily: 'Inter, sans-serif', fontWeight: 'normal',
        color: '#4b5563', textAlign: 'center', lineHeight: 1.4
      },
      {
        id: 3,
        type: 'text',
        content: 'Récits authentiques • Moments précieux',
        x: 50, y: 410, width: 200, height: 20,
        fontSize: 10, fontFamily: 'Inter, sans-serif', fontWeight: 'normal',
        color: '#9ca3af', textAlign: 'center'
      }
    ],
    backgroundColor: '#ffffff'
  },
  {
    id: 'vintage_classic',
    name: 'Classique Vintage',
    preview: '',
    category: 'Vintage',
    elements: [
      {
        id: 1,
        type: 'text',
        content: 'MÉMOIRES',
        x: 50, y: 120, width: 200, height: 50,
        fontSize: 30, fontFamily: 'Playfair Display, serif', fontWeight: 'bold',
        color: '#8b4513', textAlign: 'center', letterSpacing: '5px'
      },
      {
        id: 2,
        type: 'text',
        content: '• • •',
        x: 50, y: 180, width: 200, height: 20,
        fontSize: 20, fontFamily: 'serif', fontWeight: 'normal',
        color: '#d4af37', textAlign: 'center'
      },
      {
        id: 3,
        type: 'text',
        content: 'Récits d\'une époque\nremarkable',
        x: 50, y: 220, width: 200, height: 60,
        fontSize: 16, fontFamily: 'Playfair Display, serif', fontWeight: 'normal',
        color: '#8b4513', textAlign: 'center', lineHeight: 1.5, fontStyle: 'italic'
      },
      {
        id: 4,
        type: 'text',
        content: 'Prénom Nom',
        x: 50, y: 380, width: 200, height: 30,
        fontSize: 14, fontFamily: 'Playfair Display, serif', fontWeight: 'normal',
        color: '#8b4513', textAlign: 'center'
      }
    ],
    backgroundColor: '#fdf6e3'
  }
];

// Templates pour la quatrième de couverture
const BACK_TEMPLATES = [
  {
    id: 'back_summary',
    name: 'Résumé Simple',
    preview: '📝',
    elements: [
      {
        id: 1,
        type: 'text',
        content: 'À PROPOS DE CE LIVRE',
        x: 30, y: 40, width: 240, height: 25,
        fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: 'bold',
        color: '#374151', textAlign: 'left', letterSpacing: '1px'
      },
      {
        id: 2,
        type: 'text',
        content: 'Ce livre rassemble les souvenirs les plus précieux de notre famille, racontés avec authenticité et émotion. À travers ces pages, découvrez l\'histoire de générations qui ont façonné notre héritage.\n\nChaque chapitre révèle des anecdotes touchantes, des moments de joie et les valeurs qui nous unissent encore aujourd\'hui.',
        x: 30, y: 80, width: 240, height: 180,
        fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: 'normal',
        color: '#4b5563', textAlign: 'justify', lineHeight: 1.6
      },
      {
        id: 3,
        type: 'text',
        content: '"Un témoignage bouleversant sur l\'importance de préserver nos racines."',
        x: 30, y: 280, width: 240, height: 40,
        fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: 'normal',
        color: '#6b7280', textAlign: 'center', fontStyle: 'italic', lineHeight: 1.4
      },
      {
        id: 4,
        type: 'text',
        content: 'Éditions Familiales • 2024',
        x: 30, y: 400, width: 240, height: 20,
        fontSize: 10, fontFamily: 'Inter, sans-serif', fontWeight: 'normal',
        color: '#9ca3af', textAlign: 'center'
      }
    ],
    backgroundColor: '#ffffff'
  },
  {
    id: 'back_biography',
    name: 'Biographie',
    preview: '👤',
    elements: [
      {
        id: 1,
        type: 'text',
        content: 'À PROPOS DE L\'AUTEUR',
        x: 30, y: 40, width: 240, height: 25,
        fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: 'bold',
        color: '#374151', textAlign: 'left', letterSpacing: '1px'
      },
      {
        id: 2,
        type: 'text',
        content: 'Née en 1945 à Lyon, Marie Dubois a consacré sa vie à sa famille et à la préservation de son histoire. Institutrice pendant 40 ans, elle a toujours eu le goût des mots et de la transmission.\n\nAujourd\'hui grand-mère de six petits-enfants, elle partage dans ce livre les récits qui ont bercé son enfance et façonné sa personnalité.',
        x: 30, y: 80, width: 240, height: 140,
        fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: 'normal',
        color: '#4b5563', textAlign: 'justify', lineHeight: 1.6
      },
      {
        id: 3,
        type: 'text',
        content: 'CONTENU DU LIVRE',
        x: 30, y: 240, width: 240, height: 25,
        fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: 'bold',
        color: '#374151', textAlign: 'left', letterSpacing: '1px'
      },
      {
        id: 4,
        type: 'text',
        content: '• Les origines de la famille\n• Souvenirs d\'enfance\n• La guerre et l\'occupation\n• Rencontres et mariages\n• Traditions familiales',
        x: 30, y: 275, width: 240, height: 80,
        fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: 'normal',
        color: '#4b5563', textAlign: 'left', lineHeight: 1.8
      },
      {
        id: 5,
        type: 'text',
        content: 'Collection Mémoires • Édition privée',
        x: 30, y: 400, width: 240, height: 20,
        fontSize: 10, fontFamily: 'Inter, sans-serif', fontWeight: 'normal',
        color: '#9ca3af', textAlign: 'center'
      }
    ],
    backgroundColor: '#fafafa'
  }
];

// Composant de sélection de couleur moderne
const ColorPicker = ({ color, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const colors = [
    '#1f2937', '#ffffff', '#f97316', '#ea580c', '#dc2626',
    '#16a34a', '#2563eb', '#7c3aed', '#db2777', '#6b7280',
    '#8b4513', '#d4af37', '#2c1810', '#faf7f2', '#fdf6e3'
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all shadow-sm hover:shadow-md"
        style={{ backgroundColor: color }}
      />
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 z-50 min-w-64">
            <div className="grid grid-cols-5 gap-3 mb-4">
              {colors.map(preset => (
                <button
                  key={preset}
                  onClick={() => {
                    onChange(preset);
                    setIsOpen(false);
                  }}
                  className="w-10 h-10 rounded-xl border border-gray-200 hover:scale-110 transition-transform shadow-sm"
                  style={{ backgroundColor: preset }}
                />
              ))}
            </div>
            <input
              type="color"
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-12 rounded-xl border border-gray-200 cursor-pointer"
            />
          </div>
        </>
      )}
    </div>
  );
};

// Composant de carte moderne
const Card = ({ children, className = "", onClick, isSelected = false }) => (
  <div
    className={`bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg ${
      isSelected ? 'ring-2 ring-orange-500 border-orange-300' : ''
    } ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

// Composant de bouton moderne
const Button = ({ children, variant = 'primary', size = 'md', className = "", onClick, disabled = false }) => {
  const baseClasses = "font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-white border border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-sm",
    lg: "px-6 py-4 text-base"
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const CoverEditor = ({ coverData, onSave }) => {
  // États principaux
  const [currentView, setCurrentView] = useState('front');
  const [selectedId, setSelectedId] = useState(null);
  const [isTextEditing, setIsTextEditing] = useState(false);
  const [dragState, setDragState] = useState({ isDragging: false, type: null });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [activePanel, setActivePanel] = useState('templates');

  // États des données
  const [frontData, setFrontData] = useState({
    elements: coverData?.frontElements || [],
    background: coverData?.frontBackground || null,
    backgroundColor: coverData?.frontBackgroundColor || '#faf7f2'
  });

  const [backData, setBackData] = useState({
    elements: coverData?.backElements || [],
    background: coverData?.backBackground || null,
    backgroundColor: coverData?.backBackgroundColor || '#ffffff'
  });

  // Références
  const canvasRef = useRef(null);
  const imageInputRef = useRef(null);
  const backgroundInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Polices disponibles
  const fontOptions = [
    { label: "Playfair Display", value: "Playfair Display, serif" },
    { label: "Inter", value: "Inter, sans-serif" },
    { label: "Dancing Script", value: "Dancing Script, cursive" },
    { label: "JetBrains Mono", value: "JetBrains Mono, monospace" }
  ];

  // Utilitaires
  const getCurrentData = () => currentView === 'front' ? frontData : backData;
  const setCurrentData = (newData) => {
    if (currentView === 'front') {
      setFrontData(prev => ({ ...prev, ...newData }));
    } else {
      setBackData(prev => ({ ...prev, ...newData }));
    }
  };

  const getSelectedElement = () => {
    const currentData = getCurrentData();
    return currentData.elements.find(el => el.id === selectedId) || null;
  };

  const generateId = () => Date.now() + Math.random();

  // Appliquer un template
  const applyTemplate = (template) => {
    setCurrentData({
      elements: template.elements.map(el => ({ ...el, id: generateId() })),
      backgroundColor: template.backgroundColor || '#ffffff'
    });
  };

  // Ajouter des éléments
  const addTextElement = () => {
    const newElement = {
      id: generateId(),
      type: 'text',
      content: 'Nouveau texte',
      x: 50, y: 100, width: 200, height: 60,
      zIndex: getCurrentData().elements.length + 1,
      fontSize: 24,
      fontFamily: 'Playfair Display, serif',
      fontWeight: 'normal',
      fontStyle: 'normal',
      color: '#1f2937',
      textAlign: 'center',
      lineHeight: 1.2
    };
    setCurrentData({
      elements: [...getCurrentData().elements, newElement]
    });
    setSelectedId(newElement.id);
    setTimeout(() => setIsTextEditing(newElement.id), 100);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const newElement = {
        id: generateId(),
        type: 'image',
        src: e.target.result,
        x: 50, y: 150, width: 200, height: 200,
        zIndex: getCurrentData().elements.length + 1,
        opacity: 1,
        borderRadius: 0
      };
      setCurrentData({
        elements: [...getCurrentData().elements, newElement]
      });
      setSelectedId(newElement.id);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleBackgroundUpload = (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setCurrentData({ background: e.target.result });
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  // Mise à jour des éléments
  const updateElement = (id, updates) => {
    const currentData = getCurrentData();
    const newElements = currentData.elements.map(el =>
      el.id === id ? { ...el, ...updates } : el
    );
    setCurrentData({ elements: newElements });
  };

  const deleteElement = (id) => {
    const currentData = getCurrentData();
    setCurrentData({
      elements: currentData.elements.filter(el => el.id !== id)
    });
    if (selectedId === id) {
      setSelectedId(null);
      setIsTextEditing(false);
    }
  };

  const duplicateElement = (id) => {
    const element = getSelectedElement();
    if (!element) return;
    
    const newElement = {
      ...element,
      id: generateId(),
      x: element.x + 20,
      y: element.y + 20,
      zIndex: getCurrentData().elements.length + 1
    };
    setCurrentData({
      elements: [...getCurrentData().elements, newElement]
    });
    setSelectedId(newElement.id);
  };

  // Gestion du drag & drop
  const handleMouseDown = useCallback((e, elementId, actionType = 'move') => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedId(elementId);
    setDragState({ isDragging: true, type: actionType });
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const element = getCurrentData().elements.find(el => el.id === elementId);
    if (actionType === 'move') {
      setDragStart({
        x: (e.clientX - rect.left) / zoom - element.x,
        y: (e.clientY - rect.top) / zoom - element.y
      });
    } else if (actionType === 'resize') {
      setDragStart({
        x: e.clientX,
        y: e.clientY,
        width: element.width,
        height: element.height
      });
    }
  }, [getCurrentData, zoom]);

  const handleMouseMove = useCallback((e) => {
    if (!dragState.isDragging || !selectedId) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    if (dragState.type === 'move') {
      const newX = (e.clientX - rect.left) / zoom - dragStart.x;
      const newY = (e.clientY - rect.top) / zoom - dragStart.y;
      updateElement(selectedId, {
        x: Math.max(-20, Math.min(320, newX)),
        y: Math.max(-20, Math.min(470, newY))
      });
    } else if (dragState.type === 'resize') {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      updateElement(selectedId, {
        width: Math.max(30, dragStart.width + deltaX),
        height: Math.max(20, dragStart.height + deltaY)
      });
    }
  }, [dragState, selectedId, dragStart, zoom]);

  const handleMouseUp = useCallback(() => {
    setDragState({ isDragging: false, type: null });
  }, []);

  // Édition de texte
  const startTextEdit = (elementId) => {
    setIsTextEditing(elementId);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.select();
      }
    }, 50);
  };

  // Sauvegarde
  const handleSave = () => {
    const saveData = {
      frontElements: frontData.elements,
      backElements: backData.elements,
      frontBackground: frontData.background,
      backBackground: backData.background,
      frontBackgroundColor: frontData.backgroundColor,
      backBackgroundColor: backData.backgroundColor,
      timestamp: Date.now()
    };
    onSave?.(saveData);
  };

  const selectedElement = getSelectedElement();
  const currentData = getCurrentData();
  const currentTemplates = currentView === 'front' ? FRONT_TEMPLATES : BACK_TEMPLATES;

  return (
    <div 
      className="flex-1 flex bg-gradient-to-br from-gray-50 via-white to-orange-50/30 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Interface principale */}
      <div className="flex-1 flex">
        {/* Panel gauche - Outils */}
        <div className="w-96 bg-white/90 backdrop-blur-sm border-r border-gray-200/50 flex flex-col">
          {/* Header compact */}
          <div className="p-4 border-b border-gray-200/50">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-lg font-bold text-gray-900">Éditeur de couverture</h1>
                <p className="text-xs text-gray-600">Créez la couverture parfaite</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowGrid(!showGrid)}>
                  <Grid size={14} />
                </Button>
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                    className="p-1 hover:bg-white rounded text-gray-600"
                  >
                    <ZoomOut size={12} />
                  </button>
                  <span className="px-2 text-xs text-gray-700 min-w-10 text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                    className="p-1 hover:bg-white rounded text-gray-600"
                  >
                    <ZoomIn size={12} />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Navigation Recto/Verso compacte */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setCurrentView('front')}
                className={`py-2 px-3 rounded-md text-xs font-medium transition-all ${
                  currentView === 'front'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Première de couv.
              </button>
              <button
                onClick={() => setCurrentView('back')}
                className={`py-2 px-3 rounded-md text-xs font-medium transition-all ${
                  currentView === 'back'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Quatrième de couv.
              </button>
            </div>
          </div>

          {/* Contenu des outils */}
          <div className="flex-1 overflow-hidden">
            {/* Onglets des outils */}
            <div className="flex border-b border-gray-200/50">
              {[
                { id: 'templates', label: 'Templates', icon: Sparkles },
                { id: 'elements', label: 'Éléments', icon: Plus },
                { id: 'design', label: 'Design', icon: Palette }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActivePanel(tab.id)}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-all border-b-2 ${
                    activePanel === tab.id
                      ? 'border-orange-500 text-orange-600 bg-orange-50/50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50/50'
                  }`}
                >
                  <tab.icon size={16} className="mx-auto mb-1" />
                  <div>{tab.label}</div>
                </button>
              ))}
            </div>

            {/* Contenu des onglets */}
            <div className="p-6 overflow-y-auto h-full">
              {activePanel === 'templates' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Templates {currentView === 'front' ? 'de couverture' : 'de résumé'}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {currentTemplates.map(template => (
                        <Card
                          key={template.id}
                          className="p-4 cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => applyTemplate(template)}
                        >
                          <div className="text-center">
                            <div className="text-3xl mb-2">{template.preview}</div>
                            <div className="text-sm font-medium text-gray-900 mb-1">
                              {template.name}
                            </div>
                            {template.category && (
                              <div className="text-xs text-gray-500">{template.category}</div>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activePanel === 'elements' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Ajouter des éléments</h3>
                    <div className="space-y-3">
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-full"
                        onClick={addTextElement}
                      >
                        <Type size={18} />
                        Ajouter du texte
                      </Button>
                      <Button
                        variant="secondary"
                        size="lg"
                        className="w-full"
                        onClick={() => imageInputRef.current?.click()}
                      >
                        <ImageIcon size={18} />
                        Ajouter une image
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activePanel === 'design' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Arrière-plan</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 w-16">Couleur</span>
                        <ColorPicker
                          color={currentData.backgroundColor}
                          onChange={(color) => setCurrentData({ backgroundColor: color })}
                        />
                        <input
                          type="text"
                          value={currentData.backgroundColor}
                          onChange={(e) => setCurrentData({ backgroundColor: e.target.value })}
                          className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg"
                        />
                      </div>
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => backgroundInputRef.current?.click()}
                      >
                        <Palette size={16} />
                        Image de fond
                      </Button>
                      {currentData.background && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-red-600 hover:text-red-700"
                          onClick={() => setCurrentData({ background: null })}
                        >
                          <X size={16} />
                          Supprimer l'image
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Propriétés de l'élément sélectionné */}
                  {selectedElement && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">
                          {selectedElement.type === 'text' ? 'Propriétés du texte' : 'Propriétés de l\'image'}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteElement(selectedElement.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>

                      {selectedElement.type === 'text' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Police</label>
                            <select
                              value={selectedElement.fontFamily}
                              onChange={(e) => updateElement(selectedElement.id, { fontFamily: e.target.value })}
                              className="w-full p-3 border border-gray-200 rounded-xl bg-white"
                            >
                              {fontOptions.map(font => (
                                <option key={font.value} value={font.value}>
                                  {font.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Taille: {selectedElement.fontSize}px
                              </label>
                              <input
                                type="range"
                                min="12"
                                max="72"
                                value={selectedElement.fontSize}
                                onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) })}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Couleur</label>
                              <ColorPicker
                                color={selectedElement.color}
                                onChange={(color) => updateElement(selectedElement.id, { color })}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant={selectedElement.fontWeight === 'bold' ? 'primary' : 'secondary'}
                              size="sm"
                              onClick={() => updateElement(selectedElement.id, {
                                fontWeight: selectedElement.fontWeight === 'bold' ? 'normal' : 'bold'
                              })}
                            >
                              <Bold size={16} />
                            </Button>
                            <Button
                              variant={selectedElement.fontStyle === 'italic' ? 'primary' : 'secondary'}
                              size="sm"
                              onClick={() => updateElement(selectedElement.id, {
                                fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic'
                              })}
                            >
                              <Italic size={16} />
                            </Button>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            {['left', 'center', 'right'].map(align => (
                              <Button
                                key={align}
                                variant={selectedElement.textAlign === align ? 'primary' : 'secondary'}
                                size="sm"
                                onClick={() => updateElement(selectedElement.id, { textAlign: align })}
                              >
                                {align === 'left' && <AlignLeft size={16} />}
                                {align === 'center' && <AlignCenter size={16} />}
                                {align === 'right' && <AlignRight size={16} />}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedElement.type === 'image' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Opacité: {Math.round((selectedElement.opacity || 1) * 100)}%
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={selectedElement.opacity || 1}
                              onChange={(e) => updateElement(selectedElement.id, { opacity: parseFloat(e.target.value) })}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Bordures: {selectedElement.borderRadius || 0}px
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="50"
                              value={selectedElement.borderRadius || 0}
                              onChange={(e) => updateElement(selectedElement.id, { borderRadius: parseInt(e.target.value) })}
                              className="w-full"
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 pt-4 border-t border-gray-200">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1"
                          onClick={() => duplicateElement(selectedElement.id)}
                        >
                          <Copy size={16} />
                          Dupliquer
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1"
                          onClick={() => deleteElement(selectedElement.id)}
                        >
                          <Trash2 size={16} />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer avec sauvegarde */}
          <div className="p-6 border-t border-gray-200/50">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleSave}
            >
              <Save size={18} />
              Sauvegarder la couverture
            </Button>
          </div>
        </div>

        {/* Zone centrale - Canvas */}
        <div className="flex-1 flex flex-col">
          {/* Header canvas */}
          <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 p-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                {currentView === 'front' ? 'Première de couverture' : 'Quatrième de couverture'}
              </h2>
              <p className="text-sm text-gray-600">
                {currentView === 'front' 
                  ? 'Titre, auteur et visuels principaux' 
                  : 'Résumé, biographie et informations éditoriales'
                }
              </p>
            </div>
          </div>

          {/* Zone de canvas */}
          <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 via-white to-orange-50/30 relative overflow-hidden">
            <div className="relative">
              <div
                ref={canvasRef}
                className="relative bg-white shadow-2xl border border-gray-300/50 mx-auto select-none"
                style={{
                  width: `${300 * zoom}px`,
                  height: `${450 * zoom}px`,
                  backgroundColor: currentData.backgroundColor,
                  backgroundImage: currentData.background ? `url(${currentData.background})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: '16px',
                  overflow: 'hidden'
                }}
                onClick={() => {
                  setSelectedId(null);
                  setIsTextEditing(false);
                }}
              >
                {/* Grille */}
                {showGrid && (
                  <div className="absolute inset-0 pointer-events-none">
                    <svg width="100%" height="100%" className="opacity-20">
                      <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f97316" strokeWidth="0.5"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>
                )}

                {/* Éléments */}
                {currentData.elements
                  .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                  .map((element) => (
                    <div
                      key={element.id}
                      className={`absolute transition-all duration-200 group ${
                        selectedId === element.id
                          ? 'ring-2 ring-orange-400 ring-opacity-60'
                          : 'hover:ring-2 hover:ring-orange-200 hover:ring-opacity-40'
                      } ${dragState.isDragging && selectedId === element.id ? 'cursor-grabbing' : 'cursor-grab'}`}
                      style={{
                        left: element.x,
                        top: element.y,
                        width: element.width,
                        height: element.height,
                        zIndex: element.zIndex || 0,
                        opacity: element.opacity || 1,
                        borderRadius: element.type === 'image' ? `${element.borderRadius || 0}px` : '0px'
                      }}
                      onMouseDown={(e) => handleMouseDown(e, element.id, 'move')}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(element.id);
                      }}
                      onDoubleClick={() => {
                        if (element.type === 'text') {
                          startTextEdit(element.id);
                        }
                      }}
                    >
                      {element.type === 'text' ? (
                        isTextEditing === element.id ? (
                          <textarea
                            ref={textareaRef}
                            value={element.content}
                            onChange={(e) => updateElement(element.id, { content: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Escape') {
                                setIsTextEditing(false);
                                setSelectedId(null);
                              }
                              if (e.key === 'Enter' && e.ctrlKey) {
                                setIsTextEditing(false);
                              }
                            }}
                            onBlur={() => setIsTextEditing(false)}
                            className="w-full h-full p-2 border-2 border-orange-400 outline-none resize-none bg-white rounded-lg"
                            style={{
                              fontSize: `${element.fontSize}px`,
                              fontFamily: element.fontFamily,
                              fontWeight: element.fontWeight,
                              fontStyle: element.fontStyle,
                              color: element.color,
                              textAlign: element.textAlign,
                              lineHeight: element.lineHeight || 1.2,
                              letterSpacing: element.letterSpacing || 0
                            }}
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center p-2 break-words whitespace-pre-wrap"
                            style={{
                              fontSize: `${element.fontSize}px`,
                              fontFamily: element.fontFamily,
                              fontWeight: element.fontWeight,
                              fontStyle: element.fontStyle,
                              color: element.color,
                              textAlign: element.textAlign,
                              lineHeight: element.lineHeight || 1.2,
                              letterSpacing: element.letterSpacing || 0
                            }}
                          >
                            {element.content || 'Texte vide'}
                          </div>
                        )
                      ) : (
                        <img
                          src={element.src}
                          alt="Élément"
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                      )}

                      {/* Contrôles de l'élément sélectionné */}
                      {selectedId === element.id && !isTextEditing && (
                        <>
                          {/* Points de contrôle */}
                          <div className="absolute -inset-1 pointer-events-none">
                            <div className="absolute -top-1 -left-1 w-3 h-3 bg-orange-500 border-2 border-white rounded-full shadow-sm"></div>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 border-2 border-white rounded-full shadow-sm"></div>
                            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-orange-500 border-2 border-white rounded-full shadow-sm"></div>
                            <div 
                              className="absolute -bottom-1 -right-1 w-3 h-3 bg-orange-500 border-2 border-white rounded-full shadow-sm cursor-se-resize"
                              onMouseDown={(e) => handleMouseDown(e, element.id, 'resize')}
                            ></div>
                          </div>

                          {/* Bouton de suppression */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteElement(element.id);
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100"
                          >
                            <X size={12} />
                          </button>
                        </>
                      )}
                    </div>
                  ))}

                {/* Message d'accueil */}
                {currentData.elements.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Card className="p-8 max-w-sm mx-4 text-center">
                      <div className="text-6xl mb-4 opacity-50">
                        {currentView === 'front' ? '📚' : '📝'}
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-700">
                        {currentView === 'front' ? 'Créez votre couverture' : 'Créez votre dos de livre'}
                      </h3>
                      <p className="text-gray-500 mb-4 text-sm">
                        {currentView === 'front'
                          ? 'Choisissez un template ou ajoutez vos éléments'
                          : 'Ajoutez le résumé et les informations'
                        }
                      </p>
                      <div className="space-y-2">
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full"
                          onClick={() => setActivePanel('templates')}
                        >
                          <Sparkles size={16} />
                          Voir les templates
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full"
                          onClick={addTextElement}
                        >
                          <Type size={16} />
                          Ajouter du texte
                        </Button>
                      </div>
                    </Card>
                  </div>
                )}

                {/* Lignes de guidage */}
                {selectedId && (
                  <>
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-orange-300 opacity-40 pointer-events-none transform -translate-x-px"></div>
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-orange-300 opacity-40 pointer-events-none transform -translate-y-px"></div>
                  </>
                )}
              </div>

              {/* Aide contextuelle */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200/80 text-sm text-gray-600 whitespace-nowrap">
                  {isTextEditing
                    ? "Ctrl+Entrée pour terminer • Échap pour annuler"
                    : selectedId
                      ? "Double-clic pour éditer • Faites glisser pour déplacer"
                      : "Cliquez pour sélectionner • Double-clic pour éditer"
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inputs cachés */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        ref={backgroundInputRef}
        type="file"
        accept="image/*"
        onChange={handleBackgroundUpload}
        className="hidden"
      />

      {/* Styles CSS */}
      <style jsx>{`
        input[type="range"] {
          -webkit-appearance: none;
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          outline: none;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          background: #ea580c;
        }

        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};