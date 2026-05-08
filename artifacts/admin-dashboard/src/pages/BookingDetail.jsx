import { useRoute, Link } from "wouter";
import {
  useGetBooking,
  getGetBookingQueryKey,
  useUpdateBooking,
  useGetAvailablePhotographers,
  useAssignPhotographer
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Phone, Calendar, ChevronLeft, CheckCircle, Star, User } from "lucide-react";

const STATUS_CONFIG = {
  new:       { label: "New",       cls: "bg-blue-50 text-blue-700 ring-1 ring-blue-200" },
  pending:   { label: "Pending",   cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" },
  assigned:  { label: "Assigned",  cls: "bg-violet-50 text-violet-700 ring-1 ring-violet-200" },
  confirmed: { label: "Confirmed", cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
};

const FAKE_BOOKINGS = {
  1: {
    id: 1, clientName: "Sarah & James Chen", clientEmail: "sarah.chen@email.com", clientPhone: "+1 (917) 555-0192",
    eventType: "Wedding", eventDate: "2026-06-14", location: "Grand Ballroom, New York, NY",
    status: "new", totalPrice: 3500, packageName: "Full Day Wedding Premium",
    notes: "Couple prefers candid shots. Reception at 6pm. Ceremony at 2pm. Please capture the first dance and cake cutting.",
    addons: ["Drone Photography", "Second Shooter", "Same-Day Preview"],
    days: [
      { dayNumber: 1, date: "2026-06-14", details: "Bridal prep & ceremony (10am–4pm)", photographerName: null },
      { dayNumber: 2, date: "2026-06-15", details: "Post-wedding brunch & portrait session", photographerName: null },
    ],
  },
  2: {
    id: 2, clientName: "Emily Rodriguez", clientEmail: "emily.r@email.com", clientPhone: "+1 (305) 555-0834",
    eventType: "Birthday Party", eventDate: "2026-05-22", location: "Miami Beach Resort, FL",
    status: "pending", totalPrice: 1800, packageName: "Half Day Events",
    notes: "Sweet 16 party. Outdoor pool area at sunset.",
    addons: ["Photo Booth Setup"],
    days: [
      { dayNumber: 1, date: "2026-05-22", details: "Party coverage (4pm–10pm)", photographerName: "Olivia Torres" },
    ],
  },
};

export default function BookingDetail() {
  const [, params] = useRoute("/bookings/:id");
  const id = parseInt(params.id, 10);
  const queryClient = useQueryClient();
  const { data: apiBooking, isLoading } = useGetBooking(id, { query: { enabled: !!id } });
  const updateBooking = useUpdateBooking();
  const assignPhotographer = useAssignPhotographer();

  const [selectedDay, setSelectedDay] = useState(null);
  const [assigningPhotographer, setAssigningPhotographer] = useState(null);

  const searchDate = selectedDay ? selectedDay.date : null;
  const { data: availability, isLoading: isAvailabilityLoading } = useGetAvailablePhotographers(
    { date: searchDate },
    { query: { enabled: !!selectedDay } }
  );

  const booking = apiBooking || FAKE_BOOKINGS[id] || FAKE_BOOKINGS[1];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3 rounded-xl" />
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  const sc = STATUS_CONFIG[booking.status] || STATUS_CONFIG.new;

  const confirmAssignment = () => {
    if (!selectedDay || !assigningPhotographer) return;
    if (apiBooking) {
      assignPhotographer.mutate(
        { id, data: { dayNumber: selectedDay.dayNumber, photographerId: assigningPhotographer.id } },
        { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetBookingQueryKey(id) }); setAssigningPhotographer(null); setSelectedDay(null); } }
      );
    } else {
      setAssigningPhotographer(null);
      setSelectedDay(null);
    }
  };

  const handleConfirmRequest = () => {
    if (apiBooking) {
      updateBooking.mutate({ id, data: { status: "confirmed" } }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetBookingQueryKey(id) })
      });
    }
  };

  const FAKE_AVAILABLE = [
    { id: 1, name: "Alexandra Kim",  specialization: "Wedding & Portrait", avatarUrl: "https://i.pravatar.cc/300?img=47", rating: 4.9, currentBookingCount: 3 },
    { id: 5, name: "Olivia Torres",  specialization: "Wedding & Maternity", avatarUrl: "https://i.pravatar.cc/300?img=44", rating: 5.0, currentBookingCount: 2 },
    { id: 4, name: "Marcus Chen",    specialization: "Commercial & Fashion", avatarUrl: "https://i.pravatar.cc/300?img=11", rating: 4.6, currentBookingCount: 1 },
    { id: 7, name: "Priya Patel",    specialization: "Corporate & Events",   avatarUrl: "https://i.pravatar.cc/300?img=45", rating: 4.7, currentBookingCount: 1 },
  ];
  const FAKE_UNAVAILABLE = [
    { id: 3, name: "Sarah Mitchell", specialization: "Nature & Landscape", avatarUrl: "https://i.pravatar.cc/300?img=48", reason: "Booked: Napa Valley Wedding" },
    { id: 6, name: "Daniel Brooks",  specialization: "Documentary & Street", avatarUrl: "https://i.pravatar.cc/300?img=15", reason: "Busy: Seattle Corporate Event" },
  ];

  const availablePhotographers = availability?.available || FAKE_AVAILABLE;
  const unavailablePhotographers = availability?.unavailable || FAKE_UNAVAILABLE;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link href="/bookings" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
            <ChevronLeft className="h-4 w-4" /> Back
          </Link>
          <div className="w-px h-5 bg-slate-200" />
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-slate-900">{booking.clientName}</h1>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${sc.cls}`}>{sc.label}</span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5 capitalize">{booking.eventType} · Booking #{booking.id}</p>
          </div>
        </div>
        {booking.status !== "confirmed" && (
          <button
            onClick={handleConfirmRequest}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all shadow-sm"
          >
            <CheckCircle className="h-4 w-4" /> Confirm Request
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          {/* Event details */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-5">Event Details</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {[
                { label: "Event Type",    value: booking.eventType,   capitalize: true },
                { label: "Date",          value: format(new Date(booking.eventDate), "MMMM d, yyyy") },
                { label: "Location",      value: booking.location,   icon: MapPin },
              ].map(({ label, value, capitalize, icon: Icon }) => (
                <div key={label}>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">{label}</p>
                  <p className={`text-sm font-semibold text-slate-800 ${capitalize ? "capitalize" : ""}`}>
                    {Icon && <Icon className="inline h-3.5 w-3.5 text-slate-400 mr-1" />}
                    {value}
                  </p>
                </div>
              ))}
            </div>
            {booking.notes && (
              <div className="mt-5 pt-5 border-t border-slate-100">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Client Notes</p>
                <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-4 leading-relaxed">{booking.notes}</p>
              </div>
            )}
          </div>

          {/* Days & assignments */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Event Days & Photographer Assignment</h3>
            <div className="space-y-3">
              {booking.days?.map((day) => (
                <div key={day.dayNumber} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-[11px] font-bold text-indigo-600">
                        {day.dayNumber}
                      </div>
                      <span className="text-sm font-semibold text-slate-900">
                        {format(new Date(day.date), "EEEE, MMM d, yyyy")}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 ml-8">{day.details}</p>
                    {day.photographerName && (
                      <div className="ml-8 mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
                        <User className="h-3 w-3" /> {day.photographerName}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedDay(selectedDay?.dayNumber === day.dayNumber ? null : day)}
                    className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      day.photographerName
                        ? "border border-slate-200 text-slate-600 hover:bg-slate-100"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {day.photographerName ? "Change" : "Assign Photographer"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Photographer selection panel */}
          {selectedDay && (
            <div className="bg-white rounded-2xl border-2 border-indigo-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Select Photographer — Day {selectedDay.dayNumber}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{format(new Date(selectedDay.date), "EEEE, MMMM d, yyyy")}</p>
                </div>
                <button onClick={() => setSelectedDay(null)} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
              </div>

              {isAvailabilityLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Available Photographers</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {availablePhotographers.map((photo) => (
                        <div key={photo.id} className="flex items-center gap-3 p-3.5 border border-slate-200 rounded-xl bg-white hover:border-indigo-200 hover:bg-indigo-50/40 transition-all">
                          <img
                            src={photo.avatarUrl || `https://i.pravatar.cc/100?u=${photo.id}`}
                            alt={photo.name}
                            className="h-10 w-10 rounded-xl object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900">{photo.name}</p>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-slate-400 truncate">{photo.specialization}</p>
                              {photo.rating && (
                                <span className="flex items-center gap-0.5 text-[10px] text-amber-600 font-semibold shrink-0">
                                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {photo.rating}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => setAssigningPhotographer(photo)}
                            className="shrink-0 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all"
                          >
                            Assign
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {unavailablePhotographers.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Unavailable</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 opacity-60">
                        {unavailablePhotographers.map((photo) => (
                          <div key={photo.id} className="flex items-center gap-3 p-3.5 border border-slate-100 rounded-xl bg-slate-50">
                            <img
                              src={photo.avatarUrl || `https://i.pravatar.cc/100?u=${photo.id}`}
                              alt={photo.name}
                              className="h-10 w-10 rounded-xl object-cover grayscale shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-700">{photo.name}</p>
                              <p className="text-xs text-red-500 truncate">{photo.reason}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Client */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Client Information</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-indigo-600">
                  {booking.clientName.split(" ").map(w => w[0]).join("").slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{booking.clientName}</p>
                <p className="text-xs text-slate-400">Client</p>
              </div>
            </div>
            <div className="space-y-3">
              <a href={`mailto:${booking.clientEmail}`} className="flex items-center gap-2.5 text-sm text-indigo-600 hover:text-indigo-700">
                <Mail className="h-4 w-4 shrink-0 text-slate-400" /> {booking.clientEmail}
              </a>
              <a href={`tel:${booking.clientPhone}`} className="flex items-center gap-2.5 text-sm text-slate-700">
                <Phone className="h-4 w-4 shrink-0 text-slate-400" /> {booking.clientPhone}
              </a>
              <div className="flex items-start gap-2.5 text-sm text-slate-600">
                <Calendar className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
                {format(new Date(booking.eventDate), "MMMM d, yyyy")}
              </div>
              <div className="flex items-start gap-2.5 text-sm text-slate-600">
                <MapPin className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" /> {booking.location}
              </div>
            </div>
          </div>

          {/* Financials */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Financials</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Package</span>
                <span className="font-medium text-slate-800 text-right max-w-[140px]">{booking.packageName || "Custom"}</span>
              </div>
              {booking.addons?.length > 0 && (
                <div>
                  <p className="text-sm text-slate-500 mb-2">Add-ons</p>
                  <div className="space-y-1">
                    {booking.addons.map((a, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" /> {a}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="pt-3 mt-3 border-t border-slate-100 flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-900">Total</span>
                <span className="text-xl font-bold text-slate-900">${(booking.totalPrice || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Assignment Dialog */}
      <Dialog open={!!assigningPhotographer} onOpenChange={(open) => !open && setAssigningPhotographer(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Confirm Photographer Assignment</DialogTitle>
            <DialogDescription className="pt-1">
              You're about to assign <span className="font-semibold text-slate-900">{assigningPhotographer?.name}</span> to{" "}
              <span className="font-semibold text-slate-900">Day {selectedDay?.dayNumber}</span> ({selectedDay && format(new Date(selectedDay.date), "MMMM d, yyyy")}).
              They will receive an email notification.
            </DialogDescription>
          </DialogHeader>
          {assigningPhotographer && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <img
                src={assigningPhotographer.avatarUrl || `https://i.pravatar.cc/100?u=${assigningPhotographer.id}`}
                alt={assigningPhotographer.name}
                className="h-10 w-10 rounded-xl object-cover"
              />
              <div>
                <p className="font-semibold text-sm text-slate-900">{assigningPhotographer.name}</p>
                <p className="text-xs text-slate-500">{assigningPhotographer.specialization}</p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setAssigningPhotographer(null)} className="rounded-xl">Cancel</Button>
            <Button onClick={confirmAssignment} disabled={assignPhotographer.isPending} className="rounded-xl bg-indigo-600 hover:bg-indigo-700">
              {assignPhotographer.isPending ? "Assigning…" : "Confirm Assignment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
