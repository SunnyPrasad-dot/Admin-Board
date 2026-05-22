import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useGetPhotographers } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, MapPin, Star, Camera, Briefcase } from "lucide-react";

const STATUS_CONFIG = {
  available:   { label: "Available",   cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500" },
  busy:        { label: "Busy",        cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",       dot: "bg-amber-500" },
  unavailable: { label: "Unavailable", cls: "bg-red-50 text-red-700 ring-1 ring-red-200",             dot: "bg-red-500" },
};

const FAKE_PHOTOGRAPHERS = [
  {
    id: 1, name: "Alexandra Kim",  specialization: "Wedding & Portrait",  experience: 8, city: "New York, NY",
    status: "available", currentBookingCount: 3,
    avatarUrl: "https://i.pravatar.cc/300?img=47",
    skills: ["Wedding", "Portrait", "Lifestyle"],
    rating: 4.9, shoots: 142,
  },
  {
    id: 2, name: "James Rivera",   specialization: "Sports & Events",     experience: 5, city: "Los Angeles, CA",
    status: "available", currentBookingCount: 2,
    avatarUrl: "https://i.pravatar.cc/300?img=33",
    skills: ["Events", "Sports", "Concert"],
    rating: 4.7, shoots: 98,
  },
  {
    id: 3, name: "Sarah Mitchell", specialization: "Nature & Landscape",  experience: 11, city: "San Francisco, CA",
    status: "busy", currentBookingCount: 4,
    avatarUrl: "https://i.pravatar.cc/300?img=48",
    skills: ["Landscape", "Travel", "Outdoor"],
    rating: 4.8, shoots: 215,
  },
  {
    id: 4, name: "Marcus Chen",    specialization: "Commercial & Fashion", experience: 7, city: "Chicago, IL",
    status: "available", currentBookingCount: 1,
    avatarUrl: "https://i.pravatar.cc/300?img=11",
    skills: ["Fashion", "Commercial", "Studio"],
    rating: 4.6, shoots: 177,
  },
  {
    id: 5, name: "Olivia Torres",  specialization: "Wedding & Maternity", experience: 6, city: "Miami, FL",
    status: "available", currentBookingCount: 2,
    avatarUrl: "https://i.pravatar.cc/300?img=44",
    skills: ["Wedding", "Maternity", "Family"],
    rating: 5.0, shoots: 89,
  },
  {
    id: 6, name: "Daniel Brooks",  specialization: "Documentary & Street", experience: 9, city: "Seattle, WA",
    status: "busy", currentBookingCount: 3,
    avatarUrl: "https://i.pravatar.cc/300?img=15",
    skills: ["Documentary", "Street", "Photojournalism"],
    rating: 4.8, shoots: 304,
  },
  {
    id: 7, name: "Priya Patel",    specialization: "Corporate & Events",  experience: 4, city: "Austin, TX",
    status: "available", currentBookingCount: 1,
    avatarUrl: "https://i.pravatar.cc/300?img=45",
    skills: ["Corporate", "Events", "Headshots"],
    rating: 4.7, shoots: 63,
  },
];

export default function Photographers() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [, setLocation] = useLocation();
  const { data: apiPhotographers, isLoading } = useGetPhotographers({ search: search || undefined });

  const base = apiPhotographers?.length ? apiPhotographers : FAKE_PHOTOGRAPHERS;
  const photographers = base.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.specialization?.toLowerCase().includes(search.toLowerCase()) || p.city?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filters = [
    { label: "All", value: "all" },
    { label: "Available", value: "available" },
    { label: "Busy", value: "busy" },
    { label: "Unavailable", value: "unavailable" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-foreground">Photographers</h1>
          <p className="text-sm text-slate-500 dark:text-muted-foreground mt-0.5">{photographers.length} photographers</p>
        </div>
        <button
          onClick={() => setLocation("/photographers/new")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-semibold transition-all shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Photographer
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-muted-foreground/70" />
          <Input
            placeholder="Search by name, specialization, city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 w-72 bg-card text-sm border-border rounded-xl shadow-sm dark:bg-card"
          />
        </div>
        <div className="flex gap-2 bg-white dark:bg-card rounded-xl border border-slate-200 dark:border-border p-1 shadow-sm">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                statusFilter === f.value
                  ? "bg-primary text-white shadow-sm"
                  : "text-slate-500 dark:text-muted-foreground hover:text-slate-700 dark:text-muted-foreground dark:hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}
        </div>
      ) : !photographers.length ? (
        <div className="bg-white dark:bg-card rounded-2xl border border-dashed border-slate-200 dark:border-border py-16 text-center">
          <Camera className="h-8 w-8 text-slate-300 dark:text-muted-foreground mx-auto mb-3" />
          <p className="text-slate-500 dark:text-muted-foreground text-sm">No photographers match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {photographers.map((p) => {
            const sc = STATUS_CONFIG[p.status] || STATUS_CONFIG.unavailable;
            return (
              <div key={p.id} className="bg-white dark:bg-card rounded-2xl border border-slate-100 dark:border-border/60 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                {/* Cover gradient */}
                <div className="h-20 bg-gradient-to-br from-primary/10 via-primary/5 to-slate-100 dark:to-slate-900 relative">
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
                  />
                </div>

                <div className="px-5 pb-5 -mt-8">
                  {/* Avatar + status */}
                  <div className="flex items-end justify-between mb-4">
                    <img
                      src={p.avatarUrl || `https://i.pravatar.cc/300?u=${p.id}`}
                      alt={p.name}
                      className="h-16 w-16 rounded-2xl object-cover ring-4 ring-white shadow-sm"
                    />
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${sc.cls} dark:opacity-95`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                      {sc.label}
                    </span>
                  </div>

                  {/* Info */}
                  <h3 className="font-bold text-slate-900 dark:text-foreground text-base dark:text-foreground">{p.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-muted-foreground mt-0.5 dark:text-muted-foreground">{p.specialization}</p>

                  <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400 dark:text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {p.city}
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-border">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-muted-foreground">
                      <Briefcase className="h-3.5 w-3.5 text-slate-400 dark:text-muted-foreground" />
                      <span><b className="text-slate-700 dark:text-muted-foreground font-semibold">{p.experience}y</b> exp</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-muted-foreground">
                      <Camera className="h-3.5 w-3.5 text-slate-400 dark:text-muted-foreground" />
                      <span><b className="text-slate-700 dark:text-muted-foreground font-semibold">{p.shoots || p.currentBookingCount * 18 || 0}</b> shoots</span>
                    </div>
                    {p.rating && (
                      <div className="flex items-center gap-1 text-xs ml-auto">
                        <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      <span className="font-semibold text-slate-700 dark:text-foreground">{p.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  {p.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {p.skills.slice(0, 3).map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-muted-foreground text-[11px] font-medium dark:bg-muted dark:text-muted-foreground">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link href={`/photographers/${p.id}`}>
                    <button className="mt-4 w-full py-2 rounded-xl border border-slate-200 dark:border-border text-sm font-semibold text-slate-700 dark:text-foreground hover:bg-primary/10 hover:border-primary/20 hover:text-primary dark:hover:bg-primary/10 transition-all">
                      View Profile
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
