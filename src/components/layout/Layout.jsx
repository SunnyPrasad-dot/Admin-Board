import { useAuth } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function Layout({ children }) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 fixed inset-y-0 z-20">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-60 flex flex-col min-h-screen">
        <Navbar />

        {/* Page */}
        <div className="flex-1 p-5 sm:p-7 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
