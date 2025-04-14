
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Room, roomApi } from "@/api/roomApi";
import { CreateReservationData, reservationApi } from "@/api/reservationApi";
import { useAuth } from "@/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { formatDate } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { 
  ArrowLeft, 
  Calendar as CalendarIcon,
  Clock,
  Loader,
  MapPin,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = yup.object({
  date: yup.string().required("Date is required"),
  startTime: yup.string().required("Start time is required"),
  endTime: yup.string().required("End time is required"),
  purpose: yup.string().required("Purpose is required"),
  attendees: yup
    .number()
    .positive("Attendees must be positive")
    .integer("Attendees must be a whole number")
    .required("Number of attendees is required"),
}).required();

type FormData = yup.InferType<typeof schema>;

export default function RoomDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availableTimeSlots, setAvailableTimeSlots] = useState<{ startTime: string; endTime: string }[]>([]);
  const [isReserving, setIsReserving] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  
  const watchDate = watch("date");
  const watchStartTime = watch("startTime");
  
  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const roomData = await roomApi.getRoomById(id);
        setRoom(roomData);
        
        // Initialize with today's available time slots
        if (selectedDate) {
          updateAvailableTimeSlots(selectedDate, roomData);
        }
      } catch (error) {
        console.error("Error fetching room details:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load room details.",
        });
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRoomDetails();
  }, [id, navigate]);
  
  // Update available time slots when date changes
  const updateAvailableTimeSlots = (date: Date, roomData: Room) => {
    const dateString = date.toISOString().split('T')[0];
    setValue("date", dateString);
    
    const dayAvailability = roomData.availability.find(a => a.date === dateString);
    
    if (!dayAvailability) {
      setAvailableTimeSlots([]);
      return;
    }
    
    const available = dayAvailability.timeSlots
      .filter(slot => slot.isAvailable)
      .map(slot => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
      }));
    
    setAvailableTimeSlots(available);
    
    // Reset time selections
    setValue("startTime", "");
    setValue("endTime", "");
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    if (!date || !room) return;
    
    setSelectedDate(date);
    updateAvailableTimeSlots(date, room);
  };
  
  const onSubmit = async (data: FormData) => {
    if (!id) return;
    
    setIsReserving(true);
    try {
      const reservationData: CreateReservationData = {
        roomId: id,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        purpose: data.purpose,
        attendees: data.attendees,
      };
      
      await reservationApi.createReservation(reservationData);
      
      toast({
        title: "Reservation successful",
        description: "Your room has been reserved successfully.",
      });
      
      reset();
      navigate("/bookings");
    } catch (error) {
      console.error("Error creating reservation:", error);
      toast({
        variant: "destructive",
        title: "Reservation failed",
        description: "Failed to create reservation. Please try again.",
      });
    } finally {
      setIsReserving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!room) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold">Room not found</h1>
        <p className="mt-2 text-muted-foreground">The room you're looking for doesn't exist.</p>
        <Button 
          className="mt-4" 
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate("/dashboard")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to rooms
      </Button>
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="overflow-hidden rounded-lg">
            <img
              src={room.images[selectedImageIndex] || "https://placehold.co/800x500?text=No+Image"}
              alt={room.name}
              className="h-[400px] w-full object-cover"
            />
          </div>
          
          {room.images.length > 1 && (
            <div className="mt-2 flex space-x-2 overflow-x-auto">
              {room.images.map((image, index) => (
                <button
                  key={index}
                  className={`flex-shrink-0 overflow-hidden rounded ${
                    selectedImageIndex === index ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`${room.name} - ${index + 1}`}
                    className="h-20 w-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
          
          <div className="mt-6">
            <h1 className="text-3xl font-bold">{room.name}</h1>
            
            <div className="mt-2 flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                <span>{room.location}</span>
              </div>
              <div className="flex items-center">
                <Users className="mr-1 h-4 w-4" />
                <span>Capacity: {room.capacity} people</span>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">Description</h2>
                <p className="mt-2 text-muted-foreground">{room.description}</p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold">Amenities</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {room.amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline" className="capitalize">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Make a Reservation</CardTitle>
              <CardDescription>
                Select a date and time to book this room
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form id="reservation-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select date</Label>
                    <div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? (
                              formatDate(selectedDate.toISOString().split('T')[0])
                            ) : (
                              "Pick a date"
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <input 
                        type="hidden" 
                        {...register("date")} 
                      />
                      {errors.date && (
                        <p className="mt-1 text-sm text-destructive">{errors.date.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Select
                        disabled={availableTimeSlots.length === 0}
                        onValueChange={(value) => setValue("startTime", value)}
                      >
                        <SelectTrigger id="startTime">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTimeSlots.map((slot, index) => (
                            <SelectItem key={index} value={slot.startTime}>
                              {slot.startTime}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <input 
                        type="hidden" 
                        {...register("startTime")} 
                      />
                      {errors.startTime && (
                        <p className="mt-1 text-sm text-destructive">{errors.startTime.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Select
                        disabled={!watchStartTime || availableTimeSlots.length === 0}
                        onValueChange={(value) => setValue("endTime", value)}
                      >
                        <SelectTrigger id="endTime">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTimeSlots
                            .filter(slot => {
                              // Only show end times that come after the selected start time
                              if (!watchStartTime) return false;
                              return slot.startTime > watchStartTime;
                            })
                            .map((slot, index) => (
                              <SelectItem key={index} value={slot.endTime}>
                                {slot.endTime}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <input 
                        type="hidden" 
                        {...register("endTime")} 
                      />
                      {errors.endTime && (
                        <p className="mt-1 text-sm text-destructive">{errors.endTime.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="attendees">Number of Attendees</Label>
                    <Input
                      id="attendees"
                      type="number"
                      min="1"
                      max={room.capacity}
                      {...register("attendees", { valueAsNumber: true })}
                    />
                    {errors.attendees && (
                      <p className="mt-1 text-sm text-destructive">{errors.attendees.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose of Reservation</Label>
                    <Textarea
                      id="purpose"
                      placeholder="Brief description of your meeting or event"
                      {...register("purpose")}
                    />
                    {errors.purpose && (
                      <p className="mt-1 text-sm text-destructive">{errors.purpose.message}</p>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              {isAuthenticated ? (
                <Button 
                  className="w-full" 
                  type="submit"
                  form="reservation-form"
                  disabled={isReserving || availableTimeSlots.length === 0}
                >
                  {isReserving ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Reserving...
                    </>
                  ) : (
                    "Reserve Room"
                  )}
                </Button>
              ) : (
                <div className="w-full">
                  <Button 
                    className="w-full" 
                    onClick={() => navigate("/login")}
                    variant="secondary"
                  >
                    Login to Reserve
                  </Button>
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    You need to be logged in to make a reservation
                  </p>
                </div>
              )}
            </CardFooter>
          </Card>
          
          {availableTimeSlots.length === 0 && watchDate && (
            <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-4 text-center dark:border-orange-900 dark:bg-orange-950">
              <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                No available time slots for the selected date.
              </p>
              <p className="mt-1 text-xs text-orange-600 dark:text-orange-400">
                Please try selecting a different date.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
