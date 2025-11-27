import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
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
import type { NanoAgent } from "@shared/schema";

const iconMap: Record<string, React.ElementType> = {
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
  Bell,
};

interface AgentCardProps {
  agent: NanoAgent;
  onClick?: () => void;
}

export function AgentCard({ agent, onClick }: AgentCardProps) {
  const Icon = iconMap[agent.icon] || Brain;
  
  const statusColors = {
    active: "bg-green-500",
    idle: "bg-yellow-500",
    processing: "bg-blue-500",
  };

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-border/50 bg-card/80 backdrop-blur-sm"
      onClick={onClick}
      data-testid={`agent-card-${agent.id}`}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div 
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${agent.color}20` }}
          >
            <Icon 
              className="w-5 h-5" 
              style={{ color: agent.color }}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate">
                {agent.name}
              </h3>
              <div 
                className={`w-2 h-2 rounded-full ${statusColors[agent.status]} status-pulse`}
                title={agent.status}
              />
            </div>
            
            <p className="text-sm text-muted-foreground font-medium mb-2">
              {agent.role}
            </p>
            
            <p className="text-xs text-muted-foreground/80 line-clamp-2">
              {agent.description}
            </p>
          </div>
        </div>
        
        {agent.lastAction && (
          <div className="mt-4 pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground truncate">
              <span className="opacity-60">Last:</span> {agent.lastAction}
            </p>
            {agent.lastActionTime && (
              <p className="text-xs text-muted-foreground/60 font-mono mt-1">
                {agent.lastActionTime}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function AgentGrid({ agents, onAgentClick }: { 
  agents: NanoAgent[]; 
  onAgentClick?: (agent: NanoAgent) => void;
}) {
  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      data-testid="agent-grid"
    >
      {agents.map((agent) => (
        <AgentCard 
          key={agent.id} 
          agent={agent} 
          onClick={() => onAgentClick?.(agent)}
        />
      ))}
    </div>
  );
}
