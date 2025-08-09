"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { 
  Upload, X, Move, Trash2, Copy, AlignLeft, AlignCenter, AlignRight,
  Settings, Image as ImageIcon, Crop as CropIcon, Check, RotateCw,
  Layers, ChevronUp, ChevronDown, Eye, EyeOff
} from "lucide-react";

// ImageCanvas — version simplifiée, style Apple, usage type Canva
// Objectifs :
// 1) Ajouter une image (upload + drag&drop)
// 2) Rogner simplement (outil de crop intégré sans dépendance)
// 3) Placer librement OU flotter (gauche/droite/centre) et laisser le texte s'adapter
// 4) UI épurée

export const ImageCanvas = ({ 
  onImagesUpdate = () => {},
  images = [],
  selectedImageId = null,
  onImageSelect = () => {},
  onClose = () => {}
}) => {
  const fileInputRef = useRef(null);
  const dropRef = useRef(null);

  // État local des images synchronisé avec le parent
  const [localImages, setLocalImages] = useState(images);
  useEffect(() => setLocalImages(images), [images]);
  useEffect(() => { onImagesUpdate(localImages); }, [localImages, onImagesUpdate]);

  // Fonctions globales compatibles avec BookEditor
  useEffect(() => {
    window.updateImageFloat = (imageId, float) => updateImage(imageId, { float });
    window.removeImageFromState = (imageId) => deleteImage(imageId);
    return () => { try { delete window.updateImageFloat; delete window.removeImageFromState; } catch {} };
  }, []);

  // Upload / Drag & Drop
  const handleFiles = useCallback((filesLike) => {
    const files = Array.from(filesLike || []);
    files.forEach((file, index) => {
      if (!file.type?.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result;
        setLocalImages((prev) => {
          const maxZ = prev.reduce((m, img) => Math.max(m, img.zIndex || 0), 0);
          const newImage = {
            id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            src,
            alt: file.name.replace(/\.[^/.]+$/, ""),
            width: 320,
            height: 200,
            x: 96 + (index * 24),
            y: 120 + (index * 24),
            rotation: 0,
            opacity: 1,
            zIndex: maxZ + index + 1,
            float: 'none', // none = position libre, left/right/center = wrapping
            visible: true,
            locked: false,
            createdAt: Date.now()
          };
          queueMicrotask(() => onImageSelect(newImage.id));
          return [...prev, newImage];
        });
      };
      reader.readAsDataURL(file);
    });
  }, [onImageSelect]);

  const handleImageUpload = useCallback((e) => { handleFiles(e.target.files); e.target.value=''; }, [handleFiles]);

  useEffect(() => {
    const el = dropRef.current; if (!el) return;
    const over = (e) => { e.preventDefault(); el.classList.add('ring-1','ring-blue-400'); };
    const leave = (e) => { e.preventDefault(); el.classList.remove('ring-1','ring-blue-400'); };
    const drop = (e) => { e.preventDefault(); leave(e); if (e.dataTransfer?.files?.length) handleFiles(e.dataTransfer.files); };
    el.addEventListener('dragover', over); el.addEventListener('dragleave', leave); el.addEventListener('drop', drop);
    return () => { el.removeEventListener('dragover', over); el.removeEventListener('dragleave', leave); el.removeEventListener('drop', drop); };
  }, [handleFiles]);

  // Helpers image
  const updateImage = useCallback((imageId, updates) => {
    setLocalImages(prev => prev.map(img => img.id === imageId ? { ...img, ...updates } : img));
  }, []);

  const deleteImage = useCallback((imageId) => {
    setLocalImages(prev => prev.filter(img => img.id !== imageId));
    if (selectedImageId === imageId) onImageSelect(null);
  }, [selectedImageId, onImageSelect]);

  const duplicateImage = useCallback((imageId) => {
    setLocalImages(prev => {
      const src = prev.find(i => i.id === imageId); if (!src) return prev;
      const maxZ = prev.reduce((m, i) => Math.max(m, i.zIndex||0), 0);
      const copy = { ...src, id:`img-${Date.now()}-${Math.random().toString(36).slice(2,9)}`, x: src.x+20, y: src.y+20, zIndex:maxZ+1, createdAt:Date.now(), alt: src.alt+" (copie)" };
      queueMicrotask(()=> onImageSelect(copy.id));
      return [...prev, copy];
    });
  }, [onImageSelect]);

  // Ordre des calques minimal
  const changeImageOrder = useCallback((imageId, direction) => {
    setLocalImages(prev => {
      const idx = prev.findIndex(i => i.id===imageId); if (idx===-1) return prev;
      const maxZ = prev.reduce((m,i)=>Math.max(m,i.zIndex||0),0);
      const minZ = prev.reduce((m,i)=>Math.min(m,i.zIndex||0),0);
      return prev.map(i => i.id===imageId ? { ...i, zIndex: direction==='front'? maxZ+1 : minZ-1 } : i);
    });
  }, []);

  // Données utiles
  const selectedImage = localImages.find(img => img.id === selectedImageId);

  // -------------------- CROP TOOL --------------------
  const [cropOpen, setCropOpen] = useState(false);
  const [cropImg, setCropImg] = useState(null); // HTMLImageElement chargé
  const [cropRect, setCropRect] = useState({ x: 0, y: 0, w: 100, h: 100 });
  const [viewSize, setViewSize] = useState({ w: 600, h: 360 });
  const [dragMode, setDragMode] = useState(null); // 'move' | 'nw'|'ne'|'sw'|'se'
  const [startPos, setStartPos] = useState({ x:0, y:0, rect:null });

  const openCropper = async (image) => {
    if (!image) return;
    const img = new Image();
    img.onload = () => {
      setCropImg(img);
      // Ajuster le viewport (max 600x360) en conservant le ratio
      const maxW = 600, maxH = 360;
      let vw = img.width, vh = img.height;
      const r = Math.min(maxW/vw, maxH/vh, 1);
      vw = Math.round(vw*r); vh = Math.round(vh*r);
      setViewSize({ w: vw, h: vh });
      // Rect initial au centre (80% de la plus petite dimension)
      const base = Math.round(Math.min(vw, vh)*0.8);
      setCropRect({ x: Math.round((vw-base)/2), y: Math.round((vh-base)/2), w: base, h: base });
      setCropOpen(true);
    };
    img.src = image.src;
  };

  const onCropMouseDown = (e, mode='move') => {
    e.preventDefault();
    setDragMode(mode);
    setStartPos({ x: e.clientX, y: e.clientY, rect: { ...cropRect } });
    window.addEventListener('mousemove', onCropMouseMove);
    window.addEventListener('mouseup', onCropMouseUp);
  };

  const onCropMouseMove = (e) => {
    setCropRect(prev => {
      const dx = e.clientX - startPos.x; const dy = e.clientY - startPos.y;
      let { x, y, w, h } = startPos.rect;
      const minSize = 30;
      if (dragMode === 'move') { x += dx; y += dy; }
      if (dragMode === 'nw') { x += dx; y += dy; w -= dx; h -= dy; }
      if (dragMode === 'ne') { y += dy; w += dx; h -= dy; }
      if (dragMode === 'sw') { x += dx; w -= dx; h += dy; }
      if (dragMode === 'se') { w += dx; h += dy; }
      // Contraintes au viewport
      x = Math.max(0, Math.min(viewSize.w - minSize, x));
      y = Math.max(0, Math.min(viewSize.h - minSize, y));
      w = Math.max(minSize, Math.min(viewSize.w - x, w));
      h = Math.max(minSize, Math.min(viewSize.h - y, h));
      return { x, y, w, h };
    });
  };
  const onCropMouseUp = () => {
    window.removeEventListener('mousemove', onCropMouseMove);
    window.removeEventListener('mouseup', onCropMouseUp);
    setDragMode(null);
  };

  const applyCrop = async () => {
    if (!cropImg) return;
    // Convertir les coords viewport -> coords réelles image
    const scaleX = cropImg.width / viewSize.w;
    const scaleY = cropImg.height / viewSize.h;
    const sx = Math.round(cropRect.x * scaleX);
    const sy = Math.round(cropRect.y * scaleY);
    const sw = Math.round(cropRect.w * scaleX);
    const sh = Math.round(cropRect.h * scaleY);
    const canvas = document.createElement('canvas');
    canvas.width = sw; canvas.height = sh;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(cropImg, sx, sy, sw, sh, 0, 0, sw, sh);
    const dataUrl = canvas.toDataURL('image/png');
    if (selectedImage) {
      updateImage(selectedImage.id, { src: dataUrl, width: Math.min(selectedImage.width, sw), height: Math.min(selectedImage.height, sh) });
    }
    setCropOpen(false);
  };

  // ---- THEME minimal Apple-like ----
  const panelBg = "bg-white/70 backdrop-blur supports-[backdrop-filter]:backdrop-blur border border-slate-200";
  const chip = "px-2 py-1 rounded-lg text-center border border-slate-200 bg-white/60";
  const ghostBtn = "p-2 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors";

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className={`p-4 ${panelBg} sticky top-0 z-10`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center">
              <ImageIcon size={18} className="text-slate-700" />
            </div>
            <h3 className="text-[15px] font-medium text-slate-800">Images</h3>
          </div>
          <button onClick={onClose} className={ghostBtn} aria-label="Fermer"><X size={18} /></button>
        </div>
        <div ref={dropRef} className="mt-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-slate-400">
          <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 p-3 text-slate-700">
            <Upload size={16} /> Ajouter une image
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
          <div className="px-4 pb-3 text-[11px] text-slate-500 text-center">ou glissez-déposez ici</div>
        </div>
      </div>

      {/* Liste */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {localImages.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            Ajoutez une image pour commencer.
          </div>
        ) : (
          localImages.slice().sort((a,b)=>b.zIndex-a.zIndex).map((image) => (
            <div key={image.id} className={`rounded-xl border border-slate-200 ${panelBg} p-3 ${selectedImageId===image.id?'ring-1 ring-blue-500':''}`} onClick={()=>onImageSelect(image.id)}>
              <div className="flex items-center gap-3">
                <img src={image.src} alt={image.alt} className="w-16 h-16 object-cover rounded-lg border border-slate-200" />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] text-slate-800 truncate">{image.alt}</div>
                  <div className="text-[11px] text-slate-500">{image.width} × {image.height}px</div>
                </div>
                <div className="flex items-center gap-1">
                  <button className={ghostBtn} title="Rogner" onClick={(e)=>{e.stopPropagation(); openCropper(image);}}><CropIcon size={14} /></button>
                  <button className={ghostBtn} title="Dupliquer" onClick={(e)=>{e.stopPropagation(); duplicateImage(image.id);}}><Copy size={14} /></button>
                  <button className={ghostBtn} title={image.visible? 'Masquer':'Afficher'} onClick={(e)=>{e.stopPropagation(); updateImage(image.id,{visible:!image.visible});}}>{image.visible? <Eye size={14}/> : <EyeOff size={14}/>}</button>
                  <button className={ghostBtn+" text-rose-600 hover:bg-rose-50"} title="Supprimer" onClick={(e)=>{e.stopPropagation(); if(confirm('Supprimer cette image ?')) deleteImage(image.id);}}><Trash2 size={14} /></button>
                </div>
              </div>

              {selectedImageId===image.id && (
                <div className="mt-3 border-t border-slate-200 pt-3 space-y-3">
                  {/* Placement / Wrapping */}
                  <div>
                    <div className="text-[11px] text-slate-700 mb-2">Texte autour</div>
                    <div className="grid grid-cols-4 gap-2">
                      {[{v:'left',l:'Gauche',I:AlignLeft},{v:'center',l:'Centre',I:AlignCenter},{v:'right',l:'Droite',I:AlignRight},{v:'none',l:'Libre',I:Settings}].map(({v,l,I})=> (
                        <button key={v} onClick={()=>updateImage(image.id,{float:v})} className={`px-2 py-2 rounded-lg border text-[12px] flex items-center justify-center gap-1 ${image.float===v?'border-blue-500 text-blue-600 bg-blue-50':'border-slate-300 hover:border-slate-400'}`}>
                          <I size={14}/> {l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Taille simple */}
                  <div>
                    <div className="text-[11px] text-slate-700 mb-1">Largeur (px)</div>
                    <input type="range" min="80" max="800" value={image.width} onChange={(e)=>{
                      const w = parseInt(e.target.value||'0');
                      const ratio = Math.max(1, image.width)/Math.max(1,image.height);
                      updateImage(image.id,{ width:w, height: Math.round(w/ratio) });
                    }} className="w-full accent-blue-600" />
                  </div>

                  {/* Calques minimal */}
                  <div className="flex gap-2">
                    <button onClick={()=>changeImageOrder(image.id,'front')} className={`px-3 py-2 rounded-lg border ${panelBg} text-sm`}>Devant</button>
                    <button onClick={()=>changeImageOrder(image.id,'back')} className={`px-3 py-2 rounded-lg border ${panelBg} text-sm`}>Derrière</button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer minimal */}
      <div className={`p-3 ${panelBg} text-center text-[12px] text-slate-600`}>Glissez une image, rogne-la, place-la. Simple.</div>

      {/* --- CROP MODAL --- */}
      {cropOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-[720px] max-w-[95vw]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-slate-800"><CropIcon size={16}/> Rogner l'image</div>
              <button className={ghostBtn} onClick={()=>setCropOpen(false)} aria-label="Fermer"><X size={16}/></button>
            </div>
            <div className="p-4">
              {/* Zone de preview */}
              <div className="relative mx-auto" style={{ width: viewSize.w, height: viewSize.h, background:'#f8fafc', borderRadius:'12px', overflow:'hidden', border:'1px solid #e2e8f0' }}>
                {cropImg && (
                  <img src={cropImg.src} alt="to-crop" draggable={false} style={{ width: viewSize.w, height: viewSize.h, objectFit:'contain', userSelect:'none', pointerEvents:'none' }} />
                )}
                {/* Masque + cadre */}
                <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.25)' }} />
                <div
                  className="absolute border-2 border-blue-500 bg-white/0"
                  style={{ left: cropRect.x, top: cropRect.y, width: cropRect.w, height: cropRect.h, boxShadow:'0 0 0 9999px rgba(0,0,0,0.25)'}}
                  onMouseDown={(e)=>onCropMouseDown(e,'move')}
                >
                  {/* Poignées */}
                  {['nw','ne','sw','se'].map((h)=> (
                    <div key={h}
                      onMouseDown={(e)=>onCropMouseDown(e,h)}
                      className="absolute w-3 h-3 bg-white border border-blue-500 rounded-sm"
                      style={{
                        left: h.includes('w') ? -6 : h.includes('e') ? cropRect.w-6 : (cropRect.w/2-6),
                        top: h.includes('n') ? -6 : h.includes('s') ? cropRect.h-6 : (cropRect.h/2-6),
                        cursor: h==='nw'?'nwse-resize': h==='se'?'nwse-resize': h==='ne'?'nesw-resize':'nesw-resize'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-slate-200">
              <button className={ghostBtn} onClick={()=>setCropOpen(false)}>Annuler</button>
              <button className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1" onClick={applyCrop}><Check size={16}/> Appliquer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
