import { useGetDashboardSummary } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Calendar, MessageSquare, Briefcase } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: summary, isLoading } = useGetDashboardSummary();

  const getStatusColor = (s) => {
    switch(s) {
      case "new": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "pending": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "assigned": return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "confirmed": return "bg-green-100 text-green-800 hover:bg-green-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    { title: "Total Requests", value: summary?.totalRequests || 0, icon: Calendar, color: "text-blue-500" },
    { title: "Confirmed Bookings", value: summary?.confirmedBookings || 0, icon: Briefcase, color: "text-success" },
    { title: "Inquiry Requests", value: summary?.inquiryRequests || 0, icon: MessageSquare, color: "text-warning" },
    { title: "Available Photographers", value: summary?.availablePhotographers || 0, icon: Users, color: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="bookings">
            <TabsList className="mb-4">
              <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
              <TabsTrigger value="inquiries">Recent Inquiries</TabsTrigger>
            </TabsList>
            <TabsContent value="bookings">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Event Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summary?.recentBookings?.length ? (
                      summary.recentBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <Link href={`/bookings/${booking.id}`} className="font-medium hover:underline text-primary">
                              {booking.clientName}
                            </Link>
                          </TableCell>
                          <TableCell className="capitalize">{booking.eventType}</TableCell>
                          <TableCell>{format(new Date(booking.eventDate), "MMM d, yyyy")}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                          No recent bookings.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="inquiries">
              <div className="text-center py-12 text-muted-foreground border rounded-lg">
                View <Link href="/inquiries" className="text-primary hover:underline">all inquiries</Link> here.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
