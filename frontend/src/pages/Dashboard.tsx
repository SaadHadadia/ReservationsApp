import { useEffect, useState } from "react";
import { Room, RoomFilter, roomApi } from "@/api/roomApi";
import { RoomCard } from "@/components/RoomCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  Loader, 
  Calendar as CalendarIcon,
  Users
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, formatDate } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filters
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [location, setLocation] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  // Available values from data
  const [locations, setLocations] = useState<string[]>([]);
  const [allAmenities, setAllAmenities] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoading(true);
      try {
        const roomsData = await roomApi.getAllRooms();
        setRooms(roomsData);
        setFilteredRooms(roomsData);
        
        // Extract unique locations and amenities
        const uniqueLocations = [...new Set(roomsData.map(room => room.location))];
        const uniqueAmenities = [...new Set(roomsData.flatMap(room => room.amenities))];
        
        setLocations(uniqueLocations);
        setAllAmenities(uniqueAmenities);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRooms();
  }, []);
  
  // Apply search term filter
  useEffect(() => {
    if (searchTerm.trim() === "") {
      applyFilters();
      return;
    }
    
    const filtered = rooms.filter(room => 
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredRooms(filtered);
  }, [searchTerm, rooms]);
  
  // Apply all filters
  const applyFilters = () => {
    let filtered = rooms;
    const activeFiltersList: string[] = [];
    
    // Filter by location
    if (location) {
      filtered = filtered.filter(room => room.location === location);
      activeFiltersList.push(`Location: ${location}`);
    }
    
    // Filter by capacity
    if (capacity) {
      const capacityNum = parseInt(capacity);
      filtered = filtered.filter(room => room.capacity >= capacityNum);
      activeFiltersList.push(`Capacity: ${capacity}+`);
    }
    
    // Filter by date and availability
    if (date) {
      const dateString = date.toISOString().split('T')[0];
      filtered = filtered.filter(room => 
        room.availability?.some(a => a.date === dateString && a.timeSlots?.some(slot => slot.isAvailable)) || false
      );
      activeFiltersList.push(`Date: ${formatDate(dateString)}`);
    }
    
    // Filter by amenities
    if (amenities.length > 0) {
      filtered = filtered.filter(room => 
        amenities.every(amenity => room.amenities?.includes(amenity))
      );
      activeFiltersList.push(`Amenities: ${amenities.length} selected`);
    }
    
    setFilteredRooms(filtered);
    setActiveFilters(activeFiltersList);
  };
  
  const resetFilters = () => {
    setLocation("");
    setCapacity("");
    setDate(new Date());
    setAmenities([]);
    setActiveFilters([]);
    setFilteredRooms(rooms);
  };
  
  const toggleAmenity = (amenity: string) => {
    setAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity) 
        : [...prev, amenity]
    );
  };
  
  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">Available Rooms</h1>
        <p className="text-muted-foreground">
          Find and book the perfect room for your needs
        </p>
      </div>
      
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rooms..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="border-dashed"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? formatDate(date.toISOString().split('T')[0]) : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {activeFilters.length > 0 && (
                <Badge 
                  variant="secondary" 
                  className="ml-2"
                >
                  {activeFilters.length}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Rooms</SheetTitle>
              <SheetDescription>
                Narrow down your search with filters
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any location</SelectItem>
                    {locations.map(loc => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capacity">Minimum Capacity</Label>
                <Select value={capacity} onValueChange={setCapacity}>
                  <SelectTrigger id="capacity">
                    <SelectValue placeholder="Select capacity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any capacity</SelectItem>
                    <SelectItem value="2">2+ people</SelectItem>
                    <SelectItem value="4">4+ people</SelectItem>
                    <SelectItem value="8">8+ people</SelectItem>
                    <SelectItem value="12">12+ people</SelectItem>
                    <SelectItem value="20">20+ people</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 gap-2">
                  {allAmenities.map(amenity => (
                    <div key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`amenity-${amenity}`}
                        checked={amenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="mr-2 h-4 w-4 rounded border-gray-300"
                      />
                      <label 
                        htmlFor={`amenity-${amenity}`}
                        className="text-sm capitalize"
                      >
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <SheetFooter>
              <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
              <SheetClose asChild>
                <Button onClick={applyFilters}>Apply Filters</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      
      {activeFilters.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter, index) => (
            <Badge key={index} variant="secondary">
              {filter}
            </Badge>
          ))}
          <Button 
            variant="link" 
            className="h-auto p-0 text-sm font-medium"
            onClick={resetFilters}
          >
            Clear all
          </Button>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {filteredRooms.length === 0 ? (
            <div className="mt-12 text-center">
              <h3 className="text-xl font-semibold">No rooms found</h3>
              <p className="mt-2 text-muted-foreground">
                Try adjusting your filters or search term
              </p>
              <Button className="mt-4" onClick={resetFilters}>Reset Filters</Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
