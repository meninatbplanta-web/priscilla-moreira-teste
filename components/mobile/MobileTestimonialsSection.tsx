import React from 'react';

interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  date: string;
  text: string;
  likes: number;
}

const MobileTestimonialsSection: React.FC = () => {
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

        {/* Testimonials List */}
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-50 dark:bg-neutral-800 rounded-2xl p-4 border border-gray-100 dark:border-neutral-700"
            >
              {/* User Info */}
              <div className="flex items-start gap-3 mb-3">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {testimonial.name}
                    </h3>
                    <span className="text-blue-500 text-sm">✓</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">
                    {testimonial.date}
                  </p>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">⭐</span>
                  ))}
                </div>
              </div>

              {/* Testimonial Text */}
              <p className="text-sm text-gray-700 dark:text-neutral-300 leading-relaxed mb-3">
                {testimonial.text}
              </p>

              {/* Likes */}
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 text-gray-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span className="text-xs font-medium">{testimonial.likes}</span>
                </button>
              </div>
            </div>
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
