import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useGetPhotographers } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Photographers() {
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();
  const { data: photographers, isLoading } = useGetPhotographers({ search: search || undefined });

  const getStatusColor = (s) => {
    switch(s) {
      case "available": return "bg-green-100 text-green-800 hover:bg-green-100";
      case "busy": return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "unavailable": return "bg-red-100 text-red-800 hover:bg-red-100";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-foreground">Photographers</h1>
        <Button onClick={() => setLocation("/photographers/new")} data-testid="button-add-photographer">
          <Plus className="mr-2 h-4 w-4" />
          Add Photographer
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, specialization, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-64 w-full" />)}
        </div>
      ) : !photographers?.length ? (
        <div className="text-center py-12 text-muted-foreground bg-white rounded-lg border border-dashed">
          No photographers found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photographers.map((photographer) => (
            <Card key={photographer.id} className="overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={photographer.avatarUrl || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      {photographer.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Badge className={getStatusColor(photographer.status)}>
                    {photographer.status}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg">{photographer.name}</h3>
                  <p className="text-sm text-muted-foreground">{photographer.specialization} • {photographer.city}</p>
                </div>
                
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Experience:</span>
                    <span>{photographer.experience} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Bookings:</span>
                    <span>{photographer.currentBookingCount}</span>
                  </div>
                </div>

                <div className="pt-4 flex gap-2">
                  <Button asChild variant="outline" className="flex-1" data-testid={`button-view-${photographer.id}`}>
                    <Link href={`/photographers/${photographer.id}`}>View Profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
