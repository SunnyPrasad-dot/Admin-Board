import { useGetInquiries } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Inquiries() {
  const { data: inquiries, isLoading } = useGetInquiries();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Inquiry Requests</h1>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
            </div>
          ) : !inquiries?.length ? (
            <div className="text-center py-12 text-muted-foreground">
              No inquiries found.
            </div>
          ) : (
            <div className="divide-y">
              {inquiries.map((inquiry) => (
                <div key={inquiry.id} className="p-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{inquiry.name}</h3>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(inquiry.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground flex gap-4">
                      <span>{inquiry.email}</span>
                      <span>{inquiry.phone}</span>
                    </div>
                    <p className="text-sm mt-2 text-foreground/80 line-clamp-2">
                      {inquiry.message}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Reply</Button>
                    <Button size="sm">Create Booking</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}