import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAula4Progress } from '../hooks/useAula4Progress';
import aula4Data from '../data/aula4.json';
import { ArrowUp, Minimize2, Activity, Zap, RefreshCcw, Eye, Mic, Flame, Wind, CheckCircle, AlertTriangle, ArrowRight, TrendingUp, Users, ShieldCheck } from 'lucide-react';

import MobileHeader from '../components/mobile/MobileHeader';
import MobileBottomNav from '../components/mobile/MobileBottomNav';
import MobileHeroSection from '../components/mobile/MobileHeroSection';
import MobileCompletionSection from '../components/mobile/MobileCompletionSection';
import MobileCountdownSection from '../components/mobile/MobileCountdownSection';

import { useLessonStatus } from '../hooks/useLessonStatus';

const Aula4MobilePage: React.FC = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const {
        progress,
        completeSection,
        isSectionCompleted,
    } = useAula4Progress();

    const { dynamicLessons } = useLessonStatus(4);
    const currentLesson = dynamicLessons.find(l => l.id === 4);
    const isVideoUnlocked = currentLesson?.status === 'active';

    const [activeSection, setActiveSection] = useState('teoria');

    const teoriaRef = useRef<HTMLDivElement>(null);

    const { page_structure, lesson_content } = aula4Data;
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
        analista: 'Visão Sistêmica',
    };

    // Aula 4 is usually unlocked last, assuming it's available now or based on date
    // Using a future date or current date depending on logic. 
    // The JSON says status: active, so let's assume it's unlocked or check date.
    // Let's use the release date from lesson list if available, or just unlock it for now as it is "active".


    const renderSection = (section: any) => {
        const isCompleted = isSectionCompleted(section.id);

        switch (section.type) {
            case 'summary_block':
                return (
                    <div key={section.id} className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-gray-100 dark:border-neutral-800 mb-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{section.title}</h2>
                        <div className="text-sm text-gray-700 dark:text-neutral-300 leading-relaxed mb-4 space-y-2">
                            {section.content.split('[cite_start]').map((part: string, index: number) => (
                                <p key={index}>{part.replace(/\[cite:.*?\]/g, '')}</p>
                            ))}
                        </div>
                        {section.key_takeaway && (
                            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                                <p className="text-sm font-medium text-purple-800 dark:text-purple-300 flex gap-2">
                                    🔑 <span>{section.key_takeaway}</span>
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
                            {isCompleted ? 'Lido ✓' : 'Marcar como Lido'}
                        </button>
                    </div>
                );

            case 'data_insight':
                return (
                    <div key={section.id} className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-gray-100 dark:border-neutral-800 mb-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                            {section.title}
                        </h2>
                        <p className="text-sm text-gray-700 dark:text-neutral-300 mb-4">{section.content}</p>
                        <div className="grid grid-cols-1 gap-3">
                            {section.stats.map((stat: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-neutral-800 rounded-xl">
                                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400 w-16 text-center">{stat.value}</span>
                                    <span className="text-sm text-gray-600 dark:text-neutral-400 border-l pl-3 border-gray-200 dark:border-neutral-700">
                                        {stat.label}
                                    </span>
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
                            {isCompleted ? 'Dados Analisados ✓' : 'Confirmar Leitura'}
                        </button>
                    </div>
                );

            case 'comparison_block':
                return (
                    <div key={section.id} className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-gray-100 dark:border-neutral-800 mb-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{section.title}</h2>

                        <div className="space-y-4">
                            {/* Left Column */}
                            <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
                                <h3 className="font-bold text-red-800 dark:text-red-300 mb-2 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    {section.left_column.title}
                                </h3>
                                <ul className="space-y-2">
                                    {section.left_column.items.map((item: string, idx: number) => (
                                        <li key={idx} className="text-sm text-red-700 dark:text-red-200/80 flex gap-2">
                                            <span>•</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Right Column */}
                            <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/30">
                                <h3 className="font-bold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4" />
                                    {section.right_column.title}
                                </h3>
                                <ul className="space-y-2">
                                    {section.right_column.items.map((item: string, idx: number) => (
                                        <li key={idx} className="text-sm text-green-700 dark:text-green-200/80 flex gap-2">
                                            <span>•</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <button
                            onClick={() => handleCompleteSection(section.id)}
                            className={`mt-4 w-full py-2 rounded-xl text-sm font-semibold transition-colors ${isCompleted
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-300'
                                }`}
                        >
                            {isCompleted ? 'Comparação Entendida ✓' : 'Entendi a Diferença'}
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

            case 'reflective_block':
                return (
                    <div key={section.id} className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800 mb-8">
                        <h2 className="text-lg font-bold text-indigo-900 dark:text-indigo-100 mb-4">{section.title}</h2>
                        <p className="text-sm text-indigo-800 dark:text-indigo-200/80 leading-relaxed mb-6">
                            {section.content.replace(/\[cite:.*?\]/g, '').replace(/\[cite_start\]/g, '')}
                        </p>

                        {section.quote && (
                            <div className="relative p-4 bg-white dark:bg-neutral-900 rounded-xl border border-indigo-100 dark:border-indigo-800/50 shadow-sm">
                                <span className="absolute -top-3 left-4 text-4xl text-indigo-200 dark:text-indigo-800">"</span>
                                <p className="text-center text-indigo-900 dark:text-indigo-100 font-medium italic relative z-10">
                                    {section.quote.replace(/\[cite:.*?\]/g, '')}
                                </p>
                            </div>
                        )}

                        <button
                            onClick={() => handleCompleteSection(section.id)}
                            className={`mt-6 w-full py-3 rounded-xl text-sm font-bold transition-all ${isCompleted
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none active:scale-[0.98]'
                                }`}
                        >
                            {isCompleted ? 'Reflexão Feita ✓' : 'Aceito o Desafio'}
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
                                if (section.action_url.startsWith('http')) {
                                    window.open(section.action_url, '_blank');
                                } else {
                                    navigate(section.action_url);
                                }
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
                <MobileCountdownSection
                    targetDate="2025-12-07T15:00:00"
                    title="AULA 4 DISPONÍVEL"
                    subTitle="A transmissão oficial começou."
                />

                <div className="px-4 py-4">
                    <MobileHeroSection
                        bannerUrl={page_structure.banner.image_url}
                        title={metadata.title}
                        subtitle={metadata.subtitle}
                        badge={page_structure.header_info.badge.text}
                        isVideoUnlocked={isVideoUnlocked}
                        lockedMessage={page_structure.video_player}
                        onStartStudy={handleStartStudy}
                    />
                </div>

                <div ref={teoriaRef} className="px-4 space-y-4">
                    {sections.map((section: any) => renderSection(section))}
                </div>

                <div className="px-4 mt-8">
                    <MobileCompletionSection
                        title="CURSO CONCLUÍDO!"
                        message="Você completou a jornada de introdução à Análise Corporal."
                        progressPercentage={metadata.completion_percentage}
                        lessons={dynamicLessons}
                        nextLessonInfo={{
                            title: "Certificado",
                            release_date: "Disponível",
                            buttonText: "Emitir Certificado",
                            onButtonClick: () => window.open('https://certificado-dusky.vercel.app/', '_blank')
                        }}
                    />
                </div>
            </main>

            <MobileBottomNav
                activeSection={activeSection}
                onNavigate={handleNavigate}
                completedSections={progress.completedSections}
            />
        </div>
    );
};

export default Aula4MobilePage;
