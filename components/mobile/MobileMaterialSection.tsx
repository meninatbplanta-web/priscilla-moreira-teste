import React from 'react';

interface MobileMaterialSectionProps {
  pdfUrl: string;
}

const MobileMaterialSection: React.FC<MobileMaterialSectionProps> = ({ pdfUrl }) => {
  const handleDownload = () => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="px-4 py-6">
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-purple-950 dark:via-pink-950 dark:to-purple-950 rounded-3xl p-6 border-2 border-purple-200 dark:border-purple-800">
        <div className="text-center">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
            <span>📚</span>
            Material de Apoio Oficial
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-neutral-300 mb-4 leading-relaxed">
            Baixe o PDF completo do minicurso com todos os conceitos, mapas mentais e exercícios práticos para revisar quando quiser.
          </p>

          {/* Features */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-700 dark:text-neutral-300">
              <span className="text-green-500">✅</span>
              <span>50+ páginas</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-700 dark:text-neutral-300">
              <span className="text-green-500">✅</span>
              <span>Mapas visuais</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-700 dark:text-neutral-300">
              <span className="text-green-500">✅</span>
              <span>Exercícios práticos</span>
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="flex flex-col items-start">
              <span className="text-base">Baixar Agora</span>
              <span className="text-xs opacity-90">PDF Gratuito</span>
            </div>
          </button>

          {/* Stats */}
          <div className="mt-6 pt-4 border-t border-purple-200 dark:border-purple-800">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  2.5k+
                </div>
                <div className="text-xs text-gray-600 dark:text-neutral-400 mt-1">
                  Downloads
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  4.9/5
                </div>
                <div className="text-xs text-gray-600 dark:text-neutral-400 mt-1">
                  Avaliação
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  8.2 MB
                </div>
                <div className="text-xs text-gray-600 dark:text-neutral-400 mt-1">
                  Tamanho
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMaterialSection;
