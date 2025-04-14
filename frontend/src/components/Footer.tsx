
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-medium">QuickRoom</h3>
            <p className="text-sm text-muted-foreground">
              Simple and efficient room reservation system for your workplace or organization.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
            <div>
              <h4 className="mb-3 text-sm font-medium">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-muted-foreground transition-colors hover:text-foreground">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/bookings" className="text-muted-foreground transition-colors hover:text-foreground">
                    My Bookings
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-medium">Help</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/faq" className="text-muted-foreground transition-colors hover:text-foreground">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-muted-foreground transition-colors hover:text-foreground">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-muted-foreground transition-colors hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} QuickRoom. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
