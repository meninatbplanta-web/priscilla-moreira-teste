import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAula1Progress } from '../hooks/useAula1Progress';
import aula1Data from '../data/aula1-nova.json';

import MobileHeader from '../components/mobile/MobileHeader';
import MobileBottomNav from '../components/mobile/MobileBottomNav';
import MobileHeroSection from '../components/mobile/MobileHeroSection';
import MobileMediaPlayer from '../components/mobile/MobileMediaPlayer';
import MobileTheorySection from '../components/mobile/MobileTheorySection';
import MobileProfileCarousel from '../components/mobile/MobileProfileCarousel';
import MobileExerciseSection from '../components/mobile/MobileExerciseSection';
import MobileQuizSection from '../components/mobile/MobileQuizSection';
import MobileCompletionSection from '../components/mobile/MobileCompletionSection';
import MobileMaterialSection from '../components/mobile/MobileMaterialSection';
import MobileTestimonialsSection from '../components/mobile/MobileTestimonialsSection';

import { useLessonStatus } from '../hooks/useLessonStatus';

const Aula1MobilePage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const {
    progress,
    completeSection,
    saveExercise,
    saveQuizAnswer,
    isSectionCompleted,
  } = useAula1Progress();

  const { dynamicLessons, nextLessonInfo } = useLessonStatus(1);

  const [activeSection, setActiveSection] = useState('teoria');

  const teoriaRef = useRef<HTMLDivElement>(null);
  const perfisRef = useRef<HTMLDivElement>(null);
  const praticaRef = useRef<HTMLDivElement>(null);
  const quizRef = useRef<HTMLDivElement>(null);

  const { page_structure, lesson_content } = aula1Data;
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

  const fundamentosTab = tabsSection?.tabs?.find((t: any) => t.id === 'fundamentos');
  const tracosTab = tabsSection?.tabs?.find((t: any) => t.id === 'tracos_carater');
  const alertaTab = tabsSection?.tabs?.find((t: any) => t.id === 'alerta_saude');

  const theoryCards = fundamentosTab?.content || [];
  const alertCard = alertaTab?.content?.[0] || null;
  const profiles = tracosTab?.content || [];

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {
      teoria: teoriaRef,
      perfis: perfisRef,
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

  const handleCompleteTheory = (itemId: string) => {
    completeSection(itemId);
  };

  const handleCompleteProfile = (profileId: string) => {
    completeSection(profileId);
  };

  const handleCompleteExercise = (text: string) => {
    saveExercise(text);
    completeSection('ex_analise');
  };

  const handleCompleteQuiz = (questionIndex: number, isCorrect: boolean) => {
    saveQuizAnswer(questionIndex, isCorrect);
    completeSection(`quiz_${questionIndex + 1}`);
  };

  const badgeLabels: Record<string, string> = {
    iniciante: 'Estudante',
    explorador: 'Analista Jr.',
    mestre: 'Analista Elite',
  };

  const currentLesson = dynamicLessons.find(l => l.id === 1);
  const isVideoUnlocked = currentLesson?.status === 'active';

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
            lockedMessage={page_structure.video_player.locked_message}
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
              📺 Introdução Multimídia
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
          <MobileTheorySection
            theoryCards={theoryCards}
            alertCard={alertCard}
            completedItems={progress.completedSections}
            onComplete={handleCompleteTheory}
          />
        </div>

        <div ref={perfisRef}>
          <MobileProfileCarousel
            profiles={profiles}
            completedItems={progress.completedSections}
            onComplete={handleCompleteProfile}
          />
        </div>

        <div ref={praticaRef}>
          {exerciseSection && (
            <MobileExerciseSection
              content={exerciseSection.content}
              isCompleted={isSectionCompleted('ex_analise')}
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

        <MobileMaterialSection pdfUrl="https://priscilla-moreira.com/imagens/PDF-MINICURSO-ANALISTA-CORPORAL.pdf" />

        <MobileTestimonialsSection />

        {completionSection && (
          <MobileCompletionSection
            title={completionSection.title}
            message={completionSection.message}
            progressPercentage={progress.progressPercentage}
            lessons={dynamicLessons}
            nextLessonInfo={nextLessonInfo || completionSection.next_lesson_info}
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

export default Aula1MobilePage;
