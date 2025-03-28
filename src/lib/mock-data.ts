
import { addDays, format, setHours, setMinutes, startOfDay } from "date-fns";

// Types for our booking system
export interface TimeSlot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price?: number;
}

export interface Booking {
  id: string;
  timeSlotId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
  createdAt: Date;
}

export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
  description: string;
}

// Generate time slots for the next 30 days
export const generateTimeSlots = (startDate: Date = new Date()): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  
  // Generate for the next 30 days
  for (let day = 0; day < 30; day++) {
    const currentDate = addDays(startOfDay(startDate), day);
    
    // Generate time slots from 9 AM to 5 PM with 1-hour intervals
    for (let hour = 9; hour < 17; hour++) {
      const slotDate = setHours(currentDate, hour);
      
      // Generate two 30-min slots per hour
      for (let minute = 0; minute < 60; minute += 30) {
        const startTimeDate = setMinutes(slotDate, minute);
        const endTimeDate = setMinutes(startTimeDate, minute + 30);
        
        const isAvailable = Math.random() > 0.3; // 70% chance of being available
        
        slots.push({
          id: `slot-${format(startTimeDate, 'yyyy-MM-dd-HH-mm')}`,
          date: new Date(currentDate),
          startTime: format(startTimeDate, 'HH:mm'),
          endTime: format(endTimeDate, 'HH:mm'),
          isAvailable,
          price: 50, // Default price
        });
      }
    }
  }
  
  return slots;
};

export const services: Service[] = [
  {
    id: 'service-1',
    name: 'Standard Consultation',
    duration: 30,
    price: 50,
    description: 'A standard 30-minute consultation session.'
  },
  {
    id: 'service-2',
    name: 'Premium Consultation',
    duration: 60,
    price: 90,
    description: 'An extended 60-minute in-depth consultation.'
  },
  {
    id: 'service-3',
    name: 'Quick Check-in',
    duration: 15,
    price: 25,
    description: 'A brief 15-minute check-in session.'
  }
];

// Mock bookings data
export const bookings: Booking[] = [];

// Mock API functions
export const getAvailableTimeSlots = (date: Date): Promise<TimeSlot[]> => {
  const allSlots = generateTimeSlots();
  const dateString = format(date, 'yyyy-MM-dd');
  const filteredSlots = allSlots.filter(
    slot => format(slot.date, 'yyyy-MM-dd') === dateString && slot.isAvailable
  );
  
  return Promise.resolve(filteredSlots);
};

export const getBookedTimeSlots = (date: Date): Promise<TimeSlot[]> => {
  const allSlots = generateTimeSlots();
  const dateString = format(date, 'yyyy-MM-dd');
  const filteredSlots = allSlots.filter(
    slot => format(slot.date, 'yyyy-MM-dd') === dateString && !slot.isAvailable
  );
  
  return Promise.resolve(filteredSlots);
};

export const createBooking = (
  timeSlotId: string, 
  customerName: string, 
  customerEmail: string, 
  customerPhone: string,
  notes?: string
): Promise<Booking> => {
  const newBooking: Booking = {
    id: `booking-${Date.now()}`,
    timeSlotId,
    customerName,
    customerEmail,
    customerPhone,
    notes,
    createdAt: new Date()
  };
  
  bookings.push(newBooking);
  
  // Update the time slot to be unavailable
  const allSlots = generateTimeSlots();
  const timeSlot = allSlots.find(slot => slot.id === timeSlotId);
  if (timeSlot) {
    timeSlot.isAvailable = false;
  }
  
  return Promise.resolve(newBooking);
};
