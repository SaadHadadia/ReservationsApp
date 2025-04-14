
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();
  
  return (
    <div className="container flex h-[calc(100vh-4rem)] flex-col items-center justify-center">
      <ShieldAlert className="h-16 w-16 text-destructive" />
      <h1 className="mt-6 text-3xl font-bold">Access Denied</h1>
      <p className="mt-2 text-center text-muted-foreground">
        You don't have permission to access this page.
      </p>
      <div className="mt-6 flex space-x-4">
        <Button onClick={() => navigate(-1)}>Go Back</Button>
        <Button variant="outline" onClick={() => navigate("/")}>
          Go to Home
        </Button>
      </div>
    </div>
  );
}
