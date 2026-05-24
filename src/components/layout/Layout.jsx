import { useAuth } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { useSettings } from "@/contexts/SettingsContext";

export default function Layout({ children }) {
  const { user } = useAuth();
  const { settings } = useSettings();

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      {/* Navbar - Fixed at top */}
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className={`hidden md:flex flex-col shrink-0 fixed inset-y-14 z-20 transition-all duration-300 ${settings.collapseSidebar ? 'w-20' : 'w-60'}`}>
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 overflow-y-auto pt-14 ${settings.collapseSidebar ? 'md:pl-20' : 'md:pl-60'}`}>
          {/* Page */}
          <div className="flex-1 p-5 sm:p-7">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
