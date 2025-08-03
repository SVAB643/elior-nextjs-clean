"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Sparkles, CreditCard, Lock, Star, ChevronRight, Zap, Crown, Play, Quote, User, BookOpen } from 'lucide-react';

export default function PurchasePage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Témoignages style carte flottante
  const testimonials = [
    {
      name: "Marie D.",
      role: "Retraitée",
      text: "En 2h, un livre de 68 pages. Mes petits-enfants ont adoré découvrir notre histoire.",
      avatar: "MD",
      rating: 5,
      time: "Il y a 2h"
    },
    {
      name: "Jean-P.",
      role: "Ingénieur",
      text: "L'IA a transformé mes souvenirs en véritable roman familial. Impressionnant.",
      avatar: "JP",
      rating: 5,
      time: "Il y a 5h"
    },
    {
      name: "Sophie L.",
      role: "Enseignante",
      text: "Mes enfants connaissent maintenant toute leur histoire. Résultat professionnel.",
      avatar: "SL",
      rating: 5,
      time: "Il y a 1j"
    },
    {
      name: "Claude M.",
      role: "Historien",
      text: "80 ans de vie retracés avec une qualité d'écriture époustouflante.",
      avatar: "CM",
      rating: 5,
      time: "Il y a 2j"
    },
    {
      name: "Anne B.",
      role: "Artiste",
      text: "Elior a donné vie à mes souvenirs d'enfance. Un vrai chef-d'œuvre littéraire.",
      avatar: "AB",
      rating: 5,
      time: "Il y a 3j"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const handlePurchase = async () => {
    if (!email.trim()) {
      alert('Veuillez entrer votre email');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setShowModal(true);
    }, 2000);
  };

  const handleModalClose = () => {
    setShowModal(false);
    const tempCode = `ELIOR-${Date.now().toString().slice(-6)}`;
    localStorage.setItem('elior_access', 'granted');
    alert(`Code d'accès généré: ${tempCode}\n\nBienvenue dans Elior !`);
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-white to-blue-50"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-yellow-200/15 to-blue-200/12 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-200/12 to-yellow-200/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Navigation minimaliste */}
      <nav className="relative z-10 flex items-center justify-between p-6 bg-white border-b border-yellow-100">
        <a href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-300/80 to-blue-300/60 rounded-lg flex items-center justify-center shadow-lg backdrop-blur-sm">
            <BookOpen className="text-white" size={18} />
          </div>
          <span className="text-xl font-light text-gray-900 tracking-wide">Elior</span>
        </a>
        <a href="/login" className="text-gray-600 hover:text-gray-900 transition-all duration-300 font-light text-sm">
          J'ai un code d'accès
        </a>
      </nav>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Colonne gauche - Témoignages flottants élégants */}
          <div className="relative h-[600px] overflow-hidden">
            
            {/* Animation fluide en cascade diagonale */}
            <div className="absolute inset-0">
              {testimonials.map((testimonial, index) => {
                const isActive = index === currentTestimonial;
                const nextIndex = (currentTestimonial + 1) % testimonials.length;
                const prevIndex = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
                
                let position = 'hidden';
                let scale = 0.8;
                let opacity = 0;
                let translateX = 0;
                let translateY = 0;
                let rotation = 0;
                
                if (index === currentTestimonial) {
                  // Témoignage principal - centre
                  position = 'center';
                  scale = 1;
                  opacity = 1;
                  translateX = 0;
                  translateY = 0;
                  rotation = 0;
                } else if (index === nextIndex) {
                  // Témoignage suivant - droite et légèrement en arrière
                  position = 'next';
                  scale = 0.85;
                  opacity = 0.6;
                  translateX = 120;
                  translateY = 20;
                  rotation = 8;
                } else if (index === prevIndex) {
                  // Témoignage précédent - gauche et en arrière
                  position = 'prev';
                  scale = 0.75;
                  opacity = 0.4;
                  translateX = -80;
                  translateY = 40;
                  rotation = -5;
                } else {
                  // Témoignages cachés
                  opacity = 0;
                  scale = 0.6;
                  translateY = 100;
                }
                
                return (
                  <div
                    key={index}
                    className="absolute top-1/2 left-1/2 w-80 transition-all duration-1000 ease-out"
                    style={{
                      transform: `translate(-50%, -50%) translateX(${translateX}px) translateY(${translateY}px) scale(${scale}) rotate(${rotation}deg)`,
                      opacity: opacity,
                      zIndex: isActive ? 10 : position === 'next' ? 9 : position === 'prev' ? 8 : 1
                    }}
                  >
                    <div className={`bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border transition-all duration-1000 ${
                      isActive ? 'border-yellow-200 shadow-2xl bg-white' : 'border-yellow-100/30'
                    }`}>
                      
                      {/* Header du témoignage */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-yellow-100 to-blue-100 rounded-full flex items-center justify-center border border-yellow-200/30 shadow-sm">
                            <span className="text-sm font-medium text-gray-600">{testimonial.avatar}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">{testimonial.name}</h4>
                            <p className="text-gray-500 text-xs font-light">{testimonial.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      
                      {/* Contenu du témoignage */}
                      <blockquote className="text-gray-700 text-sm leading-relaxed mb-3 font-light">
                        "{testimonial.text}"
                      </blockquote>
                      
                      {/* Footer avec temps */}
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="font-light">{testimonial.time}</span>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span className="font-light">Vérifié</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Particules flottantes pour l'ambiance */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-r from-yellow-200/20 to-blue-200/20 rounded-full animate-pulse"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${30 + (i % 3) * 20}%`,
                    animationDelay: `${i * 0.8}s`,
                    animationDuration: `${3 + i * 0.5}s`
                  }}
                ></div>
              ))}
            </div>

            {/* Indicateurs de progression élégants */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 bg-white/80 backdrop-blur-xl rounded-full px-4 py-2 border border-yellow-200/30">
              {testimonials.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    index === currentTestimonial 
                      ? 'bg-gradient-to-r from-yellow-500 to-blue-500 w-8' 
                      : 'bg-gray-300 w-1.5'
                  }`}
                ></div>
              ))}
            </div>

            {/* Badge social proof flottant */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xl rounded-2xl px-4 py-3 shadow-lg border border-yellow-200/30 animate-pulse">
              <div className="flex items-center space-x-2 text-sm">
                <div className="relative">
                  <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-blue-500 rounded-full"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-blue-500 rounded-full animate-ping opacity-20"></div>
                </div>
                <div>
                  <div className="text-gray-900 font-medium text-xs">73 personnes</div>
                  <div className="text-gray-500 font-light text-xs">ont rejoint aujourd'hui</div>
                </div>
              </div>
            </div>

            {/* Effet de profondeur avec ombres */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-white/5 pointer-events-none rounded-3xl"></div>
          </div>

          {/* Colonne droite - Formulaire sophistiqué */}
          <div className="max-w-md mx-auto w-full">
            
            {/* Header élégant */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-yellow-50 to-blue-50 border border-yellow-200/30 text-gray-700 text-sm font-light mb-6 backdrop-blur-sm">
                <Crown className="w-4 h-4 mr-2 text-yellow-600" />
                Accès Premium
              </div>
              
              <h1 className="text-3xl font-light text-gray-900 mb-3 tracking-tight">
                Rejoignez Elior
              </h1>
              <p className="text-gray-600 leading-relaxed font-light">
                Transformez vos souvenirs en livre professionnel avec l'IA
              </p>
            </div>

            {/* Card de formulaire */}
            <div className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl border border-yellow-200/20 overflow-hidden">
              
              {/* Header avec prix */}
              <div className="bg-gradient-to-r from-yellow-50/50 to-blue-50/40 p-6 border-b border-yellow-100/50">
                <div className="text-center">
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-light text-gray-900">49</span>
                    <span className="text-lg text-gray-700 ml-1">€</span>
                    <span className="text-base text-gray-400 line-through ml-4">79€</span>
                  </div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-yellow-100/60 to-blue-100/50 border border-yellow-200/30 text-gray-700 text-xs font-light">
                    Économisez 30€ · Accès à vie
                  </div>
                </div>
              </div>

              {/* Formulaire */}
              <div className="p-6">
                <div className="space-y-5">
                  
                  {/* Input email style uniforme */}
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Entrez votre adresse email"
                        className="w-full px-4 py-3 border border-yellow-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-300 focus:ring-2 focus:ring-yellow-400/50 transition-all duration-300 outline-none bg-white font-light"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          email.includes('@') ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                      </div>
                    </div>
                  </div>

                  {/* Inclusions compactes */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-gray-700 font-light">IA illimitée</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-gray-700 font-light">Export PDF</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-gray-700 font-light">Accès à vie</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-gray-700 font-light">Support VIP</span>
                    </div>
                  </div>

                  {/* CTA style uniforme */}
                  <button
                    onClick={handlePurchase}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-light py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl text-sm group"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Activation...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span>Obtenir l'accès maintenant</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    )}
                  </button>

                  {/* Mode démo compact */}
                  <div className="bg-gradient-to-r from-blue-50/60 to-yellow-50/50 border border-blue-200/30 rounded-xl p-3 backdrop-blur-sm">
                    <div className="flex items-center space-x-2 text-blue-700 mb-1">
                      <Play className="w-3 h-3" />
                      <span className="text-xs font-medium">MODE DÉMO</span>
                    </div>
                    <p className="text-xs text-blue-600 font-light">
                      Test gratuit · Aucun paiement requis
                    </p>
                  </div>
                </div>

                {/* Footer avec garanties */}
                <div className="mt-6 pt-4 border-t border-yellow-100">
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Lock className="w-3 h-3" />
                      <span className="font-light">Sécurisé</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <span className="font-light">Remboursé 30j</span>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <span className="font-light">Sans engagement</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Note de bas de page */}
            <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed font-light">
              En continuant, vous acceptez nos{' '}
              <a href="#" className="text-yellow-600 hover:text-blue-600 transition-colors">conditions d'utilisation</a>.
              <br />
              Paiement traité par Stripe. Aucun abonnement.
            </p>
          </div>
        </div>
      </div>

      {/* Modal success minimaliste */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-yellow-200/20 backdrop-blur-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              
              <h2 className="text-xl font-light text-gray-900 mb-3">
                Bienvenue dans Elior ! 🎉
              </h2>
              
              <p className="text-gray-600 mb-6 text-sm leading-relaxed font-light">
                Votre accès premium est activé.<br/>
                Prêt à créer votre livre ?
              </p>
              
              <button
                onClick={handleModalClose}
                className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-light py-3 px-4 rounded-xl transition-all duration-300 text-sm"
              >
                Commencer maintenant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}