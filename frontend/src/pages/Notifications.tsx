
import { useEffect, useState } from "react";
import { Notification, notificationApi } from "@/api/notificationApi";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { 
  Bell, 
  Check, 
  Loader, 
  MailOpen 
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  
  useEffect(() => {
    fetchNotifications();
  }, []);
  
  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await notificationApi.getUserNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        variant: "destructive",
        title: "Failed to load notifications",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const markAsRead = async (notificationId: string) => {
    try {
      await notificationApi.markAsRead(notificationId);
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      toast({
        title: "Notification marked as read",
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        variant: "destructive",
        title: "Failed to mark notification as read",
        description: "Please try again later.",
      });
    }
  };
  
  const markAllAsRead = async () => {
    setIsMarkingAll(true);
    try {
      await notificationApi.markAllAsRead();
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      toast({
        title: "All notifications marked as read",
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast({
        variant: "destructive",
        title: "Failed to mark all notifications as read",
        description: "Please try again later.",
      });
    } finally {
      setIsMarkingAll(false);
    }
  };
  
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount === 0 
              ? "You're all caught up!" 
              : `You have ${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`}
          </p>
        </div>
        
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            onClick={markAllAsRead}
            disabled={isMarkingAll}
          >
            {isMarkingAll ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            Mark all as read
          </Button>
        )}
      </div>
      
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <MailOpen className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No notifications</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You don't have any notifications yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map(notification => (
            <Card key={notification.id} className={notification.read ? "bg-muted/50" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <Bell className="mr-2 h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Notification</CardTitle>
                  </div>
                  {!notification.read && (
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  )}
                </div>
                <CardDescription>
                  {new Date(notification.createdAt).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{notification.message}</p>
              </CardContent>
              {!notification.read && (
                <CardFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Mark as read
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
