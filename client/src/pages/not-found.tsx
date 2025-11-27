import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm max-w-md w-full">
        <CardContent className="py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <h2 className="text-xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The page you're looking for doesn't exist or has been moved.
            Our Nano Agents are investigating.
          </p>
          <Link href="/">
            <Button className="gap-2" data-testid="button-home">
              <Home className="w-4 h-4" />
              Back to Boardroom
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
