import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Users
} from "lucide-react";
import type { MeetingReport as MeetingReportType, AgentContribution, ActionItem, MetricUpdate } from "@shared/schema";

interface MeetingReportProps {
  report: MeetingReportType | null;
  isLoading?: boolean;
}

export function MeetingReport({ report, isLoading }: MeetingReportProps) {
  if (isLoading) {
    return <MeetingReportSkeleton />;
  }

  if (!report) {
    return (
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="py-12 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
          <p className="text-muted-foreground">
            Select a meeting type to view the report
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" data-testid="meeting-report">
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {report.type.charAt(0).toUpperCase() + report.type.slice(1)} Meeting Report
            </CardTitle>
            <span className="text-sm text-muted-foreground font-mono">
              {new Date(report.timestamp).toLocaleString()}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed" data-testid="report-summary">
            {report.summary}
          </p>
        </CardContent>
      </Card>

      {report.metrics && report.metrics.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {report.metrics.map((metric, index) => (
            <MetricCard key={index} metric={metric} />
          ))}
        </div>
      )}

      {report.agentContributions.length > 0 && (
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Agent Contributions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {report.agentContributions.map((contribution, index) => (
              <ContributionCard key={index} contribution={contribution} />
            ))}
          </CardContent>
        </Card>
      )}

      {report.actionItems.length > 0 && (
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Action Items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.actionItems.map((item) => (
              <ActionItemCard key={item.id} item={item} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MetricCard({ metric }: { metric: MetricUpdate }) {
  const TrendIcon = metric.trend === "up" ? TrendingUp : metric.trend === "down" ? TrendingDown : Minus;
  const trendColor = metric.trend === "up" ? "text-green-500" : metric.trend === "down" ? "text-red-500" : "text-muted-foreground";
  
  return (
    <Card className="border-border/50 bg-card/80">
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          {metric.name}
        </p>
        <div className="flex items-end justify-between gap-2">
          <p className="text-2xl font-bold">{metric.value}</p>
          <div className={`flex items-center gap-1 ${trendColor}`}>
            <TrendIcon className="w-4 h-4" />
            <span className="text-sm font-medium">
              {metric.change > 0 ? "+" : ""}{metric.change}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ContributionCard({ contribution }: { contribution: AgentContribution }) {
  const priorityColors = {
    high: "bg-red-500/10 text-red-500 border-red-500/20",
    medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    low: "bg-green-500/10 text-green-500 border-green-500/20",
  };

  return (
    <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        <span className="font-semibold text-foreground">{contribution.agentName}</span>
        <span className="text-sm text-muted-foreground">{contribution.role}</span>
        <Badge 
          variant="outline" 
          className={`text-xs ${priorityColors[contribution.priority]}`}
        >
          {contribution.priority}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {contribution.insight}
      </p>
    </div>
  );
}

function ActionItemCard({ item }: { item: ActionItem }) {
  const statusIcons = {
    pending: Clock,
    in_progress: AlertTriangle,
    completed: CheckCircle2,
  };
  const StatusIcon = statusIcons[item.status];
  
  const statusColors = {
    pending: "text-muted-foreground",
    in_progress: "text-yellow-500",
    completed: "text-green-500",
  };

  const priorityColors = {
    high: "border-l-red-500",
    medium: "border-l-yellow-500",
    low: "border-l-green-500",
  };

  return (
    <div className={`p-4 rounded-lg bg-muted/30 border border-border/30 border-l-4 ${priorityColors[item.priority]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="font-medium text-foreground">{item.title}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Assigned to: <span className="text-foreground">{item.assignedTo}</span>
          </p>
          {item.dueDate && (
            <p className="text-xs text-muted-foreground mt-1 font-mono">
              Due: {new Date(item.dueDate).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className={`flex items-center gap-1 ${statusColors[item.status]}`}>
          <StatusIcon className="w-4 h-4" />
          <span className="text-xs capitalize">{item.status.replace("_", " ")}</span>
        </div>
      </div>
    </div>
  );
}

function MeetingReportSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="h-6 w-48 bg-muted/50 rounded animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="h-4 w-full bg-muted/50 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-muted/50 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-muted/50 rounded animate-pulse" />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-border/50 bg-card/80">
            <CardContent className="p-4">
              <div className="h-3 w-16 bg-muted/50 rounded animate-pulse mb-2" />
              <div className="h-8 w-20 bg-muted/50 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
