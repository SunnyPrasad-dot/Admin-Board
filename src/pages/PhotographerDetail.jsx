import { useRoute, Link } from "wouter";
import { useGetPhotographer } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { MapPin, Mail, Phone, Star, Camera, Briefcase, Calendar, ChevronLeft, Edit } from "lucide-react";

const STATUS_CONFIG = {
  available:   { label: "Available",   cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500" },
  busy:        { label: "Busy",        cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",       dot: "bg-amber-500" },
  unavailable: { label: "Unavailable", cls: "bg-red-50 text-red-700 ring-1 ring-red-200",             dot: "bg-red-500" },
};

const FAKE_PHOTOGRAPHERS = {
  1: {
    name: "Alexandra Kim", specialization: "Wedding & Portrait", experience: 8, city: "New York, NY",
    email: "alex.kim@tkstudio.com", phone: "+1 (212) 555-0147",
    status: "available", avatarUrl: "https://i.pravatar.cc/300?img=47",
    bio: "Alexandra has been capturing life's most cherished moments for over 8 years. Specializing in wedding and portrait photography, she brings an artistic eye and warm personality to every session, ensuring her clients feel comfortable and confident.",
    skills: ["Wedding", "Portrait", "Lifestyle", "Engagement", "Editorial"],
    workingDays: ["Monday", "Wednesday", "Friday", "Saturday", "Sunday"],
    rating: 4.9, totalShoots: 142,
    portfolio: [
      "https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&h=400&fit=crop",
    ],
    upcomingBookings: [
      { id: 1, date: "2026-06-14", clientName: "Sarah & James Chen",     eventType: "Wedding",   location: "Grand Ballroom, NY" },
      { id: 3, date: "2026-07-04", clientName: "Michael & Anna Thompson", eventType: "Wedding",   location: "Napa Valley, CA" },
    ],
    completedShoots: [
      { id: 10, date: "2026-04-20", clientName: "Emma Wilson",    eventType: "Engagement" },
      { id: 11, date: "2026-03-15", clientName: "The Park Family", eventType: "Family Portrait" },
      { id: 12, date: "2026-02-08", clientName: "Brandon & Chloe", eventType: "Wedding" },
    ],
  },
};

export default function PhotographerDetail() {
  const [, params] = useRoute("/photographers/:id");
  const id = parseInt(params.id, 10);
  const { data: apiPhotographer, isLoading } = useGetPhotographer(id, { query: { enabled: !!id } });

  const fake = FAKE_PHOTOGRAPHERS[id] || FAKE_PHOTOGRAPHERS[1];
  const photographer = apiPhotographer || fake;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-2xl col-span-1" />
          <Skeleton className="h-64 rounded-2xl col-span-2" />
        </div>
      </div>
    );
  }

  const sc = STATUS_CONFIG[photographer.status] || STATUS_CONFIG.unavailable;
  const portfolioImages = photographer.portfolio || fake.portfolio || [];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link href="/photographers" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-muted-foreground hover:text-slate-700 dark:text-muted-foreground transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back to Photographers
      </Link>

      {/* Hero card */}
      <div className="bg-white dark:bg-card rounded-2xl border border-slate-100 dark:border-border shadow-sm overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />
        <div className="px-6 pb-6 -mt-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <img
                src={photographer.avatarUrl || `https://i.pravatar.cc/300?u=${id}`}
                alt={photographer.name}
                className="h-20 w-20 rounded-2xl object-cover ring-4 ring-white shadow-md"
              />
              <div className="mb-1">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">{photographer.name}</h1>
                <p className="text-slate-500 dark:text-muted-foreground mt-0.5">{photographer.specialization}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${sc.cls}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                    {sc.label}
                  </span>
                  {(photographer.rating || fake.rating) && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-muted-foreground">
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      {photographer.rating || fake.rating}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-border/60 text-sm font-medium text-slate-700 dark:text-muted-foreground hover:bg-slate-50 dark:bg-slate-900/50 transition-all">
                <Edit className="h-4 w-4" /> Edit Profile
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-all shadow-sm">
                Update Availability
              </button>
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-border">
            {[
              { icon: Briefcase, label: "Experience",      value: `${photographer.experience} years` },
              { icon: Camera,    label: "Total Shoots",    value: `${photographer.totalShoots || fake.totalShoots || 0}` },
              { icon: Calendar,  label: "Active Bookings", value: `${photographer.currentBookingCount ?? 2}` },
              { icon: MapPin,    label: "Based in",        value: photographer.city },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <div className="flex justify-center mb-1.5">
                  <Icon className="h-4 w-4 text-slate-400 dark:text-muted-foreground/70" />
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-foreground">{value}</p>
                <p className="text-[11px] text-slate-400 dark:text-muted-foreground/70">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left col */}
        <div className="space-y-5">
          {/* Contact */}
          <div className="bg-white dark:bg-card rounded-2xl border border-slate-100 dark:border-border shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-foreground mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-slate-400 dark:text-muted-foreground/70 shrink-0" />
                <a href={`mailto:${photographer.email}`} className="text-primary hover:underline truncate">{photographer.email}</a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-slate-400 dark:text-muted-foreground/70 shrink-0" />
                <span className="text-slate-700 dark:text-muted-foreground">{photographer.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-slate-400 dark:text-muted-foreground/70 shrink-0" />
                <span className="text-slate-700 dark:text-muted-foreground">{photographer.city}</span>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white dark:bg-card rounded-2xl border border-slate-100 dark:border-border shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-foreground mb-3">Specializations</h3>
            <div className="flex flex-wrap gap-2">
              {(photographer.skills?.length ? photographer.skills : fake.skills).map((skill) => (
                <span key={skill} className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium border border-primary/10">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Working days */}
          <div className="bg-white dark:bg-card rounded-2xl border border-slate-100 dark:border-border shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-foreground mb-3">Working Days</h3>
            <div className="flex flex-wrap gap-2">
              {(photographer.workingDays?.length ? photographer.workingDays : fake.workingDays).map((day) => (
                <span key={day} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-muted-foreground text-xs font-medium">
                  {day}
                </span>
              ))}
            </div>
          </div>

          {/* Bio */}
          {(photographer.bio || fake.bio) && (
            <div className="bg-white dark:bg-card rounded-2xl border border-slate-100 dark:border-border shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-foreground mb-3">About</h3>
              <p className="text-sm text-slate-600 dark:text-muted-foreground leading-relaxed">{photographer.bio || fake.bio}</p>
            </div>
          )}
        </div>

        {/* Right col */}
        <div className="lg:col-span-2 space-y-5">
          {/* Portfolio */}
          {portfolioImages.length > 0 && (
            <div className="bg-white dark:bg-card rounded-2xl border border-slate-100 dark:border-border shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-foreground mb-4">Portfolio</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {portfolioImages.map((url, i) => (
                  <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={url}
                      alt={`Portfolio ${i + 1}`}
                      className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Bookings */}
          <div className="bg-white dark:bg-card rounded-2xl border border-slate-100 dark:border-border shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-border">
              <h3 className="text-sm font-bold text-slate-900 dark:text-foreground">Upcoming Bookings</h3>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-border/60">
              {!(photographer.upcomingBookings || fake.upcomingBookings)?.length ? (
                <p className="px-5 py-6 text-sm text-slate-400 dark:text-muted-foreground/70 text-center">No upcoming bookings.</p>
              ) : (
                (photographer.upcomingBookings || fake.upcomingBookings).map((b) => (
                  <div key={b.id} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-foreground">{b.clientName}</p>
                      <p className="text-xs text-slate-400 dark:text-muted-foreground/70 capitalize">{b.eventType} · {b.location}</p>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-muted-foreground shrink-0">{format(new Date(b.date), "MMM d, yyyy")}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Completed Shoots */}
          <div className="bg-white dark:bg-card rounded-2xl border border-slate-100 dark:border-border shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-border">
              <h3 className="text-sm font-bold text-slate-900 dark:text-foreground">Completed Shoots</h3>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-border/60">
              {!(photographer.completedShoots || fake.completedShoots)?.length ? (
                <p className="px-5 py-6 text-sm text-slate-400 dark:text-muted-foreground/70 text-center">No completed shoots.</p>
              ) : (
                (photographer.completedShoots || fake.completedShoots).map((b) => (
                  <div key={b.id} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                      <Camera className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-foreground">{b.clientName}</p>
                      <p className="text-xs text-slate-400 dark:text-muted-foreground/70 capitalize">{b.eventType}</p>
                    </div>
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                      Completed
                    </span>
                    <span className="text-xs text-slate-500 dark:text-muted-foreground shrink-0">{format(new Date(b.date), "MMM d, yyyy")}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
