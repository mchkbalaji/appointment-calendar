
import { useState, useEffect } from "react";
import Calendar from "@/components/Calendar";
import TimeSlots from "@/components/TimeSlots";
import BookingForm from "@/components/BookingForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAvailableTimeSlots, TimeSlot } from "@/lib/mock-data";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

const BookingPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const isMobile = useIsMobile();

  // Fetch available slots when the selected date changes
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      setIsLoading(true);
      try {
        const slots = await getAvailableTimeSlots(selectedDate);
        setAvailableSlots(slots);
        
        // Reset selected slot when date changes
        setSelectedSlot(null);
      } catch (error) {
        console.error("Error fetching available slots:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate]);

  // Generate a list of dates that have available slots for the calendar highlights
  useEffect(() => {
    const generateAvailableDates = async () => {
      // This is a simplified version - in a real app you'd likely have an API endpoint
      // that returns all dates with available slots in a given month
      const today = new Date();
      const dates: Date[] = [];
      
      // Let's assume some random dates have availability
      for (let i = 0; i < 15; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + Math.floor(Math.random() * 30));
        dates.push(date);
      }
      
      setAvailableDates(dates);
    };
    
    generateAvailableDates();
  }, []);

  const handleSelectSlot = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    setSelectedSlot(null);
    
    // Refresh available slots
    getAvailableTimeSlots(selectedDate).then(slots => {
      setAvailableSlots(slots);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointment Booking</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select a date and time to schedule your appointment. All appointments are confirmed instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select a Date</CardTitle>
                <CardDescription>
                  Choose your preferred appointment date
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar 
                  selectedDate={selectedDate} 
                  onDateSelect={setSelectedDate}
                  highlightedDates={availableDates}
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select a Time</CardTitle>
                <CardDescription>
                  Available time slots for {format(selectedDate, "MMMM d, yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <TimeSlots
                    date={selectedDate}
                    availableSlots={availableSlots}
                    selectedSlot={selectedSlot}
                    onSelectSlot={handleSelectSlot}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Form Dialog */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className={`sm:max-w-md ${isMobile ? 'px-4 py-4' : ''}`}>
          <DialogHeader>
            <DialogTitle>Complete Your Booking</DialogTitle>
          </DialogHeader>
          <Separator />
          {isMobile ? (
            <ScrollArea className="max-h-[70vh] p-2">
              {selectedSlot && (
                <BookingForm
                  selectedSlot={selectedSlot}
                  onSuccess={handleBookingSuccess}
                  onCancel={() => setShowBookingModal(false)}
                />
              )}
            </ScrollArea>
          ) : (
            selectedSlot && (
              <BookingForm
                selectedSlot={selectedSlot}
                onSuccess={handleBookingSuccess}
                onCancel={() => setShowBookingModal(false)}
              />
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingPage;
