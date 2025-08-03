"use client";

import { useState, useEffect } from 'react';
import { BookOpen, Mic, Sparkles, Check, Star, ArrowRight, Play, Users, Award, Zap, Quote, ChevronDown, Brain, Heart, Crown } from 'lucide-react';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [showVideo, setShowVideo] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showTransformation, setShowTransformation] = useState(false);

  const rawText = "Q: Pouvez-vous me parler de votre rencontre avec votre mari ?\n\nR: Ah... euh... c'était en 1962, j'avais 18 ans à l'époque. Il pleuvait ce matin-là et... comment dire... j'étais en retard pour aller au travail, à la boulangerie vous savez. Alors je courais sous la pluie et... paf ! Je suis tombée, mes courses partout sur le trottoir... (rires) C'est là qu'il est arrivé, comme... comme un ange gardien quoi ! Il m'a aidée à ramasser mes affaires et quand on s'est regardés... je sais pas comment expliquer mais j'ai su tout de suite que... que ma vie allait changer.";

  const transformedText = {
    title: "L'amour sous la pluie",
    content: "Les souvenirs les plus précieux naissent souvent des instants les plus inattendus. En cette matinée pluvieuse de 1962, une jeune femme de dix-huit ans pressait le pas vers son travail à la boulangerie, ignorant que le destin s'apprêtait à bouleverser sa vie.\n\nLa pluie tombait en cascade sur les pavés glissants de la ville. Dans sa hâte, elle perdit pied et chuta, ses courses se dispersant comme les pièces d'un puzzle sur le trottoir mouillé. C'est alors qu'une silhouette bienveillante émergea de la brume matinale.\n\nCet homme, qui deviendrait plus tard son compagnon de vie, s'agenouilla pour l'aider à rassembler ses affaires. Lorsque leurs regards se rencontrèrent pour la première fois, le temps sembla suspendu. En cet instant magique, sous la pluie battante, naissait une histoire d'amour qui traverserait les décennies..."
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < rawText.length) {
        setTypingText(rawText.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        setTimeout(() => {
          setShowTransformation(true);
        }, 2000);
        clearInterval(typingInterval);
      }
    }, 50);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(typingInterval);
    };
  }, []);

  const handleWaitlist = (e) => {
    e.preventDefault();
    alert(`Merci ${email} ! Vous serez notifié du lancement.`);
    setEmail('');
  };

  const handlePurchase = () => {
    window.location.href = '/purchase';
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrollY > 50 
          ? 'bg-white/95 backdrop-blur-xl border-b border-yellow-100/50' 
          : 'bg-transparent border-b border-white/20'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-300/80 via-blue-300/60 to-yellow-400/70 rounded-lg flex items-center justify-center shadow-lg backdrop-blur-sm">
                <BookOpen className="text-white" size={18} />
              </div>
              <span className={`text-xl font-light tracking-wide transition-colors duration-300 ${
                scrollY > 50 ? 'text-gray-900' : 'text-white'
              }`}>
                Elior
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#demo" className={`hover:text-opacity-80 transition-colors font-light ${
                scrollY > 50 ? 'text-gray-600 hover:text-gray-900' : 'text-white hover:text-white'
              }`}>
                Démo
              </a>
              <a href="#features" className={`hover:text-opacity-80 transition-colors font-light ${
                scrollY > 50 ? 'text-gray-600 hover:text-gray-900' : 'text-white hover:text-white'
              }`}>
                Fonctionnalités
              </a>
              <a href="#pricing" className={`hover:text-opacity-80 transition-colors font-light ${
                scrollY > 50 ? 'text-gray-600 hover:text-gray-900' : 'text-white hover:text-white'
              }`}>
                Tarifs
              </a>
              <a href="/login" className={`hover:text-opacity-80 transition-colors font-light ${
                scrollY > 50 ? 'text-gray-600 hover:text-gray-900' : 'text-white hover:text-white'
              }`}>
                Connexion
              </a>
              <button 
                onClick={handlePurchase}
                className={`px-6 py-2 rounded-lg transition-all font-light shadow-lg ${
                  scrollY > 50 
                    ? 'bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white'
                    : 'bg-white/20 border border-white/30 hover:bg-white/30 text-white'
                }`}
              >
                Commencer
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section avec Vidéo de Fond */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        
        {/* Vidéo de fond */}
        <iframe
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none'
          }}
          src="https://www.youtube.com/embed/23AnzV-TfZc?autoplay=1&mute=1&loop=1&playlist=23AnzV-TfZc&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&cc_load_policy=0&playsinline=1&enablejsapi=0"
          title="Elior Hero Video"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
        
        {/* Overlay pour la lisibilité */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        
        {/* Overlay dégradé subtil */}
        <div 
          className="absolute inset-0 z-20"
          style={{
            background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.4) 100%)'
          }}
        ></div>
        
        {/* Effets de particules subtils */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-white/8 via-white/4 to-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-white/4 via-white/8 to-white/6 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-40 max-w-6xl mx-auto px-6 py-32">
          <div className="text-center mb-20">
            
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-xl border border-white/20 text-gray-700 px-4 py-2 rounded-full text-sm font-light mb-8 shadow-lg">
              <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-blue-400 rounded-full animate-pulse"></div>
              Accès anticipé
            </div>
            
            <div className="space-y-2 mb-12">
              <h1 className="text-4xl lg:text-5xl font-extralight text-white tracking-tight leading-none drop-shadow-lg">
                Vos
              </h1>
              <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight leading-none drop-shadow-lg">
                SOUVENIRS
              </h1>
              <h1 className="text-4xl lg:text-5xl font-extralight text-white tracking-tight leading-none drop-shadow-lg">
                deviennent
              </h1>
              <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight leading-none drop-shadow-lg">
                LIVRE
              </h1>
            </div>
            
            <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed font-light mb-12 drop-shadow-md">
              L'intelligence artificielle transforme vos récits en chef-d'œuvre littéraire
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handlePurchase}
                className="bg-white/95 backdrop-blur-sm hover:bg-white text-gray-900 px-8 py-4 rounded-2xl transition-all text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 border border-white/20"
              >
                Créer mon livre
              </button>
              
              <button 
                onClick={() => document.getElementById('demo').scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 text-white px-8 py-4 rounded-2xl transition-all text-lg font-light hover:shadow-xl"
              >
                Voir la démo
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-2xl font-light text-white mb-2">2.5h</div>
              <p className="text-white/80 font-light text-sm">pour créer un livre</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-2xl font-light text-white mb-2">68 pages</div>
              <p className="text-white/80 font-light text-sm">en moyenne</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-2xl font-light text-white mb-2">98%</div>
              <p className="text-white/80 font-light text-sm">de satisfaction</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-40">
          <ChevronDown className="w-5 h-5 text-white/70" />
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-24 bg-gradient-to-br from-yellow-50/30 via-blue-50/20 to-yellow-100/35 relative overflow-hidden">
        
        <div className="absolute inset-0 bg-gradient-to-r from-black/3 via-transparent to-black/3"></div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-900 mb-4 tracking-tight">
              De la 
              <span className="font-bold bg-gradient-to-r from-yellow-600 to-blue-600 bg-clip-text text-transparent"> voix au livre </span>
              en quelques minutes
            </h2>
            <p className="text-lg text-gray-600 font-light">
              Parlez naturellement, Elior fait le reste
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            <div>
              <div className="bg-gradient-to-br from-yellow-50/70 via-white/90 to-blue-50/60 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-yellow-200/30 min-h-[450px] relative overflow-hidden">
                
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-yellow-100/50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-600 ml-4 font-light">Enregistrement en cours</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span>02:34</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-4 h-8">
                  {[...Array(30)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-t from-yellow-400 to-blue-500 rounded-full transition-all duration-300"
                      style={{
                        width: '3px',
                        height: `${Math.random() * 100 + 20}%`,
                        opacity: isTyping && i < (typingText.length / rawText.length) * 30 ? 1 : 0.3,
                        animationDelay: `${i * 0.1}s`
                      }}
                    ></div>
                  ))}
                </div>

                <div className="bg-gradient-to-br from-gray-50/60 to-blue-50/40 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-yellow-100/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Mic className="w-4 h-4 text-yellow-600" />
                    <span className="text-xs text-gray-600 font-medium">Transcription automatique</span>
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed font-mono">
                    {typingText}
                    {isTyping && <span className="animate-pulse">|</span>}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-blue-500 rounded-full flex items-center justify-center text-white shadow-lg">
                      <Play className="w-4 h-4 ml-0.5" />
                    </button>
                    <button className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                      <div className="w-3 h-3 bg-current rounded-sm"></div>
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    Qualité: <span className="text-green-600 font-medium">Excellent</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center">
              <div className={`transition-all duration-1000 ${showTransformation ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                <div className="bg-gradient-to-br from-yellow-500 to-blue-500 rounded-full p-3 shadow-2xl backdrop-blur-sm">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div>
              <div className={`bg-gradient-to-br from-blue-50/70 to-yellow-50/60 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-blue-200/30 min-h-[400px] transition-all duration-1000 relative overflow-hidden ${
                showTransformation ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-8'
              }`}>
                
                <div className="absolute inset-0 opacity-10 bg-gradient-to-tr from-yellow-200/20 to-blue-200/15 rounded-3xl"></div>
                
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-blue-100/50 relative z-10">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-600 ml-4 font-light">Livre Elior</span>
                </div>
                
                {showTransformation && (
                  <div className="space-y-4 relative z-10">
                    <h3 className="text-xl font-medium text-gray-900 border-b border-blue-100 pb-2">
                      {transformedText.title}
                    </h3>
                    <div className="text-gray-800 leading-relaxed font-light whitespace-pre-line text-sm">
                      {transformedText.content}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-8">
              <div className="text-center bg-gradient-to-br from-yellow-50/50 to-blue-50/30 backdrop-blur-xl rounded-2xl p-6 border border-yellow-200/20 shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium text-gray-900 text-sm">1. Vous parlez</h3>
                <p className="text-xs text-gray-600">Répondez aux questions à l'oral</p>
              </div>
              <div className="text-center bg-gradient-to-br from-blue-50/50 to-yellow-50/30 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/20 shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium text-gray-900 text-sm">2. IA transforme</h3>
                <p className="text-xs text-gray-600">Transcription → récit littéraire</p>
              </div>
              <div className="text-center bg-gradient-to-br from-yellow-100/50 to-blue-50/30 backdrop-blur-xl rounded-2xl p-6 border border-yellow-200/20 shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium text-gray-900 text-sm">3. Livre fini</h3>
                <p className="text-xs text-gray-600">Prêt à imprimer et partager</p>
              </div>
            </div>
            
            <div className="inline-flex items-center gap-8 text-transparent bg-gradient-to-r from-yellow-500 to-blue-600 bg-clip-text font-medium text-sm tracking-wide">
              <span>ORAL</span>
              <span>→</span>
              <span>TRANSCRIT</span>
              <span>→</span>
              <span>LITTÉRAIRE</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-gradient-to-br from-white via-yellow-50/20 to-blue-50/25 relative overflow-hidden">
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-32 left-20 w-64 h-64 bg-gradient-to-r from-yellow-200/10 via-blue-200/8 to-yellow-300/12 rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 right-20 w-80 h-80 bg-gradient-to-r from-blue-200/8 via-yellow-200/10 to-blue-300/12 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          
          <div className="text-center mb-20">
            <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
              Trois étapes.
              <span className="font-bold bg-gradient-to-r from-yellow-600 to-blue-600 bg-clip-text text-transparent"> UNE ŒUVRE. </span>
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-16">
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-yellow-50/60 to-blue-50/40 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-yellow-200/20 mb-8 hover:shadow-2xl transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-500">
                  <Mic className="text-white" size={24} />
                </div>
                <div className="text-6xl font-extralight text-gray-200 mb-4">01</div>
                <h3 className="text-2xl font-light text-gray-900 mb-4">Racontez</h3>
                <p className="text-gray-600 leading-relaxed font-light">
                  Parlez naturellement. Nos questions vous guident 
                  pour capturer l'essence de vos souvenirs.
                </p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-50/60 to-yellow-50/40 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-blue-200/20 mb-8 hover:shadow-2xl transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-500">
                  <Brain className="text-white" size={24} />
                </div>
                <div className="text-6xl font-extralight text-gray-200 mb-4">02</div>
                <h3 className="text-2xl font-light text-gray-900 mb-4">Transformez</h3>
                <p className="text-gray-600 leading-relaxed font-light">
                  L'IA structure et sublime vos récits. 
                  Votre voix, magnifiée par la technologie.
                </p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-yellow-100/60 to-blue-50/40 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-yellow-200/20 mb-8 hover:shadow-2xl transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-500">
                  <BookOpen className="text-white" size={24} />
                </div>
                <div className="text-6xl font-extralight text-gray-200 mb-4">03</div>
                <h3 className="text-2xl font-light text-gray-900 mb-4">Partagez</h3>
                <p className="text-gray-600 leading-relaxed font-light">
                  Votre livre est prêt. Imprimez, partagez, 
                  transmettez votre héritage familial.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gift Section */}
      <section className="py-24 bg-gradient-to-br from-yellow-50/20 via-white to-blue-50/15 relative overflow-hidden">
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-yellow-200/8 via-blue-200/5 to-yellow-300/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-blue-200/8 via-yellow-200/10 to-blue-300/8 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-5xl font-light text-gray-900 tracking-tight leading-tight">
                  Achetez maintenant,
                  <span className="font-bold bg-gradient-to-r from-yellow-600 to-blue-600 bg-clip-text text-transparent block">
                    Offrez quand vous voulez
                  </span>
                </h2>
                
                <p className="text-lg text-gray-600 leading-relaxed font-light max-w-lg">
                  Quand vous offrez Elior en cadeau, nous envoyons un message personnalisé à votre proche à la date que vous choisissez. Vous pouvez également imprimer une carte cadeau pré-conçue.
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={handlePurchase}
                  className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-8 py-4 rounded-2xl transition-all text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Acheter maintenant
                </button>
                
                <div className="flex items-center gap-3">
                  <button className="w-12 h-12 bg-white/60 hover:bg-white/80 backdrop-blur-sm border border-white/40 rounded-full flex items-center justify-center transition-all hover:shadow-lg group">
                    <ArrowRight className="w-5 h-5 text-gray-600 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <button className="w-12 h-12 bg-white/60 hover:bg-white/80 backdrop-blur-sm border border-white/40 rounded-full flex items-center justify-center transition-all hover:shadow-lg group">
                    <ArrowRight className="w-5 h-5 text-gray-600 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="flex gap-6 items-center justify-center">
                
                <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/30 hover:bg-white/60 transition-all duration-500 transform hover:-rotate-2 hover:scale-105">
                  <div className="w-64 h-80 bg-gradient-to-br from-yellow-50 to-blue-50 rounded-2xl shadow-lg flex items-center justify-center border border-yellow-200/30">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-blue-500 rounded-full mx-auto flex items-center justify-center">
                        <Heart className="w-8 h-8 text-white" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-medium text-gray-900">L'histoire de</h3>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-blue-600 bg-clip-text text-transparent">Grand-mère</h3>
                      </div>
                      <p className="text-sm text-gray-600 px-4 leading-relaxed">
                        Ses souvenirs d'enfance, ses rencontres, sa famille...
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/30 hover:bg-white/60 transition-all duration-500 transform hover:rotate-2 hover:scale-105">
                  <div className="w-64 h-80 bg-gradient-to-br from-blue-50 to-yellow-50 rounded-2xl shadow-lg flex items-center justify-center border border-blue-200/30">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-yellow-500 rounded-full mx-auto flex items-center justify-center">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-medium text-gray-900">Notre voyage</h3>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-yellow-600 bg-clip-text text-transparent">en famille</h3>
                      </div>
                      <p className="text-sm text-gray-600 px-4 leading-relaxed">
                        Deux générations, mille souvenirs à partager...
                      </p>
                    </div>
                  </div>
                </div>
                
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/40">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">Cadeau Premium</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-white via-blue-50/15 to-yellow-50/20 relative overflow-hidden">
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-200/8 via-yellow-200/5 to-blue-300/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-yellow-200/8 via-blue-200/10 to-yellow-300/8 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">
              Ils ont créé leur 
              <span className="font-bold bg-gradient-to-r from-yellow-600 to-blue-600 bg-clip-text text-transparent"> livre de famille </span>
            </h2>
            <p className="text-lg text-gray-600 font-light">
              Découvrez leurs témoignages authentiques
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 border border-white/30 hover:bg-white/90 hover:backdrop-blur-xl transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl group cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/80 to-blue-500/80 group-hover:from-yellow-400 group-hover:to-blue-500 rounded-full flex items-center justify-center text-white font-medium text-lg transition-all duration-700">
                  JP
                </div>
                <div>
                  <h3 className="font-medium text-gray-900/70 group-hover:text-gray-900 transition-all duration-700">Jean-Pierre</h3>
                  <p className="text-sm text-gray-600/60 group-hover:text-gray-600 transition-all duration-700">Ingénieur retraité</p>
                </div>
                <div className="ml-auto flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400/70 text-yellow-400/70 group-hover:fill-yellow-400 group-hover:text-yellow-400 transition-all duration-700" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700/60 group-hover:text-gray-700 leading-relaxed font-light mb-4 transition-all duration-700">
                "L'IA a transformé mes souvenirs en véritable roman familial. Impressionnant."
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500/50 group-hover:text-gray-500 transition-all duration-700">
                <span>Il y a 2h</span>
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-500/60 group-hover:text-emerald-500 transition-all duration-700" />
                  <span>Vérifié</span>
                </div>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 border border-white/30 hover:bg-white/90 hover:backdrop-blur-xl transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl group cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400/80 to-yellow-500/80 group-hover:from-blue-400 group-hover:to-yellow-500 rounded-full flex items-center justify-center text-white font-medium text-lg transition-all duration-700">
                  MC
                </div>
                <div>
                  <h3 className="font-medium text-gray-900/70 group-hover:text-gray-900 transition-all duration-700">Marie-Claire</h3>
                  <p className="text-sm text-gray-600/60 group-hover:text-gray-600 transition-all duration-700">Grand-mère</p>
                </div>
                <div className="ml-auto flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400/70 text-yellow-400/70 group-hover:fill-yellow-400 group-hover:text-yellow-400 transition-all duration-700" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700/60 group-hover:text-gray-700 leading-relaxed font-light mb-4 transition-all duration-700">
                "En 2h30, j'ai eu un livre de 68 pages sur mes enfants. C'est magique !"
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500/50 group-hover:text-gray-500 transition-all duration-700">
                <span>Il y a 1j</span>
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-500/60 group-hover:text-emerald-500 transition-all duration-700" />
                  <span>Vérifié</span>
                </div>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 border border-white/30 hover:bg-white/90 hover:backdrop-blur-xl transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl group cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/80 to-blue-400/80 group-hover:from-yellow-500 group-hover:to-blue-400 rounded-full flex items-center justify-center text-white font-medium text-lg transition-all duration-700">
                  PH
                </div>
                <div>
                  <h3 className="font-medium text-gray-900/70 group-hover:text-gray-900 transition-all duration-700">Philippe</h3>
                  <p className="text-sm text-gray-600/60 group-hover:text-gray-600 transition-all duration-700">Père de famille</p>
                </div>
                <div className="ml-auto flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400/70 text-yellow-400/70 group-hover:fill-yellow-400 group-hover:text-yellow-400 transition-all duration-700" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700/60 group-hover:text-gray-700 leading-relaxed font-light mb-4 transition-all duration-700">
                "Mes enfants ont adoré le livre sur leur grand-père. Très émouvant."
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500/50 group-hover:text-gray-500 transition-all duration-700">
                <span>Il y a 3j</span>
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-500/60 group-hover:text-emerald-500 transition-all duration-700" />
                  <span>Vérifié</span>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-6 bg-white/20 backdrop-blur-md hover:bg-white/80 rounded-2xl px-8 py-4 border border-white/30 hover:shadow-lg transition-all duration-700 group cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400/80 to-blue-500/80 group-hover:from-yellow-400 group-hover:to-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium transition-all duration-700">JP</div>
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400/80 to-yellow-500/80 group-hover:from-blue-400 group-hover:to-yellow-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium transition-all duration-700">MC</div>
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-500/80 to-blue-400/80 group-hover:from-yellow-500 group-hover:to-blue-400 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium transition-all duration-700">PH</div>
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500/80 to-yellow-400/80 group-hover:from-blue-500 group-hover:to-yellow-400 rounded-full border-2 border-white flex items-center justify-center text-gray-600/70 group-hover:text-gray-600 text-xs font-medium transition-all duration-700">+</div>
                </div>
                <span className="text-sm text-gray-700/70 group-hover:text-gray-700 font-light transition-all duration-700">147 familles satisfaites</span>
              </div>
              <div className="w-px h-6 bg-white/30 group-hover:bg-yellow-200/50 transition-all duration-700"></div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400/70 text-yellow-400/70 group-hover:fill-yellow-400 group-hover:text-yellow-400 transition-all duration-700" />
                  ))}
                </div>
                <span className="text-sm text-gray-700/70 group-hover:text-gray-700 font-light transition-all duration-700">4.9/5 étoiles</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-to-br from-yellow-50/25 via-blue-50/15 to-yellow-100/30 relative overflow-hidden">
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-yellow-200/10 via-blue-200/8 to-yellow-300/12 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-900 mb-4 tracking-tight">
              Un prix.
              <span className="font-bold bg-gradient-to-r from-yellow-600 to-blue-600 bg-clip-text text-transparent"> UNE VIE D'ACCÈS. </span>
            </h2>
            <p className="text-lg text-gray-600 font-light">
              Accès exclusif pour les 100 premiers membres
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-br from-yellow-200/15 to-blue-200/10 rounded-3xl blur-xl opacity-60"></div>
            <div className="relative bg-gradient-to-br from-white/90 to-blue-50/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-yellow-200/20 overflow-hidden max-w-md mx-auto">
              
              <div className="p-6 text-center border-b border-yellow-100/40 bg-gradient-to-br from-yellow-50/30 to-blue-50/20 backdrop-blur-sm">
                <h3 className="text-xl font-light text-gray-900 mb-3">Elior Premium</h3>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-4xl font-light text-gray-900">49</span>
                  <span className="text-lg text-gray-600">€</span>
                  <span className="text-base text-gray-400 line-through ml-3">99€</span>
                </div>
                <p className="text-gray-600 font-light text-sm">Paiement unique • Accès à vie</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <Check className="text-emerald-600 flex-shrink-0" size={16} />
                    <span className="font-light text-gray-700 text-sm">Livres illimités</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="text-emerald-600 flex-shrink-0" size={16} />
                    <span className="font-light text-gray-700 text-sm">IA avancée</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="text-emerald-600 flex-shrink-0" size={16} />
                    <span className="font-light text-gray-700 text-sm">Export PDF</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="text-emerald-600 flex-shrink-0" size={16} />
                    <span className="font-light text-gray-700 text-sm">Support prioritaire</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="text-emerald-600 flex-shrink-0" size={16} />
                    <span className="font-light text-gray-700 text-sm">Mises à jour</span>
                  </div>
                </div>
                
                <button 
                  onClick={handlePurchase}
                  className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white py-3 rounded-lg transition-all text-base font-light shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Commencer maintenant
                </button>
                
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500 font-light">
                    Paiement sécurisé • Garantie 30 jours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-slate-900 to-blue-900/90 text-white overflow-hidden relative">
        
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-yellow-900/5 to-blue-900/10"></div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-yellow-500/5 via-blue-500/3 to-yellow-600/8 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-500/3 via-yellow-500/5 to-blue-600/8 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          
          <div className="mb-12">
            <h2 className="text-4xl lg:text-5xl font-extralight mb-3 tracking-tight">
              VOTRE
            </h2>
            <h2 className="text-4xl lg:text-5xl font-bold mb-3 tracking-tight bg-gradient-to-r from-yellow-200 to-blue-200 bg-clip-text text-transparent">
              HISTOIRE
            </h2>
            <h2 className="text-4xl lg:text-5xl font-extralight tracking-tight">
              MÉRITE D'ÊTRE
            </h2>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-yellow-200 to-blue-200 bg-clip-text text-transparent">
              RACONTÉE
            </h2>
          </div>
          
          <p className="text-lg mb-10 opacity-90 font-light max-w-2xl mx-auto leading-relaxed">
            Rejoignez les visionnaires qui transforment leurs souvenirs en héritage littéraire
          </p>
          
          <div className="bg-gradient-to-br from-yellow-50/10 to-blue-50/5 backdrop-blur-xl rounded-2xl p-6 border border-yellow-200/10 max-w-md mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="flex-1 px-5 py-3 rounded-lg text-gray-900 focus:outline-none bg-white/90 backdrop-blur-sm font-light text-sm"
              />
              <button 
                onClick={handleWaitlist}
                className="bg-gradient-to-br from-yellow-400 to-blue-400 hover:from-yellow-500 hover:to-blue-500 text-white px-6 py-3 rounded-lg transition-all duration-500 font-light whitespace-nowrap shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-sm text-sm"
              >
                Me notifier
              </button>
            </div>
          </div>

          <p className="text-xs opacity-75 font-light">
            Plus que <span className="bg-gradient-to-r from-yellow-200 to-blue-200 bg-clip-text text-transparent font-medium">27 places</span> disponibles
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-white via-yellow-50/10 to-blue-50/15 border-t border-yellow-100/30">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-12">
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-500/80 via-blue-500/60 to-yellow-600/80 rounded-lg flex items-center justify-center shadow-lg backdrop-blur-sm">
                  <BookOpen className="text-white" size={18} />
                </div>
                <span className="text-xl font-light text-gray-900 tracking-wide">
                  Elior
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed font-light">
                Transformez vos souvenirs en livre avec l'intelligence artificielle.
              </p>
            </div>
            
            <div>
              <h4 className="font-light text-gray-900 mb-4">Produit</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-gray-600 hover:bg-gradient-to-r hover:from-yellow-600/70 hover:via-blue-600/60 hover:to-yellow-700/70 hover:bg-clip-text hover:text-transparent transition-all duration-300 font-light">Fonctionnalités</a></li>
                <li><a href="#pricing" className="text-gray-600 hover:bg-gradient-to-r hover:from-yellow-600/70 hover:via-blue-600/60 hover:to-yellow-700/70 hover:bg-clip-text hover:text-transparent transition-all duration-300 font-light">Tarifs</a></li>
                <li><a href="/login" className="text-gray-600 hover:bg-gradient-to-r hover:from-yellow-600/70 hover:via-blue-600/60 hover:to-yellow-700/70 hover:bg-clip-text hover:text-transparent transition-all duration-300 font-light">Connexion</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-light text-gray-900 mb-4">Support</h4>
              <ul className="space-y-3">
                <li><a href="mailto:hello@elior.fr" className="text-gray-600 hover:bg-gradient-to-r hover:from-yellow-600/70 hover:via-blue-600/60 hover:to-yellow-700/70 hover:bg-clip-text hover:text-transparent transition-all duration-300 font-light">Contact</a></li>
                <li><a href="#" className="text-gray-600 hover:bg-gradient-to-r hover:from-yellow-600/70 hover:via-blue-600/60 hover:to-yellow-700/70 hover:bg-clip-text hover:text-transparent transition-all duration-300 font-light">FAQ</a></li>
                <li><a href="#" className="text-gray-600 hover:bg-gradient-to-r hover:from-yellow-600/70 hover:via-blue-600/60 hover:to-yellow-700/70 hover:bg-clip-text hover:text-transparent transition-all duration-300 font-light">Guide</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-yellow-100/30 mt-12 pt-8 text-center">
            <p className="text-gray-500 text-sm font-light">
              &copy; 2024 Elior. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}