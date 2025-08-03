"use client";

import { useState } from 'react';
import { BookOpen, Lock, ArrowRight, AlertCircle, CheckCircle, Mail, Key } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [accessCode, setAccessCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSignup, setIsSignup] = useState(true); // true = inscription, false = connexion

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (isSignup) {
        // Mode inscription : vérifier le code + créer le compte
        await handleSignup();
      } else {
        // Mode connexion : juste email + mot de passe
        await handleLogin();
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    }
    
    setIsLoading(false);
  };

  const handleSignup = async () => {
    const codeFormatted = accessCode.toUpperCase().trim();
    
    // 🔧 DEBUG - À supprimer après les tests
    console.log('Code recherché:', codeFormatted);

    // Test de connexion Supabase
    const { data: testData, error: testError } = await supabase
      .from('codes')
      .select('*');

    console.log('Tous les codes dans la base:', testData);
    console.log('Erreur de connexion:', testError);
    // FIN DU DEBUG 🔧
    
    // 1. Vérifier que le code existe et n'est pas utilisé
    const { data: codeData, error: codeError } = await supabase
      .from('codes')
      .select('*')
      .eq('code', codeFormatted)
      .eq('used', false)
      .single();

    console.log('Recherche du code spécifique:', { codeData, codeError });

    if (codeError || !codeData) {
      throw new Error('Code d\'accès invalide ou déjà utilisé.');
    }

    // 2. Créer l'utilisateur avec Supabase Auth
    const { error: signupError, data: signupData } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signupError) {
      throw new Error(signupError.message);
    }

    // 3. Marquer le code comme utilisé
    const { error: updateError } = await supabase
      .from('codes')
      .update({ 
        used: true, 
        used_by: signupData.user?.id 
      })
      .eq('id', codeData.id);

    if (updateError) {
      console.error('Erreur lors de la mise à jour du code:', updateError);
    }

    setSuccess(true);
    
    // Redirection vers l'app
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1500);
  };

  const handleLogin = async () => {
    // Connexion avec Supabase Auth
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    setSuccess(true);
    
    // Redirection vers l'app
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1500);
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
            {isSignup ? 'Compte créé ! 🎉' : 'Connexion réussie ! 🎉'}
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
              {isSignup ? 'Créer votre compte' : 'Connexion à Elior'}
            </h1>
            
            <p className="text-gray-600 font-light">
              {isSignup 
                ? 'Entrez vos informations et votre code d\'accès' 
                : 'Connectez-vous à votre espace Elior'
              }
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
            <button
              onClick={() => setIsSignup(true)}
              className={`flex-1 py-2 px-4 rounded-lg font-light text-sm transition-all ${
                isSignup 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Créer un compte
            </button>
            <button
              onClick={() => setIsSignup(false)}
              className={`flex-1 py-2 px-4 rounded-lg font-light text-sm transition-all ${
                !isSignup 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Se connecter
            </button>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl shadow-2xl border border-yellow-200/30 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-light text-gray-700 mb-2">
                  <Mail size={16} className="inline mr-2" />
                  Adresse email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full px-4 py-3 border border-yellow-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-blue-300 text-lg bg-white text-gray-900"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-light text-gray-700 mb-2">
                  <Key size={16} className="inline mr-2" />
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignup ? "Créez un mot de passe" : "Votre mot de passe"}
                  className="w-full px-4 py-3 border border-yellow-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-blue-300 text-lg bg-white text-gray-900"
                  required
                />
              </div>

              {/* Access Code (only for signup) */}
              {isSignup && (
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
                    className="w-full px-4 py-3 border border-yellow-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-blue-300 text-center text-lg font-mono bg-white text-gray-900"
                    required={isSignup}
                  />
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
                  <AlertCircle size={16} />
                  <span className="text-sm font-light">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !email.trim() || !password.trim() || (isSignup && !accessCode.trim())}
                className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white py-3 rounded-xl transition-all shadow-lg font-light flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    {isSignup ? 'Créer mon compte' : 'Se connecter'}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Divider (only for signup) */}
            {isSignup && (
              <>
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
                    type="button"
                    onClick={handlePurchase}
                    className="w-full border-2 border-yellow-300 hover:border-blue-400 text-gray-700 hover:text-blue-700 py-3 rounded-xl hover:bg-gradient-to-r hover:from-yellow-50 hover:to-blue-50 transition-all font-light"
                  >
                    Obtenir l'accès (49€)
                  </button>
                  
                  <p className="text-xs text-gray-500 font-light">
                    Accès immédiat • Paiement sécurisé • Satisfait ou remboursé
                  </p>
                </div>
              </>
            )}
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
        </div>
      </div>
    </div>
  );
}