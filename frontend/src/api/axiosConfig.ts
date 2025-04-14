
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    if (response) {
      // Handle specific status codes
      switch (response.status) {
        case 401:
          // Unauthorized - Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Only show the toast if we're not on the login page
          if (!window.location.pathname.includes('/login')) {
            toast({
              title: "Session expired",
              description: "Please login again to continue.",
              variant: "destructive",
            });
            
            // Redirect to login
            window.location.href = '/login';
          }
          break;
        
        case 403:
          toast({
            title: "Access denied",
            description: "You don't have permission to access this resource.",
            variant: "destructive",
          });
          break;
          
        case 404:
          // Not found
          toast({
            title: "Resource not found",
            description: "The requested resource does not exist.",
            variant: "destructive",
          });
          break;
          
        case 500:
          // Server error
          toast({
            title: "Server error",
            description: "Something went wrong on our end. Please try again later.",
            variant: "destructive",
          });
          break;
          
        default:
          // Default error message
          if (response.data && response.data.message) {
            toast({
              title: "Error",
              description: response.data.message,
              variant: "destructive",
            });
          } else {
            toast({
              title: "Error",
              description: "An unexpected error occurred.",
              variant: "destructive",
            });
          }
      }
    } else {
      // Network error or the server is down
      toast({
        title: "Connection error",
        description: "Unable to connect to the server. Please check your internet connection.",
        variant: "destructive",
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;
