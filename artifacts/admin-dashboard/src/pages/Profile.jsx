import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Admin Profile</h1>
      <Card>
        <CardContent className="p-6 flex items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="text-3xl bg-primary/10 text-primary">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
            <p className="text-sm font-medium mt-1 text-primary capitalize">{user.role}</p>
          </div>
          <div className="ml-auto">
            <Button variant="outline">Edit Profile</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
