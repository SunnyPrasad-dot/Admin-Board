import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Sidebar from "@/components/layout/Sidebar";

const PAGE_TITLES = {
  "/": "Dashboard",
  "/bookings": "Confirm Requests",
  "/inquiries": "Inquiry Requests",
  "/photographers": "Photographers",
  "/prices": "Price Management",
  "/settings": "Settings",
  "/profile": "My Profile",
};

function PageTitle() {
  const [location] = useLocation();
  const matched = Object.entries(PAGE_TITLES).find(([path]) =>
    path === "/" ? location === "/" : location.startsWith(path)
  );
  return (
    <h2 className="text-sm font-semibold text-slate-700 hidden sm:block">
      {matched ? matched[1] : ""}
    </h2>
  );
}

export default function Navbar() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden h-8 w-8">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-60 border-0">
            <Sidebar />
          </SheetContent>
        </Sheet>
        <PageTitle />
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4 text-slate-500" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-slate-100 transition-colors">
              <Avatar className="h-7 w-7">
                <AvatarImage src="https://i.pravatar.cc/100?img=60" />
                <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xs font-semibold">
                  {user?.name?.charAt(0) || "A"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm font-medium text-slate-700">
                {user?.name}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel className="text-xs text-slate-500">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setLocation("/profile")}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLocation("/settings")}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                localStorage.removeItem("admin-user");
                window.location.reload();
              }}
              className="text-red-600"
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
