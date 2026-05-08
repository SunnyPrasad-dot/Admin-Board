import { useRoute, Link } from "wouter";
import { useGetPhotographer } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

export default function PhotographerDetail() {
  const [, params] = useRoute("/photographers/:id");
  const id = parseInt(params.id, 10);
  const { data: photographer, isLoading } = useGetPhotographer(id, { query: { enabled: !!id } });

  const getStatusColor = (s) => {
    switch(s) {
      case "available": return "bg-green-100 text-green-800 hover:bg-green-100";
      case "busy": return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "unavailable": return "bg-red-100 text-red-800 hover:bg-red-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-40 w-full" /><Skeleton className="h-64 w-full" /></div>;
  if (!photographer) return <div>Photographer not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-4 border-white shadow-sm">
            <AvatarImage src={photographer.avatarUrl || ""} />
            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
              {photographer.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{photographer.name}</h1>
            <p className="text-muted-foreground">{photographer.specialization}</p>
            <Badge className={`mt-2 ${getStatusColor(photographer.status)}`}>
              {photographer.status}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Edit Profile</Button>
          <Button>Update Availability</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact & Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <span className="text-muted-foreground block">Email</span>
                <span className="font-medium">{photographer.email}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Phone</span>
                <span className="font-medium">{photographer.phone}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">City</span>
                <span className="font-medium">{photographer.city}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Experience</span>
                <span className="font-medium">{photographer.experience} years</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Working Days</span>
                <div className="flex gap-1 flex-wrap mt-1">
                  {photographer.workingDays?.map(day => (
                    <Badge key={day} variant="secondary">{day}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground block">Skills</span>
                <div className="flex gap-1 flex-wrap mt-1">
                  {photographer.skills?.map(skill => (
                    <Badge key={skill} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {!photographer.upcomingBookings?.length ? (
                <div className="text-sm text-muted-foreground py-4 text-center">No upcoming bookings.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {photographer.upcomingBookings.map(b => (
                      <TableRow key={b.id}>
                        <TableCell>{format(new Date(b.date), "MMM d, yyyy")}</TableCell>
                        <TableCell>{b.clientName}</TableCell>
                        <TableCell className="capitalize">{b.eventType}</TableCell>
                        <TableCell>{b.location}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completed Shoots</CardTitle>
            </CardHeader>
            <CardContent>
              {!photographer.completedShoots?.length ? (
                <div className="text-sm text-muted-foreground py-4 text-center">No completed shoots.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {photographer.completedShoots.map(b => (
                      <TableRow key={b.id}>
                        <TableCell>{format(new Date(b.date), "MMM d, yyyy")}</TableCell>
                        <TableCell>{b.clientName}</TableCell>
                        <TableCell className="capitalize">{b.eventType}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
