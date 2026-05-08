import { useRoute } from "wouter";
import { 
  useGetBooking, 
  getGetBookingQueryKey,
  useUpdateBooking,
  useGetAvailablePhotographers,
  useAssignPhotographer
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function BookingDetail() {
  const [, params] = useRoute("/bookings/:id");
  const id = parseInt(params.id, 10);
  const queryClient = useQueryClient();
  const { data: booking, isLoading } = useGetBooking(id, { query: { enabled: !!id } });
  const updateBooking = useUpdateBooking();
  const assignPhotographer = useAssignPhotographer();

  const [selectedDay, setSelectedDay] = useState(null);
  const [assigningPhotographer, setAssigningPhotographer] = useState(null);
  
  // Date parameter for available photographers based on selected day
  const searchDate = selectedDay ? selectedDay.date : booking?.eventDate || new Date().toISOString();
  
  const { data: availability, isLoading: isAvailabilityLoading } = useGetAvailablePhotographers(
    { date: searchDate },
    { query: { enabled: !!selectedDay } }
  );

  if (isLoading || !booking) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 md:col-span-2" />
          <Skeleton className="h-64 md:col-span-1" />
        </div>
      </div>
    );
  }

  const confirmAssignment = () => {
    if (!selectedDay || !assigningPhotographer) return;
    
    assignPhotographer.mutate(
      { 
        id, 
        data: { 
          dayNumber: selectedDay.dayNumber, 
          photographerId: assigningPhotographer.id 
        } 
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetBookingQueryKey(id) });
          setAssigningPhotographer(null);
          setSelectedDay(null);
        }
      }
    );
  };

  const handleConfirmRequest = () => {
    updateBooking.mutate(
      { id, data: { status: "confirmed" } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetBookingQueryKey(id) });
        }
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Booking #{booking.id}</h1>
          <Badge variant="outline" className="text-sm">
            {booking.status}
          </Badge>
        </div>
        <div className="flex gap-2">
          {booking.status !== "confirmed" && (
            <Button onClick={handleConfirmRequest} className="bg-success hover:bg-success/90 text-white" data-testid="button-confirm-request">
              Confirm Request
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground block">Event Type</span>
                  <span className="font-medium capitalize">{booking.eventType}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Location</span>
                  <span className="font-medium">{booking.location}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Date</span>
                  <span className="font-medium">
                    {format(new Date(booking.eventDate), "MMM d, yyyy")}
                    {booking.endDate && ` - ${format(new Date(booking.endDate), "MMM d, yyyy")}`}
                  </span>
                </div>
              </div>

              {booking.notes && (
                <div>
                  <span className="text-muted-foreground block text-sm mb-1">Notes</span>
                  <p className="text-sm p-3 bg-gray-50 rounded-md">{booking.notes}</p>
                </div>
              )}
              
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-4">Event Days & Assignments</h3>
                <div className="space-y-4">
                  {booking.days?.map(day => (
                    <div key={day.dayNumber} className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 bg-gray-50 rounded-lg border">
                      <div>
                        <div className="font-medium">Day {day.dayNumber}: {format(new Date(day.date), "MMM d, yyyy")}</div>
                        <div className="text-sm text-muted-foreground mt-1">{day.details}</div>
                        {day.photographerName && (
                          <div className="mt-2 text-sm">
                            <span className="text-primary font-medium">Assigned: {day.photographerName}</span>
                          </div>
                        )}
                      </div>
                      <Button 
                        variant={day.photographerName ? "outline" : "default"} 
                        size="sm" 
                        onClick={() => setSelectedDay(day)}
                        data-testid={`button-assign-day-${day.dayNumber}`}
                      >
                        {day.photographerName ? "Change Photographer" : "Select Photographer"}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedDay && (
            <Card className="border-primary shadow-sm" id="assignment-section">
              <CardHeader>
                <CardTitle>Assign Photographer for Day {selectedDay.dayNumber}</CardTitle>
                <CardDescription>{format(new Date(selectedDay.date), "MMMM d, yyyy")}</CardDescription>
              </CardHeader>
              <CardContent>
                {isAvailabilityLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Suggested Available Photographers</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {availability?.available.map(photo => (
                          <div key={photo.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {photo.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm">{photo.name}</div>
                                <div className="text-xs text-muted-foreground">{photo.specialization}</div>
                              </div>
                            </div>
                            <Button size="sm" onClick={() => setAssigningPhotographer(photo)} data-testid={`button-pick-${photo.id}`}>
                              Assign
                            </Button>
                          </div>
                        ))}
                        {availability?.available.length === 0 && (
                          <div className="col-span-full text-sm text-muted-foreground p-4 bg-gray-50 rounded-lg text-center">
                            No photographers available on this date.
                          </div>
                        )}
                      </div>
                    </div>

                    {availability?.unavailable?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-3 text-muted-foreground">Unavailable Photographers</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-60 grayscale-[50%]">
                          {availability.unavailable.map(photo => (
                            <div key={photo.id} className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>{photo.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm">{photo.name}</div>
                                <div className="text-xs text-red-600">{photo.reason}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="mt-6 flex justify-end">
                  <Button variant="ghost" onClick={() => setSelectedDay(null)}>Cancel Selection</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <span className="text-muted-foreground block">Name</span>
                <span className="font-medium">{booking.clientName}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Email</span>
                <a href={`mailto:${booking.clientEmail}`} className="font-medium text-primary hover:underline">{booking.clientEmail}</a>
              </div>
              <div>
                <span className="text-muted-foreground block">Phone</span>
                <a href={`tel:${booking.clientPhone}`} className="font-medium text-primary hover:underline">{booking.clientPhone}</a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <span className="text-muted-foreground block">Package</span>
                <span className="font-medium">{booking.packageName || "Custom"}</span>
              </div>
              {booking.addons?.length > 0 && (
                <div>
                  <span className="text-muted-foreground block">Add-ons</span>
                  <ul className="list-disc pl-4 mt-1">
                    {booking.addons.map((addon, i) => (
                      <li key={i}>{addon}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="pt-4 border-t flex justify-between items-center text-base font-bold">
                <span>Total Price</span>
                <span>${booking.totalPrice?.toFixed(2) || "0.00"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!assigningPhotographer} onOpenChange={(open) => !open && setAssigningPhotographer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Assignment</DialogTitle>
            <DialogDescription>
              Are you sure you want to assign <strong>{assigningPhotographer?.name}</strong> to Day {selectedDay?.dayNumber}? 
              This will update the booking and send a notification to the photographer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssigningPhotographer(null)}>Cancel</Button>
            <Button onClick={confirmAssignment} disabled={assignPhotographer.isPending} data-testid="button-confirm-assignment">
              {assignPhotographer.isPending ? "Assigning..." : "Confirm Assignment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
