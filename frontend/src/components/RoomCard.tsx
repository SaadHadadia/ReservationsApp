
import { Room } from "@/api/roomApi";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  // Check if there are any available time slots today
  const today = new Date().toISOString().split('T')[0];
  const todayAvailability = room.availability.find(a => a.date === today);
  const hasAvailableSlots = todayAvailability?.timeSlots.some(slot => slot.isAvailable) || false;

  return (
    <Link to={`/rooms/${room.id}`} className="room-card block overflow-hidden">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={room.images[0] || "https://placehold.co/600x400?text=No+Image"}
          alt={room.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {hasAvailableSlots ? (
          <Badge className="absolute right-2 top-2 bg-green-500 hover:bg-green-600">
            Available Today
          </Badge>
        ) : (
          <Badge className="absolute right-2 top-2 bg-orange-500 hover:bg-orange-600">
            Unavailable Today
          </Badge>
        )}
      </div>
      <div className="p-4">
        <h3 className="mb-1 text-lg font-medium">{room.name}</h3>
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="mr-1 h-4 w-4" />
            <span>{room.location}</span>
          </div>
          <div className="flex items-center">
            <Users className="mr-1 h-4 w-4" />
            <span>Capacity: {room.capacity}</span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {room.amenities.slice(0, 3).map((amenity, index) => (
            <Badge key={index} variant="outline" className="capitalize">
              {amenity}
            </Badge>
          ))}
          {room.amenities.length > 3 && (
            <Badge variant="outline">+{room.amenities.length - 3} more</Badge>
          )}
        </div>
      </div>
    </Link>
  );
}
