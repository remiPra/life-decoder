import React from 'react';
import { SignIn } from '@clerk/clerk-react';

interface LoginPromptProps {
  onSkip?: () => void;
  showSkip?: boolean;
}

export default function LoginPrompt({ onSkip, showSkip = false }: LoginPromptProps) {
  return (
    <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Message de valeur */}
        <div className="text-center mb-8 fade-in">
          <div className="text-6xl mb-6">✨</div>
          <h2 className="text-4xl font-serif text-[#C5A059] gold-glow mb-4">
            Souhaitez-vous sauvegarder votre analyse ?
          </h2>
          <p className="text-stone-300 text-lg mb-6">
            Connectez-vous pour débloquer:
          </p>

          <div className="glass p-8 rounded-3xl gold-border mb-8">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl mb-2">📋</div>
                <h3 className="text-[#C5A059] font-serif mb-2">Historique</h3>
                <p className="text-sm text-stone-400">Accès à toutes vos analyses passées</p>
              </div>
              <div>
                <div className="text-3xl mb-2">📄</div>
                <h3 className="text-[#C5A059] font-serif mb-2">PDF Illimités</h3>
                <p className="text-sm text-stone-400">Téléchargez vos rapports détaillés</p>
              </div>
              <div>
                <div className="text-3xl mb-2">🔓</div>
                <h3 className="text-[#C5A059] font-serif mb-2">Analyses Illimitées</h3>
                <p className="text-sm text-stone-400">Toutes les fonctionnalités débloquées</p>
              </div>
            </div>
          </div>
        </div>

        {/* Clerk Sign In */}
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

        {/* Skip button optionnel */}
        {showSkip && onSkip && (
          <div className="text-center mt-6">
            <button
              onClick={onSkip}
              className="text-stone-500 hover:text-stone-300 text-sm transition-colors underline"
            >
              Continuer sans sauvegarder
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-stone-600 text-xs">
          <p>100% Gratuit · Sécurisé · Confidentiel</p>
          <p className="mt-2">Sauvegarde automatique de toutes vos analyses</p>
        </div>
      </div>
    </div>
  );
}
