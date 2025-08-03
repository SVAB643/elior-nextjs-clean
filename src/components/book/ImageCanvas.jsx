"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { 
  Upload, X, Move, RotateCw, Trash2, Copy, AlignLeft, 
  AlignCenter, AlignRight, ZoomIn, ZoomOut, Image as ImageIcon,
  Layers, Eye, EyeOff, Lock, Unlock, ChevronUp, ChevronDown,
  Palette, Sparkles, Settings, Grid3X3
} from "lucide-react";

export const ImageCanvas = ({ 
  onImagesUpdate = () => {},
  images = [],
  selectedImageId = null,
  onImageSelect = () => {},
  onClose = () => {}
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedImageId, setDraggedImageId] = useState(null);

  // État local des images
  const [localImages, setLocalImages] = useState(images);

  // Synchroniser avec les images du parent
  useEffect(() => {
    setLocalImages(images);
  }, [images]);

  // Synchroniser avec le parent quand les images changent
  useEffect(() => {
    onImagesUpdate(localImages);
  }, [localImages, onImagesUpdate]);

  // Connecter les fonctions globales au state React
  useEffect(() => {
    window.updateImageFloat = (imageId, float) => {
      updateImage(imageId, { float });
    };

    window.removeImageFromState = (imageId) => {
      deleteImage(imageId);
    };

    return () => {
      delete window.updateImageFloat;
      delete window.removeImageFromState;
    };
  }, []);

  // Upload d'images multiples avec preview
  const handleImageUpload = useCallback((event) => {
    const files = Array.from(event.target.files);
    
    files.forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = {
            id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            src: e.target.result,
            alt: file.name.replace(/\.[^/.]+$/, ""), // Nom sans extension
            width: 300,
            height: 200,
            x: 100 + (index * 30), // Décalage intelligent
            y: 150 + (index * 30),
            rotation: 0,
            opacity: 1,
            zIndex: localImages.length + index + 1,
            float: 'none', // none, left, right, center
            visible: true,
            locked: false,
            createdAt: Date.now()
          };
          
          setLocalImages(prev => [...prev, newImage]);
          onImageSelect(newImage.id); // Sélectionner automatiquement la nouvelle image
        };
        reader.readAsDataURL(file);
      }
    });
    
    event.target.value = '';
  }, [localImages.length, onImageSelect]);

  // Mettre à jour une image
  const updateImage = useCallback((imageId, updates) => {
    setLocalImages(prev => 
      prev.map(img => 
        img.id === imageId ? { ...img, ...updates } : img
      )
    );
  }, []);

  // Supprimer une image
  const deleteImage = useCallback((imageId) => {
    setLocalImages(prev => prev.filter(img => img.id !== imageId));
    if (selectedImageId === imageId) {
      onImageSelect(null);
    }
  }, [selectedImageId, onImageSelect]);

  // Dupliquer une image
  const duplicateImage = useCallback((imageId) => {
    const imageToDuplicate = localImages.find(img => img.id === imageId);
    if (imageToDuplicate) {
      const newImage = {
        ...imageToDuplicate,
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        alt: `${imageToDuplicate.alt} (copie)`,
        x: imageToDuplicate.x + 25,
        y: imageToDuplicate.y + 25,
        zIndex: Math.max(...localImages.map(img => img.zIndex)) + 1,
        createdAt: Date.now()
      };
      setLocalImages(prev => [...prev, newImage]);
      onImageSelect(newImage.id);
    }
  }, [localImages, onImageSelect]);

  // Changer l'ordre des images
  const changeImageOrder = useCallback((imageId, direction) => {
    const image = localImages.find(img => img.id === imageId);
    if (!image) return;

    const sortedImages = [...localImages].sort((a, b) => a.zIndex - b.zIndex);
    const currentIndex = sortedImages.findIndex(img => img.id === imageId);
    
    if (direction === 'up' && currentIndex < sortedImages.length - 1) {
      const nextImage = sortedImages[currentIndex + 1];
      updateImage(imageId, { zIndex: nextImage.zIndex });
      updateImage(nextImage.id, { zIndex: image.zIndex });
    } else if (direction === 'down' && currentIndex > 0) {
      const prevImage = sortedImages[currentIndex - 1];
      updateImage(imageId, { zIndex: prevImage.zIndex });
      updateImage(prevImage.id, { zIndex: image.zIndex });
    }
  }, [localImages, updateImage]);

  // Actions en lot
  const toggleAllVisibility = useCallback(() => {
    const allVisible = localImages.every(img => img.visible);
    setLocalImages(prev => 
      prev.map(img => ({ ...img, visible: !allVisible }))
    );
  }, [localImages]);

  const deleteAllImages = useCallback(() => {
    if (localImages.length > 0 && confirm(`Supprimer toutes les ${localImages.length} images ?`)) {
      setLocalImages([]);
      onImageSelect(null);
    }
  }, [localImages.length, onImageSelect]);

  // Obtenir l'image sélectionnée
  const selectedImage = localImages.find(img => img.id === selectedImageId);

  // Statistiques
  const stats = {
    total: localImages.length,
    visible: localImages.filter(img => img.visible).length,
    locked: localImages.filter(img => img.locked).length,
    floating: localImages.filter(img => img.float !== 'none').length
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-orange-50 to-pink-50">
      {/* Header avec dégradé coucher de soleil */}
      <div className="p-4 border-b border-orange-200 bg-gradient-to-r from-orange-100 to-pink-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center shadow-lg">
              <ImageIcon size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-light text-gray-800">
                Gestionnaire d'Images
              </h3>
              <p className="text-xs text-gray-600">
                Ultra-fluide • Style Canva
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-orange-200 rounded-xl transition-all duration-300 text-gray-600 hover:text-gray-800"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Statistiques */}
        {localImages.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { label: 'Total', value: stats.total, color: 'bg-blue-100 text-blue-700' },
              { label: 'Visibles', value: stats.visible, color: 'bg-green-100 text-green-700' },
              { label: 'Flottantes', value: stats.floating, color: 'bg-purple-100 text-purple-700' },
              { label: 'Verrouillées', value: stats.locked, color: 'bg-red-100 text-red-700' }
            ].map(stat => (
              <div key={stat.label} className={`${stat.color} px-2 py-1 rounded-lg text-center`}>
                <div className="text-lg font-semibold">{stat.value}</div>
                <div className="text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
        
        {/* Actions rapides */}
        {localImages.length > 0 && (
          <div className="flex gap-2 mb-4">
            <button
              onClick={toggleAllVisibility}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-lg transition-all duration-300 text-sm font-medium text-gray-700"
            >
              {localImages.every(img => img.visible) ? <EyeOff size={14} /> : <Eye size={14} />}
              {localImages.every(img => img.visible) ? 'Masquer tout' : 'Afficher tout'}
            </button>
            <button
              onClick={deleteAllImages}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-100 hover:bg-red-200 rounded-lg transition-all duration-300 text-sm font-medium text-red-700"
            >
              <Trash2 size={14} />
              Tout supprimer
            </button>
          </div>
        )}
        
        {/* Bouton upload principal */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-3 p-4 border-2 border-dashed border-orange-300 rounded-xl hover:border-orange-400 hover:bg-white hover:bg-opacity-50 transition-all duration-300 text-orange-600 font-medium"
          style={{
            background: localImages.length === 0 ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))' : ''
          }}
        >
          <Upload size={20} />
          {localImages.length === 0 ? 'Ajouter vos premières images' : 'Ajouter d\'autres images'}
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Liste des images avec design amélioré */}
      <div className="flex-1 overflow-y-auto p-4">
        {localImages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
              <ImageIcon size={40} className="text-orange-400" />
            </div>
            <h4 className="text-lg font-light text-gray-700 mb-2">Aucune image pour le moment</h4>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Ajoutez des images pour commencer à créer<br />
              votre livre avec une mise en page professionnelle
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Sparkles size={12} />
                Drag & Drop
              </div>
              <div className="flex items-center gap-1">
                <Grid3X3 size={12} />
                Text wrapping
              </div>
              <div className="flex items-center gap-1">
                <Palette size={12} />
                Style libre
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {localImages
              .sort((a, b) => b.zIndex - a.zIndex)
              .map((image) => (
              <div
                key={image.id}
                className={`border-2 rounded-xl p-4 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
                  selectedImageId === image.id
                    ? 'border-orange-400 bg-gradient-to-br from-orange-50 to-pink-50 shadow-lg scale-[1.02]'
                    : 'border-gray-200 hover:border-orange-300 hover:shadow-md bg-white'
                }`}
                onClick={() => onImageSelect(image.id)}
              >
                {/* Header de l'image */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative group">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-16 h-16 object-cover rounded-xl shadow-md transition-all duration-300 group-hover:shadow-lg"
                      style={{ 
                        opacity: image.visible ? image.opacity : 0.3,
                        transform: `rotate(${image.rotation}deg)`
                      }}
                    />
                    {image.locked && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <Lock size={10} className="text-white" />
                      </div>
                    )}
                    {selectedImageId === image.id && (
                      <div className="absolute inset-0 border-2 border-orange-400 rounded-xl animate-pulse"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate mb-1">
                      {image.alt}
                    </p>
                    <p className="text-xs text-gray-500 mb-1">
                      {image.width} × {image.height}px
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        image.float === 'none' ? 'bg-blue-100 text-blue-700' :
                        image.float === 'left' ? 'bg-green-100 text-green-700' :
                        image.float === 'right' ? 'bg-purple-100 text-purple-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {image.float === 'none' ? '🎯 Libre' :
                         image.float === 'left' ? '⬅ Gauche' :
                         image.float === 'right' ? '➡ Droite' : '⬛ Centre'}
                      </span>
                      <span className="text-xs text-gray-400">
                        z:{image.zIndex}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateImage(image.id, { visible: !image.visible });
                      }}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        image.visible 
                          ? 'hover:bg-orange-100 text-gray-600 hover:text-orange-600' 
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                      title={image.visible ? "Masquer" : "Afficher"}
                    >
                      {image.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Supprimer cette image ?')) {
                          deleteImage(image.id);
                        }
                      }}
                      className="p-2 hover:bg-red-100 text-gray-400 hover:text-red-600 rounded-lg transition-all duration-300"
                      title="Supprimer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                {/* Contrôles étendus pour l'image sélectionnée */}
                {selectedImageId === image.id && (
                  <div className="border-t border-orange-200 pt-4 space-y-4 animate-in slide-in-from-top duration-300">
                    
                    {/* Positionnement rapide */}
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-3 flex items-center gap-2">
                        <Move size={12} />
                        Positionnement
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: 'left', icon: AlignLeft, label: 'Flotter à gauche', desc: 'Texte à droite' },
                          { value: 'right', icon: AlignRight, label: 'Flotter à droite', desc: 'Texte à gauche' },
                          { value: 'center', icon: AlignCenter, label: 'Centré', desc: 'Texte autour' },
                          { value: 'none', icon: Settings, label: 'Position libre', desc: 'Par-dessus le texte' }
                        ].map(({ value, icon: Icon, label, desc }) => (
                          <button
                            key={value}
                            onClick={() => updateImage(image.id, { float: value })}
                            className={`p-3 rounded-xl border-2 transition-all duration-300 text-left ${
                              image.float === value
                                ? 'border-orange-400 bg-gradient-to-br from-orange-100 to-pink-100 text-orange-700 shadow-md'
                                : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                            }`}
                            title={label}
                          >
                            <Icon size={16} className="mb-1" />
                            <div className="text-xs font-medium">{label.split(' ')[0]}</div>
                            <div className="text-xs opacity-75">{desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Dimensions avec ratio */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-700 block mb-2">
                          Largeur
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={image.width}
                            onChange={(e) => {
                              const newWidth = parseInt(e.target.value) || 50;
                              const aspectRatio = image.width / image.height;
                              updateImage(image.id, { 
                                width: newWidth,
                                height: Math.round(newWidth / aspectRatio)
                              });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                            min="50"
                            max="800"
                          />
                          <span className="absolute right-3 top-2 text-xs text-gray-400">px</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-700 block mb-2">
                          Hauteur
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={image.height}
                            onChange={(e) => {
                              const newHeight = parseInt(e.target.value) || 50;
                              const aspectRatio = image.width / image.height;
                              updateImage(image.id, { 
                                height: newHeight,
                                width: Math.round(newHeight * aspectRatio)
                              });
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                            min="50"
                            max="800"
                          />
                          <span className="absolute right-3 top-2 text-xs text-gray-400">px</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Position XY (pour images en position libre) */}
                    {image.float === 'none' && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-700 block mb-2">
                            Position X
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={image.x}
                              onChange={(e) => updateImage(image.id, { x: parseInt(e.target.value) || 0 })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                            />
                            <span className="absolute right-3 top-2 text-xs text-gray-400">px</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-700 block mb-2">
                            Position Y
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={image.y}
                              onChange={(e) => updateImage(image.id, { y: parseInt(e.target.value) || 0 })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                            />
                            <span className="absolute right-3 top-2 text-xs text-gray-400">px</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Effets visuels */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-700 block mb-2 flex items-center gap-1">
                          <RotateCw size={12} />
                          Rotation ({image.rotation}°)
                        </label>
                        <input
                          type="range"
                          min="-180"
                          max="180"
                          value={image.rotation}
                          onChange={(e) => updateImage(image.id, { rotation: parseInt(e.target.value) })}
                          className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #fed7aa 0%, #fed7aa ${(image.rotation + 180) / 3.6}%, #e5e7eb ${(image.rotation + 180) / 3.6}%, #e5e7eb 100%)`
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-700 block mb-2 flex items-center gap-1">
                          <Palette size={12} />
                          Opacité ({Math.round(image.opacity * 100)}%)
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={image.opacity}
                          onChange={(e) => updateImage(image.id, { opacity: parseFloat(e.target.value) })}
                          className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #fed7aa 0%, #fed7aa ${image.opacity * 100}%, #e5e7eb ${image.opacity * 100}%, #e5e7eb 100%)`
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Actions avancées */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => duplicateImage(image.id)}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-lg hover:from-blue-200 hover:to-blue-300 transition-all duration-300 text-sm font-medium"
                      >
                        <Copy size={14} />
                        Dupliquer
                      </button>
                      <button
                        onClick={() => updateImage(image.id, { locked: !image.locked })}
                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
                          image.locked 
                            ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-700 hover:from-red-200 hover:to-red-300'
                            : 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 hover:from-green-200 hover:to-green-300'
                        }`}
                      >
                        {image.locked ? <Unlock size={14} /> : <Lock size={14} />}
                        {image.locked ? 'Déverr.' : 'Verr.'}
                      </button>
                    </div>
                    
                    {/* Gestion des calques */}
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-2 flex items-center gap-1">
                        <Layers size={12} />
                        Ordre des calques (z: {image.zIndex})
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => changeImageOrder(image.id, 'up')}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 hover:bg-orange-100 rounded-lg transition-all duration-300 text-sm font-medium text-gray-700 hover:text-orange-700"
                        >
                          <ChevronUp size={14} />
                          Premier plan
                        </button>
                        <button
                          onClick={() => changeImageOrder(image.id, 'down')}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 hover:bg-orange-100 rounded-lg transition-all duration-300 text-sm font-medium text-gray-700 hover:text-orange-700"
                        >
                          <ChevronDown size={14} />
                          Arrière-plan
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer avec informations détaillées */}
      <div className="p-4 border-t border-orange-200 bg-gradient-to-r from-orange-100 to-pink-100">
        <div className="text-xs text-gray-600 text-center space-y-1">
          {localImages.length > 0 ? (
            <>
              <div className="font-medium text-orange-700">
                {stats.total} image(s) • {stats.visible} visible(s) • {stats.floating} flottante(s)
              </div>
              {selectedImage && (
                <div className="text-gray-500">
                  ✨ "{selectedImage.alt}" sélectionnée • Cliquez dans la page pour la déplacer
                </div>
              )}
              <div className="text-gray-400 pt-1">
                💡 Les images apparaissent en temps réel dans votre page de texte
              </div>
            </>
          ) : (
            <div className="text-gray-500">
              Commencez par ajouter quelques images pour voir la magie opérer ✨
            </div>
          )}
        </div>
      </div>
    </div>
  );
};