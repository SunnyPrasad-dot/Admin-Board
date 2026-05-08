import { useGetDashboardSummary } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Link } from "wouter";
import { Calendar, Users, MessageSquare, CheckCircle, TrendingUp, ArrowUpRight, Clock } from "lucide-react";

const STATUS_CONFIG = {
  new:       { label: "New",       cls: "bg-blue-50 text-blue-700 ring-1 ring-blue-200" },
  pending:   { label: "Pending",   cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
  assigned:  { label: "Assigned",  cls: "bg-violet-50 text-violet-700 ring-1 ring-violet-200" },
  confirmed: { label: "Confirmed", cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
  cancelled: { label: "Cancelled", cls: "bg-red-50 text-red-700 ring-1 ring-red-200" },
};

const FAKE_BOOKINGS = [
  { id: 1, clientName: "Sarah & James Chen",      eventType: "Wedding",            eventDate: "2026-06-14", status: "new" },
  { id: 2, clientName: "Emily Rodriguez",          eventType: "Birthday",           eventDate: "2026-05-22", status: "pending" },
  { id: 3, clientName: "Michael & Anna Thompson",  eventType: "Wedding",            eventDate: "2026-07-04", status: "assigned" },
  { id: 4, clientName: "David Park",               eventType: "Corporate",          eventDate: "2026-05-18", status: "new" },
  { id: 5, clientName: "Jessica Liu",              eventType: "Baby Shower",        eventDate: "2026-05-25", status: "pending" },
];

const FAKE_INQUIRIES = [
  { id: 1, name: "Kevin O'Brien",        email: "kevin@email.com",   message: "Looking for full-day wedding coverage on June 14, 2026 at The Ritz-Carlton, Boston.", createdAt: "2026-05-08" },
  { id: 2, name: "Priya Sharma",         email: "priya@email.com",   message: "Engagement shoot at Central Park — golden hour if possible. Very flexible on date.", createdAt: "2026-05-07" },
  { id: 3, name: "Mark & Lisa Williams", email: "mlwilliams@email.com", message: "25th anniversary vow renewal, small intimate ceremony. Prefer outdoor setting.", createdAt: "2026-05-06" },
];

export default function Dashboard() {
  const { data: summary, isLoading } = useGetDashboardSummary();

  const stats = [
    { title: "Total Requests",       value: summary?.totalRequests || 48,          icon: Calendar,     color: "text-indigo-500", bg: "bg-indigo-50", change: "+12%", trend: "up" },
    { title: "Confirmed Bookings",   value: summary?.confirmedBookings || 32,       icon: CheckCircle,  color: "text-emerald-500", bg: "bg-emerald-50", change: "+8%", trend: "up" },
    { title: "Inquiry Requests",     value: summary?.inquiryRequests || 11,         icon: MessageSquare,color: "text-amber-500", bg: "bg-amber-50", change: "+3", trend: "up" },
    { title: "Available Photographers", value: summary?.availablePhotographers || 5, icon: Users,      color: "text-violet-500", bg: "bg-violet-50", change: "5 of 7", trend: "neutral" },
  ];

  const bookings = summary?.recentBookings?.length ? summary.recentBookings : FAKE_BOOKINGS;
  const inquiries = FAKE_INQUIRIES;

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white rounded-lg border border-slate-200 px-3 py-2 shadow-sm">
          <Clock className="h-3.5 w-3.5" />
          {format(new Date(), "MMMM d, yyyy")}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{s.title}</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{isLoading ? "—" : s.value}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${s.bg}`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4">
              {s.trend === "up" && <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />}
              <span className={`text-xs font-medium ${s.trend === "up" ? "text-emerald-600" : "text-slate-500"}`}>{s.change}</span>
              {s.trend === "up" && <span className="text-xs text-slate-400">from last month</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">Recent Bookings</h2>
            <Link href="/bookings" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
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
                <Link key={b.id} href={`/bookings/${b.id}`} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="h-9 w-9 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-indigo-600">
                      {b.clientName.split(" ").map(w => w[0]).join("").slice(0,2)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{b.clientName}</p>
                    <p className="text-xs text-slate-400 capitalize">{b.eventType} · {format(new Date(b.eventDate), "MMM d, yyyy")}</p>
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
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">Recent Inquiries</h2>
            <Link href="/inquiries" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {inquiries.map((inq) => (
              <div key={inq.id} className="px-5 py-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-amber-700">{inq.name[0]}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-900">{inq.name}</span>
                  <span className="ml-auto text-[10px] text-slate-400">{format(new Date(inq.createdAt), "MMM d")}</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{inq.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
