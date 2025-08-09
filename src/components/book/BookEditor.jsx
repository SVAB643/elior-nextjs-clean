"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Save, Upload, Type, ZoomIn, ZoomOut, Printer, RotateCcw,
  Palette, Link as LinkIcon, List, ListOrdered, Quote, Minus, FileText, ImageIcon,
  Undo2, Redo2, Strikethrough, Highlighter, Eraser, Heading1, Heading2, Heading3,
  Link2Off, RemoveFormatting, Pilcrow, Code
} from "lucide-react";

// Import du composant ImageCanvas amélioré
import { ImageCanvas } from './ImageCanvas';

/**
 * IMPORTANT :
 * - Cette version reprend exactement votre structure et votre direction artistique,
 *   mais corrige plusieurs détails d'ergonomie et de robustesse.
 * - Elle ajoute des fonctionnalités d'édition demandées par vos utilisateurs
 *   (undo/redo, titres, liens, citation, code, nettoyage, etc.) tout en gardant
 *   la compatibilité avec un site déjà imbriqué.
 */

export const BookEditor = ({
  content: initialContent = "",
  onChange = () => {},
  onSave = () => {},
  onLoad = () => {},
  onPrint = () => {}
}) => {
  const editorRef = useRef(null);
  const imageContainerRef = useRef(null);
  const [zoom, setZoom] = useState(100);
  const [content, setContent] = useState(initialContent || `
    <h1 style="text-align: center; margin-bottom: 2em; color: #374151; font-weight: 300; font-size: 2.5em;">Mon Livre</h1>
    <p style="margin-bottom: 1.5em; text-indent: 2em; line-height: 1.8;">Commencez à écrire votre histoire ici. Cette zone d'édition vous permet de créer un livre professionnel avec toutes les fonctionnalités de mise en forme nécessaires.</p>
    <p style="margin-bottom: 1.5em; text-indent: 2em; line-height: 1.8;">Utilisez la barre d'outils pour formater votre texte et ajouter des images via le panneau dédié. Les images apparaîtront directement dans votre page et le texte s'adaptera automatiquement autour d'elles.</p>
    <p style="margin-bottom: 1.5em; text-indent: 2em; line-height: 1.8;">Vous pouvez déplacer les images librement, les redimensionner, et voir le résultat en temps réel pendant que vous écrivez votre livre.</p>
  `);
  const [activeTools, setActiveTools] = useState(new Set());
  const [showImageCanvas, setShowImageCanvas] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // ============ Styles CSS intégrés (inchangés + petites améliorations) ============
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .page-container { position: relative; overflow: visible; }
      .integrated-image { position: absolute; cursor: move; z-index: 10; transition: all .3s cubic-bezier(.4,0,.2,1); border-radius: 12px; user-select: none; box-shadow: 0 4px 20px rgba(0,0,0,.1); pointer-events: auto; }
      .integrated-image:hover { box-shadow: 0 8px 30px rgba(255,107,53,.3); transform: translateY(-2px); }
      .integrated-image.selected { box-shadow: 0 0 0 3px #ff6b35, 0 8px 30px rgba(255,107,53,.4); z-index: 20; }
      .integrated-image.dragging { transform: rotate(3deg) scale(1.05) translateY(-5px); z-index: 100; box-shadow: 0 15px 40px rgba(0,0,0,.3); }
      .integrated-image img { width: 100%; height: 100%; object-fit: cover; border-radius: 10px; display: block; pointer-events: none; }
      .image-controls { position: absolute; top: -45px; left: 0; right: 0; display: flex; justify-content: center; gap: 6px; opacity: 0; transition: all .3s ease; pointer-events: none; }
      .integrated-image:hover .image-controls, .integrated-image.selected .image-controls { opacity: 1; pointer-events: all; }
      .control-btn { width: 32px; height: 32px; background: rgba(0,0,0,.8); backdrop-filter: blur(10px); color: white; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .2s ease; font-size: 12px; font-weight: bold; }
      .control-btn:hover { background: rgba(255,107,53,.9); transform: scale(1.1); }
      .resize-handles { position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity .3s ease; }
      .integrated-image:hover .resize-handles, .integrated-image.selected .resize-handles { opacity: 1; }
      .resize-handle { position: absolute; width: 14px; height: 14px; background: #ff6b35; border: 3px solid white; border-radius: 50%; pointer-events: all; transition: all .2s ease; box-shadow: 0 2px 8px rgba(0,0,0,.2); }
      .resize-handle:hover { background: #f7931e; transform: scale(1.3); box-shadow: 0 4px 12px rgba(255,107,53,.5); }
      .resize-handle.nw { top: -7px; left: -7px; cursor: nw-resize; }
      .resize-handle.ne { top: -7px; right: -7px; cursor: ne-resize; }
      .resize-handle.sw { bottom: -7px; left: -7px; cursor: sw-resize; }
      .resize-handle.se { bottom: -7px; right: -7px; cursor: se-resize; }
      .integrated-image[data-float="left"] { float: left; position: relative !important; margin: 0 20px 20px 0; z-index: 1; }
      .integrated-image[data-float="right"] { float: right; position: relative !important; margin: 0 0 20px 20px; z-index: 1; }
      .integrated-image[data-float="center"] { display: block; position: relative !important; margin: 25px auto; clear: both; z-index: 1; }
      .integrated-image.appearing { animation: imageAppear .6s cubic-bezier(.4,0,.2,1); }
      @keyframes imageAppear { 0% { opacity:0; transform: scale(.8) translateY(20px);} 100% { opacity:1; transform: scale(1) translateY(0);} }
      .integrated-image.removing { animation: imageRemove .4s cubic-bezier(.4,0,.2,1) forwards; }
      @keyframes imageRemove { 0% { opacity:1; transform: scale(1) rotate(0);} 100% { opacity:0; transform: scale(.3) rotate(180deg);} }
      .alignment-guide { position: absolute; background: #ff6b35; z-index: 50; opacity: .8; transition: opacity .2s ease; }
      .alignment-guide.vertical { width: 2px; height: 100%; top: 0; }
      .alignment-guide.horizontal { height: 2px; width: 100%; left: 0; }
      .editor-content { position: relative; min-height: 100%; overflow: visible; }
      .editor-content p { position: relative; z-index: 1; }
    `;
    document.head.appendChild(style);
    return () => { if (document.head.contains(style)) document.head.removeChild(style); };
  }, []);

  // ============ Rendu des images dans la page (garde votre logique) ============
  const renderImagesInPage = useCallback(() => {
    if (!imageContainerRef.current) return;
    imageContainerRef.current.innerHTML = '';

    images.filter(img => img.visible).forEach((image) => {
      const imageElement = document.createElement('div');
      imageElement.id = `page-img-${image.id}`;
      imageElement.className = `integrated-image appearing ${selectedImageId === image.id ? 'selected' : ''}`;
      imageElement.setAttribute('data-float', image.float);
      imageElement.style.pointerEvents = 'auto';

      if (image.float === 'none') {
        imageElement.style.cssText += `
          width: ${image.width}px; height: ${image.height}px; left: ${image.x}px; top: ${image.y}px; transform: rotate(${image.rotation}deg); opacity: ${image.opacity}; z-index: ${image.zIndex}; pointer-events: auto;`;
      } else {
        imageElement.style.cssText += `
          width: ${image.width}px; height: ${image.height}px; transform: rotate(${image.rotation}deg); opacity: ${image.opacity}; z-index: ${image.zIndex}; pointer-events: auto;`;
      }

      imageElement.innerHTML = `
        <img src="${image.src}" alt="${image.alt}" draggable="false" />
        <div class="image-controls">
          <button class="control-btn" data-action="float-left" title="Flotter à gauche">⬅</button>
          <button class="control-btn" data-action="float-center" title="Centrer">⬛</button>
          <button class="control-btn" data-action="float-right" title="Flotter à droite">➡</button>
          <button class="control-btn" data-action="float-none" title="Position libre">↗</button>
          <button class="control-btn" data-action="remove" title="Supprimer" style="background: rgba(239,68,68,.9);">✕</button>
        </div>
        <div class="resize-handles">
          <div class="resize-handle nw"></div>
          <div class="resize-handle ne"></div>
          <div class="resize-handle sw"></div>
          <div class="resize-handle se"></div>
        </div>
      `;

      setupImageInteractions(imageElement, image.id, zoom);
      imageContainerRef.current.appendChild(imageElement);
    });
  }, [images, selectedImageId, zoom]);

  // ============ Interactions images ============
  const updateImagePosition = useCallback((imageId, updates) => {
    setImages(prev => prev.map(img => img.id === imageId ? { ...img, ...updates } : img));
  }, []);

  const setupImageInteractions = useCallback((imageElement, imageId, currentZoom) => {
    // Sélection
    imageElement.addEventListener('click', (e) => {
      e.stopPropagation();
      setSelectedImageId(imageId);
    });

    // Boutons flottants
    imageElement.querySelectorAll('.control-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.getAttribute('data-action');
        if (action === 'remove') {
          removeIntegratedImage(imageId);
          return;
        }
        const map = { 'float-left': 'left', 'float-center': 'center', 'float-right': 'right', 'float-none': 'none' };
        const f = map[action];
        if (f) updateImagePosition(imageId, { float: f });
      });
    });

    // Drag & Drop (corrigé avec compensation du zoom)
    imageElement.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('resize-handle') || e.target.classList.contains('control-btn')) return;
      e.preventDefault();
      setIsDragging(true);
      imageElement.classList.add('dragging');

      const rect = imageElement.getBoundingClientRect();
      const containerRect = imageContainerRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      const handleMouseMove = (ev) => {
        if (!imageContainerRef.current) return;
        const scale = currentZoom / 100; // compensation du zoom CSS
        const newX = (ev.clientX - containerRect.left - offsetX) / scale;
        const newY = (ev.clientY - containerRect.top - offsetY) / scale;
        const maxX = imageContainerRef.current.offsetWidth - imageElement.offsetWidth;
        const maxY = imageContainerRef.current.offsetHeight - imageElement.offsetHeight;
        const constrainedX = Math.max(0, Math.min(maxX, newX));
        const constrainedY = Math.max(0, Math.min(maxY, newY));
        imageElement.style.left = constrainedX + 'px';
        imageElement.style.top = constrainedY + 'px';
        updateImagePosition(imageId, { x: constrainedX, y: constrainedY, float: 'none' });
      };
      const handleMouseUp = () => {
        setIsDragging(false);
        imageElement.classList.remove('dragging');
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });

    // Redimensionnement (préserve le ratio)
    const resizeHandles = imageElement.querySelectorAll('.resize-handle');
    resizeHandles.forEach((handle) => {
      handle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = imageElement.offsetWidth;
        const startHeight = imageElement.offsetHeight;
        const aspectRatio = startWidth / startHeight;

        const onMove = (ev) => {
          const deltaX = ev.clientX - startX;
          const scale = currentZoom / 100;
          let newWidth = startWidth;
          if (handle.classList.contains('se') || handle.classList.contains('ne')) newWidth = Math.max(50, startWidth + deltaX / scale);
          if (handle.classList.contains('sw') || handle.classList.contains('nw')) newWidth = Math.max(50, startWidth - deltaX / scale);
          const newHeight = newWidth / aspectRatio;
          imageElement.style.width = newWidth + 'px';
          imageElement.style.height = newHeight + 'px';
          updateImagePosition(imageId, { width: newWidth, height: newHeight });
        };
        const onUp = () => {
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });
    });
  }, [updateImagePosition]);

  // Re-rendu des images quand elles changent
  useEffect(() => { renderImagesInPage(); }, [renderImagesInPage]);

  // ============ Export PDF (votre logique conservée) ============
  const exportToPDF = useCallback(async () => {
    try {
      let jsPDF, html2canvas;
      try {
        const jsPDFModule = await import('jspdf');
        jsPDF = jsPDFModule.default;
        html2canvas = (await import('html2canvas')).default;
      } catch (importError) {
        alert(`❌ Dépendances manquantes !\n\nInstallez d'abord :\nnpm install jspdf html2canvas\n\nPuis redémarrez votre serveur.`);
        return;
      }

      // Overlay de progression (identique, esthétique conservée)
      const progressDiv = document.createElement('div');
      progressDiv.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(255,107,53,.95), rgba(247,147,30,.95)); display: flex; align-items: center; justify-content: center; z-index: 10000; color: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
          <div style="text-align: center; max-width: 450px; padding: 40px;">
            <div style="font-size: 28px; margin-bottom: 25px; font-weight: 300;">📚 Génération du PDF...</div>
            <div style="background: rgba(255,255,255,.25); border-radius: 15px; padding: 6px; margin-bottom: 20px; backdrop-filter: blur(10px);">
              <div id="progress-bar" style="width: 0%; height: 12px; background: linear-gradient(90deg, white, rgba(255,255,255,.9)); border-radius: 10px; transition: width .5s cubic-bezier(.4,0,.2,1); box-shadow: 0 2px 10px rgba(255,255,255,.3);"></div>
            </div>
            <div id="progress-text" style="font-size: 16px; opacity: .95; font-weight: 300;">Préparation du contenu...</div>
          </div>
        </div>`;
      document.body.appendChild(progressDiv);
      const updateProgress = (percent, text) => {
        const bar = document.getElementById('progress-bar');
        const textEl = document.getElementById('progress-text');
        if (bar) bar.style.width = percent + '%';
        if (textEl) textEl.textContent = text;
      };

      updateProgress(15, 'Préparation de la page...');

      // Conteneur dédié à l'export
      const exportContainer = document.createElement('div');
      exportContainer.style.cssText = `
        width: 210mm !important; min-height: 297mm !important; padding: 20mm !important; background: white !important; font-family: "Times New Roman", serif !important; font-size: 12pt !important; line-height: 1.6 !important; color: black !important; position: relative !important; box-sizing: border-box !important; overflow: visible !important;`;

      updateProgress(35, 'Intégration du texte...');

      const clonedContent = editorRef.current.cloneNode(true);
      clonedContent.style.position = 'relative';
      clonedContent.style.zIndex = '1';
      exportContainer.appendChild(clonedContent);

      updateProgress(55, 'Positionnement des images...');

      images.filter(img => img.visible).forEach((image) => {
        const imgElement = document.createElement('div');
        if (image.float === 'none') {
          imgElement.style.cssText = `position:absolute; left:${image.x}px; top:${image.y}px; width:${image.width}px; height:${image.height}px; transform: rotate(${image.rotation}deg); opacity:${image.opacity}; z-index:${image.zIndex + 10}; page-break-inside: avoid;`;
        } else {
          imgElement.style.cssText = `width:${image.width}px; height:${image.height}px; transform: rotate(${image.rotation}deg); opacity:${image.opacity}; page-break-inside: avoid; margin: 15px; z-index:${image.zIndex + 10};`;
          if (image.float === 'left') { imgElement.style.float = 'left'; imgElement.style.margin = '0 15px 15px 0'; }
          if (image.float === 'right') { imgElement.style.float = 'right'; imgElement.style.margin = '0 0 15px 15px'; }
          if (image.float === 'center') { imgElement.style.display = 'block'; imgElement.style.margin = '15px auto'; imgElement.style.textAlign = 'center'; }
        }
        imgElement.innerHTML = `<img src="${image.src}" alt="${image.alt}" style="width:100%; height:100%; object-fit:cover; border-radius:6px;" />`;
        exportContainer.appendChild(imgElement);
      });

      updateProgress(75, `Optimisation pour l'impression...`);

      exportContainer.style.position = 'absolute';
      exportContainer.style.left = '-9999px';
      exportContainer.style.top = '0';
      document.body.appendChild(exportContainer);

      await new Promise(resolve => setTimeout(resolve, 1200));
      updateProgress(90, 'Capture de la page...');

      const canvas = await html2canvas(exportContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: exportContainer.scrollWidth,
        height: exportContainer.scrollHeight,
        logging: false
      });

      document.body.removeChild(exportContainer);
      updateProgress(95, 'Génération du fichier PDF...');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasAspectRatio = canvas.width / canvas.height;
      const pdfAspectRatio = pdfWidth / pdfHeight;
      let imgWidth, imgHeight;
      if (canvasAspectRatio > pdfAspectRatio) { imgWidth = pdfWidth; imgHeight = pdfWidth / canvasAspectRatio; }
      else { imgHeight = pdfHeight; imgWidth = pdfHeight * canvasAspectRatio; }
      const imgX = (pdfWidth - imgWidth) / 2;
      const imgY = (pdfHeight - imgHeight) / 2;
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth, imgHeight);

      updateProgress(100, 'Finalisation...');
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      const fileName = `elior-livre-${dateStr}.pdf`;
      pdf.save(fileName);

      setTimeout(() => {
        if (document.body.contains(progressDiv)) document.body.removeChild(progressDiv);
        const successDiv = document.createElement('div');
        successDiv.innerHTML = `
          <div style="position: fixed; bottom: 30px; right: 30px; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px 25px; border-radius: 15px; box-shadow: 0 8px 25px rgba(16,185,129,.4); z-index: 10000; font-family: sans-serif; font-size: 15px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,.2);">
            <div style="display:flex; align-items:center; gap:10px;">
              <div style="font-size:24px;">✅</div>
              <div>
                <div style="font-weight:600;">PDF généré avec succès !</div>
                <div style="opacity:.9; font-size:13px; margin-top:2px;">${fileName}</div>
              </div>
            </div>
          </div>`;
        document.body.appendChild(successDiv);
        setTimeout(() => {
          if (document.body.contains(successDiv)) {
            successDiv.style.transition = 'all .4s ease';
            successDiv.style.transform = 'translateX(100%)';
            successDiv.style.opacity = '0';
            setTimeout(() => { if (document.body.contains(successDiv)) document.body.removeChild(successDiv); }, 400);
          }
        }, 5000);
      }, 1000);
    } catch (error) {
      console.error('Erreur export PDF:', error);
      alert(`❌ Erreur lors de l'export PDF: ${error.message}`);
    }
  }, [images]);

  // ============ Gestion du contenu & execCommand (conservés + ajouts) ============
  const updateContent = useCallback(() => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      onChange(newContent);
      // sauvegarde locale optionnelle
      try { localStorage.setItem('elior-editor-content', newContent); } catch {}
    }
  }, [onChange]);

  const exec = useCallback((command, value = null) => {
    // document.execCommand est encore supporté par la plupart des navigateurs de bureau.
    // Pour rester simple et compatible dans un site imbriqué, on garde cette API.
    document.execCommand(command, false, value);
    const newActiveTools = new Set();
    if (document.queryCommandState('bold')) newActiveTools.add('bold');
    if (document.queryCommandState('italic')) newActiveTools.add('italic');
    if (document.queryCommandState('underline')) newActiveTools.add('underline');
    setActiveTools(newActiveTools);
    updateContent();
  }, [updateContent]);

  const applyHeading = (tag) => {
    // formatBlock attend le nom HTML (ex: H1)
    exec('formatBlock', tag);
  };

  const createLink = () => {
    const url = prompt('Entrez l\'URL :');
    if (!url) return;
    exec('createLink', url);
  };

  const removeLink = () => exec('unlink');

  const clearFormatting = () => exec('removeFormat');

  const handleContentChange = useCallback(() => {
    updateContent();
    const newActive = new Set();
    if (document.queryCommandState('bold')) newActive.add('bold');
    if (document.queryCommandState('italic')) newActive.add('italic');
    if (document.queryCommandState('underline')) newActive.add('underline');
    setActiveTools(newActive);
  }, [updateContent]);

  const initializeContent = useCallback((element) => {
    if (element && !element.hasAttribute('data-initialized')) {
      // charger depuis localStorage si dispo
      let start = content;
      try {
        const cached = localStorage.getItem('elior-editor-content');
        if (!initialContent && cached) start = cached;
      } catch {}
      element.innerHTML = start;
      element.setAttribute('data-initialized', 'true');
    }
  }, [content, initialContent]);

  const handleZoomChange = useCallback((newZoom) => {
    setZoom(Math.max(50, Math.min(200, newZoom)));
  }, []);

  // ============ Raccourcis clavier enrichis ============
  const handleKeyDown = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b': e.preventDefault(); exec('bold'); break;
        case 'i': e.preventDefault(); exec('italic'); break;
        case 'u': e.preventDefault(); exec('underline'); break;
        case 's': e.preventDefault(); onSave(); break;
        case 'z': e.preventDefault(); exec('undo'); break;
        case 'y': e.preventDefault(); exec('redo'); break;
      }
    }
    if (e.key === 'Delete' && selectedImageId) {
      const imageElement = document.getElementById(`page-img-${selectedImageId}`);
      if (imageElement) removeIntegratedImage(selectedImageId);
    }
  }, [exec, onSave, selectedImageId]);

  // Nettoyage du collage (empêche le style parasite)
  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  // ============ Handlers ImageCanvas -> état React ============
  const handleImagesUpdate = useCallback((newImages) => { setImages(newImages); }, []);
  const handlePageClick = useCallback((e) => {
    if (e.target === imageContainerRef.current || e.target === editorRef.current) setSelectedImageId(null);
  }, []);

  // Wire des fonctions globales (compatibilité avec vos CustomEvents)
  useEffect(() => {
    const updateFloat = (imageId, float) => setImages(prev => prev.map(i => i.id === imageId ? { ...i, float } : i));
    const removeFromState = (imageId) => setImages(prev => prev.filter(i => i.id !== imageId));
    window.updateImageFloat = updateFloat;
    window.removeImageFromState = removeFromState;
    return () => {
      // nettoyage
      try {
        delete window.updateImageFloat;
        delete window.removeImageFromState;
      } catch {}
    };
  }, []);

  // ============ Rendu JSX ============
  return (
    <div className="flex-1 flex h-full bg-gray-50">
      {/* Zone d'édition principale */}
      <div className="flex-1 flex flex-col">
        {/* Barre d'outils améliorée */}
        <div className="bg-white border-b border-gray-100 p-4 flex-shrink-0 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            {/* Gras / Italique / Souligné */}
            <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 border border-gray-100">
              {[
                { command: 'bold', icon: Bold, shortcut: 'Ctrl+B' },
                { command: 'italic', icon: Italic, shortcut: 'Ctrl+I' },
                { command: 'underline', icon: Underline, shortcut: 'Ctrl+U' }
              ].map(({ command, icon: Icon, shortcut }) => (
                <button
                  key={command}
                  onClick={() => exec(command)}
                  title={shortcut}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    activeTools.has(command) ? 'text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  style={{
                    background: activeTools.has(command)
                      ? 'linear-gradient(135deg, #fed7aa, #c7d2fe)'
                      : 'transparent'
                  }}
                >
                  <Icon size={16} />
                </button>
              ))}
              {/* Barré */}
              <button onClick={() => exec('strikeThrough')} className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-600 transition-all duration-300" title="Barré">
                <Strikethrough size={16} />
              </button>
            </div>

            {/* Titres */}
            <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 border border-gray-100">
              <button onClick={() => applyHeading('H1')} className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-600" title="Titre 1">
                <Heading1 size={16} />
              </button>
              <button onClick={() => applyHeading('H2')} className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-600" title="Titre 2">
                <Heading2 size={16} />
              </button>
              <button onClick={() => applyHeading('H3')} className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-600" title="Titre 3">
                <Heading3 size={16} />
              </button>
              <button onClick={() => applyHeading('P')} className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-600" title="Paragraphe">
                <Pilcrow size={16} />
              </button>
            </div>

            {/* Alignement */}
            <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 border border-gray-100">
              {[
                { command: 'justifyLeft', icon: AlignLeft },
                { command: 'justifyCenter', icon: AlignCenter },
                { command: 'justifyRight', icon: AlignRight }
              ].map(({ command, icon: Icon }) => (
                <button key={command} onClick={() => exec(command)} className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-600 transition-all duration-300">
                  <Icon size={16} />
                </button>
              ))}
            </div>

            {/* Listes */}
            <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 border border-gray-100">
              <button onClick={() => exec('insertUnorderedList')} className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-600 transition-all duration-300" title="Liste à puces">
                <List size={16} />
              </button>
              <button onClick={() => exec('insertOrderedList')} className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-600 transition-all duration-300" title="Liste numérotée">
                <ListOrdered size={16} />
              </button>
              <button onClick={() => exec('formatBlock', '<BLOCKQUOTE>')} className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-600" title="Citation">
                <Quote size={16} />
              </button>
              <button onClick={() => exec('formatBlock', '<PRE>')} className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-600" title="Bloc de code">
                <Code size={16} />
              </button>
              <button onClick={() => exec('insertHorizontalRule')} className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-600" title="Ligne horizontale">
                <Minus size={16} />
              </button>
            </div>

            {/* Taille de police */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-2 border border-gray-100">
              <Type size={16} className="text-gray-600" />
              <select onChange={(e) => exec('fontSize', e.target.value)} className="bg-transparent border-none outline-none text-sm text-gray-700 font-light cursor-pointer" defaultValue="3">
                <option value="1">Très petit</option>
                <option value="2">Petit</option>
                <option value="3">Normal</option>
                <option value="4">Moyen</option>
                <option value="5">Grand</option>
                <option value="6">Très grand</option>
                <option value="7">Énorme</option>
              </select>
            </div>

            <div className="w-px h-8 bg-gray-200" />

            {/* Couleurs rapides */}
            <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 border border-gray-100">
              {['#000000', '#ef4444', '#3b82f6', '#10b981', '#f59e0b'].map(color => (
                <button key={color} onClick={() => exec('foreColor', color)} className="w-6 h-6 rounded border-2 border-white shadow-sm hover:scale-110 transition-transform duration-200" style={{ backgroundColor: color }} title={`Couleur ${color}`} />
              ))}
              {/* Effaceur de style */}
              <button onClick={clearFormatting} className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-600" title="Effacer la mise en forme">
                <RemoveFormatting size={16} />
              </button>
            </div>

            {/* Liens */}
            <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 border border-gray-100">
              <button onClick={createLink} className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-600" title="Insérer un lien">
                <LinkIcon size={16} />
              </button>
              <button onClick={removeLink} className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-600" title="Supprimer le lien">
                <Link2Off size={16} />
              </button>
            </div>

            {/* Panneau images */}
            <button
              onClick={() => setShowImageCanvas(!showImageCanvas)}
              className={`flex items-center gap-2 px-4 py-2 text-white rounded-xl transition-all duration-300 shadow-lg text-sm font-light hover:scale-105 hover:shadow-xl ${showImageCanvas ? 'ring-2 ring-white ring-opacity-50' : ''}`}
              style={{ background: showImageCanvas ? 'linear-gradient(135deg, #f7931e, #ff6b35)' : 'linear-gradient(135deg, #ff6b35, #f7931e)' }}
            >
              <ImageIcon size={16} />
              {showImageCanvas ? 'Masquer Images' : 'Gérer Images'}
              {images.length > 0 && (
                <span className="bg-white bg-opacity-30 px-2 py-0.5 rounded-full text-xs font-medium">{images.length}</span>
              )}
            </button>

            {/* Zoom */}
            <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 border border-gray-100">
              <button onClick={() => handleZoomChange(zoom - 10)} className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-600 transition-all duration-300" title="Zoom -">
                <ZoomOut size={16} />
              </button>
              <span className="px-3 py-1 text-sm text-gray-700 min-w-[60px] text-center font-light">{zoom}%</span>
              <button onClick={() => handleZoomChange(zoom + 10)} className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-600 transition-all duration-300" title="Zoom +">
                <ZoomIn size={16} />
              </button>
            </div>

            <div className="flex-1" />

            {/* Undo/Redo rapides */}
            <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 border border-gray-100">
              <button onClick={() => exec('undo')} className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-600" title="Annuler (Ctrl+Z)"><Undo2 size={16} /></button>
              <button onClick={() => exec('redo')} className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-600" title="Rétablir (Ctrl+Y)"><Redo2 size={16} /></button>
            </div>

            {/* Actions principales */}
            <div className="flex items-center gap-2">
              <button onClick={() => handleZoomChange(100)} className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 text-sm font-light" title="Réinitialiser zoom">
                <RotateCcw size={14} />
                Reset
              </button>
              <button onClick={exportToPDF} className="flex items-center gap-2 px-4 py-2 text-white rounded-xl transition-all duration-300 text-sm font-light shadow-lg hover:scale-105 hover:shadow-xl" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }} title="Exporter en PDF haute qualité (texte + images)">
                <FileText size={16} />
                Export PDF
              </button>
              <button onClick={onPrint} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300 text-sm font-light shadow-lg hover:scale-105">
                <Printer size={16} />
                Imprimer
              </button>
              <button onClick={onLoad} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 text-sm font-light">
                <Upload size={16} />
                Charger
              </button>
              <button onClick={onSave} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-300 text-sm font-light shadow-lg" title="Ctrl+S">
                <Save size={16} />
                Sauvegarder
              </button>
            </div>
          </div>
        </div>

        {/* Zone d'édition ultra-fluide avec images intégrées */}
        <div className="flex-1 overflow-auto bg-gradient-to-b from-gray-100 to-gray-200 p-8" style={{ height: 'calc(100vh - 140px)' }}>
          <div className="mx-auto transition-all duration-500 ease-out" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center', paddingBottom: '100px' }}>
            {/* Page A4 */}
            <div
              className="bg-white shadow-xl mx-auto relative border border-gray-200 page-container"
              style={{ width: '21cm', minHeight: '29.7cm', padding: '2.5cm', fontFamily: '"Times New Roman", serif', marginBottom: '2cm', borderRadius: '8px', background: 'linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(249, 250, 251, 0.8))' }}
              onClick={handlePageClick}
            >
              {/* Conteneur d'images (overlay) */}
              <div ref={imageContainerRef} className="absolute inset-0" style={{ pointerEvents: 'none', zIndex: 10 }} />

              {/* Zone d'édition de texte */}
              <div
                ref={(el) => { editorRef.current = el; initializeContent(el); }}
                contentEditable
                suppressContentEditableWarning={true}
                onInput={handleContentChange}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                className="editor-content w-full outline-none text-gray-800 leading-relaxed cursor-text focus:outline-none relative"
                style={{ fontSize: '16px', lineHeight: '1.8', minHeight: '24.7cm', maxHeight: 'none', wordWrap: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap', zIndex: 1, pointerEvents: 'all' }}
                tabIndex={0}
                spellCheck={true}
                placeholder="Commencez à écrire votre livre ici..."
              />
            </div>
          </div>
        </div>

        {/* Barre d'état */}
        <div className="bg-white border-t border-gray-100 px-6 py-2 text-xs text-gray-500 font-light flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>Format A4 • 21 × 29,7 cm</span>
            <span>Zoom: {zoom}%</span>
            {images.length > 0 && (
              <span className="text-orange-600">{images.length} image(s) • {images.filter(img => img.visible).length} visible(s)</span>
            )}
            {selectedImageId && (
              <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-md">✨ Image sélectionnée • Del: supprimer</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span>🎨 Images intégrées en temps réel</span>
            <span>📄 Export PDF ultra-qualité</span>
            <span>⚡ Interface ultra-fluide</span>
          </div>
        </div>
      </div>

      {/* Panneau ImageCanvas coulissant */}
      {showImageCanvas && (
        <div className="w-80 border-l border-gray-200 bg-white shadow-xl animate-in slide-in-from-right duration-300">
          <ImageCanvas
            onImagesUpdate={handleImagesUpdate}
            images={images}
            selectedImageId={selectedImageId}
            onImageSelect={setSelectedImageId}
            onClose={() => setShowImageCanvas(false)}
          />
        </div>
      )}
    </div>
  );
};

// Fonctions globales pour la manipulation d'images (compatibilité avec votre code)
if (typeof window !== 'undefined') {
  window.setImageFloat = (imageId, float) => {
    window.dispatchEvent(new CustomEvent('setImageFloat', { detail: { imageId, float } }));
  };
  window.removeIntegratedImage = (imageId) => {
    const imageElement = document.getElementById(`page-img-${imageId}`);
    if (imageElement) {
      imageElement.classList.add('removing');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('removeImage', { detail: { imageId } }));
      }, 400);
    }
  };
  window.addEventListener('setImageFloat', (e) => {
    const { imageId, float } = e.detail;
    if (window.updateImageFloat) window.updateImageFloat(imageId, float);
  });
  window.addEventListener('removeImage', (e) => {
    const { imageId } = e.detail;
    if (window.removeImageFromState) window.removeImageFromState(imageId);
  });
}
