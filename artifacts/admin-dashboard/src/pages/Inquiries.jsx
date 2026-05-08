import { useGetInquiries } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Phone, MessageSquare, Calendar, ChevronRight, Clock } from "lucide-react";

const FAKE_INQUIRIES = [
  {
    id: 1,
    name: "Kevin O'Brien",
    email: "kevin.obrien@email.com",
    phone: "+1 (617) 555-0182",
    eventType: "Wedding",
    message: "Hi, I'm planning a wedding for June 14, 2026 at The Ritz-Carlton in Boston. Looking for full day coverage for approximately 200 guests. We'd love to discuss packages that include an engagement shoot as well. Could you provide availability and detailed pricing?",
    createdAt: "2026-05-08",
    avatarColor: "bg-indigo-100 text-indigo-700",
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+1 (212) 555-0934",
    eventType: "Engagement Shoot",
    message: "I'm getting engaged next month and would love an outdoor engagement shoot at Central Park. We're very flexible on timing and would absolutely love golden hour if possible. My partner and I are comfortable in front of the camera.",
    createdAt: "2026-05-07",
    avatarColor: "bg-rose-100 text-rose-700",
  },
  {
    id: 3,
    name: "Mark & Lisa Williams",
    email: "mlwilliams@email.com",
    phone: "+1 (415) 555-0271",
    eventType: "Vow Renewal",
    message: "We're celebrating our 25th wedding anniversary and would like to renew our vows in a small intimate ceremony with 30 close friends and family. We prefer an outdoor setting with natural light. Any availability in September 2026?",
    createdAt: "2026-05-06",
    avatarColor: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 4,
    name: "Nicole Johnson",
    email: "njohnson@acmecorp.com",
    phone: "+1 (312) 555-0449",
    eventType: "Corporate Headshots",
    message: "Our company needs professional headshots for 15 team members. We'd like to schedule a half-day studio session at our downtown Chicago office. Do you offer on-location corporate packages with consistent lighting setup?",
    createdAt: "2026-05-05",
    avatarColor: "bg-violet-100 text-violet-700",
  },
  {
    id: 5,
    name: "Carlos & Rosa Mendez",
    email: "cmendez@email.com",
    phone: "+1 (305) 555-0663",
    eventType: "Quinceañera",
    message: "Our daughter's Quinceañera is on August 3rd at La Paloma Banquet Hall in Miami. We need a photographer for 6 hours including the church ceremony and the reception. We'd love a style that's vibrant and celebratory.",
    createdAt: "2026-05-04",
    avatarColor: "bg-amber-100 text-amber-700",
  },
  {
    id: 6,
    name: "Grace Chen",
    email: "grace.chen@email.com",
    phone: "+1 (408) 555-0118",
    eventType: "Newborn Photography",
    message: "I just had my baby boy last week and would love newborn photos in the next 5–10 days. Looking for a soft, natural light style with simple props. We're based in San Jose, CA and prefer an in-home session.",
    createdAt: "2026-05-03",
    avatarColor: "bg-cyan-100 text-cyan-700",
  },
];

export default function Inquiries() {
  const { data: apiInquiries, isLoading } = useGetInquiries();
  const inquiries = apiInquiries?.length ? apiInquiries : FAKE_INQUIRIES;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Inquiry Requests</h1>
        <p className="text-sm text-slate-500 mt-0.5">{inquiries.length} pending inquiries</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex gap-4">
                <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-16 w-full mt-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !inquiries.length ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 py-16 text-center">
          <MessageSquare className="h-8 w-8 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No inquiry requests yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq, idx) => {
            const avatarColor = inq.avatarColor || FAKE_INQUIRIES[idx % FAKE_INQUIRIES.length]?.avatarColor || "bg-indigo-100 text-indigo-700";
            const initials = inq.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
            return (
              <div key={inq.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 text-sm font-bold ${avatarColor}`}>
                      {initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <h3 className="font-semibold text-slate-900 text-base">{inq.name}</h3>
                          <div className="flex items-center flex-wrap gap-3 mt-1">
                            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                              <Mail className="h-3 w-3" /> {inq.email}
                            </span>
                            {inq.phone && (
                              <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                                <Phone className="h-3 w-3" /> {inq.phone}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {(inq.eventType) && (
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200">
                              {inq.eventType}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                            <Clock className="h-3 w-3" />
                            {format(new Date(inq.createdAt), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>

                      <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {inq.message}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-3.5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="h-3.5 w-3.5" />
                    Received {format(new Date(inq.createdAt), "MMMM d, yyyy")}
                  </div>
                  <div className="flex gap-2">
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-white hover:border-slate-300 transition-all">
                      <Mail className="h-3.5 w-3.5" /> Reply
                    </button>
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-all">
                      Create Booking <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
