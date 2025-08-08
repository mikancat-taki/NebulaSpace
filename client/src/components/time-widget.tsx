import { useState, useEffect } from 'react';

interface TimeWidgetProps {
  onClick: () => void;
}

export function TimeWidget({ onClick }: TimeWidgetProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });
  };

  return (
    <div 
      className="glassmorphism rounded-lg p-4 hover:bg-opacity-30 transition-all duration-300 cursor-pointer group"
      onClick={onClick}
      data-testid="time-widget"
    >
      <div className="text-white">
        <div className="text-2xl font-bold" data-testid="current-time">
          {formatTime(currentTime)}
        </div>
        <div className="text-sm opacity-80" data-testid="current-date">
          {formatDate(currentTime)}
        </div>
      </div>
      <div className="text-xs text-white opacity-60 mt-1 group-hover:opacity-80 transition-opacity">
        クリックでカレンダーを開く
      </div>
    </div>
  );
}
