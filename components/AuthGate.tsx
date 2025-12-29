import React from 'react';
import { SignIn, useAuth } from '@clerk/clerk-react';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();

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

  // Non connecté - afficher la page de connexion avec message
  if (!isSignedIn) {
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

          {/* Clerk Sign In Component with custom styling */}
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

          {/* Footer */}
          <div className="text-center mt-8 text-stone-600 text-xs">
            <p>Gratuit · Sécurisé · Confidentiel</p>
            <p className="mt-2">Sauvegarde automatique de tes analyses</p>
          </div>
        </div>
      </div>
    );
  }

  // Connecté - afficher les résultats
  return <>{children}</>;
}
