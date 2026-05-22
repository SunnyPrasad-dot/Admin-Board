import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";

export default function PhotographerNew() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSave = (e) => {
    e.preventDefault();
    toast({ title: "Photographer Created", description: "Successfully added new photographer." });
    setLocation("/photographers");
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/photographers")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Add New Photographer</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Create a new photographer profile</p>
        </div>
      </div>
      
      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle>Photographer Details</CardTitle>
            <CardDescription>Enter the personal and professional details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input placeholder="John Doe" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Specialization</label>
                <Input placeholder="e.g. Wedding & Events" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Years of Experience</label>
                <Input type="number" placeholder="5" min="0" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <Input placeholder="e.g. New York, NY" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Skills (comma separated)</label>
              <Input placeholder="Wedding, Portrait, Studio" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t pt-5">
            <Button variant="outline" type="button" onClick={() => setLocation("/photographers")}>Cancel</Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white gap-2">
              <Save className="h-4 w-4" /> Save Photographer
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
