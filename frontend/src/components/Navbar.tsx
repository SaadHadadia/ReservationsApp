
import { useAuth } from "@/auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Bell, LogOut, Menu, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold">QuickRoom</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden flex-1 items-center justify-between md:flex">
          <div className="flex items-center gap-6">
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="font-medium transition-colors hover:text-primary">
                  Dashboard
                </Link>
                <Link to="/bookings" className="font-medium transition-colors hover:text-primary">
                  My Bookings
                </Link>
                {user?.role === "ADMIN" && (
                  <Link to="/admin" className="font-medium transition-colors hover:text-primary">
                    Admin Panel
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <>
                <Link to="/notifications">
                  <Button size="icon" variant="ghost">
                    <Bell className="h-5 w-5" />
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{user?.fullName}</DropdownMenuLabel>
                    <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                      {user?.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => navigate("/profile")}>
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex flex-1 items-center justify-end md:hidden">
          <ThemeToggle />
          
          {isAuthenticated && (
            <Link to="/notifications" className="mr-2">
              <Button size="icon" variant="ghost">
                <Bell className="h-5 w-5" />
              </Button>
            </Link>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="container pb-4 md:hidden">
          <div className="flex flex-col space-y-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">{user?.fullName}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
                <Link 
                  to="/dashboard" 
                  className="py-2 font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/bookings" 
                  className="py-2 font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Bookings
                </Link>
                <Link 
                  to="/profile" 
                  className="py-2 font-medium transition-colors hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Profile
                </Link>
                {user?.role === "ADMIN" && (
                  <Link 
                    to="/admin" 
                    className="py-2 font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
