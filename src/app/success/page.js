"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BookOpen, CheckCircle, Copy, Mail, ArrowRight, Sparkles } from 'lucide-react';

function SuccessContent() {
  const [accessCode, setAccessCode] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const preCode = searchParams.get('code');

  useEffect(() => {
    if (sessionId) {
      verifyPaymentAndCreateCode();
    } else {
      setError('Session de paiement introuvable');
      setIsLoading(false);
    }
  }, [sessionId]);

  const verifyPaymentAndCreateCode = async () => {
    try {
      console.log('🔍 Vérification du paiement pour session:', sessionId);
      
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, preCode }),
      });

      const result = await response.json();
      console.log('📋 Résultat vérification:', result);

      if (result.success) {
        setAccessCode(result.code);
        setEmail(result.email);
        console.log('✅ Code d\'accès généré:', result.code);
      } else {
        setError(result.error || 'Erreur lors de la vérification du paiement');
        console.error('❌ Erreur vérification:', result.error);
      }
    } catch (error) {
      console.error('❌ Erreur réseau:', error);
      setError('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(accessCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback pour les navigateurs qui ne supportent pas clipboard
      const textArea = document.createElement('textarea');
      textArea.value = accessCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const goToLogin = () => {
    window.location.href = '/login';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-white to-blue-50"></div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-yellow-200/20 to-blue-200/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-200/15 to-yellow-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl border border-yellow-200 p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          
          <h2 className="text-2xl font-light text-gray-900 mb-4">
            Vérification du paiement...
          </h2>
          
          <p className="text-gray-600 font-light">
            Création de votre code d'accès personnel
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-orange-50"></div>
        
        <div className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl border border-red-200 p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-2xl">⚠️</span>
          </div>
          
          <h2 className="text-2xl font-light text-gray-900 mb-4">
            Erreur de vérification
          </h2>
          
          <p className="text-gray-600 font-light mb-6">
            {error}
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition-all font-light"
            >
              Réessayer
            </button>
            
            <a
              href="mailto:support@elior.fr"
              className="block w-full border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-all font-light"
            >
              Contacter le support
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-green-200/20 to-emerald-200/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-emerald-200/15 to-green-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Particules de célébration */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-green-400 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-white border-b border-green-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-300/80 to-emerald-300/60 rounded-lg flex items-center justify-center shadow-lg backdrop-blur-sm">
                <BookOpen className="text-white" size={18} />
              </div>
              <span className="text-xl font-light text-gray-900 tracking-wide">Elior</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <div className="relative z-10 flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl w-full">
          
          {/* Header de succès */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative">
              <CheckCircle className="text-white" size={32} />
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping opacity-20"></div>
            </div>
            
            <h1 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">
              🎉 Paiement réussi !
            </h1>
            
            <p className="text-xl text-gray-600 font-light leading-relaxed">
              Votre accès à Elior a été activé avec succès
            </p>
          </div>

          {/* Carte principale */}
          <div className="bg-white rounded-3xl shadow-2xl border border-green-200/30 overflow-hidden">
            
            {/* En-tête de la carte */}
            <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/60 p-8 border-b border-green-100/50">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="text-green-600" size={24} />
                <h2 className="text-2xl font-light text-gray-900">Votre code d'accès</h2>
                <Sparkles className="text-green-600" size={24} />
              </div>
              
              <p className="text-center text-gray-600 font-light">
                Conservez précieusement ce code pour accéder à votre espace Elior
              </p>
            </div>

            {/* Corps de la carte */}
            <div className="p-8 space-y-8">
              
              {/* Code d'accès */}
              <div className="text-center">
                <label className="block text-sm font-light text-gray-700 mb-4">
                  Votre code d'accès personnel
                </label>
                
                <div className="relative">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-green-200 rounded-xl p-6 font-mono text-2xl text-center text-gray-900 tracking-widest font-bold shadow-inner">
                    {accessCode}
                  </div>
                  
                  <button
                    onClick={copyCode}
                    className={`absolute top-2 right-2 p-2 rounded-lg transition-all ${
                      copied 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                    title={copied ? 'Copié !' : 'Copier le code'}
                  >
                    {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                  </button>
                </div>
                
                {copied && (
                  <p className="text-green-600 text-sm mt-2 font-light animate-pulse">
                    ✓ Code copié dans le presse-papiers !
                  </p>
                )}
              </div>

              {/* Email de confirmation */}
              {email && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Mail className="text-blue-600" size={20} />
                    <h3 className="font-medium text-gray-900">Email de confirmation</h3>
                  </div>
                  
                  <p className="text-sm text-gray-600 font-light">
                    Un email de confirmation avec votre code d'accès a été envoyé à{' '}
                    <span className="font-medium text-gray-900">{email}</span>
                  </p>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h3 className="font-medium text-gray-900 mb-3">📋 Prochaines étapes</h3>
                
                <ol className="space-y-2 text-sm text-gray-600 font-light">
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <span>Cliquez sur "Accéder à Elior" ci-dessous</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <span>Créez votre compte avec votre email et un mot de passe</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <span>Entrez votre code d'accès pour activer votre compte</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                    <span>Commencez à créer votre biographie !</span>
                  </li>
                </ol>
              </div>

              {/* Bouton d'action */}
              <button
                onClick={goToLogin}
                className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white py-4 rounded-xl transition-all shadow-lg font-light flex items-center justify-center gap-3 transform hover:scale-105"
              >
                <BookOpen size={20} />
                <span>Accéder à Elior</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* Support */}
          <div className="text-center mt-12">
            <p className="text-sm text-gray-500 font-light">
              Besoin d'aide ? 
              <a href="mailto:support@elior.fr" className="text-green-600 hover:text-emerald-600 ml-1 transition-colors">
                Contactez notre support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}