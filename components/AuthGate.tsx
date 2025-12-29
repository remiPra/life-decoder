import React, { useState } from 'react';
import { SignIn, useAuth } from '@clerk/clerk-react';
import TermsModal from './TermsModal';

export default function AuthGate({
  children,
  allowFreeAccess = false
}: {
  children: React.ReactNode;
  allowFreeAccess?: boolean;
}) {
  const { isSignedIn, isLoaded } = useAuth();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Chargement
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-radial flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-500 text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  // Non connecté - afficher la page de connexion avec message (sauf si accès gratuit autorisé)
  if (!isSignedIn && !allowFreeAccess) {
    return (
      <div className="min-h-screen bg-radial flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8 fade-in">
            <h1 className="text-5xl font-serif text-[#C5A059] gold-glow mb-4">
              LIFE DECODER
            </h1>
            <p className="text-stone-300 text-base mb-2">
              Bienvenue
            </p>
            <p className="text-stone-400 text-sm tracking-wider">
              Connecte-toi pour accéder à l'app
            </p>
          </div>

          {/* Terms Checkbox */}
          <div className="mb-6 glass p-6 rounded-2xl gold-border">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-2 border-[#C5A059] bg-transparent checked:bg-[#C5A059] cursor-pointer flex-shrink-0"
              />
              <span className="text-sm text-stone-300 leading-relaxed">
                J'accepte les{' '}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowTermsModal(true);
                  }}
                  className="text-[#C5A059] hover:text-[#D4AF37] underline transition-colors font-medium"
                >
                  Conditions Générales d'Utilisation
                </button>{' '}
                de Life Decoder
              </span>
            </label>
          </div>

          {/* Clerk Sign In Component with custom styling - Only show if terms accepted */}
          {termsAccepted ? (
            <div className="clerk-auth-container">
              <SignIn
                appearance={{
                  elements: {
                    rootBox: "mx-auto",
                    card: "glass gold-border rounded-3xl shadow-2xl",
                    headerTitle: "text-[#C5A059] font-serif",
                    headerSubtitle: "text-stone-400",
                    socialButtonsBlockButton: "glass gold-border hover:bg-[#C5A059]/10 transition-all",
                    formButtonPrimary: "bg-[#C5A059] hover:bg-[#D4AF37] text-black font-bold",
                    footerActionLink: "text-[#C5A059] hover:text-[#D4AF37]",
                    formFieldInput: "glass border-stone-700 focus:border-[#C5A059] text-white",
                    formFieldLabel: "text-stone-400",
                    dividerLine: "bg-stone-700",
                    dividerText: "text-stone-500",
                  },
                  variables: {
                    colorPrimary: "#C5A059",
                    colorBackground: "#121212",
                    colorText: "#e5e5e5",
                    colorInputBackground: "#1a1a1a",
                    colorInputText: "#e5e5e5",
                  }
                }}
              />
            </div>
          ) : (
            <div className="glass p-8 rounded-3xl gold-border text-center">
              <div className="text-4xl mb-4">📜</div>
              <p className="text-stone-400 text-sm">
                Accepte les conditions générales pour continuer
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-8 text-stone-600 text-xs">
            <p>Gratuit · Sécurisé · Confidentiel</p>
            <p className="mt-2">Sauvegarde automatique de tes analyses</p>
          </div>

          {/* Terms Modal */}
          <TermsModal
            isOpen={showTermsModal}
            onClose={() => setShowTermsModal(false)}
          />
        </div>
      </div>
    );
  }

  // Connecté - afficher les résultats
  return <>{children}</>;
}
