import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CalendarModal({ isOpen, onClose }: CalendarModalProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDetailedTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDetailedDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glassmorphism border-white border-opacity-20 max-w-md" data-testid="calendar-modal">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-semibold flex justify-between items-center">
            カレンダー & 時計
            <button 
              onClick={onClose}
              className="text-white opacity-70 hover:opacity-100 text-2xl"
              data-testid="close-calendar"
            >
              <X className="w-6 h-6" />
            </button>
          </DialogTitle>
        </DialogHeader>
        
        {/* Digital Clock Display */}
        <div className="text-center mb-6">
          <div className="text-4xl font-mono text-white mb-2" data-testid="detailed-time">
            {formatDetailedTime(currentTime)}
          </div>
          <div className="text-white opacity-80" data-testid="detailed-date">
            {formatDetailedDate(currentTime)}
          </div>
        </div>

        {/* Calendar Component */}
        <div className="glassmorphism-light rounded-lg p-4" data-testid="calendar-container">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border-0"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center text-white",
              caption_label: "text-sm font-medium text-white",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 text-white opacity-50 hover:opacity-100",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-white rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-white [&:has([aria-selected])]:bg-opacity-20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-9 w-9 p-0 font-normal text-white aria-selected:opacity-100 hover:bg-white hover:bg-opacity-10 rounded-md",
              day_selected: "bg-river-blue text-white hover:bg-river-blue hover:text-white focus:bg-river-blue focus:text-white",
              day_today: "bg-white bg-opacity-20 text-white",
              day_outside: "text-white opacity-30 aria-selected:bg-white aria-selected:bg-opacity-20 aria-selected:text-white aria-selected:opacity-100",
              day_disabled: "text-white opacity-20",
              day_range_middle: "aria-selected:bg-white aria-selected:bg-opacity-20 aria-selected:text-white",
              day_hidden: "invisible",
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
