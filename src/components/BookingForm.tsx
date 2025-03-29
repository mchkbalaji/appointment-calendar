
import { useState } from "react";
import { format } from "date-fns";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TimeSlot, createBooking } from "@/lib/mock-data";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface BookingFormProps {
  selectedSlot: TimeSlot;
  onSuccess: () => void;
  onCancel: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  notes: z.string().optional(),
});

const BookingForm = ({ selectedSlot, onSuccess, onCancel }: BookingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formattedDate = format(selectedSlot.date, "EEEE, MMMM d, yyyy");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      notes: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      await createBooking(
        selectedSlot.id,
        data.name,
        data.email,
        data.phone,
        data.notes
      );
      
      toast({
        title: "Appointment Confirmed!",
        description: `Your appointment on ${formattedDate} at ${selectedSlot.startTime} has been booked.`,
      });
      
      onSuccess();
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="p-4 bg-gray-50 rounded-md mb-4">
        <h3 className="font-semibold mb-2"  style={{color:"#9B87F5"}}>Appointment Details</h3>
        <p className="text-sm text-gray-600">Date: {formattedDate}</p>
        <p className="text-sm text-gray-600">
          Time: {selectedSlot.startTime} - {selectedSlot.endTime}
        </p>
        <p className="text-sm text-gray-600 mt-1">Price: ${selectedSlot.price}</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="(123) 456-7890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any additional information or special requests"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Booking
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BookingForm;
