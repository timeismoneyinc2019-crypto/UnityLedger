import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Users,
  Zap,
  Globe,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default function Analytics() {
  const metrics = [
    { 
      label: "Total Transactions", 
      value: "2.4M", 
      change: 12.5, 
      trend: "up" as const,
      icon: Activity,
    },
    { 
      label: "Active Users", 
      value: "847K", 
      change: 8.3, 
      trend: "up" as const,
      icon: Users,
    },
    { 
      label: "Processing Speed", 
      value: "12ms", 
      change: -15.2, 
      trend: "down" as const,
      icon: Zap,
    },
    { 
      label: "Global Coverage", 
      value: "195", 
      change: 2.1, 
      trend: "up" as const,
      icon: Globe,
    },
  ];

  const agentPerformance = [
    { name: "Athena", tasks: 4521, efficiency: 98.7, trend: "up" },
    { name: "Helios", tasks: 3892, efficiency: 99.2, trend: "up" },
    { name: "Solara", tasks: 5234, efficiency: 97.8, trend: "down" },
    { name: "Nexus", tasks: 6102, efficiency: 99.5, trend: "up" },
    { name: "Artemis", tasks: 2847, efficiency: 96.4, trend: "up" },
    { name: "Morpheus", tasks: 3456, efficiency: 98.1, trend: "stable" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6" data-testid="analytics-page">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time performance metrics and insights
          </p>
        </div>
        
        <Badge variant="outline" className="w-fit">
          <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
          Live Data
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <metric.icon className="w-5 h-5 text-primary" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  metric.trend === "up" ? "text-green-500" : "text-red-500"
                }`}>
                  {metric.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {Math.abs(metric.change)}%
                </div>
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                {metric.label}
              </p>
              <p className="text-3xl font-bold">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Agent Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {agentPerformance.map((agent) => (
              <div key={agent.name} className="flex items-center gap-4">
                <div className="w-24 shrink-0">
                  <p className="font-medium text-sm">{agent.name}</p>
                </div>
                <div className="flex-1">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${agent.efficiency}%` }}
                    />
                  </div>
                </div>
                <div className="w-20 text-right">
                  <span className="text-sm font-mono">{agent.efficiency}%</span>
                </div>
                <div className="w-8">
                  {agent.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : agent.trend === "down" ? (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  ) : (
                    <span className="block w-4 h-0.5 bg-muted-foreground rounded" />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">API Latency</p>
                <p className="text-2xl font-bold text-green-500">12ms</p>
                <p className="text-xs text-muted-foreground mt-1">Avg. response time</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Uptime</p>
                <p className="text-2xl font-bold text-green-500">99.99%</p>
                <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Error Rate</p>
                <p className="text-2xl font-bold text-yellow-500">0.02%</p>
                <p className="text-xs text-muted-foreground mt-1">Below threshold</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Queue Size</p>
                <p className="text-2xl font-bold">847</p>
                <p className="text-xs text-muted-foreground mt-1">Pending tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
