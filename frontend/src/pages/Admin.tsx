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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("rooms");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const [selectedItemForDeletion, setSelectedItemForDeletion] = useState<{
    type: 'room' | 'user' | 'reservation';
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddingReservation, setIsAddingReservation] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: '',
    location: '',
    capacity: 0,
    amenities: [] as string[],
    description: ''
  });
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'USER'
  });
  const [newReservation, setNewReservation] = useState({
    roomId: '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    attendees: 1,
    userId: ''
  });
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
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
  
  const handleAddReservation = async () => {
    try {
      setIsAddingReservation(true);
      const reservationData = {
        roomId: newReservation.roomId,
        date: newReservation.date,
        startTime: newReservation.startTime,
        endTime: newReservation.endTime,
        purpose: newReservation.purpose,
        attendees: newReservation.attendees,
        userId: newReservation.userId
      };
      
      await reservationApi.createReservationAsAdmin(reservationData);
      
      toast({
        title: "Reservation added successfully",
        description: "The new reservation has been created.",
      });
      
      setNewReservation({
        roomId: '',
        date: '',
        startTime: '',
        endTime: '',
        purpose: '',
        attendees: 1,
        userId: ''
      });
      
      // Rafraîchir la liste des réservations
      const reservationsData = await reservationApi.getAllReservations();
      setReservations(reservationsData);
    } catch (error) {
      console.error("Error adding reservation:", error);
      toast({
        variant: "destructive",
        title: "Failed to add reservation",
        description: "Please try again later.",
      });
    } finally {
      setIsAddingReservation(false);
    }
  };

  const handleAddRoom = async () => {
    try {
      const roomData = await roomApi.createRoom(newRoom);
      setRooms(prev => [...prev, roomData]);
      setNewRoom({
        name: '',
        location: '',
        capacity: 0,
        amenities: [],
        description: ''
      });
      toast({
        title: "Room added successfully",
        description: "The new room has been created.",
      });
    } catch (error) {
      console.error("Error adding room:", error);
      toast({
        variant: "destructive",
        title: "Failed to add room",
        description: "Please try again later.",
      });
    }
  };

  const handleAddUser = async () => {
    try {
      const userData = await userApi.createUser(newUser);
      setUsers(prev => [...prev, userData]);
      setNewUser({
        email: '',
        password: '',
        fullName: '',
        role: 'USER'
      });
      toast({
        title: "User added successfully",
        description: "The new user has been created.",
      });
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        variant: "destructive",
        title: "Failed to add user",
        description: "Please try again later.",
      });
    }
  };

  const handleEditRoom = async (room: Room) => {
    setEditingRoom(room);
  };

  const handleEditUser = async (user: User) => {
    setEditingUser(user);
  };

  const handleUpdateRoom = async () => {
    if (!editingRoom) return;
    
    try {
      const updatedRoom = await roomApi.updateRoom(editingRoom.id, editingRoom);
      setRooms(prev => prev.map(room => 
        room.id === updatedRoom.id ? updatedRoom : room
      ));
      setEditingRoom(null);
      toast({
        title: "Room updated successfully",
        description: "The room has been updated.",
      });
    } catch (error) {
      console.error("Error updating room:", error);
      toast({
        variant: "destructive",
        title: "Failed to update room",
        description: "Please try again later.",
      });
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    try {
      const updatedUser = await userApi.updateUser(editingUser.id, editingUser);
      setUsers(prev => prev.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));
      setEditingUser(null);
      toast({
        title: "User updated successfully",
        description: "The user has been updated.",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        variant: "destructive",
        title: "Failed to update user",
        description: "Please try again later.",
      });
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
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Room
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Room</DialogTitle>
                  <DialogDescription>
                    Create a new room with its details.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newRoom.name}
                      onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newRoom.location}
                      onChange={(e) => setNewRoom({ ...newRoom, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={newRoom.capacity}
                      onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newRoom.description}
                      onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleAddRoom}>Add Room</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                            {(room.amenities || []).slice(0, 2).map((amenity, index) => (
                              <Badge key={index} variant="outline" className="capitalize">
                                {amenity}
                              </Badge>
                            ))}
                            {room.amenities && room.amenities.length > 2 && (
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
                              <DropdownMenuItem onClick={() => handleEditRoom(room)}>
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
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                      Create a new user account.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={newUser.fullName}
                        onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                      >
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">User</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleAddUser}>Add User</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
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
        
        <TabsContent value="reservations">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Manage Reservations</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Reservation
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Reservation</DialogTitle>
                  <DialogDescription>
                    Create a new reservation.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="room">Room</Label>
                    <select
                      id="room"
                      className="form-input"
                      value={newReservation.roomId}
                      onChange={(e) => setNewReservation({ ...newReservation, roomId: e.target.value })}
                    >
                      <option value="">Select a room</option>
                      {rooms.map(room => (
                        <option key={room.id} value={room.id}>
                          {room.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newReservation.date}
                      onChange={(e) => setNewReservation({ ...newReservation, date: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={newReservation.startTime}
                      onChange={(e) => setNewReservation({ ...newReservation, startTime: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newReservation.endTime}
                      onChange={(e) => setNewReservation({ ...newReservation, endTime: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose</Label>
                    <Input
                      id="purpose"
                      value={newReservation.purpose}
                      onChange={(e) => setNewReservation({ ...newReservation, purpose: e.target.value })}
                      placeholder="Enter the purpose of the reservation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="attendees">Number of Attendees</Label>
                    <Input
                      id="attendees"
                      type="number"
                      min="1"
                      value={newReservation.attendees}
                      onChange={(e) => setNewReservation({ ...newReservation, attendees: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button 
                    onClick={handleAddReservation}
                    disabled={isAddingReservation || !newReservation.roomId || !newReservation.date || !newReservation.startTime || !newReservation.endTime}
                  >
                    {isAddingReservation ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Reservation"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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

      {/* Edit Room Dialog */}
      <Dialog open={!!editingRoom} onOpenChange={() => setEditingRoom(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>
              Modify the room details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editingRoom?.name || ''}
                onChange={(e) => setEditingRoom(prev => prev ? {...prev, name: e.target.value} : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={editingRoom?.location || ''}
                onChange={(e) => setEditingRoom(prev => prev ? {...prev, location: e.target.value} : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-capacity">Capacity</Label>
              <Input
                id="edit-capacity"
                type="number"
                value={editingRoom?.capacity || 0}
                onChange={(e) => setEditingRoom(prev => prev ? {...prev, capacity: parseInt(e.target.value)} : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editingRoom?.description || ''}
                onChange={(e) => setEditingRoom(prev => prev ? {...prev, description: e.target.value} : null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRoom(null)}>Cancel</Button>
            <Button onClick={handleUpdateRoom}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Modify the user details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editingUser?.email || ''}
                onChange={(e) => setEditingUser(prev => prev ? {...prev, email: e.target.value} : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-fullName">Full Name</Label>
              <Input
                id="edit-fullName"
                value={editingUser?.fullName || ''}
                onChange={(e) => setEditingUser(prev => prev ? {...prev, fullName: e.target.value} : null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={editingUser?.role || 'USER'}
                onValueChange={(value) => setEditingUser(prev => prev ? {...prev, role: value} : null)}
              >
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
            <Button onClick={handleUpdateUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
