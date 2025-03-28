
import { useState } from "react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday
} from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  highlightedDates?: Date[];
}

const Calendar = ({ selectedDate, onDateSelect, highlightedDates = [] }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });
  
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const hasHighlight = (date: Date): boolean => {
    return highlightedDates.some(highlightDate => 
      isSameDay(highlightDate, date)
    );
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden animate-fade-in">
      <div className="p-4 bg-primary text-white">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={prevMonth}
            className="text-white hover:text-primary-light hover:bg-white/10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-semibold">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={nextMonth}
            className="text-white hover:text-primary-light hover:bg-white/10"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdays.map((day) => (
            <div 
              key={day} 
              className="text-center text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => {
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentDay = isToday(day);
            const hasHighlightedSlot = hasHighlight(day);
            
            return (
              <Button
                key={i}
                variant="ghost"
                className={cn(
                  "h-10 w-full rounded-md text-sm p-0 font-normal relative",
                  isCurrentMonth ? "text-gray-700" : "text-gray-300",
                  isSelected ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" : "hover:bg-gray-100",
                  isCurrentDay && !isSelected && "border border-primary/70",
                )}
                disabled={!isCurrentMonth || new Date(day) < new Date(new Date().setHours(0, 0, 0, 0))}
                onClick={() => onDateSelect(day)}
              >
                <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
                {hasHighlightedSlot && !isSelected && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-booking-available rounded-full"></div>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
