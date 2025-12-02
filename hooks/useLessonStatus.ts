import { useNavigate } from 'react-router-dom';
import { MINICOURSE_MODULE } from '../data/lessons';
import { isLessonAvailable, formatReleaseDate } from '../constants';

export const useLessonStatus = (currentLessonId: number) => {
    const navigate = useNavigate();

    const dynamicLessons = MINICOURSE_MODULE.lessons.map((lesson) => {
        const isUnlocked = isLessonAvailable(lesson);
        return {
            id: lesson.id,
            title: lesson.title,
            duration: lesson.duration,
            status: isUnlocked ? 'active' : 'locked',
            link: isUnlocked ? `/aula/${lesson.id}` : undefined,
            release_date: lesson.releaseDate
        };
    });

    const nextLesson = MINICOURSE_MODULE.lessons.find(l => l.id === currentLessonId + 1);

    let nextLessonInfo = null;

    if (nextLesson) {
        const isNextUnlocked = isLessonAvailable(nextLesson);
        nextLessonInfo = {
            title: `Próxima: ${nextLesson.title}`,
            release_date: isNextUnlocked ? 'Disponível Agora' : formatReleaseDate(nextLesson.releaseDate || ''),
            buttonText: isNextUnlocked ? 'Acessar Próxima Aula' : 'Definir Lembrete',
            onButtonClick: () => {
                if (isNextUnlocked) {
                    navigate(`/aula/${nextLesson.id}`);
                    window.scrollTo(0, 0);
                } else {
                    // Optional: Add reminder logic or toast here
                    alert(`A aula estará disponível em ${formatReleaseDate(nextLesson.releaseDate || '')}`);
                }
            }
        };
    }

    return {
        dynamicLessons,
        nextLessonInfo
    };
};
