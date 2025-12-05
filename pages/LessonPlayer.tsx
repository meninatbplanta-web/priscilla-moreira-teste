import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Lock, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, FileText, Video, Mic, BrainCircuit, Layers, BarChart3, FileBarChart, Presentation, HelpCircle, Hourglass } from 'lucide-react';
import Header from '../components/Header';
import CoursePageContent from '../components/CoursePageContent';
import LoginModal from '../components/LoginModal';
import LockedLessonModal from '../components/LockedLessonModal';
import { isLessonAvailable, formatReleaseDate } from '../constants';
import { LESSONS, LESSON_CONTENT, ALL_MODULES, COURSES } from '../data/lessons';
import { TabOption, LessonContent, FullLessonData, PageStructure } from '../types';
import DynamicLessonContent from '../components/DynamicLessonContent';
import aula1Json from '../data/aula1.json';
import aula2Json from '../data/aula2.json';
import aula3Json from '../data/aula3.json';
import aula4Json from '../data/aula4.json';
import LessonSchedule from '../components/LessonSchedule';

const LessonPlayer: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabOption>(TabOption.COURSE);
  const [showLockedModal, setShowLockedModal] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Sidebar state: which module is expanded?
  // Initialize with the module containing the current lesson
  const [expandedModuleId, setExpandedModuleId] = useState<number | null>(null);

  const currentLessonId = Number(lessonId);
  const currentLesson = LESSONS.find(l => l.id === currentLessonId);
  const currentCourse = COURSES.find(c => c.id === currentLesson?.courseId);

  // Map lessons to their JSON data
  const lessonDataMap: Record<number, FullLessonData> = {
    1: aula1Json as unknown as FullLessonData,
    2: aula2Json as unknown as FullLessonData,
    3: aula3Json as unknown as FullLessonData,
    4: aula4Json as unknown as FullLessonData,
  };

  const currentJson = lessonDataMap[currentLessonId];

  // Validation: if lesson doesn't exist
  useEffect(() => {
    if (!currentLesson) {
      navigate('/');
    } else {
      // Automatically expand the module of the current lesson if not already expanded
      setExpandedModuleId((prev) => prev === null ? currentLesson.moduleId : prev);
    }
  }, [currentLesson, navigate]);

  if (!currentLesson) return null;

  const isUnlocked = currentLesson.courseId === 'minicourse'
    ? isLessonAvailable(currentLesson)
    : false; // Paid course is always locked in preview mode

  // Special rule: Lesson 1 contents always unlocked for minicourse. Paid course always locked.
  const isContentUnlocked = currentLesson.courseId === 'minicourse' && (currentLesson.id === 1 || isUnlocked);

  // Get next/prev lessons specifically within the context of the entire flat list
  const nextLesson = LESSONS.find(l => l.id === currentLessonId + 1 && l.courseId === currentLesson.courseId);
  const prevLesson = LESSONS.find(l => l.id === currentLessonId - 1 && l.courseId === currentLesson.courseId);

  // Get modules for the current course only
  const courseModules = ALL_MODULES.filter(m => m.courseId === currentLesson.courseId);

  const handleLessonChange = (id: number) => {
    const targetLesson = LESSONS.find(l => l.id === id);
    if (!targetLesson) return;

    // Allow navigation to locked lessons to '''see''' them, but lock content.
    // Except for minicourse future lessons which are date-locked.
    if (targetLesson.courseId === 'minicourse' && !isLessonAvailable(targetLesson)) {
      setShowLockedModal(formatReleaseDate(targetLesson.releaseDate || ''));
      return;
    }

    // PAYWALL LOGIC: Intercept clicks for Formation course
    if (targetLesson.courseId === 'formation') {
      setShowLoginModal(true);
      return;
    }

    navigate(`/aula/${id}`);
    // No window.scrollTo(0,0) needed here as the content div scrolls independently, 
    // but we can scroll the main content div if we had a ref. 
    // For now, let's rely on user scroll or reset if we add a ref later.
  };

  const toggleModule = (modId: number) => {
    setExpandedModuleId(expandedModuleId === modId ? null : modId);
  };

  const getDynamicContent = () => {
    const lessonContent = LESSON_CONTENT[currentLesson.id];
    if (lessonContent && lessonContent[activeTab]) {
      return lessonContent[activeTab];
    }
    return `
      <p>Conteúdo para <strong>${activeTab}</strong> da aula <strong>${currentLesson.title}</strong> será adicionado em breve.</p>
      <br/>
      <p class="text-sm text-neutral-500">Aguarde a atualização do material didático.</p>
    `;
  };

  const renderTabContent = () => {
    if (!isContentUnlocked) {
      return (
        <div className="h-64 w-full flex flex-col items-center justify-center border border-dashed border-gray-300 dark:border-neutral-800 rounded-lg bg-gray-50 dark:bg-neutral-950/50">
          <Lock className="text-gray-400 dark:text-neutral-600 mb-4" size={48} />
          <h3 className="text-xl font-heading font-semibold text-gray-900 dark:text-white mb-2">Conteúdo Bloqueado</h3>
          <p className="text-gray-500 dark:text-neutral-500">
            {currentLesson.courseId === 'minicourse'
              ? `A aula estará disponível em ${formatReleaseDate(currentLesson.releaseDate || '')}.`
              : 'Faça o login ou adquira a formação para acessar este conteúdo.'}
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-brand-black border border-gray-200 dark:border-neutral-900 p-8 rounded-lg min-h-[300px] animate-fade-in transition-colors duration-300">
        <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
          {getTabIcon(activeTab)}
          {activeTab}
        </h3>

        <div
          className="text-gray-700 dark:text-neutral-300 leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: getDynamicContent() || '' }}
        />
      </div>
    );
  };

  const getTabIcon = (tab: TabOption) => {
    switch (tab) {
      case TabOption.COURSE: return <FileText size={18} />;
      case TabOption.VIDEO_SUMMARY: return <Video size={18} />;
      case TabOption.AUDIO_SUMMARY: return <Mic size={18} />;
      case TabOption.MIND_MAP: return <BrainCircuit size={18} />;
      case TabOption.FLASHCARDS: return <Layers size={18} />;
      case TabOption.INFOGRAPHIC: return <BarChart3 size={18} />;
      case TabOption.REPORT: return <FileBarChart size={18} />;
      case TabOption.QUIZ: return <HelpCircle size={18} />;
      case TabOption.SLIDES: return <Presentation size={18} />;
      default: return <FileText size={18} />;
    }
  };

  const renderVideoSection = () => (
    <div id="video-section" className="w-full aspect-video bg-black rounded-xl border border-gray-200 dark:border-neutral-800 mb-8 relative overflow-hidden shadow-2xl">
      {isContentUnlocked ? (
        <div className="absolute inset-0 bg-black group cursor-pointer transition-colors duration-300">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${currentJson?.page_structure?.video_player?.video_id || 'zLz7AYdBoGU'}`}
            title="Vídeo Demonstrativo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>


        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-neutral-950 text-center p-6 transition-colors duration-300">
          <Lock size={48} className="text-gray-400 dark:text-neutral-700 mb-4" />
          <h3 className="text-xl font-heading font-bold text-gray-700 dark:text-neutral-300 mb-2">
            {currentJson?.page_structure?.video_player?.locked_message?.title || currentJson?.page_structure?.video_player_hero?.locked_message?.title || "Aula Bloqueada"}
          </h3>
          <p className="text-gray-500 dark:text-neutral-500 max-w-md mx-auto">
            {currentLesson.courseId === 'minicourse'
              ? <span>
                {currentJson?.page_structure?.video_player?.locked_message?.text || currentJson?.page_structure?.video_player_hero?.locked_message?.text ||
                  <>A aula estará disponível em <span className="text-brand-red">{formatReleaseDate(currentLesson.releaseDate || '')}</span>.</>
                }
              </span>
              : <span>Conteúdo exclusivo para alunos matriculados na formação.</span>
            }
          </p>
        </div>
      )}
    </div>
  );

  // --- MINICURSO LAYOUT ---
  if (currentLesson.courseId === 'minicourse') {
    return (
      <div className="bg-gray-50 dark:bg-brand-darker text-gray-900 dark:text-white flex flex-col min-h-screen transition-colors duration-300">
        <Header />
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <main className="container mx-auto px-4 md:px-6 py-6 md:py-12 max-w-4xl transition-all duration-300">

            {/* Video Banner (Aula 1 Special) */}
            {currentLesson.id === 1 ? (
              <>
                <div className="relative w-full aspect-video rounded-xl md:rounded-2xl overflow-hidden shadow-lg mb-4 md:mb-6 bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/wo2fdlq54Bc"
                    title="Aula 01: Fundamentos da Leitura Corporal"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>

                {/* Título Destacado (Aula 1 Special) */}
                <div className="mb-8 p-4 md:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-500 rounded-lg">
                  <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white text-center">
                    Aula 01: Fundamentos da Leitura Corporal
                  </h2>
                </div>
              </>
            ) : (
              /* Banner Image (Other Lessons) */
              <div className="relative w-full rounded-xl overflow-hidden shadow-lg mb-8 group">
                <img
                  src={currentJson?.page_structure?.banner?.image_url || currentJson?.page_structure?.video_player_hero?.thumbnail_url || "https://priscilla-moreira.com/imagens/minicurso-banner1.jpg"}
                  alt={currentJson?.page_structure?.banner?.alt_text || "Banner do Curso"}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            )}

            {/* Header Info */}
            <div className="mb-8 md:mb-10 text-center md:text-left">
              <div className="inline-flex items-center gap-2 mb-4 bg-gray-100 dark:bg-neutral-800/80 px-4 py-1.5 rounded-full border border-gray-200 dark:border-neutral-700 backdrop-blur-sm">
                <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse ${currentJson?.page_structure?.header_info?.badge?.color === 'green' ? 'bg-green-500' : 'bg-green-500'}`}></div>
                <span className="text-[10px] md:text-xs font-bold text-gray-600 dark:text-neutral-300 uppercase tracking-widest">
                  {currentJson?.page_structure?.header_info?.badge?.text || currentJson?.page_structure?.header_bar?.badge?.text || "MINICURSO GRATUITO"}
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white leading-tight mb-2">
                {currentJson?.page_structure?.header_info?.title || currentJson?.page_structure?.video_player_hero?.lesson_title || currentCourse?.title}
              </h1>
              <p className="text-sm md:text-base text-gray-500 dark:text-neutral-400 max-w-2xl mx-auto md:mx-0">
                Domine a leitura corporal e transforme sua percepção sobre as pessoas.
              </p>
            </div>

            {/* Inline Lesson List */}
            <LessonSchedule
              currentLessonId={currentLessonId}
              onLessonChange={handleLessonChange}
              onLessonLocked={(date) => setShowLockedModal(date)}
              completedLessons={LESSONS.filter(l => l.id < currentLessonId).map(l => l.id)}
            />

            {/* Content Area */}
            <div className="bg-white dark:bg-brand-black border border-gray-200 dark:border-neutral-900 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">

              <div className="p-6 md:p-10">
                <div className="mb-8 border-b border-gray-100 dark:border-neutral-800 pb-6">
                  <h1 className="text-2xl md:text-4xl font-heading font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                    {currentJson?.lesson_content?.metadata?.title || currentJson?.page_structure?.video_player_hero?.lesson_title || `Aula ${currentLessonId}: ${currentLesson.title}`}
                  </h1>
                  <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400">
                    {currentJson?.lesson_content?.metadata?.subtitle || currentJson?.page_structure?.video_player_hero?.status_label || "O Mapa da Mente Humana"}
                  </p>
                </div>



                {renderVideoSection()}

                {/* Conteúdo Dinâmico para todas as aulas */}
                {currentLessonId === 1 && <DynamicLessonContent data={aula1Json.lesson_content as unknown as LessonContent} pageStructure={aula1Json.page_structure as unknown as PageStructure} />}
                {currentLessonId === 2 && <DynamicLessonContent
                  data={aula2Json.lesson_content as unknown as LessonContent}
                  pageStructure={aula2Json.page_structure as unknown as PageStructure}
                />}
                {currentLessonId === 3 && <DynamicLessonContent data={aula3Json.lesson_content as unknown as LessonContent} />}
                {currentLessonId === 4 && <DynamicLessonContent
                  data={aula4Json.lesson_content as unknown as LessonContent}
                  pageStructure={aula4Json.page_structure as unknown as PageStructure}
                />}

                {isContentUnlocked && currentLessonId !== 1 && currentLessonId !== 2 && currentLessonId !== 3 && currentLessonId !== 4 && (
                  <div>
                    {/* Simplified Tabs for Minicurso */}
                    <div className="mb-8 overflow-x-auto scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                      <div className="flex gap-3 min-w-max pb-2">
                        {Object.values(TabOption).map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 
                                          ${activeTab === tab
                                ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20 transform scale-105'
                                : 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 border border-transparent hover:bg-gray-200 dark:hover:bg-neutral-700'}
                                      `}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                    </div>
                    {renderTabContent()}
                  </div>
                )}
              </div>
            </div>

          </main>
        </div>

        {/* Locked Modal */}
        <LockedLessonModal
          isOpen={!!showLockedModal}
          releaseDate={showLockedModal}
          onClose={() => setShowLockedModal(null)}
        />
      </div>
    );
  }

  // --- DEFAULT FORMATION LAYOUT ---
  return (
    <div className="h-screen bg-gray-50 dark:bg-brand-darker text-gray-900 dark:text-white flex flex-col overflow-hidden transition-colors duration-300">
      <Header />



      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full overflow-hidden">

        {/* Sidebar */}
        <aside className="w-full lg:w-96 border-r border-gray-200 dark:border-neutral-900 bg-white dark:bg-brand-black flex-shrink-0 flex flex-col h-full overflow-hidden transition-colors">
          <div className="p-6 border-b border-gray-200 dark:border-neutral-900 shrink-0">
            <h2 className="font-heading font-bold text-sm uppercase tracking-wider text-gray-500 dark:text-neutral-500">
              {currentLesson.courseId === 'minicourse' ? 'Conteúdo do Minicurso' : 'Módulos da Formação'}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {courseModules.map((module) => {
              const isExpanded = expandedModuleId === module.id;

              return (
                <div key={module.id} className="border-b border-gray-100 dark:border-neutral-900/50 transition-colors">
                  {/* Module Header */}
                  {currentLesson.courseId === 'formation' ? (
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 dark:hover:bg-neutral-900/50 transition-colors duration-200"
                    >
                      <div>
                        <p className="text-xs font-mono text-gray-400 dark:text-neutral-600 mb-1">Módulo {module.id}</p>
                        <h3 className="font-heading font-bold text-gray-900 dark:text-white">{module.title}</h3>
                      </div>
                      <ChevronDown
                        className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                        size={20}
                      />
                    </button>
                  ) : (
                    <div className="p-6">
                      <h3 className="font-heading font-bold text-gray-900 dark:text-white">{module.title}</h3>
                    </div>
                  )}

                  {/* Lessons List */}
                  {isExpanded && (
                    <div className="bg-gray-50/50 dark:bg-black/20 transition-all duration-500 ease-in-out overflow-hidden">
                      {module.lessons.map((lesson) => {
                        const isActive = lesson.id === currentLessonId;
                        const isLocked = !isLessonAvailable(lesson);

                        return (
                          <div
                            key={lesson.id}
                            onClick={() => handleLessonChange(lesson.id)}
                            className={`flex items-center gap-4 p-4 pl-8 border-l-4 transition-colors duration-200 cursor-pointer 
                                          ${isActive
                                ? 'border-brand-red bg-red-50 dark:bg-red-900/10'
                                : isLocked
                                  ? 'border-transparent text-gray-400 dark:text-neutral-700'
                                  : 'border-transparent hover:bg-gray-100 dark:hover:bg-neutral-900/70'
                              }`}
                          >
                            <div className={`flex-shrink-0 ${isActive ? 'text-brand-red' : 'text-gray-400 dark:text-neutral-600'}`}>
                              {isActive ? <Play size={16} fill="currentColor" /> : (isLocked ? <Lock size={16} /> : <Play size={16} />)}
                            </div>
                            <div className="flex-1">
                              <h4 className={`font-semibold text-sm leading-tight ${isActive ? 'text-gray-900 dark:text-white' : (isLocked ? '' : 'text-gray-700 dark:text-neutral-300')}`}>
                                {lesson.title}
                              </h4>
                            </div>
                            <span className="text-xs font-mono text-gray-400 dark:text-neutral-600">{lesson.duration || '60:00'}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-neutral-900 flex justify-between items-center shrink-0">
            <div>
              {currentLesson.courseId === 'formation' && (
                <span className="text-xs font-mono text-gray-400 dark:text-neutral-600 mb-1 block">
                  Módulo {currentLesson.moduleId} • Aula {currentLesson.id - 100}
                  {/* Note: ID math is a rough display approximation, real app would use array index */}
                </span>
              )}
              <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2">{currentLesson.title}</h2>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => prevLesson && handleLessonChange(prevLesson.id)}
                disabled={!prevLesson}
                className="p-3 rounded-full bg-gray-100 dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => nextLesson && handleLessonChange(nextLesson.id)}
                disabled={!nextLesson}
                className="p-3 rounded-full bg-gray-100 dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            {renderTabContent()}
          </div>
        </main>
      </div>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};

export default LessonPlayer;
