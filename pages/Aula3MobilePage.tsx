import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAula3Progress } from '../hooks/useAula3Progress';
import aula3Data from '../data/aula3.json';
import LessonSchedule from '../components/LessonSchedule';
import LockedLessonModal from '../components/LockedLessonModal';
import { ArrowUp, Minimize2, Activity, Zap, RefreshCcw, Eye, Mic, Flame, Wind, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

import MobileHeader from '../components/mobile/MobileHeader';
import MobileBottomNav from '../components/mobile/MobileBottomNav';
import MobileHeroSection from '../components/mobile/MobileHeroSection';
import MobileCompletionSection from '../components/mobile/MobileCompletionSection';
import MobileCountdownSection from '../components/mobile/MobileCountdownSection';

import { useLessonStatus } from '../hooks/useLessonStatus';

const Aula3MobilePage: React.FC = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const {
        progress,
        completeSection,
        isSectionCompleted,
    } = useAula3Progress();

    const { dynamicLessons, nextLessonInfo } = useLessonStatus(3);
    const currentLesson = dynamicLessons.find(l => l.id === 3);
    const isVideoUnlocked = currentLesson?.status === 'active';

    const [activeSection, setActiveSection] = useState('teoria');
    const [showLockedModal, setShowLockedModal] = useState<string | null>(null);

    const teoriaRef = useRef<HTMLDivElement>(null);

    const { page_structure, lesson_content } = aula3Data;
    const { metadata, sections } = lesson_content;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleNavigate = (sectionId: string) => {
        setActiveSection(sectionId);
        if (teoriaRef.current) {
            teoriaRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleStartStudy = () => {
        const firstSection = sections[0];
        if (firstSection) {
            completeSection(firstSection.id);
        }
        handleNavigate('teoria');
    };

    const handleCompleteSection = (sectionId: string) => {
        completeSection(sectionId);
    };

    const badgeLabels: Record<string, string> = {
        iniciante: 'Estudante',
        explorador: 'Analista Jr.',
        mestre: 'Analista de Elite',
        detetive: 'Leitor de Rostos',
    };



    const renderSection = (section: any) => {
        const isCompleted = isSectionCompleted(section.id);

        switch (section.type) {
            case 'text_block':
                return (
                    <div key={section.id} className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-gray-100 dark:border-neutral-800 mb-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{section.title}</h2>
                        <div className="text-sm text-gray-700 dark:text-neutral-300 leading-relaxed space-y-2">
                            {section.content.split('[cite_start]').map((part: string, index: number) => (
                                <p key={index}>{part.replace(/\[cite:.*?\]/g, '')}</p>
                            ))}
                        </div>
                        {section.key_takeaway && (
                            <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
                                <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
                                    💡 {section.key_takeaway.replace(/\[cite:.*?\]/g, '')}
                                </p>
                            </div>
                        )}
                        <button
                            onClick={() => handleCompleteSection(section.id)}
                            className={`mt-4 w-full py-2 rounded-xl text-sm font-semibold transition-colors ${isCompleted
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-300'
                                }`}
                        >
                            {isCompleted ? 'Leitura Concluída ✓' : 'Marcar como Lido'}
                        </button>
                    </div>
                );

            case 'infographic_text':
                return (
                    <div key={section.id} className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-gray-100 dark:border-neutral-800 mb-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{section.title}</h2>
                        <p className="text-sm text-gray-700 dark:text-neutral-300 mb-4">{section.content.replace(/\[cite:.*?\]/g, '')}</p>
                        <ul className="space-y-3">
                            {section.bullet_points.map((point: string, idx: number) => (
                                <li key={idx} className="flex gap-3 text-sm text-gray-700 dark:text-neutral-300">
                                    <span className="text-blue-500 font-bold">•</span>
                                    <span dangerouslySetInnerHTML={{ __html: point.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\[cite:.*?\]/g, '').replace(/\[cite_start\]/g, '') }} />
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => handleCompleteSection(section.id)}
                            className={`mt-4 w-full py-2 rounded-xl text-sm font-semibold transition-colors ${isCompleted
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-300'
                                }`}
                        >
                            {isCompleted ? 'Estudo Concluído ✓' : 'Marcar como Estudado'}
                        </button>
                    </div>
                );

            case 'detailed_list':
                return (
                    <div key={section.id} className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-gray-100 dark:border-neutral-800 mb-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{section.title}</h2>
                        <div className="space-y-4">
                            {section.items.map((item: any, idx: number) => (
                                <div key={idx} className="p-3 bg-gray-50 dark:bg-neutral-800 rounded-xl">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{item.feature}</h3>
                                    <p className="text-sm text-gray-600 dark:text-neutral-400">{item.meaning.replace(/\[cite:.*?\]/g, '').replace(/\[cite_start\]/g, '')}</p>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => handleCompleteSection(section.id)}
                            className={`mt-4 w-full py-2 rounded-xl text-sm font-semibold transition-colors ${isCompleted
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-300'
                                }`}
                        >
                            {isCompleted ? 'Análise Concluída ✓' : 'Concluir Análise'}
                        </button>
                    </div>
                );

            case 'interactive_check':
                return (
                    <div key={section.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-5 border border-blue-100 dark:border-blue-800 mb-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{section.title}</h2>
                        <div className="flex items-start gap-3 mb-4 bg-white dark:bg-neutral-900 p-3 rounded-xl border border-blue-100 dark:border-blue-800/50">
                            <Eye className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-700 dark:text-neutral-300 font-medium">
                                {section.instruction.replace(/\[cite:.*?\]/g, '')}
                            </p>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-neutral-300 mb-3">{section.content}</p>
                        <ul className="space-y-2">
                            {section.rules.map((rule: string, idx: number) => (
                                <li key={idx} className="text-sm text-gray-700 dark:text-neutral-300 pl-4 border-l-2 border-blue-300 dark:border-blue-700">
                                    <span dangerouslySetInnerHTML={{ __html: rule.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\[cite:.*?\]/g, '').replace(/\[cite_start\]/g, '') }} />
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => handleCompleteSection(section.id)}
                            className={`mt-4 w-full py-2 rounded-xl text-sm font-semibold transition-colors ${isCompleted
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                                }`}
                        >
                            {isCompleted ? 'Exercício Realizado ✓' : 'Confirmar Exercício'}
                        </button>
                    </div>
                );

            case 'grid_layout':
                return (
                    <div key={section.id} className="mb-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 px-1">{section.title}</h2>
                        <div className="grid gap-3">
                            {section.cards.map((card: any, idx: number) => (
                                <div key={idx} className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-gray-100 dark:border-neutral-800 shadow-sm">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">{card.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-neutral-400 leading-relaxed">
                                        {card.text.replace(/\[cite:.*?\]/g, '').replace(/\[cite_start\]/g, '')}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => handleCompleteSection(section.id)}
                            className={`mt-4 w-full py-2 rounded-xl text-sm font-semibold transition-colors ${isCompleted
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-300'
                                }`}
                        >
                            {isCompleted ? 'Seção Concluída ✓' : 'Marcar como Concluído'}
                        </button>
                    </div>
                );

            case 'warning_block':
                return (
                    <div key={section.id} className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-5 border border-amber-100 dark:border-amber-800 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                            <h2 className="text-lg font-bold text-amber-900 dark:text-amber-100">{section.title}</h2>
                        </div>
                        <p className="text-sm text-amber-800 dark:text-amber-200/80 leading-relaxed">
                            {section.content.replace(/\[cite:.*?\]/g, '').replace(/\[cite_start\]/g, '')}
                        </p>
                        <button
                            onClick={() => handleCompleteSection(section.id)}
                            className={`mt-4 w-full py-2 rounded-xl text-sm font-semibold transition-colors ${isCompleted
                                ? 'bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-100'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-100'
                                }`}
                        >
                            {isCompleted ? 'Entendido ✓' : 'Entendi o Alerta'}
                        </button>
                    </div>
                );

            case 'call_to_action':
                return (
                    <div key={section.id} className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-center text-white mb-8">
                        <h2 className="text-xl font-bold mb-3">{section.title}</h2>
                        <p className="text-white/90 text-sm mb-6 leading-relaxed">
                            {section.text.replace(/\[cite:.*?\]/g, '').replace(/\[cite_start\]/g, '')}
                        </p>
                        <button
                            onClick={() => {
                                handleCompleteSection(section.id);
                                navigate(section.action_url);
                            }}
                            className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                        >
                            {section.button_text} <ArrowRight className="w-4 h-4" />
                        </button>
                        {section.note && (
                            <p className="mt-4 text-xs text-white/60">
                                {section.note.replace(/\[cite:.*?\]/g, '')}
                            </p>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 transition-colors duration-300">
            <MobileHeader
                progressPercentage={progress.progressPercentage}
                currentBadge={progress.currentBadge}
                badgeLabel={badgeLabels[progress.currentBadge]}
                isDarkMode={theme === 'dark'}
                onToggleTheme={toggleTheme}
            />

            <main className="pb-20">
                <div className="px-4 py-4">
                    <LessonSchedule
                        currentLessonId={3}
                        onLessonChange={(id) => navigate(`/aula/${id}`)}
                        onLessonLocked={(date) => setShowLockedModal(date)}
                        completedLessons={[1, 2]}
                    />
                    <MobileHeroSection
                        bannerUrl={page_structure.banner.image_url}
                        title={metadata.title}
                        subtitle={metadata.subtitle}
                        badge={page_structure.header_info.badge.text}
                        isVideoUnlocked={isVideoUnlocked}
                        videoUrl={`https://www.youtube.com/embed/${page_structure.video_player.video_id}`}
                        videoTitle={metadata.title}
                        lockedMessage={page_structure.video_player.locked_message}
                        onStartStudy={handleStartStudy}
                    />
                </div>

                <div ref={teoriaRef} className="px-4 space-y-4">
                    {sections.map((section: any) => renderSection(section))}
                </div>

                <div className="px-4 mt-8">
                    <MobileCompletionSection
                        title="AULA 3 CONCLUÍDA!"
                        message="Você completou o estudo da Fisiognomia."
                        progressPercentage={metadata.completion_percentage}
                        lessons={dynamicLessons}
                        nextLessonInfo={nextLessonInfo || {
                            title: "Aula 4: Carreira",
                            release_date: "07/12 às 15h",
                            buttonText: "Definir Lembrete"
                        }}
                    />
                </div>
            </main>

            <MobileBottomNav
                activeSection={activeSection}
                onNavigate={handleNavigate}
                completedSections={progress.completedSections}
            />
            <LockedLessonModal
                isOpen={!!showLockedModal}
                releaseDate={showLockedModal}
                onClose={() => setShowLockedModal(null)}
            />
        </div>
    );
};

export default Aula3MobilePage;
