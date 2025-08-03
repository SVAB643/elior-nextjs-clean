"use client";

import { useState } from 'react';
import { BookOpen, Lock, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Codes d'accès valides (temporaire - en production, ce sera dans une base de données)
  const validCodes = [
    'ELIOR-2024-ALPHA',
    'ELIOR-2024-BETA',
    'ELIOR-2024-GAMMA',
    'ELIOR-2024-DELTA',
    'ELIOR-2024-TEST',
    // Ajoutez vos codes ici
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simuler une vérification (remplacez par un appel API en production)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const codeFormatted = accessCode.toUpperCase().trim();
    
    if (validCodes.includes(codeFormatted)) {
      setSuccess(true);
      
      // Sauvegarder l'accès (localStorage temporaire - utilisez une vraie auth en production)
      localStorage.setItem('elior_access', 'granted');
      localStorage.setItem('elior_access_code', codeFormatted);
      
      // Redirection vers l'app
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
      
    } else {
      setError('Code d\'accès invalide. Vérifiez votre code ou contactez le support.');
    }
    
    setIsLoading(false);
  };

  const handlePurchase = () => {
    window.location.href = '/purchase';
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-white to-blue-50"></div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-yellow-200/20 to-blue-200/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-200/15 to-yellow-200/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl border border-yellow-200 p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-white" size={32} />
          </div>
          
          <h2 className="text-2xl font-light text-gray-900 mb-4">
            Accès validé ! 🎉
          </h2>
          
          <p className="text-gray-600 mb-6 font-light">
            Redirection vers votre espace Elior...
          </p>
          
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gradient-to-r from-yellow-500 to-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-white to-blue-50"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-yellow-200/20 to-blue-200/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-200/15 to-yellow-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-white border-b border-yellow-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-300/80 to-blue-300/60 rounded-lg flex items-center justify-center shadow-lg backdrop-blur-sm">
                <BookOpen className="text-white" size={18} />
              </div>
              <span className="text-xl font-light text-gray-900 tracking-wide">Elior</span>
            </a>
            
            <a 
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors font-light"
            >
              ← Retour à l'accueil
            </a>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="relative z-10 flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Lock className="text-white" size={24} />
            </div>
            
            <h1 className="text-3xl font-light text-gray-900 mb-2 tracking-tight">
              Accès à Elior
            </h1>
            
            <p className="text-gray-600 font-light">
              Entrez votre code d'accès pour commencer à créer votre livre
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl shadow-2xl border border-yellow-200/30 p-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="accessCode" className="block text-sm font-light text-gray-700 mb-2">
                  Code d'accès
                </label>
                <input
                  type="text"
                  id="accessCode"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="ELIOR-2024-XXXXX"
                  className="w-full px-4 py-3 border border-yellow-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-blue-300 text-center text-lg font-mono bg-white"
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
                  <AlertCircle size={16} />
                  <span className="text-sm font-light">{error}</span>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isLoading || !accessCode.trim()}
                className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white py-3 rounded-xl transition-all shadow-lg font-light flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    Accéder à Elior
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-yellow-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-light">ou</span>
              </div>
            </div>

            {/* Purchase Option */}
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600 font-light">
                Vous n'avez pas encore de code d'accès ?
              </p>
              
              <button
                onClick={handlePurchase}
                className="w-full border-2 border-yellow-300 hover:border-blue-400 text-gray-700 hover:text-blue-700 py-3 rounded-xl hover:bg-gradient-to-r hover:from-yellow-50 hover:to-blue-50 transition-all font-light"
              >
                Obtenir l'accès (49€)
              </button>
              
              <p className="text-xs text-gray-500 font-light">
                Accès immédiat • Paiement sécurisé • Satisfait ou remboursé
              </p>
            </div>
          </div>

          {/* Help */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 font-light">
              Besoin d'aide ? 
              <a href="mailto:support@elior.fr" className="text-yellow-600 hover:text-blue-600 ml-1 transition-colors">
                Contactez le support
              </a>
            </p>
          </div>

          {/* Demo Codes for Testing */}
          <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-200">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              🧪 Codes de test (développement)
            </h3>
            <div className="text-xs text-blue-700 space-y-1 font-light">
              <div>• ELIOR-2024-ALPHA</div>
              <div>• ELIOR-2024-BETA</div>
              <div>• ELIOR-2024-TEST</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}