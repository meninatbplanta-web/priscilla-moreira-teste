import React, { useState, useEffect } from 'react';

interface MobileCountdownSectionProps {
  targetDate: string; // ISO format date string
}

const MobileCountdownSection: React.FC<MobileCountdownSectionProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  const handleAddToCalendar = () => {
    const title = 'Aula Inaugural - Formação Terapeuta Corporal';
    const details = 'Aula 1: Fundamentos da Leitura Biológica';
    const location = 'Online';
    
    const startDate = new Date(targetDate);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration
    
    const formatGoogleDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
    };
    
    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <div className="px-4 py-6">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-3xl p-6 border-2 border-blue-200 dark:border-blue-800">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-3xl">📅</span>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              AULA INAUGURAL AGENDADA
            </h2>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-neutral-300 mb-6">
            A transmissão oficial começará dia 01/12/2025 às 20:00
          </p>

          <div className="flex justify-center items-center gap-2 mb-6">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {formatNumber(timeLeft.days)}
              </div>
              <div className="text-xs text-gray-600 dark:text-neutral-400 mt-1">
                Dias
              </div>
            </div>
            
            <div className="text-3xl text-gray-400 dark:text-neutral-500 mb-4">:</div>
            
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {formatNumber(timeLeft.hours)}
              </div>
              <div className="text-xs text-gray-600 dark:text-neutral-400 mt-1">
                Horas
              </div>
            </div>
            
            <div className="text-3xl text-gray-400 dark:text-neutral-500 mb-4">:</div>
            
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {formatNumber(timeLeft.minutes)}
              </div>
              <div className="text-xs text-gray-600 dark:text-neutral-400 mt-1">
                Min
              </div>
            </div>
            
            <div className="text-3xl text-gray-400 dark:text-neutral-500 mb-4">:</div>
            
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {formatNumber(timeLeft.seconds)}
              </div>
              <div className="text-xs text-gray-600 dark:text-neutral-400 mt-1">
                Seg
              </div>
            </div>
          </div>

          <button
            onClick={handleAddToCalendar}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <span className="text-xl">📅</span>
            Adicionar ao Calendário
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileCountdownSection;
