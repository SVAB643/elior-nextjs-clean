// src/components/interview/AdaptiveInterviewContainer.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import { ChapterSidebar } from "./ChapterSidebar";
import { RecordingCenter } from "./RecordingCenter";
import { TranscriptionArea } from "./TranscriptionArea";

export const AdaptiveInterviewContainer = ({ 
  bookTitle = "Mon Livre",
  authorName = "",
  onViewChange,
  onSendToEditor 
}) => {
  // États existants
  const [chapters, setChapters] = useState([
    {
      id: '1',
      title: '👶 Enfance et origines',
      questions: [
        {
          id: 'q1',
          title: 'Où avez-vous grandi ?',
          text: 'Parlez-moi de l\'endroit où vous avez passé votre enfance. Qu\'est-ce qui rendait ce lieu spécial ?'
        },
        {
          id: 'q2', 
          title: 'Vos premiers souvenirs',
          text: 'Quels sont vos tout premiers souvenirs d\'enfance ? Y a-t-il une image, une odeur, un moment qui vous revient clairement ?'
        },
        {
          id: 'q3',
          title: 'Votre famille',
          text: 'Décrivez-moi votre famille. Qui étaient les personnages marquants de votre entourage ?'
        }
      ],
      segments: []
    }
  ]);

  const [activeChapter, setActiveChapter] = useState('1');
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // États d'enregistrement
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isPlayingQuestion, setIsPlayingQuestion] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordingProgress, setRecordingProgress] = useState(0);

  // NOUVEAUX ÉTATS pour IA adaptative
  const [partialTranscription, setPartialTranscription] = useState('');
  const [isAnalyzingResponse, setIsAnalyzingResponse] = useState(false);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [aiQuestions, setAiQuestions] = useState([]); // Questions générées par IA

  // Refs pour enregistrement
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const recordingStartTime = useRef(null);
  const progressInterval = useRef(null);

  // Initialiser l'audio context pour le niveau audio
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Gérer la sélection de question
  const handleQuestionSelect = (questionId) => {
    const chapter = chapters.find(c => c.id === activeChapter);
    if (!chapter) return;

    // Chercher d'abord dans les questions fixes
    let question = chapter.questions.find(q => q.id === questionId);
    
    // Si pas trouvé, chercher dans les questions IA
    if (!question) {
      question = aiQuestions.find(q => q.id === questionId);
    }

    if (question) {
      setActiveQuestion(questionId);
      setCurrentQuestion(question);
      console.log('Question sélectionnée:', question);
    }
  };

  // NOUVELLE FONCTION : Gérer les questions IA acceptées
  const handleTranscriptionComplete = (aiQuestion) => {
    if (aiQuestion && aiQuestion.isAI) {
      // Ajouter la question IA à la liste
      setAiQuestions(prev => [...prev, aiQuestion]);
      
      // Ajouter au chapitre actif
      setChapters(prev => prev.map(chapter => {
        if (chapter.id === activeChapter) {
          return {
            ...chapter,
            questions: [...chapter.questions, aiQuestion]
          };
        }
        return chapter;
      }));

      // Sélectionner automatiquement la nouvelle question IA
      setActiveQuestion(aiQuestion.id);
      setCurrentQuestion(aiQuestion);
      
      // Ajouter à l'historique de session
      setSessionHistory(prev => [...prev, aiQuestion.title]);
      
      console.log('✨ Question IA ajoutée et sélectionnée:', aiQuestion);
    }
  };

  // Obtenir l'accès au microphone
  const startRecording = async () => {
    try {
      console.log('🎤 Démarrage de l\'enregistrement...');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;

      // Configurer l'analyse audio pour le niveau
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      // Démarrer l'animation du niveau audio
      updateAudioLevel();

      // Configurer MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log('⏹️ Enregistrement arrêté, traitement...');
        setIsRecording(false);
        setIsTranscribing(true);
        setRecordingProgress(0);

        if (progressInterval.current) {
          clearInterval(progressInterval.current);
        }

        // Arrêter l'analyse audio
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }

        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
      };

      // Démarrer l'enregistrement
      mediaRecorder.start();
      setIsRecording(true);
      recordingStartTime.current = Date.now();

      // Démarrer le compteur de progression
      progressInterval.current = setInterval(() => {
        const elapsed = Date.now() - recordingStartTime.current;
        const progress = Math.min((elapsed / 30000) * 100, 100); // 30 secondes max
        setRecordingProgress(progress);
        
        if (progress >= 100) {
          stopRecording();
        }
      }, 100);

    } catch (error) {
      console.error('❌ Erreur accès microphone:', error);
      alert('Impossible d\'accéder au microphone. Vérifiez les permissions.');
    }
  };

  // Arrêter l'enregistrement
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  // Mise à jour du niveau audio
  const updateAudioLevel = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    const average = dataArray.reduce((a, b) => a + b) / bufferLength;
    setAudioLevel(average / 255);

    animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
  };

  // Transcription audio
  const transcribeAudio = async (audioBlob) => {
    try {
      console.log('🔤 Transcription en cours...');
      
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success && result.transcription) {
        const transcription = result.transcription.trim();
        console.log('✅ Transcription reçue:', transcription);
        
        setPartialTranscription(transcription);
        
        // Sauvegarder le segment
        const segment = {
          id: Date.now().toString(),
          questionId: activeQuestion,
          text: transcription,
          timestamp: new Date().toISOString(),
          audioBlob: audioBlob
        };

        setChapters(prev => prev.map(chapter => {
          if (chapter.id === activeChapter) {
            return {
              ...chapter,
              segments: [...(chapter.segments || []), segment]
            };
          }
          return chapter;
        }));

        // Ajouter à l'historique de session
        setSessionHistory(prev => [...prev, currentQuestion?.title || 'Question inconnue']);
        
        console.log('✅ Segment sauvegardé');
      } else {
        console.error('❌ Erreur transcription:', result.error);
        alert('Erreur lors de la transcription: ' + (result.error || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('❌ Erreur transcription:', error);
      alert('Erreur lors de la transcription');
    } finally {
      setIsTranscribing(false);
      
      // Déclencher l'analyse IA après un délai
      setTimeout(() => {
        setIsAnalyzingResponse(true);
      }, 1000);
    }
  };

  // Gestion du clic principal
  const handleMainClick = () => {
    if (!currentQuestion) {
      alert('Veuillez d\'abord sélectionner une question');
      return;
    }

    if (isRecording) {
      stopRecording();
    } else if (!isTranscribing && !isPlayingQuestion) {
      startCountdown();
    }
  };

  // Décompte avant enregistrement
  const startCountdown = () => {
    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setCountdown(null);
          startRecording();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Gestion des chapitres
  const handleChapterSelect = (chapterId) => {
    setActiveChapter(chapterId);
    setActiveQuestion(null);
    setCurrentQuestion(null);
    setPartialTranscription('');
  };

  const handleNewChapter = () => {
    const newChapter = {
      id: Date.now().toString(),
      title: `📖 Nouveau chapitre`,
      questions: [],
      segments: []
    };
    setChapters(prev => [...prev, newChapter]);
  };

  const handleChapterRename = (chapterId, newTitle) => {
    setChapters(prev => prev.map(chapter => 
      chapter.id === chapterId ? { ...chapter, title: newTitle } : chapter
    ));
  };

  const handleChapterDelete = (chapterId) => {
    if (chapters.length <= 1) return;
    setChapters(prev => prev.filter(chapter => chapter.id !== chapterId));
    if (activeChapter === chapterId) {
      setActiveChapter(chapters[0].id);
    }
  };

  // Gestion des segments
  const handleSegmentEdit = (segmentId, newText) => {
    setChapters(prev => prev.map(chapter => ({
      ...chapter,
      segments: chapter.segments?.map(segment =>
        segment.id === segmentId ? { ...segment, text: newText } : segment
      ) || []
    })));
  };

  const handleSegmentDelete = (segmentId) => {
    setChapters(prev => prev.map(chapter => ({
      ...chapter,
      segments: chapter.segments?.filter(segment => segment.id !== segmentId) || []
    })));
  };

  // Génération de l'histoire
  const handleGenerateStory = async () => {
    console.log('📖 Génération de l\'histoire...');
    // Logique de génération à implémenter
  };

  // Calculer le nombre total de segments
  const totalSegments = chapters.reduce((total, chapter) => {
    return total + (chapter.segments?.length || 0);
  }, 0);

  // Obtenir la question actuelle
  const activeChapterData = chapters.find(c => c.id === activeChapter);
  const selectedQuestionTitle = currentQuestion?.title || '';
  const hasQuestionSelected = !!currentQuestion;

  // Nettoyage
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar des chapitres */}
      <ChapterSidebar
        chapters={chapters}
        activeChapter={activeChapter}
        activeQuestion={activeQuestion}
        onChapterSelect={handleChapterSelect}
        onQuestionSelect={handleQuestionSelect}
        onChapterRename={handleChapterRename}
        onChapterDelete={handleChapterDelete}
        onNewChapter={handleNewChapter}
        onGenerateStory={handleGenerateStory}
        onSendToEditor={onSendToEditor}
        isGenerating={false}
        totalSegments={totalSegments}
        bookTitle={bookTitle}
        authorName={authorName}
      />

      {/* Zone centrale d'enregistrement */}
      <RecordingCenter
        isRecording={isRecording}
        countdown={countdown}
        isPlayingQuestion={isPlayingQuestion}
        isTranscribing={isTranscribing}
        audioLevel={audioLevel}
        recordingProgress={recordingProgress}
        onMainClick={handleMainClick}
        currentQuestion={currentQuestion}
        hasQuestionSelected={hasQuestionSelected}
        selectedQuestionTitle={selectedQuestionTitle}
        partialTranscription={partialTranscription}
        isAnalyzingResponse={isAnalyzingResponse}
        onTranscriptionComplete={handleTranscriptionComplete}
        sessionHistory={sessionHistory}
      />

      {/* Zone de transcription */}
      <TranscriptionArea
        chapter={activeChapterData}
        activeQuestion={activeQuestion}
        onSegmentEdit={handleSegmentEdit}
        onSegmentDelete={handleSegmentDelete}
      />
    </div>
  );
};