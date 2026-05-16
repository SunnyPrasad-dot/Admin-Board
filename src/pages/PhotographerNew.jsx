import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PhotographerNew() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Add New Photographer</h1>
      <Card>
        <CardHeader><CardTitle>Photographer Info</CardTitle></CardHeader>
        <CardContent>
          <div className="text-muted-foreground">Form implementation goes here...</div>
        </CardContent>
      </Card>
    </div>
  );
}
