import { useState } from "react";
import { Link } from "wouter";
import { useGetBookings } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Search, SlidersHorizontal, ArrowRight, MapPin, Calendar } from "lucide-react";

const STATUS_CONFIG = {
  new:       { label: "New",       cls: "bg-blue-50 text-blue-700 ring-1 ring-blue-200" },
  pending:   { label: "Pending",   cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
  assigned:  { label: "Assigned",  cls: "bg-violet-50 text-violet-700 ring-1 ring-violet-200" },
  confirmed: { label: "Confirmed", cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
  cancelled: { label: "Cancelled", cls: "bg-red-50 text-red-700 ring-1 ring-red-200" },
};

const FAKE_BOOKINGS = [
  { id: 1, clientName: "Sarah & James Chen",     clientEmail: "sarah.chen@email.com",    eventType: "Wedding",         eventDate: "2026-06-14", location: "Grand Ballroom, New York",     status: "new",       totalPrice: 3500 },
  { id: 2, clientName: "Emily Rodriguez",         clientEmail: "emily.r@email.com",       eventType: "Birthday Party",  eventDate: "2026-05-22", location: "Miami Beach Resort, FL",       status: "pending",   totalPrice: 1800 },
  { id: 3, clientName: "Michael & Anna Thompson", clientEmail: "m.thompson@email.com",    eventType: "Wedding",         eventDate: "2026-07-04", location: "Napa Valley Vineyard, CA",     status: "assigned",  totalPrice: 5200 },
  { id: 4, clientName: "David Park",              clientEmail: "dpark@acme.com",          eventType: "Corporate",       eventDate: "2026-05-18", location: "Marriott Conference, Chicago", status: "new",       totalPrice: 900 },
  { id: 5, clientName: "Jessica Liu",             clientEmail: "jliu@email.com",          eventType: "Baby Shower",     eventDate: "2026-05-25", location: "Botanical Gardens, SF",        status: "pending",   totalPrice: 1200 },
  { id: 6, clientName: "Robert & Maria Santos",   clientEmail: "rsantos@email.com",       eventType: "Wedding",         eventDate: "2026-08-12", location: "SF City Hall, CA",             status: "confirmed", totalPrice: 4800 },
  { id: 7, clientName: "Amanda Foster",           clientEmail: "amanda.f@email.com",      eventType: "Graduation",      eventDate: "2026-06-20", location: "UCLA Campus, Los Angeles",     status: "new",       totalPrice: 650 },
  { id: 8, clientName: "Tom & Lisa Bradley",      clientEmail: "tbradley@email.com",      eventType: "Vow Renewal",     eventDate: "2026-09-05", location: "Four Seasons Maui, Hawaii",   status: "pending",   totalPrice: 3100 },
];

const INITIALS_COLORS = [
  "bg-indigo-100 text-indigo-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];

export default function Bookings() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const { data: apiBookings, isLoading } = useGetBookings({
    search: search || undefined,
    status: status !== "all" ? status : undefined,
  });

  const allBookings = apiBookings?.length ? apiBookings : FAKE_BOOKINGS;
  const bookings = allBookings.filter((b) => {
    const matchSearch = !search || b.clientName.toLowerCase().includes(search.toLowerCase()) || b.clientEmail?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === "all" || b.status === status;
    return matchSearch && matchStatus;
  });

  const statusCounts = { all: allBookings.length };
  allBookings.forEach(b => { statusCounts[b.status] = (statusCounts[b.status] || 0) + 1; });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Confirm Requests</h1>
          <p className="text-sm text-slate-500 mt-0.5">{allBookings.length} total requests</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            placeholder="Search client, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 w-64 bg-white text-sm border-slate-200 rounded-xl shadow-sm"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-9 w-44 bg-white border-slate-200 rounded-xl shadow-sm text-sm">
            <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Event</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Date</th>
              <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Location</th>
              <th className="text-center px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="text-right px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4"><Skeleton className="h-9 w-full" /></td>
                  <td className="px-4 py-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-4 py-4 hidden md:table-cell"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-4 py-4 hidden lg:table-cell"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-4 py-4"><Skeleton className="h-5 w-16 mx-auto rounded-full" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-12 ml-auto" /></td>
                </tr>
              ))
            ) : !bookings.length ? (
              <tr>
                <td colSpan={6} className="text-center py-14 text-slate-400 text-sm">
                  No bookings match your current filters.
                </td>
              </tr>
            ) : bookings.map((b, idx) => {
              const sc = STATUS_CONFIG[b.status] || STATUS_CONFIG.new;
              const ic = INITIALS_COLORS[idx % INITIALS_COLORS.length];
              const initials = b.clientName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
              return (
                <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${ic}`}>
                        {initials}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{b.clientName}</p>
                        <p className="text-xs text-slate-400">{b.clientEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="capitalize text-slate-700 font-medium">{b.eventType}</span>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      {format(new Date(b.eventDate), "MMM d, yyyy")}
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[160px]">{b.location}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${sc.cls}`}>
                      {sc.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <span className="font-semibold text-slate-900">${(b.totalPrice || 0).toLocaleString()}</span>
                      <Button asChild variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-indigo-50 hover:text-indigo-600">
                        <Link href={`/bookings/${b.id}`}><ArrowRight className="h-3.5 w-3.5" /></Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
