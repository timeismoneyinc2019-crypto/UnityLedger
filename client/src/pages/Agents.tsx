import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { AgentGrid } from "@/components/AgentCard";
import { 
  Search, 
  Filter,
  Brain, 
  Shield, 
  TrendingUp, 
  Network, 
  Palette, 
  Eye, 
  Globe, 
  Scale, 
  Clock, 
  Flame, 
  Lightbulb, 
  Bell 
} from "lucide-react";
import { NANO_AGENTS, type NanoAgent } from "@shared/schema";

const iconMap: Record<string, React.ElementType> = {
  Brain, Shield, TrendingUp, Network, Palette, Eye, 
  Globe, Scale, Clock, Flame, Lightbulb, Bell,
};

export default function Agents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<NanoAgent | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredAgents = NANO_AGENTS.filter((agent) => {
    const matchesSearch = 
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: NANO_AGENTS.length,
    active: NANO_AGENTS.filter(a => a.status === "active").length,
    idle: NANO_AGENTS.filter(a => a.status === "idle").length,
    processing: NANO_AGENTS.filter(a => a.status === "processing").length,
  };

  return (
    <div className="p-4 md:p-6 space-y-6" data-testid="agents-page">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Nano Agents
          </h1>
          <p className="text-muted-foreground mt-1">
            12 Executive AI Agents powering UnityPay governance
          </p>
        </div>
      </div>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                type="search"
                placeholder="Search agents by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-muted/30 border-border/50"
                data-testid="input-agent-search"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {(["all", "active", "idle", "processing"] as const).map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  data-testid={`filter-${status}`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  <Badge variant="outline" className="ml-2 text-xs">
                    {statusCounts[status]}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredAgents.length > 0 ? (
        <AgentGrid 
          agents={filteredAgents} 
          onAgentClick={setSelectedAgent}
        />
      ) : (
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="py-12 text-center">
            <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground">
              No agents found matching your criteria
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!selectedAgent} onOpenChange={() => setSelectedAgent(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedAgent && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  {(() => {
                    const Icon = iconMap[selectedAgent.icon] || Brain;
                    return (
                      <div 
                        className="w-14 h-14 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${selectedAgent.color}20` }}
                      >
                        <Icon 
                          className="w-7 h-7" 
                          style={{ color: selectedAgent.color }}
                        />
                      </div>
                    );
                  })()}
                  <div>
                    <DialogTitle className="text-xl">{selectedAgent.name}</DialogTitle>
                    <DialogDescription className="text-sm font-medium">
                      {selectedAgent.role}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedAgent.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <h4 className="text-sm font-medium">Status</h4>
                  <Badge 
                    variant={selectedAgent.status === "active" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {selectedAgent.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Tasks Completed</p>
                    <p className="text-lg font-semibold">2,847</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Avg Response</p>
                    <p className="text-lg font-semibold">142ms</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Uptime</p>
                    <p className="text-lg font-semibold">99.97%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Last Active</p>
                    <p className="text-lg font-semibold font-mono">Just now</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
