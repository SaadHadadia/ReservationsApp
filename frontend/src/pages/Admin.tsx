import { useEffect, useState } from "react";
import { Room, roomApi } from "@/api/roomApi";
import { User, userApi } from "@/api/userApi";
import { Reservation, reservationApi } from "@/api/reservationApi";
import { CreateNotificationData, notificationApi } from "@/api/notificationApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { formatDate } from "@/lib/utils";
import { 
  Bell, 
  Building, 
  Calendar, 
  Edit, 
  Loader, 
  MoreHorizontal, 
  Plus, 
  Trash, 
  UserIcon,
  Users,
} from "lucide-react";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("rooms");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const [selectedItemForDeletion, setSelectedItemForDeletion] = useState<{
    type: 'room' | 'user' | 'reservation';
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        switch (activeTab) {
          case "rooms":
            const roomsData = await roomApi.getAllRooms();
            setRooms(roomsData);
            break;
          case "users":
            const usersData = await userApi.getAllUsers();
            setUsers(usersData);
            break;
          case "reservations":
            const reservationsData = await reservationApi.getAllReservations();
            setReservations(reservationsData);
            break;
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab}:`, error);
        toast({
          variant: "destructive",
          title: `Failed to load ${activeTab}`,
          description: "Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab]);
  
  const handleDelete = async () => {
    if (!selectedItemForDeletion) return;
    
    setIsDeleting(true);
    try {
      switch (selectedItemForDeletion.type) {
        case 'room':
          await roomApi.deleteRoom(selectedItemForDeletion.id);
          setRooms(prev => prev.filter(room => room.id !== selectedItemForDeletion.id));
          break;
        case 'user':
          await userApi.deleteUser(selectedItemForDeletion.id);
          setUsers(prev => prev.filter(user => user.id !== selectedItemForDeletion.id));
          break;
        case 'reservation':
          await reservationApi.deleteReservation(selectedItemForDeletion.id);
          setReservations(prev => prev.filter(res => res.id !== selectedItemForDeletion.id));
          break;
      }
      
      toast({
        title: "Deleted successfully",
        description: `${selectedItemForDeletion.type} has been deleted.`,
      });
      
      setSelectedItemForDeletion(null);
    } catch (error) {
      console.error(`Error deleting ${selectedItemForDeletion.type}:`, error);
      toast({
        variant: "destructive",
        title: `Failed to delete ${selectedItemForDeletion.type}`,
        description: "Please try again later.",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleSendNotification = async () => {
    if (!selectedUser || !notificationMessage.trim()) return;
    
    setIsSendingNotification(true);
    try {
      const data: CreateNotificationData = {
        userId: selectedUser.id,
        message: notificationMessage,
      };
      
      await notificationApi.createNotification(data);
      
      toast({
        title: "Notification sent",
        description: `Notification has been sent to ${selectedUser.fullName}.`,
      });
      
      setNotificationMessage("");
      setSelectedUser(null);
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        variant: "destructive",
        title: "Failed to send notification",
        description: "Please try again later.",
      });
    } finally {
      setIsSendingNotification(false);
    }
  };
  
  return (
    <div className="container py-8">
      <h1 className="mb-6 text-3xl font-bold">Admin Panel</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="rooms" className="flex items-center">
            <Building className="mr-2 h-4 w-4" />
            Rooms
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="reservations" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Reservations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="rooms">
          <div className="mb-4 flex justify-between">
            <h2 className="text-2xl font-semibold">Manage Rooms</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Room
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Amenities</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No rooms found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    rooms.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell className="font-medium">{room.name}</TableCell>
                        <TableCell>{room.location}</TableCell>
                        <TableCell>{room.capacity}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {room.amenities.slice(0, 2).map((amenity, index) => (
                              <Badge key={index} variant="outline" className="capitalize">
                                {amenity}
                              </Badge>
                            ))}
                            {room.amenities.length > 2 && (
                              <Badge variant="outline">+{room.amenities.length - 2}</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => setSelectedItemForDeletion({
                                  type: 'room',
                                  id: room.id,
                                  name: room.name,
                                })}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="users">
          <div className="mb-4 flex justify-between">
            <h2 className="text-2xl font-semibold">Manage Users</h2>
            <div className="space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Bell className="mr-2 h-4 w-4" />
                    Send Notification
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Notification</DialogTitle>
                    <DialogDescription>
                      Send a notification to a specific user.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="user">Select User</Label>
                      <select
                        id="user"
                        className="form-input"
                        value={selectedUser?.id || ""}
                        onChange={(e) => {
                          const userId = e.target.value;
                          const user = users.find(u => u.id === userId) || null;
                          setSelectedUser(user);
                        }}
                      >
                        <option value="">Select a user</option>
                        {users.map(user => (
                          <option key={user.id} value={user.id}>
                            {user.fullName} ({user.email})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Type your notification message here"
                        value={notificationMessage}
                        onChange={(e) => setNotificationMessage(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button 
                      onClick={handleSendNotification}
                      disabled={!selectedUser || !notificationMessage.trim() || isSendingNotification}
                    >
                      {isSendingNotification ? (
                        <>
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Notification"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.fullName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={user.role === "ADMIN" ? "default" : "outline"}
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user);
                                  setNotificationMessage("");
                                }}
                              >
                                <Bell className="mr-2 h-4 w-4" />
                                Send Notification
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => setSelectedItemForDeletion({
                                  type: 'user',
                                  id: user.id,
                                  name: user.fullName,
                                })}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="reservations">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">Manage Reservations</h2>
          </div>
          
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No reservations found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    reservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell className="font-medium">{reservation.roomName}</TableCell>
                        <TableCell>{reservation.userName}</TableCell>
                        <TableCell>{formatDate(reservation.date)}</TableCell>
                        <TableCell>
                          {reservation.startTime} - {reservation.endTime}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              reservation.status === "CONFIRMED"
                                ? "default"
                                : reservation.status === "PENDING"
                                ? "outline"
                                : "destructive"
                            }
                          >
                            {reservation.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => setSelectedItemForDeletion({
                                  type: 'reservation',
                                  id: reservation.id,
                                  name: `${reservation.roomName} (${formatDate(reservation.date)})`,
                                })}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Cancel Reservation
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <AlertDialog 
        open={!!selectedItemForDeletion} 
        onOpenChange={(open) => !open && setSelectedItemForDeletion(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedItemForDeletion?.type === 'room' ? 'Delete Room' : 
               selectedItemForDeletion?.type === 'user' ? 'Delete User' : 
               'Cancel Reservation'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to 
              {selectedItemForDeletion?.type === 'reservation' ? ' cancel' : ' delete'} 
              {" "}{selectedItemForDeletion?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
