import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAula2Progress } from '../hooks/useAula2Progress';
import aula2Data from '../data/aula2-nova.json';
import { ArrowUp, Minimize2, Activity, Zap, RefreshCcw, Eye, Mic, Flame, Wind } from 'lucide-react';

import MobileHeader from '../components/mobile/MobileHeader';
import MobileBottomNav from '../components/mobile/MobileBottomNav';
import MobileHeroSection from '../components/mobile/MobileHeroSection';
import MobileMediaPlayer from '../components/mobile/MobileMediaPlayer';
import MobileExerciseSection from '../components/mobile/MobileExerciseSection';
import MobileQuizSection from '../components/mobile/MobileQuizSection';
import MobileCompletionSection from '../components/mobile/MobileCompletionSection';
import MobileTestimonialsSection from '../components/mobile/MobileTestimonialsSection';

const Aula2MobilePage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const {
    progress,
    completeSection,
    saveExercise,
    saveQuizAnswer,
    isSectionCompleted,
  } = useAula2Progress();

  const [activeSection, setActiveSection] = useState('teoria');
  
  const teoriaRef = useRef<HTMLDivElement>(null);
  const praticaRef = useRef<HTMLDivElement>(null);
  const quizRef = useRef<HTMLDivElement>(null);

  const { page_structure, lesson_content } = aula2Data;
  const { metadata, sections } = lesson_content;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const introSection = sections.find((s) => s.type === 'intro');
  const multimediaSection = sections.find((s) => s.type === 'multimedia');
  const tabsSection = sections.find((s) => s.type === 'tabs');
  const exerciseSection = sections.find((s) => s.type === 'exercise');
  const quizSection = sections.find((s) => s.type === 'quiz');
  const completionSection = sections.find((s) => s.type === 'lesson_completion');

  // Extrair abas da Aula 2: lateralidade, cabeca_sentidos, nucleo, estrutura
  const lateralidadeTab = tabsSection?.tabs?.find((t: any) => t.id === 'lateralidade');
  const cabecaTab = tabsSection?.tabs?.find((t: any) => t.id === 'cabeca_sentidos');
  const nucleoTab = tabsSection?.tabs?.find((t: any) => t.id === 'nucleo');
  const estruturaTab = tabsSection?.tabs?.find((t: any) => t.id === 'estrutura');

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {
      teoria: teoriaRef,
      pratica: praticaRef,
      quiz: quizRef,
    };
    const ref = refs[sectionId];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleStartStudy = () => {
    if (introSection) {
      completeSection('intro');
    }
    handleNavigate('teoria');
  };

  const handleCompleteMultimedia = (itemId: string) => {
    completeSection(itemId);
  };

  const handleCompleteCard = (cardId: string) => {
    completeSection(cardId);
  };

  const handleCompleteExercise = (text: string) => {
    saveExercise(text);
    completeSection('ex_lateralidade');
  };

  const handleCompleteQuiz = (questionIndex: number, isCorrect: boolean) => {
    saveQuizAnswer(questionIndex, isCorrect);
    completeSection(`quiz_${questionIndex + 1}`);
  };

  const badgeLabels: Record<string, string> = {
    iniciante: 'Estudante',
    explorador: 'Analista Jr.',
    mestre: 'Analista de Elite',
    detetive: 'Detetive da Dor',
  };

  const isVideoUnlocked = new Date() >= new Date('2025-12-03T20:00:00');

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

        {introSection && isSectionCompleted('intro') && (
          <div className="px-4 py-2">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-gray-100 dark:border-neutral-800">
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                {introSection.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-neutral-400 italic mb-3">
                {introSection.subtitle}
              </p>
              {Array.isArray(introSection.content) && introSection.content.map((p: string, i: number) => (
                <p key={i} className="text-sm text-gray-700 dark:text-neutral-300 mb-2 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </div>
        )}

        {multimediaSection && (
          <div className="px-4 py-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              📺 {multimediaSection.title}
            </h2>
            <div className="space-y-4">
              {multimediaSection.items.map((item: any) => (
                <MobileMediaPlayer
                  key={item.id}
                  id={item.id}
                  type={item.type}
                  title={item.title}
                  subtitle={item.subtitle}
                  url={item.url}
                  isCompleted={isSectionCompleted(item.id)}
                  onComplete={() => handleCompleteMultimedia(item.id)}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={teoriaRef}>
          {tabsSection && (
            <div className="px-4 py-4">
              <div className="space-y-6">
                {/* Aba 1: Lateralidade */}
                {lateralidadeTab && (
                  <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-gray-100 dark:border-neutral-800">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      {lateralidadeTab.label}
                    </h2>
                    <div className="space-y-4">
                      {lateralidadeTab.content.map((card: any) => (
                        <div
                          key={card.id}
                          className={`p-4 rounded-xl border-l-4 ${
                            card.style === 'blue'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : card.style === 'pink'
                              ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                              : 'border-gray-300 bg-gray-50 dark:bg-gray-800'
                          }`}
                        >
                          <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                            {card.title}
                          </h3>
                          <p className="text-sm text-gray-700 dark:text-neutral-300 mb-3">
                            {card.text}
                          </p>
                          <button
                            onClick={() => handleCompleteCard(card.id)}
                            className={`text-sm font-semibold px-3 py-1 rounded-lg transition ${
                              isSectionCompleted(card.id)
                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            }`}
                          >
                            {isSectionCompleted(card.id) ? '✓ Concluído' : card.buttonText}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Aba 2: Cabeça e Sentidos */}
                {cabecaTab && (
                  <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-gray-100 dark:border-neutral-800">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      {cabecaTab.label}
                    </h2>
                    <div className="space-y-4">
                      {cabecaTab.content.map((card: any) => {
                        const iconMap: Record<string, React.ReactNode> = {
                          'Zap': <Zap className="w-5 h-5" />,
                          'RefreshCcw': <RefreshCcw className="w-5 h-5" />,
                          'Eye': <Eye className="w-5 h-5" />,
                        };
                        return (
                        <div
                          key={card.id}
                          className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                        >
                          <div className="flex items-start gap-3 mb-2">
                            <span className="text-xl">{iconMap[card.icon] || card.icon}</span>
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 dark:text-white">
                                {card.name}
                              </h3>
                              <p className="text-xs text-gray-600 dark:text-neutral-400">
                                {card.archetype}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-neutral-300 mb-2">
                            <strong>Corpo:</strong> {card.body}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-neutral-300 mb-2">
                            <strong>Significado:</strong> {card.pain}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-neutral-300 mb-3">
                            <strong>Poder:</strong> {card.power}
                          </p>
                          <button
                            onClick={() => handleCompleteCard(card.id)}
                            className={`text-sm font-semibold px-3 py-1 rounded-lg transition ${
                              isSectionCompleted(card.id)
                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            }`}
                          >
                            {isSectionCompleted(card.id) ? '✓ Concluído' : card.buttonText}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Aba 3: Núcleo */}
                {nucleoTab && (
                  <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-gray-100 dark:border-neutral-800">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      {nucleoTab.label}
                    </h2>
                    <div className="space-y-4">
                      {nucleoTab.content.map((card: any) => {
                        const iconMap: Record<string, React.ReactNode> = {
                          'Mic': <Mic className="w-5 h-5" />,
                          'Flame': <Flame className="w-5 h-5" />,
                          'Wind': <Wind className="w-5 h-5" />,
                        };
                        return (
                        <div
                          key={card.id}
                          className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                        >
                          <div className="flex items-start gap-3 mb-2">
                            <span className="text-xl">{iconMap[card.icon] || card.icon}</span>
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 dark:text-white">
                                {card.name}
                              </h3>
                              <p className="text-xs text-gray-600 dark:text-neutral-400">
                                {card.archetype}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-neutral-300 mb-2">
                            <strong>Corpo:</strong> {card.body}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-neutral-300 mb-2">
                            <strong>Significado:</strong> {card.pain}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-neutral-300 mb-3">
                            <strong>Poder:</strong> {card.power}
                          </p>
                          <button
                            onClick={() => handleCompleteCard(card.id)}
                            className={`text-sm font-semibold px-3 py-1 rounded-lg transition ${
                              isSectionCompleted(card.id)
                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            }`}
                          >
                            {isSectionCompleted(card.id) ? '✓ Concluído' : card.buttonText}
                          </button>
                        </div>
                      );
                      })}
                  </div>
                )}

                {/* Aba 4: Estrutura */}
                {estruturaTab && (
                  <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-gray-100 dark:border-neutral-800">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      {estruturaTab.label}
                    </h2>
                    <div className="space-y-4">
                      {estruturaTab.content.map((card: any) => {
                        const iconMap: Record<string, React.ReactNode> = {
                          'ArrowUp': <ArrowUp className="w-5 h-5" />,
                          'Minimize2': <Minimize2 className="w-5 h-5" />,
                          'Activity': <Activity className="w-5 h-5" />,
                        };
                        return (
                        <div
                          key={card.id}
                          className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                        >
                          <div className="flex items-start gap-3 mb-2">
                            <span className="text-xl">{iconMap[card.icon] || card.icon}</span>
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 dark:text-white">
                                {card.name}
                              </h3>
                              <p className="text-xs text-gray-600 dark:text-neutral-400">
                                {card.archetype}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-neutral-300 mb-2">
                            <strong>Corpo:</strong> {card.body}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-neutral-300 mb-2">
                            <strong>Significado:</strong> {card.pain}
                          </p>
                          <p className="text-sm text-gray-700 dark:text-neutral-300 mb-3">
                            <strong>Poder:</strong> {card.power}
                          </p>
                          <button
                            onClick={() => handleCompleteCard(card.id)}
                            className={`text-sm font-semibold px-3 py-1 rounded-lg transition ${
                              isSectionCompleted(card.id)
                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            }`}
                          >
                            {isSectionCompleted(card.id) ? '✓ Concluído' : card.buttonText}
                          </button>
                        </div>
                      );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div ref={praticaRef}>
          {exerciseSection && (
            <MobileExerciseSection
              content={exerciseSection.content}
              isCompleted={isSectionCompleted('ex_lateralidade')}
              savedText={progress.exerciseText}
              onComplete={handleCompleteExercise}
            />
          )}
        </div>

        <div ref={quizRef}>
          {quizSection && (
            <MobileQuizSection
              title={quizSection.title}
              questions={quizSection.questions}
              savedAnswers={progress.quizAnswers}
              onCompleteQuestion={handleCompleteQuiz}
            />
          )}
        </div>

        <MobileTestimonialsSection />

        {completionSection && (
          <MobileCompletionSection
            title={completionSection.title}
            message={completionSection.message}
            progressPercentage={progress.progressPercentage}
            lessons={page_structure.lesson_list.lessons}
            nextLessonInfo={completionSection.next_lesson_info}
          />
        )}
      </main>

      <MobileBottomNav
        activeSection={activeSection}
        onNavigate={handleNavigate}
        completedSections={progress.completedSections}
      />
    </div>
  );
};

export default Aula2MobilePage;
