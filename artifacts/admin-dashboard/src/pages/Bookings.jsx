import { useState } from "react";
import { Link } from "wouter";
import { useGetBookings } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Bookings() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const { data: bookings, isLoading } = useGetBookings({ 
    search: search || undefined, 
    status: status !== "all" ? status : undefined 
  });

  const getStatusColor = (s) => {
    switch(s) {
      case "new": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "pending": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "assigned": return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "confirmed": return "bg-green-100 text-green-800 hover:bg-green-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Confirm Requests</h1>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex gap-4 flex-wrap">
            <Input 
              placeholder="Search clients..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
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
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : !bookings?.length ? (
            <div className="text-center py-12 text-muted-foreground">
              No bookings found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="font-medium">{booking.clientName}</div>
                        <div className="text-xs text-muted-foreground">{booking.clientEmail}</div>
                      </TableCell>
                      <TableCell className="capitalize">{booking.eventType}</TableCell>
                      <TableCell>
                        {format(new Date(booking.eventDate), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{booking.location}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/bookings/${booking.id}`}>View Details</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}