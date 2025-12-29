import React from 'react';
import { TERMS_CONTENT } from '../content/terms';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/95 z-[100] overflow-y-auto p-6 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="max-w-3xl w-full glass p-12 rounded-[3.5rem] gold-border my-12"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-3xl font-serif text-[#C5A059] gold-glow mb-2">
              {TERMS_CONTENT.title}
            </h2>
            <p className="text-sm text-stone-500 uppercase tracking-wider">
              {TERMS_CONTENT.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="glass px-4 py-2 rounded-full hover:bg-[#C5A059]/10 transition-all text-stone-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent mb-8"></div>

        {/* Content */}
        <div className="text-stone-300 leading-relaxed space-y-6 max-h-[60vh] overflow-y-auto pr-4">
          {TERMS_CONTENT.sections.map((section, index) => (
            <section key={index}>
              <h3 className="text-xl font-serif text-[#C5A059] mb-3">{section.title}</h3>

              {section.content && (
                <p className="text-sm whitespace-pre-line">{section.content}</p>
              )}

              {section.subsections && section.subsections.map((sub: any, subIndex: number) => (
                <div key={subIndex} className="mt-4 ml-4">
                  <h4 className="text-lg font-serif text-[#C5A059]/80 mb-2">{sub.subtitle}</h4>
                  <p className="text-sm whitespace-pre-line">{sub.content}</p>
                </div>
              ))}

              {section.contactEmail && (
                <p className="text-sm mt-2">
                  <span className="text-[#C5A059]">{section.contactEmail}</span>
                </p>
              )}
            </section>
          ))}

          <div className="pt-6 mt-6 border-t border-stone-800">
            <p className="text-xs text-stone-600 text-center">
              Dernière mise à jour : {TERMS_CONTENT.lastUpdated}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="text-center mt-8">
          <button
            onClick={onClose}
            className="px-12 py-4 bg-[#C5A059] text-black font-bold uppercase tracking-[0.3em] rounded-3xl hover:bg-[#D4AF37] transition-all shadow-lg"
          >
            J'ai compris
          </button>
        </div>
      </div>
    </div>
  );
}
