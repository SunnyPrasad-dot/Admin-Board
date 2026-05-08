import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard,
  CalendarCheck,
  MessageSquare,
  Users,
  DollarSign,
  Settings,
  LogOut,
  Bell,
  Menu,
  Camera,
  ChevronRight,
} from "lucide-react";
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

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/bookings", label: "Confirm Requests", icon: CalendarCheck },
  { href: "/inquiries", label: "Inquiry Requests", icon: MessageSquare },
  { href: "/photographers", label: "Photographers", icon: Users },
  { href: "/prices", label: "Price Management", icon: DollarSign },
  { href: "/settings", label: "Settings", icon: Settings },
];

function NavLink({ item, collapsed }) {
  const [location] = useLocation();
  const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));

  return (
    <Link
      href={item.href}
      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
        isActive
          ? "bg-white/10 text-white"
          : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
      }`}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-400 rounded-r-full" />
      )}
      <item.icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"}`} />
      <span>{item.label}</span>
      {isActive && <ChevronRight className="ml-auto h-3.5 w-3.5 text-slate-500" />}
    </Link>
  );
}

function SidebarContent() {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col h-full bg-[#0F172A]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 ring-1 ring-indigo-500/30">
          <Camera className="h-5 w-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white tracking-wide">TK Studio</h1>
          <p className="text-[11px] text-slate-500">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
          Menu
        </p>
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src="https://i.pravatar.cc/100?img=60" />
            <AvatarFallback className="bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
              {user?.name?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.name || "Admin"}</p>
            <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="shrink-0 p-1.5 rounded-md text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-colors"
            title="Logout"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Layout({ children }) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 fixed inset-y-0 z-20">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-60 flex flex-col min-h-screen">
        {/* Top Bar */}
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
                <SidebarContent />
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
                      {user.name?.charAt(0) || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium text-slate-700">{user.name}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel className="text-xs text-slate-500">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLocation("/profile")}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation("/settings")}>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { localStorage.removeItem("admin-user"); window.location.reload(); }} className="text-red-600">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page */}
        <div className="flex-1 p-5 sm:p-7 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function PageTitle() {
  const [location] = useLocation();
  const titles = {
    "/": "Dashboard",
    "/bookings": "Confirm Requests",
    "/inquiries": "Inquiry Requests",
    "/photographers": "Photographers",
    "/prices": "Price Management",
    "/settings": "Settings",
    "/profile": "My Profile",
  };
  const matched = Object.entries(titles).find(([path]) =>
    path === "/" ? location === "/" : location.startsWith(path)
  );
  return (
    <h2 className="text-sm font-semibold text-slate-700 hidden sm:block">
      {matched ? matched[1] : ""}
    </h2>
  );
}
