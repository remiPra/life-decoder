import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { getUserAnalyses, SavedAnalysis } from '../services/analysisService';
import { exportMysticalAnalysisToPDF } from '../utils/pdfExport';
import { exportRationalAnalysisToPDF } from '../utils/pdfExport';

export default function HistoryPage({ onClose }: { onClose: () => void }) {
  const { user } = useUser();
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState<SavedAnalysis | null>(null);
  const [filter, setFilter] = useState<'all' | 'mystique' | 'rational' | 'zeri'>('all');

  useEffect(() => {
    if (user) {
      loadAnalyses();
    }
  }, [user]);

  const loadAnalyses = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getUserAnalyses(user.id);
      setAnalyses(data);
    } catch (error) {
      console.error('Error loading analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAnalyses = filter === 'all'
    ? analyses
    : analyses.filter(a => a.type === filter);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mystique': return '🔮';
      case 'rational': return '✨';
      case 'zeri': return '🌙';
      default: return '📄';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'mystique': return 'Mystique';
      case 'rational': return 'Rationnel';
      case 'zeri': return '择日';
      default: return type;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleExport = (analysis: SavedAnalysis) => {
    if (analysis.type === 'rational') {
      exportRationalAnalysisToPDF(analysis.output);
    } else {
      exportMysticalAnalysisToPDF(analysis.output.analysis || analysis.output, null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-12">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onClose}
            className="glass px-6 py-3 rounded-full gold-border hover:bg-[#C5A059]/10 transition-all"
          >
            ← Retour
          </button>
          <h1 className="text-5xl font-serif text-[#C5A059] gold-glow uppercase tracking-tighter">
            Historique
          </h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-4 flex-wrap">
          {[
            { id: 'all', label: 'Tous', icon: '📋' },
            { id: 'mystique', label: 'Mystique', icon: '🔮' },
            { id: 'zeri', label: '择日', icon: '🌙' },
            { id: 'rational', label: 'Rationnel', icon: '✨' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-6 py-3 rounded-2xl font-serif uppercase tracking-[0.2em] text-sm transition-all ${
                filter === f.id
                  ? 'bg-[#C5A059] text-black shadow-lg shadow-[#C5A059]/20'
                  : 'glass gold-border text-stone-400 hover:text-white'
              }`}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>
      </header>

      {/* Loading */}
      {loading && (
        <div className="text-center py-20">
          <div className="w-16 h-16 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-500">Chargement de l'historique...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredAnalyses.length === 0 && (
        <div className="text-center py-20 max-w-2xl mx-auto">
          <div className="text-6xl mb-6">📊</div>
          <h2 className="text-2xl font-serif text-stone-400 mb-4">
            Aucune analyse {filter !== 'all' && `de type ${getTypeLabel(filter)}`}
          </h2>
          <p className="text-stone-600">
            Tes analyses sauvegardées apparaîtront ici
          </p>
        </div>
      )}

      {/* Analysis List */}
      {!loading && filteredAnalyses.length > 0 && (
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnalyses.map((analysis) => (
              <div
                key={analysis.id}
                className="glass p-6 rounded-[2rem] gold-border hover:border-[#C5A059]/60 transition-all cursor-pointer group"
                onClick={() => setSelectedAnalysis(analysis)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getTypeIcon(analysis.type)}</span>
                    <div>
                      <h3 className="text-lg font-serif text-white group-hover:text-[#C5A059] transition-colors">
                        {analysis.prenom}
                      </h3>
                      <p className="text-xs text-stone-500 uppercase tracking-wider">
                        {getTypeLabel(analysis.type)}
                      </p>
                    </div>
                  </div>
                </div>

                {analysis.dateNaissance && (
                  <p className="text-sm text-stone-400 mb-2">
                    📅 {analysis.dateNaissance}
                  </p>
                )}

                <div className="h-px bg-stone-800 my-4"></div>

                <div className="flex items-center justify-between text-xs text-stone-600">
                  <span>{formatDate(analysis.createdAt)}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExport(analysis);
                    }}
                    className="text-[#C5A059] hover:text-[#D4AF37] transition-colors"
                  >
                    📄 PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis Detail Modal */}
      {selectedAnalysis && (
        <div
          className="fixed inset-0 bg-black/95 z-50 overflow-y-auto p-6"
          onClick={() => setSelectedAnalysis(null)}
        >
          <div
            className="max-w-4xl mx-auto my-12"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass p-12 rounded-[3.5rem] gold-border">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">{getTypeIcon(selectedAnalysis.type)}</span>
                    <h2 className="text-3xl font-serif text-[#C5A059]">
                      {selectedAnalysis.prenom}
                    </h2>
                  </div>
                  <p className="text-sm text-stone-500 uppercase tracking-wider">
                    {getTypeLabel(selectedAnalysis.type)} · {formatDate(selectedAnalysis.createdAt)}
                  </p>
                  {selectedAnalysis.dateNaissance && (
                    <p className="text-sm text-stone-400 mt-1">
                      📅 {selectedAnalysis.dateNaissance}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedAnalysis(null)}
                  className="glass px-4 py-2 rounded-full hover:bg-[#C5A059]/10 transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent mb-8"></div>

              {/* Content */}
              <div
                className="text-lg text-white leading-relaxed font-serif prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: selectedAnalysis.type === 'rational'
                    ? formatRationalOutput(selectedAnalysis.output)
                    : (selectedAnalysis.output.analysis || selectedAnalysis.output)
                }}
              />

              {/* Actions */}
              <div className="flex justify-center gap-4 mt-12 pt-8 border-t border-stone-800">
                <button
                  onClick={() => handleExport(selectedAnalysis)}
                  className="px-8 py-4 bg-[#C5A059]/10 border-2 border-[#C5A059] text-[#C5A059] font-bold uppercase tracking-[0.3em] rounded-3xl hover:bg-[#C5A059] hover:text-black transition-all"
                >
                  📄 Télécharger PDF
                </button>
                <button
                  onClick={() => setSelectedAnalysis(null)}
                  className="px-8 py-4 glass gold-border text-white font-bold uppercase tracking-[0.3em] rounded-3xl hover:bg-white/5 transition-all"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper to format rational analysis output
function formatRationalOutput(output: any): string {
  if (typeof output === 'string') return output;

  let html = '';

  if (output.situation) {
    html += `<h3 class="text-2xl text-[#C5A059] font-serif mt-8 mb-4">✦ Situation</h3>`;
    html += `<p class="mb-4">${output.situation}</p>`;
  }

  if (output.timing) {
    html += `<h3 class="text-2xl text-[#C5A059] font-serif mt-8 mb-4">✦ Timing</h3>`;
    html += `<p class="mb-4">${output.timing}</p>`;
  }

  if (output.scenarios) {
    html += `<h3 class="text-2xl text-[#C5A059] font-serif mt-8 mb-4">✦ Scénarios</h3>`;
    output.scenarios.forEach((s: any) => {
      html += `<div class="mb-6">`;
      html += `<h4 class="text-xl text-white font-serif mb-2">${s.title}</h4>`;
      html += `<p class="mb-2">${s.description}</p>`;
      if (s.probability) html += `<p class="text-sm text-stone-400">Probabilité: ${s.probability}</p>`;
      html += `</div>`;
    });
  }

  if (output.actions) {
    html += `<h3 class="text-2xl text-[#C5A059] font-serif mt-8 mb-4">✦ Actions Recommandées</h3>`;
    html += `<ul class="space-y-2">`;
    output.actions.forEach((action: string) => {
      html += `<li class="ml-6">${action}</li>`;
    });
    html += `</ul>`;
  }

  return html;
}
