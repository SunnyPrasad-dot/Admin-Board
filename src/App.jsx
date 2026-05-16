import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";

import Layout from "@/components/layout/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Bookings from "@/pages/Bookings";
import BookingDetail from "@/pages/BookingDetail";
import Inquiries from "@/pages/Inquiries";
import Photographers from "@/pages/Photographers";
import PhotographerDetail from "@/pages/PhotographerDetail";
import PhotographerNew from "@/pages/PhotographerNew";
import Prices from "@/pages/Prices";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component, ...rest }) {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  
  if (!user) {
    return <Redirect to="/login" />;
  }

  return (
    <Layout>
      <Component {...rest} />
    </Layout>
  );
}

function Router() {
  const { user } = useAuth();

  return (
    <Switch>
      <Route path="/login">
        {user ? <Redirect to="/" /> : <Login />}
      </Route>
      <Route path="/forgot-password">
        <div className="min-h-screen flex items-center justify-center p-4"><div className="bg-white p-8 rounded-lg shadow-sm border w-full max-w-md text-center">Forgot Password Mock</div></div>
      </Route>
      <Route path="/reset-password">
        <div className="min-h-screen flex items-center justify-center p-4"><div className="bg-white p-8 rounded-lg shadow-sm border w-full max-w-md text-center">Reset Password Mock</div></div>
      </Route>
      
      <Route path="/">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/bookings">
        <ProtectedRoute component={Bookings} />
      </Route>
      <Route path="/bookings/:id">
        <ProtectedRoute component={BookingDetail} />
      </Route>
      <Route path="/inquiries">
        <ProtectedRoute component={Inquiries} />
      </Route>
      <Route path="/photographers/new">
        <ProtectedRoute component={PhotographerNew} />
      </Route>
      <Route path="/photographers/:id">
        <ProtectedRoute component={PhotographerDetail} />
      </Route>
      <Route path="/photographers">
        <ProtectedRoute component={Photographers} />
      </Route>
      <Route path="/prices">
        <ProtectedRoute component={Prices} />
      </Route>
      <Route path="/profile">
        <ProtectedRoute component={Profile} />
      </Route>
      <Route path="/settings">
        <ProtectedRoute component={Settings} />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;