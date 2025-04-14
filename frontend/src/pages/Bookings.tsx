
import { useEffect, useState } from "react";
import { Reservation, reservationApi } from "@/api/reservationApi";
import { ReservationCard } from "@/components/ReservationCard";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Loader, CalendarX } from "lucide-react";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Bookings() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDeletingReservation, setIsDeletingReservation] = useState(false);
  
  useEffect(() => {
    fetchReservations();
  }, []);
  
  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const data = await reservationApi.getUserReservations();
      setReservations(data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      toast({
        variant: "destructive",
        title: "Failed to load reservations",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditReservation = (id: string) => {
    const reservation = reservations.find(r => r.id === id);
    if (reservation) {
      setSelectedReservation(reservation);
    }
  };
  
  const handleCancelReservation = (id: string) => {
    const reservation = reservations.find(r => r.id === id);
    if (reservation) {
      setSelectedReservation(reservation);
    }
  };
  
  const confirmCancelReservation = async () => {
    if (!selectedReservation) return;
    
    setIsDeletingReservation(true);
    try {
      await reservationApi.deleteReservation(selectedReservation.id);
      
      setReservations(prev => 
        prev.filter(r => r.id !== selectedReservation.id)
      );
      
      toast({
        title: "Reservation cancelled",
        description: "Your reservation has been successfully cancelled.",
      });
      
      setSelectedReservation(null);
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      toast({
        variant: "destructive",
        title: "Failed to cancel reservation",
        description: "Please try again later.",
      });
    } finally {
      setIsDeletingReservation(false);
    }
  };
  
  // Filter reservations by status
  const upcoming = reservations.filter(
    r => r.status !== 'CANCELLED' && new Date(`${r.date}T${r.startTime}`) > new Date()
  );
  
  const past = reservations.filter(
    r => r.status !== 'CANCELLED' && new Date(`${r.date}T${r.endTime}`) < new Date()
  );
  
  const cancelled = reservations.filter(r => r.status === 'CANCELLED');
  
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <h1 className="mb-6 text-3xl font-bold">My Bookings</h1>
      
      {reservations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <CalendarX className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No bookings found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You haven't made any room reservations yet.
          </p>
          <Button className="mt-4" asChild>
            <a href="/dashboard">Browse Rooms</a>
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">
              Upcoming
              {upcoming.length > 0 && (
                <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {upcoming.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {upcoming.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <h3 className="text-lg font-medium">No upcoming bookings</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  You don't have any upcoming reservations.
                </p>
                <Button className="mt-4" asChild>
                  <a href="/dashboard">Book a Room</a>
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcoming.map(reservation => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onEdit={handleEditReservation}
                    onCancel={handleCancelReservation}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {past.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <h3 className="text-lg font-medium">No past bookings</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  You don't have any past reservations.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {past.map(reservation => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onEdit={handleEditReservation}
                    onCancel={handleCancelReservation}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="cancelled">
            {cancelled.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <h3 className="text-lg font-medium">No cancelled bookings</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  You don't have any cancelled reservations.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cancelled.map(reservation => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onEdit={handleEditReservation}
                    onCancel={handleCancelReservation}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
      
      {/* Cancel Reservation Confirmation Dialog */}
      <AlertDialog open={!!selectedReservation} onOpenChange={(open) => !open && setSelectedReservation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Reservation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this reservation? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancelReservation}
              disabled={isDeletingReservation}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingReservation ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isDeletingReservation ? "Cancelling..." : "Confirm Cancel"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
