"use client";

import { useState, useEffect, useRef, useCallback } from "react";
// ← Ici j'ai supp userouteur

// Import des composants
import { Header, LoadingText } from '../../components/ui';
import { ChapterSidebar, RecordingCenter, TranscriptionArea } from '../../components/recorder';
import { BookEditor } from '../../components/book';
import { CoverEditor } from '../../components/cover';

// Configuration complète des chapitres avec toutes les questions individuelles
const DEFAULT_CHAPTERS = [
  {
    id: 1,
    title: "Les Origines",
    segments: [],
    questions: [
      { id: 101, title: "D'où je viens - Naissance", text: "Où êtes-vous né(e) ? Dans quel contexte ?" },
      { id: 102, title: "D'où je viens - Entourage", text: "Qui étaient les personnes présentes au début de votre vie ?" },
      { id: 103, title: "D'où je viens - Environnement", text: "À quoi ressemblait votre environnement (ville, nature, appartement, culture) ?" },
      { id: 104, title: "Premiers souvenirs - Premier souvenir", text: "Quel est votre tout premier souvenir clair ?" },
      { id: 105, title: "Premiers souvenirs - Scène d'enfance", text: "Y a-t-il une scène d'enfance que vous pourriez rejouer les yeux fermés ?" },
      { id: 106, title: "Premiers souvenirs - Odeurs et sons", text: "Quelle odeur ou quel son symbolise cette époque pour vous ?" },
      { id: 107, title: "Enfance intime - Rires et rêves", text: "Qu'est-ce qui vous faisait rire ou rêver enfant ?" },
      { id: 108, title: "Enfance intime - Personnalité", text: "Étiez-vous plutôt solitaire, joueur(se), aventurier(e), timide ?" },
      { id: 109, title: "Enfance intime - Objets marquants", text: "Y a-t-il un jouet, une chanson, une habitude qui vous a marqué(e) ?" }
    ]
  },
  {
    id: 2,
    title: "Grandir",
    segments: [],
    questions: [
      { id: 201, title: "Scolarité - Vécu scolaire", text: "Comment viviez-vous l'école ? Qu'est-ce qui vous enthousiasmait ou vous ennuyait ?" },
      { id: 202, title: "Scolarité - Personnes marquantes", text: "Avez-vous croisé un(e) professeur(e) ou camarade marquant(e) ?" },
      { id: 203, title: "Scolarité - Matières préférées", text: "Quelle matière ou quel domaine vous attirait spontanément ?" },
      { id: 204, title: "Amitiés - Amis d'enfance", text: "Qui étaient vos ami(e)s d'enfance ou d'adolescence ?" },
      { id: 205, title: "Amitiés - Sens de l'amitié", text: "Qu'est-ce que l'amitié signifiait pour vous à cette époque ?" },
      { id: 206, title: "Amitiés - Souvenirs entre amis", text: "Avez-vous un souvenir d'un moment \"entre potes\" inoubliable ?" },
      { id: 207, title: "Premières fois - Première fois marquante", text: "Vous souvenez-vous de votre première fois marquante (voyage, baiser, victoire, chute...) ?" },
      { id: 208, title: "Premières fois - Grandir", text: "Quand vous êtes-vous senti \"grandir\" pour la première fois ?" },
      { id: 209, title: "Premières fois - Rêves d'avenir", text: "Aviez-vous un rêve ou une idée précise de ce que vous vouliez devenir ?" }
    ]
  },
  {
    id: 3,
    title: "Devenir Adulte",
    segments: [],
    questions: [
      { id: 301, title: "Premiers choix - Décisions importantes", text: "Quelles décisions importantes avez-vous prises en devenant adulte ?" },
      { id: 302, title: "Premiers choix - Premier job et échec", text: "Quel a été votre premier job ? Et votre premier échec ?" },
      { id: 303, title: "Premiers choix - Apprentissage sur soi", text: "Qu'avez-vous appris sur vous-même à ce moment-là ?" },
      { id: 304, title: "L'amour - Représentation de l'amour", text: "Qu'est-ce que l'amour représentait pour vous à ce moment de votre vie ?" },
      { id: 305, title: "L'amour - Grande histoire", text: "Avez-vous vécu une grande histoire ? Un moment romantique fondateur ?" },
      { id: 306, title: "L'amour - Découverte des autres", text: "Qu'avez-vous découvert sur les autres dans vos premières relations ?" },
      { id: 307, title: "Prendre sa place - Construction", text: "Comment vous êtes-vous construit(e) dans le monde adulte ?" },
      { id: 308, title: "Prendre sa place - Trouver sa voie", text: "Avez-vous cherché votre voie ou l'avez-vous trouvée rapidement ?" },
      { id: 309, title: "Prendre sa place - Valeurs", text: "Quelles valeurs vous guidaient, même sans que vous les nommiez encore ?" }
    ]
  },
  {
    id: 4,
    title: "Parcours & Épreuves",
    segments: [],
    questions: [
      { id: 401, title: "Travail - Rôle du travail", text: "Quel rôle le travail joue-t-il dans votre vie ?" },
      { id: 402, title: "Travail - Vocation et projets", text: "Avez-vous eu un métier \"vocation\", ou des projets personnels moteurs ?" },
      { id: 403, title: "Travail - Changements de cap", text: "Avez-vous changé de cap ? Pourquoi ?" },
      { id: 404, title: "Moments difficiles - Tempêtes", text: "Y a-t-il eu des tempêtes dans votre vie ? Comment les avez-vous traversées ?" },
      { id: 405, title: "Moments difficiles - Ce qui aide", text: "Qu'est-ce qui vous a aidé à tenir, à guérir, à continuer ?" },
      { id: 406, title: "Moments difficiles - Apprentissages", text: "Qu'avez-vous appris dans ces moments-là ?" },
      { id: 407, title: "Engagements - Causes importantes", text: "Y a-t-il une cause ou un combat qui vous tient à cœur ?" },
      { id: 408, title: "Engagements - Prises de position", text: "Avez-vous déjà pris position, agi, défendu quelque chose publiquement ou intimement ?" },
      { id: 409, title: "Engagements - Injustices et espoirs", text: "Quelle injustice ou quel espoir vous anime encore aujourd'hui ?" }
    ]
  },
  {
    id: 5,
    title: "Joies & Passions",
    segments: [],
    questions: [
      { id: 501, title: "Ce qui fait vibrer - Sources de joie", text: "Qu'est-ce qui vous donne de l'élan, de la joie, même aujourd'hui ?" },
      { id: 502, title: "Ce qui fait vibrer - Passions", text: "Avez-vous des passions secrètes ou durables ?" },
      { id: 503, title: "Ce qui fait vibrer - État de grâce", text: "Quelle activité vous met \"dans un état de grâce\" ?" },
      { id: 504, title: "Beauté et culture - Œuvres marquantes", text: "Quel livre, film, œuvre ou chanson a bouleversé votre regard ?" },
      { id: 505, title: "Beauté et culture - Créations personnelles", text: "Avez-vous déjà créé quelque chose dont vous êtes fier(e) ?" },
      { id: 506, title: "Beauté et culture - Traditions", text: "Y a-t-il une culture, une tradition ou une fête qui vous touche particulièrement ?" }
    ]
  },
  {
    id: 6,
    title: "Vous Aujourd'hui",
    segments: [],
    questions: [
      { id: 601, title: "Le présent - Quotidien", text: "À quoi ressemble votre quotidien aujourd'hui ?" },
      { id: 602, title: "Le présent - Entourage", text: "De quoi êtes-vous entouré(e) (personnes, objets, paysages…) ?" },
      { id: 603, title: "Le présent - Appréciations", text: "Qu'est-ce que vous appréciez dans votre vie actuelle ?" },
      { id: 604, title: "Vision du monde - Regard actuel", text: "Quel regard portez-vous sur le monde d'aujourd'hui ?" },
      { id: 605, title: "Vision du monde - Enthousiasmes et inquiétudes", text: "Y a-t-il des choses qui vous enthousiasment ou vous inquiètent ?" },
      { id: 606, title: "Vision du monde - Changements souhaités", text: "Que souhaiteriez-vous voir changer ou perdurer dans la société ?" }
    ]
  },
  {
    id: 7,
    title: "Transmettre",
    segments: [],
    questions: [
      { id: 701, title: "Regard sur le chemin - Fil rouge", text: "Si vous regardez en arrière, quel est le fil rouge de votre vie ?" },
      { id: 702, title: "Regard sur le chemin - Fierté", text: "De quoi êtes-vous le ou la plus fier(e) ?" },
      { id: 703, title: "Regard sur le chemin - Regrets", text: "Y a-t-il une chose que vous auriez aimé dire plus tôt, ou faire différemment ?" },
      { id: 704, title: "Pour les lecteurs - À qui vous parlez", text: "À qui pensez-vous en racontant tout cela ?" },
      { id: 705, title: "Pour les lecteurs - Message", text: "Quel message aimeriez-vous adresser à vos enfants, proches, futur(e)s lecteur(rice)s ?" },
      { id: 706, title: "Pour les lecteurs - Ce qu'on retiendra", text: "Que voulez-vous qu'on retienne de vous, une fois ce livre refermé ?" },
      { id: 707, title: "Dernier mot - Message final", text: "Si vous aviez un message, une leçon de vie, ou un mot à transmettre à ceux qui liront ce livre… lequel serait-ce ?" }
    ]
  }
];

