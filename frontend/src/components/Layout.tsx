
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Loader } from "lucide-react";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
