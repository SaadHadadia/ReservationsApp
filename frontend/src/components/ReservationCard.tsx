
import { Reservation } from "@/api/reservationApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { 
  Calendar,
  Clock,
  MapPin, 
  Trash, 
  Users, 
  Edit 
} from "lucide-react";
import { Link } from "react-router-dom";

interface ReservationCardProps {
  reservation: Reservation;
  onEdit: (id: string) => void;
  onCancel: (id: string) => void;
}

export function ReservationCard({ reservation, onEdit, onCancel }: ReservationCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-500 hover:bg-green-600';
      case 'PENDING':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'CANCELLED':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const isPastReservation = new Date(`${reservation.date}T${reservation.endTime}`) < new Date();
  const canEdit = !isPastReservation && reservation.status !== 'CANCELLED';

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{reservation.roomName}</CardTitle>
          <Badge className={getStatusColor(reservation.status)}>
            {reservation.status}
          </Badge>
        </div>
        <CardDescription>
          Booking #{reservation.id.substring(0, 8)}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="grid gap-2">
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{formatDate(reservation.date)}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>
              {reservation.startTime} - {reservation.endTime}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{reservation.attendees} attendees</span>
          </div>
          <div className="mt-2 text-sm">
            <div className="font-medium">Purpose:</div>
            <p className="text-muted-foreground">{reservation.purpose}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link to={`/rooms/${reservation.roomId}`}>
          <Button variant="outline" size="sm">
            View Room
          </Button>
        </Link>
        <div className="flex gap-2">
          {canEdit && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(reservation.id)}
              >
                <Edit className="mr-1 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onCancel(reservation.id)}
              >
                <Trash className="mr-1 h-4 w-4" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
