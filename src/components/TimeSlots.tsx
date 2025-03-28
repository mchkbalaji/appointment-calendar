
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TimeSlot } from "@/lib/mock-data";
import { Clock } from "lucide-react";

interface TimeSlotsProps {
  date: Date;
  availableSlots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
}

const TimeSlots = ({ date, availableSlots, selectedSlot, onSelectSlot }: TimeSlotsProps) => {
  const [timeView, setTimeView] = useState<"morning" | "afternoon">("morning");
  
  // Group slots by morning (before noon) and afternoon
  const morningSlots = availableSlots.filter(
    (slot) => parseInt(slot.startTime.split(":")[0]) < 12
  );
  
  const afternoonSlots = availableSlots.filter(
    (slot) => parseInt(slot.startTime.split(":")[0]) >= 12
  );
  
  const displaySlots = timeView === "morning" ? morningSlots : afternoonSlots;
  
  if (availableSlots.length === 0) {
    return (
      <div className="p-6 text-center border rounded-md">
        <Clock className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-gray-500">No available time slots for {format(date, "MMMM d, yyyy")}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 animate-slide-in">
      <h3 className="text-lg font-semibold">
        Available times for {format(date, "MMMM d, yyyy")}
      </h3>
      
      <div className="flex space-x-2 mb-4">
        <Button 
          variant={timeView === "morning" ? "default" : "outline"}
          className={cn(
            "flex-1",
            timeView === "morning" && "bg-primary hover:bg-primary-dark"
          )}
          onClick={() => setTimeView("morning")}
        >
          Morning
        </Button>
        <Button 
          variant={timeView === "afternoon" ? "default" : "outline"}
          className={cn(
            "flex-1",
            timeView === "afternoon" && "bg-primary hover:bg-primary-dark"
          )}
          onClick={() => setTimeView("afternoon")}
        >
          Afternoon
        </Button>
      </div>
      
      {displaySlots.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {displaySlots.map((slot) => (
            <Button
              key={slot.id}
              variant={selectedSlot?.id === slot.id ? "default" : "outline"}
              className={cn(
                "py-2 px-2 text-sm",
                selectedSlot?.id === slot.id && "bg-primary hover:bg-primary-dark"
              )}
              onClick={() => onSelectSlot(slot)}
            >
              {slot.startTime} - {slot.endTime}
            </Button>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">
          No {timeView} slots available
        </p>
      )}
    </div>
  );
};

export default TimeSlots;
