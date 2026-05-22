import { useGetDashboardSummary } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Link } from "wouter";
import { getInitials } from "@/lib/utils";
import { Calendar, Users, MessageSquare, CheckCircle, TrendingUp, ArrowUpRight, Clock } from "lucide-react";

const STATUS_CONFIG = {
  new:       { label: "New",       cls: "bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/30" },
  pending:   { label: "Pending",   cls: "bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/30" },
  assigned:  { label: "Assigned",  cls: "bg-violet-500/10 text-violet-500 ring-1 ring-violet-500/30" },
  confirmed: { label: "Confirmed", cls: "bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/30" },
  cancelled: { label: "Cancelled", cls: "bg-red-500/10 text-red-500 ring-1 ring-red-500/30" },
};

const FAKE_BOOKINGS = [
  { id: 1, clientName: "Sarah & James Chen",      eventType: "Wedding",       eventDate: "2026-06-14", status: "new" },
  { id: 2, clientName: "Emily Rodriguez",          eventType: "Birthday",      eventDate: "2026-05-22", status: "pending" },
  { id: 3, clientName: "Michael & Anna Thompson",  eventType: "Wedding",       eventDate: "2026-07-04", status: "assigned" },
  { id: 4, clientName: "David Park",               eventType: "Corporate",     eventDate: "2026-05-18", status: "new" },
  { id: 5, clientName: "Jessica Liu",              eventType: "Baby Shower",   eventDate: "2026-05-25", status: "pending" },
];

const FAKE_INQUIRIES = [
  { id: 1, name: "Kevin O'Brien",        email: "kevin@email.com",     message: "Looking for full-day wedding coverage on June 14, 2026 at The Ritz-Carlton, Boston.", createdAt: "2026-05-08" },
  { id: 2, name: "Priya Sharma",         email: "priya@email.com",     message: "Engagement shoot at Central Park — golden hour if possible. Very flexible on date.", createdAt: "2026-05-07" },
  { id: 3, name: "Mark & Lisa Williams", email: "mlwilliams@email.com", message: "25th anniversary vow renewal, small intimate ceremony. Prefer outdoor setting.", createdAt: "2026-05-06" },
];

export default function Dashboard() {
  const { data: summary, isLoading } = useGetDashboardSummary();

  const stats = [
    { title: "Total Requests",          value: summary?.totalRequests || 48,          icon: Calendar,      color: "text-primary", bg: "bg-primary/10", change: "+12%", trend: "up" },
    { title: "Confirmed Bookings",      value: summary?.confirmedBookings || 32,       icon: CheckCircle,   color: "text-emerald-500", bg: "bg-emerald-500/10", change: "+8%", trend: "up" },
    { title: "Inquiry Requests",        value: summary?.inquiryRequests || 11,         icon: MessageSquare, color: "text-amber-500", bg: "bg-amber-500/10", change: "+3%", trend: "up" },
    { title: "Available Photographers", value: summary?.availablePhotographers || 5,   icon: Users,         color: "text-violet-500", bg: "bg-violet-500/10", change: "5 of 7", trend: "neutral" },
  ];

  const bookings = summary?.recentBookings?.length ? summary.recentBookings : FAKE_BOOKINGS;
  const inquiries = FAKE_INQUIRIES;

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card rounded-lg border border-border px-3 py-2 shadow-sm">
          <Clock className="h-3.5 w-3.5" />
          {format(new Date(), "MMMM d, yyyy")}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <div key={i} className="bg-card rounded-2xl p-5 border border-border shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{s.title}</p>
                <p className="text-3xl font-bold text-foreground mt-2">{isLoading ? "—" : s.value}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${s.bg}`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4">
              {s.trend === "up" && <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />}
              <span className={`text-xs font-medium ${s.trend === "up" ? "text-emerald-500" : "text-muted-foreground"}`}>{s.change}</span>
              {s.trend === "up" && <span className="text-xs text-muted-foreground">from last month</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="xl:col-span-2 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Recent Bookings</h2>
            <Link href="/bookings" className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="px-6 py-4 flex items-center gap-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              ))
            ) : bookings.map((b) => {
              const sc = STATUS_CONFIG[b.status] || STATUS_CONFIG.new;
              return (
                <Link key={b.id} href={`/bookings/${b.id}`} className="flex items-center gap-4 px-6 py-3.5 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">
                      {getInitials(b.clientName)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{b.clientName}</p>
                    <p className="text-xs text-muted-foreground capitalize">{b.eventType} · {format(new Date(b.eventDate), "MMM d, yyyy")}</p>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${sc.cls}`}>
                    {sc.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Recent Inquiries</h2>
            <Link href="/inquiries" className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {inquiries.map((inq) => (
              <div key={inq.id} className="px-5 py-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="h-6 w-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-primary">{getInitials(inq.name)}</span>
                  </div>
                  <span className="text-xs font-semibold text-foreground">{inq.name}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground">{format(new Date(inq.createdAt), "MMM d")}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{inq.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
