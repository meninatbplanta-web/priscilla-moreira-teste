import React, { useState } from 'react';

interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  date: string;
  text: string;
  likes: number;
}

const MobileTestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Ana Paula Silva',
      avatar: '👩‍⚕️',
      date: '2 dias atrás',
      text: 'Conteúdo incrível! Finalmente entendi como a mielinização molda nosso comportamento. A didática da Priscila é excepcional, tudo muito claro e aplicável. Já estou usando na minha prática clínica!',
      likes: 47,
    },
    {
      id: 2,
      name: 'Carlos Eduardo',
      avatar: '👨‍💼',
      date: '3 dias atrás',
      text: 'Eu não sou da área de saúde, mas consegui acompanhar perfeitamente. Os exemplos práticos fazem toda a diferença. Estou impressionado com a profundidade do conteúdo sendo oferecido gratuitamente!',
      likes: 38,
    },
    {
      id: 3,
      name: 'Mariana Costa',
      avatar: '👩‍🎓',
      date: '5 dias atrás',
      text: 'Simplesmente transformador! Estudei psicologia por 5 anos e nunca vi esse conteúdo explicado de forma tão prática. Os 5 perfis de caráter são fascinantes. Mal posso esperar pela próxima aula!',
      likes: 62,
    },
    {
      id: 4,
      name: 'Roberto Almeida',
      avatar: '👨‍⚕️',
      date: '1 semana atrás',
      text: 'Sou fisioterapeuta e esse conhecimento está revolucionando minha forma de atender. Agora consigo entender melhor as tensões corporais dos meus pacientes. Material de apoio em PDF é excelente!',
      likes: 41,
    },
    {
      id: 5,
      name: 'Juliana Mendes',
      avatar: '👩‍💻',
      date: '1 semana atrás',
      text: 'Que aula maravilhosa! A parte sobre psicossomática me ajudou a entender tantas coisas sobre mim mesma. Chorei várias vezes de emoção. Gratidão por compartilhar esse conhecimento! 💜',
      likes: 55,
    },
    {
      id: 6,
      name: 'Fernando Santos',
      avatar: '👨‍🏫',
      date: '2 semanas atrás',
      text: 'Conteúdo de altíssima qualidade! Sou professor de educação física e agora entendo melhor como o corpo reflete as emoções. Os exercícios práticos são ótimos para fixar o aprendizado.',
      likes: 33,
    },
  ];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="px-4 py-6">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-gray-200 dark:border-neutral-800">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
            <span>💬</span>
            O Que Nossos Alunos Dizem
          </h2>
          
          {/* Rating */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">⭐</span>
              ))}
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">5.0</span>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-neutral-400">
            Baseado em 6 avaliações verificadas
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Testimonial Card */}
          <div className="bg-gray-50 dark:bg-neutral-800 rounded-2xl p-5 border border-gray-100 dark:border-neutral-700 min-h-[280px] flex flex-col">
            {/* User Info */}
            <div className="flex items-start gap-3 mb-4">
              <div className="text-4xl">{currentTestimonial.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                    {currentTestimonial.name}
                  </h3>
                  <span className="text-blue-500 text-base">✓</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-neutral-400">
                  {currentTestimonial.date}
                </p>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">⭐</span>
                ))}
              </div>
            </div>

            {/* Testimonial Text */}
            <p className="text-sm text-gray-700 dark:text-neutral-300 leading-relaxed mb-4 flex-1">
              {currentTestimonial.text}
            </p>

            {/* Likes */}
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 text-gray-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span className="text-sm font-medium">{currentTestimonial.likes}</span>
              </button>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-2">
            <button
              onClick={handlePrevious}
              className="pointer-events-auto w-10 h-10 rounded-full bg-white dark:bg-neutral-800 border-2 border-gray-200 dark:border-neutral-700 shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors -ml-5"
              aria-label="Depoimento anterior"
            >
              <svg className="w-5 h-5 text-gray-700 dark:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="pointer-events-auto w-10 h-10 rounded-full bg-white dark:bg-neutral-800 border-2 border-gray-200 dark:border-neutral-700 shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors -mr-5"
              aria-label="Próximo depoimento"
            >
              <svg className="w-5 h-5 text-gray-700 dark:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-blue-600 dark:bg-blue-500'
                  : 'w-2 bg-gray-300 dark:bg-neutral-600'
              }`}
              aria-label={`Ir para depoimento ${index + 1}`}
            />
          ))}
        </div>

        {/* Add Comment Button */}
        <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-2xl transition-colors duration-200">
          Deixar Meu Comentário
        </button>
      </div>
    </div>
  );
};

export default MobileTestimonialsSection;