export default function EliorApp() {
  // ici aussi supprimé userouter
  // États principaux
  const [currentView, setCurrentView] = useState('recorder');
  const [chapters, setChapters] = useState(DEFAULT_CHAPTERS);
  const [activeChapter, setActiveChapter] = useState(1);
  const [activeQuestion, setActiveQuestion] = useState(null);
  
  // NOUVEAUX ÉTATS pour l'IA
  const [suggestedFollowUp, setSuggestedFollowUp] = useState(null);
  const [isAnalyzingResponse, setIsAnalyzingResponse] = useState(false);
  
  // États de l'enregistreur avec étapes de génération
  const [state, setState] = useState({
    countdown: null,
    isRecording: false,
    recordingProgress: 0,
    transcription: "",
    isTranscribing: false,
    isGenerating: false,
    generationStep: "",
    isPlayingQuestion: false,
    audioLevel: 0,
    generatedStory: ""
  });
  
  // États de l'éditeur livre
  const [bookContent, setBookContent] = useState('<h1>Mon Livre</h1><p>Commencez à écrire votre livre ici...</p>');
  const [bookTitle, setBookTitle] = useState('Mon Histoire de Vie');
  const [authorName, setAuthorName] = useState('');
  const [zoom, setZoom] = useState(100);
  
  // États de l'éditeur de couverture
  const [coverData, setCoverData] = useState({
    elements: [
      {
        id: 1,
        type: 'text',
        content: 'Mon Histoire',
        x: 50,
        y: 100,
        width: 200,
        height: 60,
        style: {
          fontSize: 28,
          fontWeight: 'bold',
          color: '#1f2937',
          textAlign: 'center',
          fontFamily: 'serif'
        }
      },
      {
        id: 2,
        type: 'text',
        content: 'Souvenirs d\'enfance',
        x: 50,
        y: 180,
        width: 200,
        height: 40,
        style: {
          fontSize: 16,
          fontWeight: 'normal',
          color: '#6b7280',
          textAlign: 'center',
          fontFamily: 'serif'
        }
      }
    ],
    background: null,
    backgroundColor: '#f8fafc'
  });
  
  const refs = useRef({
    mediaRecorder: null,
    audioStream: null,
    audioChunks: [],
    audioContext: null,
    analyser: null,
    animationFrame: null,
    recordingStartTime: null,
    progressInterval: null
  });

  // === LOGIQUE ENREGISTREUR ===
  
  // Gestion du compte à rebours
  useEffect(() => {
    let timer;
    if (state.countdown !== null && state.countdown > 0) {
      timer = setTimeout(() => setState(prev => ({ ...prev, countdown: prev.countdown - 1 })), 1000);
    } else if (state.countdown === 0) {
      setState(prev => ({ ...prev, countdown: null }));
      startRecording();
    }
    return () => clearTimeout(timer);
  }, [state.countdown]);

  // Gestion de la progression d'enregistrement
  useEffect(() => {
    if (state.isRecording) {
      refs.current.recordingStartTime = Date.now();
      refs.current.progressInterval = setInterval(() => {
        const elapsed = Date.now() - refs.current.recordingStartTime;
        const progress = Math.min((elapsed / 30000) * 100, 100);
        setState(prev => ({ ...prev, recordingProgress: progress }));
      }, 100);
    } else {
      if (refs.current.progressInterval) {
        clearInterval(refs.current.progressInterval);
      }
      setState(prev => ({ ...prev, recordingProgress: 0 }));
    }

    return () => {
      if (refs.current.progressInterval) {
        clearInterval(refs.current.progressInterval);
      }
    };
  }, [state.isRecording]);

  // Nettoyage lors du démontage du composant
  useEffect(() => {
    return () => {
      // Nettoyer les ressources audio
      if (refs.current.audioStream) {
        refs.current.audioStream.getTracks().forEach(track => track.stop());
      }
      if (refs.current.audioContext) {
        refs.current.audioContext.close();
      }
      if (refs.current.animationFrame) {
        cancelAnimationFrame(refs.current.animationFrame);
      }
    };
  }, []);

  // Obtenir la question active
  const getActiveQuestionText = useCallback(() => {
    if (!activeQuestion) return "Sélectionnez une question pour commencer l'enregistrement";
    
    const currentChapter = chapters.find(c => c.id === activeChapter);
    const question = currentChapter?.questions?.find(q => q.id === activeQuestion);
    return question ? question.text : "Question introuvable";
  }, [activeQuestion, activeChapter, chapters]);

  // Obtenir le titre de la question active
  const getActiveQuestionTitle = useCallback(() => {
    if (!activeQuestion) return "";
    
    const currentChapter = chapters.find(c => c.id === activeChapter);
    const question = currentChapter?.questions?.find(q => q.id === activeQuestion);
    return question ? question.title : "";
  }, [activeQuestion, activeChapter, chapters]);

  // NOUVELLE FONCTION : Analyser la réponse et proposer une question de suivi
  const analyzeResponseAndSuggestFollowUp = useCallback(async (transcription) => {
    if (transcription.length < 50) return; // Minimum de contenu pour analyser
    
    console.log('🧠 Début analyse IA pour:', transcription.slice(0, 100) + '...');
    setIsAnalyzingResponse(true);
    
    try {
      const response = await fetch('/api/analyze-realtime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          transcript: transcription,
          currentQuestion: getActiveQuestionText()
        }),
      });
      
      const result = await response.json();
      console.log('📊 Résultat API analyze-realtime:', result);
      
      if (result.hasInterestingPoint && result.followUpQuestion) {
        const suggestion = {
          question: result.followUpQuestion,
          specificElement: result.specificElement,
          confidence: result.confidence || 0.8
        };
        console.log('✨ Suggestion créée:', suggestion);
        setSuggestedFollowUp(suggestion);
      } else {
        console.log('❌ Pas de suggestion créée - conditions non remplies');
      }
    } catch (error) {
      console.error('❌ Erreur analyse IA:', error);
    } finally {
      setIsAnalyzingResponse(false);
    }
  }, [getActiveQuestionText]);

  // Gestion de l'acceptation de question de suivi
  const handleAcceptFollowUp = useCallback(() => {
    if (!suggestedFollowUp) return;
    
    console.log('✅ Acceptation question IA:', suggestedFollowUp.question);
    
    // Créer la question de suivi comme question SUPPLÉMENTAIRE (pas de remplacement)
    const followUpQuestion = {
      id: Date.now(),
      title: `💡 ${suggestedFollowUp.question.slice(0, 50)}...`, // Titre tronqué avec indicateur
      text: suggestedFollowUp.question,
      isAI: true,
      isFollowUp: true,
      isSupplementary: true, // Marquer comme supplémentaire
      trigger: suggestedFollowUp.specificElement,
      parentQuestionId: activeQuestion,
      confidence: suggestedFollowUp.confidence
    };
    
    // L'ajouter aux questions du chapitre actif SANS changer la question courante
    setChapters(prev => prev.map(chapter => 
      chapter.id === activeChapter
        ? { ...chapter, questions: [...chapter.questions, followUpQuestion] }
        : chapter
    ));
    
    // NE PAS changer la question active - laisser l'utilisateur la sélectionner manuellement
    // setActiveQuestion(followUpQuestion.id); // ← Ligne supprimée
    setSuggestedFollowUp(null);
    
    console.log('✅ Question supplémentaire ajoutée au chapitre - sélectionnez-la manuellement dans la sidebar');
  }, [suggestedFollowUp, activeChapter, activeQuestion]);

  const handleDeclineFollowUp = useCallback(() => {
    console.log('❌ Suggestion IA rejetée');
    setSuggestedFollowUp(null);
  }, []);

  // Lecture de la question (avec synthèse vocale si disponible)
  const playQuestion = useCallback(async (text) => {
    setState(prev => ({ ...prev, isPlayingQuestion: true }));
    
    // Utiliser la synthèse vocale si disponible
    if ('speechSynthesis' in window && text !== "Sélectionnez une question pour commencer l'enregistrement") {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      return new Promise((resolve) => {
        utterance.onend = () => {
          setState(prev => ({ ...prev, isPlayingQuestion: false }));
          resolve();
        };
        utterance.onerror = () => {
          setState(prev => ({ ...prev, isPlayingQuestion: false }));
          resolve();
        };
        
        speechSynthesis.speak(utterance);
      });
    } else {
      // Fallback : simulation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setState(prev => ({ ...prev, isPlayingQuestion: false }));
    }
  }, []);

  // Transcription avec OpenAI (uniquement à la fin de l'enregistrement)
  const transcribeAudioWithOpenAI = useCallback(async () => {
    try {
      console.log("Début de la transcription...");
      
      // Créer un blob audio à partir des chunks
      const audioBlob = new Blob(refs.current.audioChunks, { type: 'audio/webm' });
      
      console.log("Taille du fichier audio:", audioBlob.size, "bytes");
      
      // Créer un FormData pour l'envoi
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      
      // Envoyer à l'API
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log("Transcription réussie:", result.transcription);
        
        // Créer un nouveau segment avec la transcription
        const newSegment = {
          id: Date.now(),
          text: result.transcription,
          timestamp: Date.now(),
          questionId: activeQuestion
        };
        
        // Ajouter le segment au chapitre actif
        setChapters(prev => prev.map(chapter => 
          chapter.id === activeChapter
            ? { ...chapter, segments: [...chapter.segments, newSegment] }
            : chapter
        ));
        
        // NOUVEAU : Analyser la réponse pour suggérer une question de suivi
        analyzeResponseAndSuggestFollowUp(result.transcription);
        
      } else {
        console.error("Erreur transcription:", result.error);
        alert("Erreur lors de la transcription: " + result.error);
      }
      
    } catch (error) {
      console.error("Erreur transcription:", error);
      alert("Erreur lors de la transcription: " + error.message);
    } finally {
      setState(prev => ({ ...prev, isTranscribing: false }));
      refs.current.audioChunks = [];
    }
  }, [activeChapter, activeQuestion, analyzeResponseAndSuggestFollowUp]);

  // Démarrage de l'enregistrement simplifié (sans transcription temps réel)
  const startRecording = useCallback(async () => {
    try {
      console.log("Démarrage de l'enregistrement...");
      
      // Demander l'accès au microphone
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      });
      
      refs.current.audioStream = stream;
      refs.current.audioChunks = [];
      
      // Créer le MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      refs.current.mediaRecorder = mediaRecorder;
      
      // Collecter les chunks audio (sans transcription temps réel)
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          refs.current.audioChunks.push(event.data);
          console.log("Chunk audio reçu:", event.data.size, "bytes");
        }
      });
      
      // Quand l'enregistrement s'arrête, transcrire avec OpenAI
      mediaRecorder.addEventListener('stop', async () => {
        console.log("Enregistrement arrêté, début transcription...");
        await transcribeAudioWithOpenAI();
        // Nettoyer le stream
        stream.getTracks().forEach(track => track.stop());
      });
      
      // Analyse du niveau audio en temps réel
      refs.current.audioContext = new AudioContext();
      refs.current.analyser = refs.current.audioContext.createAnalyser();
      const source = refs.current.audioContext.createMediaStreamSource(stream);
      source.connect(refs.current.analyser);
      
      refs.current.analyser.fftSize = 256;
      const bufferLength = refs.current.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateAudioLevel = () => {
        if (!state.isRecording) return;
        
        refs.current.analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
        const normalizedLevel = Math.min(average / 128, 1);
        
        setState(prev => ({ ...prev, audioLevel: normalizedLevel }));
        refs.current.animationFrame = requestAnimationFrame(updateAudioLevel);
      };
      
      // Démarrer l'enregistrement
      mediaRecorder.start(1000); // Chunk toutes les secondes
      setState(prev => ({ ...prev, isRecording: true }));
      updateAudioLevel();
      
    } catch (error) {
      console.error("Erreur accès micro:", error);
      alert("Impossible d'accéder au microphone. Vérifiez les permissions.");
    }
  }, [state.isRecording, transcribeAudioWithOpenAI]);

  // Arrêt de l'enregistrement
  const stopRecording = useCallback(() => {
    console.log("Arrêt de l'enregistrement demandé...");
    
    if (refs.current.mediaRecorder && refs.current.mediaRecorder.state === 'recording') {
      refs.current.mediaRecorder.stop();
    }
    
    if (refs.current.animationFrame) {
      cancelAnimationFrame(refs.current.animationFrame);
    }
    
    if (refs.current.audioContext) {
      refs.current.audioContext.close();
    }
    
    setState(prev => ({ ...prev, isRecording: false, audioLevel: 0, isTranscribing: true }));
  }, []);

  // Gestion du clic principal
  const handleMainClick = useCallback(async () => {
    if (state.isPlayingQuestion || state.isTranscribing) return;
    
    if (!activeQuestion) {
      alert("Veuillez d'abord sélectionner une question dans la liste de gauche.");
      return;
    }
    
    if (!state.isRecording && state.countdown === null) {
      try {
        const questionText = getActiveQuestionText();
        await playQuestion(questionText);
        setState(prev => ({ ...prev, countdown: 3 }));
      } catch (error) {
        setState(prev => ({ ...prev, countdown: 3 }));
      }
    } else if (state.isRecording) {
      stopRecording();
    }
  }, [state.isRecording, state.countdown, state.isPlayingQuestion, state.isTranscribing, activeQuestion, playQuestion, stopRecording, getActiveQuestionText]);

  // === GESTION DES CHAPITRES ET QUESTIONS ===
  
  const handleChapterSelect = useCallback((chapterId) => {
    setActiveChapter(chapterId);
    // Réinitialiser la question active si on change de chapitre
    const newChapter = chapters.find(c => c.id === chapterId);
    if (newChapter && newChapter.questions && newChapter.questions.length > 0) {
      // Optionnel : sélectionner automatiquement la première question non répondue
      const unansweredQuestion = newChapter.questions.find(q => 
        !newChapter.segments.some(s => s.questionId === q.id)
      );
      if (unansweredQuestion) {
        setActiveQuestion(unansweredQuestion.id);
      } else {
        setActiveQuestion(newChapter.questions[0].id);
      }
    } else {
      setActiveQuestion(null);
    }
  }, [chapters]);

  const handleQuestionSelect = useCallback((questionId) => {
    setActiveQuestion(questionId);
  }, []);

  const handleNewChapter = useCallback(() => {
    const newChapter = {
      id: Date.now(),
      title: `Chapitre ${chapters.length + 1}`,
      segments: [],
      questions: [
        {
          id: Date.now() + 1,
          title: "Nouvelle question",
          text: "Racontez-nous un souvenir de cette période de votre vie."
        }
      ]
    };
    setChapters(prev => [...prev, newChapter]);
    setActiveChapter(newChapter.id);
    setActiveQuestion(newChapter.questions[0].id);
  }, [chapters.length]);

  const handleChapterRename = useCallback((chapterId, newTitle) => {
    setChapters(prev => prev.map(chapter => 
      chapter.id === chapterId ? { ...chapter, title: newTitle } : chapter
    ));
  }, []);

  const handleChapterDelete = useCallback((chapterId) => {
    if (chapters.length <= 1) return;
    setChapters(prev => prev.filter(chapter => chapter.id !== chapterId));
    if (activeChapter === chapterId) {
      const remainingChapters = chapters.filter(c => c.id !== chapterId);
      const newActiveChapter = remainingChapters[0];
      setActiveChapter(newActiveChapter.id);
      setActiveQuestion(newActiveChapter.questions?.[0]?.id || null);
    }
  }, [chapters, activeChapter]);

  const handleSegmentEdit = useCallback((segmentId, newText) => {
    setChapters(prev => prev.map(chapter => 
      chapter.id === activeChapter
        ? {
            ...chapter,
            segments: chapter.segments.map(segment =>
              segment.id === segmentId ? { ...segment, text: newText } : segment
            )
          }
        : chapter
    ));
  }, [activeChapter]);

  const handleSegmentDelete = useCallback((segmentId) => {
    setChapters(prev => prev.map(chapter => 
      chapter.id === activeChapter
        ? {
            ...chapter,
            segments: chapter.segments.filter(segment => segment.id !== segmentId)
          }
        : chapter
    ));
  }, [activeChapter]);

  // === FONCTION DE FALLBACK ===
  const generateFallbackHTML = useCallback((chapters) => {
    return `<h1 style="text-align: center; margin-bottom: 30px; color: #1f2937; font-size: 2em; font-family: serif;">Mon Histoire</h1>
${chapters.map((chapter, chapterIndex) => {
  if (chapter.segments.length === 0) return '';
  
  const segmentsByQuestion = chapter.segments.reduce((acc, segment) => {
    const questionId = segment.questionId;
    if (!acc[questionId]) acc[questionId] = [];
    acc[questionId].push(segment);
    return acc;
  }, {});

  const answeredQuestions = chapter.questions.filter(q => segmentsByQuestion[q.id]);

  return `
<h2 style="margin-top: 40px; margin-bottom: 20px; color: #1f2937; font-size: 1.5em; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; font-family: serif;">
  ${chapterIndex === 0 ? 'Préface' : `Chapitre ${chapterIndex}`} : ${chapter.title}
</h2>
${answeredQuestions.map(question => {
  const questionSegments = segmentsByQuestion[question.id];
  return `<p style="margin-bottom: 16px; text-align: justify; line-height: 1.8; color: #374151; font-family: serif;">${questionSegments.map(segment => segment.text.trim()).join(' ')}</p>`;
}).join('')}`;
}).join('')}

<div style="margin-top: 50px; padding: 20px; background-color: #f9fafb; border-radius: 8px; text-align: center;">
<p style="color: #6b7280; font-style: italic; font-family: serif;">Cette histoire a été créée à partir de vos souvenirs enregistrés avec Elior.</p>
</div>`;
  }, []);

  // === GÉNÉRATION DU RÉCIT AVEC IA ===
  const generateStoryAndOpenEditor = useCallback(async () => {
    const allSegments = chapters.flatMap(chapter => chapter.segments);
    if (allSegments.length === 0) return;
    
    setState(prev => ({ ...prev, isGenerating: true, generationStep: "Préparation des souvenirs..." }));
    
    try {
      setState(prev => ({ ...prev, generationStep: "Analyse de vos souvenirs..." }));
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const chaptersWithContent = chapters.filter(chapter => chapter.segments.length > 0);
      
      setState(prev => ({ ...prev, generationStep: "Réécriture par intelligence artificielle..." }));
      
      const response = await fetch('/api/rewrite-story/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          chapters: chaptersWithContent 
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setState(prev => ({ ...prev, generationStep: "Finalisation de votre livre..." }));
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setBookContent(result.rewrittenContent);
        setCurrentView('book_editor');
        
      } else {
        setState(prev => ({ ...prev, generationStep: "Génération de secours..." }));
        const fallbackHtml = generateFallbackHTML(chapters);
        setBookContent(fallbackHtml);
        setCurrentView('book_editor');
        
        alert('Erreur lors de la réécriture IA. Version simple générée.');
      }
      
    } catch (error) {
      console.error('Erreur lors de la réécriture:', error);
      
      setState(prev => ({ ...prev, generationStep: "Génération de secours..." }));
      const fallbackHtml = generateFallbackHTML(chapters);
      setBookContent(fallbackHtml);
      setCurrentView('book_editor');
      
      alert('Erreur de connexion. Version simple générée.');
    } finally {
      setState(prev => ({ ...prev, isGenerating: false, generationStep: "" }));
    }
  }, [chapters, generateFallbackHTML]);

  // === FONCTIONS LIVRE ===
  
  const saveBookDocument = useCallback(() => {
    const data = { content: bookContent, timestamp: Date.now() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elior-livre-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [bookContent]);

  const loadBookDocument = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            if (data.content) {
              setBookContent(data.content);
            }
          } catch (error) {
            alert('Erreur lors du chargement du fichier');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, []);

  const printBookDocument = useCallback(() => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Elior - Livre</title>
          <style>
            @media print {
              body { margin: 0; padding: 0; }
              @page { margin: 2cm; size: A4; }
            }
            body {
              font-family: serif;
              margin: 0;
              padding: 2cm;
              line-height: 1.6;
              color: #1f2937;
            }
            h1, h2 { color: #1f2937; }
            h1 { font-size: 24px; text-align: center; margin: 40px 0 20px 0; }
            h2 { font-size: 20px; margin: 30px 0 15px 0; }
            h3 { font-size: 16px; margin: 20px 0 10px 0; color: #6b7280; }
            p { margin: 16px 0; text-align: justify; }
            img { max-width: 100%; height: auto; margin: 20px auto; border-radius: 8px; }
          </style>
        </head>
        <body>${bookContent}</body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 250);
  }, [bookContent]);

  // === FONCTIONS COUVERTURE ===
  
  const saveCoverData = useCallback((newCoverData) => {
    setCoverData(newCoverData);
    
    // Sauvegarder automatiquement
    const data = { ...newCoverData, timestamp: Date.now() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elior-couverture-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  // === CALCULS DÉRIVÉS ===
  
  const currentChapter = chapters.find(c => c.id === activeChapter);
  const totalSegments = chapters.reduce((sum, chapter) => sum + chapter.segments.length, 0);

  // === RENDU PRINCIPAL ===
  
  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-gray-50 via-white to-orange-50/30 flex flex-col overflow-hidden">
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
      `}</style>

      <Header currentView={currentView} onViewChange={setCurrentView} />

      {state.isGenerating && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-4 relative overflow-hidden">
            
            {/* Animation de fond magique */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 via-pink-400/10 to-purple-400/10 animate-pulse"></div>
            
            {/* Particules flottantes */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute w-2 h-2 bg-orange-400 rounded-full opacity-60 animate-bounce" style={{ top: '20%', left: '15%', animationDelay: '0s' }}></div>
              <div className="absolute w-1.5 h-1.5 bg-pink-400 rounded-full opacity-40 animate-bounce" style={{ top: '60%', left: '80%', animationDelay: '0.5s' }}></div>
              <div className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-50 animate-bounce" style={{ top: '40%', left: '70%', animationDelay: '1s' }}></div>
              <div className="absolute w-1.5 h-1.5 bg-orange-400 rounded-full opacity-30 animate-bounce" style={{ top: '80%', left: '25%', animationDelay: '1.5s' }}></div>
            </div>

            {/* Contenu principal */}
            <div className="relative z-10">
              {/* Icône magique animée */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Texte principal avec animation */}
              <div className="text-center mb-4">
                <h3 className="text-xl font-medium text-gray-900 mb-2 animate-pulse">
                  ✨ La magie opère...
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {state.generationStep === "Analyse de vos souvenirs..." && "📖 Lecture attentive de vos souvenirs"}
                  {state.generationStep === "Réécriture par intelligence artificielle..." && "🖋️ Transformation en récit de grand-père"}
                  {state.generationStep === "Finalisation de votre livre..." && "📚 Mise en forme de votre histoire"}
                  {state.generationStep === "Génération de secours..." && "🔄 Création d'une version alternative"}
                  {!state.generationStep && "🌟 Préparation de la transformation"}
                </p>
              </div>

              {/* Barre de progression élégante */}
              <div className="w-full bg-gray-100 rounded-full h-3 mb-4 overflow-hidden">
                <div 
                  className="h-3 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{ 
                    width: state.generationStep === "Préparation des souvenirs..." ? "25%" :
                          state.generationStep === "Analyse de vos souvenirs..." ? "40%" :
                          state.generationStep === "Réécriture par intelligence artificielle..." ? "70%" :
                          state.generationStep === "Finalisation de votre livre..." ? "90%" :
                          state.generationStep === "Génération de secours..." ? "85%" : "10%"
                  }}
                >
                  {/* Animation de brillance */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
              </div>

              {/* Message d'encouragement */}
              <p className="text-center text-xs text-gray-500 italic">
                Votre histoire prend vie...
              </p>
            </div>
          </div>
        </div>
      )}

      {currentView === 'recorder' ? (
        // === VUE ENREGISTREUR ===
        <div className="flex-1 flex overflow-hidden">
          <ChapterSidebar
            chapters={chapters}
            activeChapter={activeChapter}
            activeQuestion={activeQuestion}
            onChapterSelect={handleChapterSelect}
            onQuestionSelect={handleQuestionSelect}
            onChapterRename={handleChapterRename}
            onChapterDelete={handleChapterDelete}
            onNewChapter={handleNewChapter}
            onGenerateStory={generateStoryAndOpenEditor}
            onSendToEditor={() => setCurrentView('book_editor')}
            isGenerating={state.isGenerating}
            totalSegments={totalSegments}
            bookTitle={bookTitle}
            authorName={authorName}
          />

          <RecordingCenter
            isRecording={state.isRecording}
            countdown={state.countdown}
            isPlayingQuestion={state.isPlayingQuestion}
            isTranscribing={state.isTranscribing}
            audioLevel={state.audioLevel}
            recordingProgress={state.recordingProgress}
            onMainClick={handleMainClick}
            currentQuestion={getActiveQuestionText()}
            hasQuestionSelected={!!activeQuestion}
            selectedQuestionTitle={getActiveQuestionTitle()}
            // Props pour l'IA
            isAnalyzingResponse={isAnalyzingResponse}
            suggestedFollowUp={suggestedFollowUp}
            onAcceptFollowUp={handleAcceptFollowUp}
            onDeclineFollowUp={handleDeclineFollowUp}
          />

          <TranscriptionArea
            chapter={currentChapter}
            activeQuestion={activeQuestion}
            onSegmentEdit={handleSegmentEdit}
            onSegmentDelete={handleSegmentDelete}
          />
        </div>
      ) : currentView === 'cover_editor' ? (
        // === VUE ÉDITEUR COUVERTURE ===
        <CoverEditor
          coverData={coverData}
          onSave={saveCoverData}
          onLoad={() => {}} // À implémenter si besoin
        />
      ) : (
        // === VUE ÉDITEUR LIVRE ===
        <BookEditor
          content={bookContent}
          chapters={chapters}
          generatedContent={bookContent}
          bookTitle={bookTitle}
          authorName={authorName}
          onChange={setBookContent}
          onSave={saveBookDocument}
          onLoad={loadBookDocument}
          onPrint={printBookDocument}
          zoom={zoom}
          onZoomChange={setZoom}
        />
      )}
    </div>
  );
}