import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

interface PlaceholderProps {
  title: string;
  description: string;
}

export default function Placeholder({ title, description }: PlaceholderProps) {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="text-muted-foreground mt-1">
          {description}
        </p>
      </div>
      
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="py-16 text-center">
          <Construction className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
          <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            This feature is under active development by the Prime Brain and Nano Agents. 
            Check back soon for updates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
