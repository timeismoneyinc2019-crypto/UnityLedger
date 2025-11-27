import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MeetingTabs } from "@/components/MeetingTabs";
import { MeetingReport } from "@/components/MeetingReport";
import { ChatInterface } from "@/components/ChatInterface";
import { AgentGrid } from "@/components/AgentCard";
import { InteractiveBoardroom } from "@/components/InteractiveBoardroom";
import { useWebSocket } from "@/hooks/use-websocket";
import { 
  Calendar, 
  Users, 
  Activity, 
  Zap,
  RefreshCw,
  Play,
  Wifi,
  WifiOff
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { NANO_AGENTS, MEETING_TYPES, type MeetingType, type MeetingReport as MeetingReportType, type ChatMessage } from "@shared/schema";

export default function Boardroom() {
  const [activeMeetingType, setActiveMeetingType] = useState<MeetingType>("daily");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [activeTab, setActiveTab] = useState("meeting");
  const { isConnected, lastMessage, clientCount } = useWebSocket();

  const { data: chatHistory } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/history"],
    staleTime: 0,
  });

  useEffect(() => {
    if (chatHistory && chatHistory.length > 0 && chatMessages.length === 0) {
      setChatMessages(chatHistory);
    }
  }, [chatHistory]);

  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.event === "meeting_completed") {
        queryClient.invalidateQueries({ queryKey: ["/api/meetings"] });
      }
    }
  }, [lastMessage]);

  const { data: report, isLoading: reportLoading, refetch } = useQuery<MeetingReportType>({
    queryKey: ["/api/meetings", activeMeetingType],
  });

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/meetings/ask", { message });
      return response.json();
    },
    onMutate: (message) => {
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: message,
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, userMessage]);
    },
    onSuccess: (data) => {
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.response,
        timestamp: new Date().toISOString(),
        agentName: data.agentName || "Prime Brain",
      };
      setChatMessages((prev) => [...prev, assistantMessage]);
    },
  });

  const runMeetingMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/meetings/${activeMeetingType}/run`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meetings", activeMeetingType] });
    },
  });

  const handleMeetingTypeChange = (type: MeetingType) => {
    setActiveMeetingType(type);
  };

  const handleSendMessage = (message: string) => {
    chatMutation.mutate(message);
  };

  return (
    <div className="p-4 md:p-6 space-y-6" data-testid="boardroom-page">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Executive Boardroom
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-Powered Governance with 12 Nano Agents
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full md:w-auto" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="meeting">Meeting</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {activeTab === "overview" && (
        <InteractiveBoardroom
          onRunSimulation={() => runMeetingMutation.mutate()}
          isSimulationLoading={runMeetingMutation.isPending}
          discussion={report?.summary || "Boardroom awaiting updates..."}
        />
      )}

      {activeTab === "meeting" && (
        <>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => refetch()}
              disabled={reportLoading}
              data-testid="button-refresh"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${reportLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button 
              size="sm"
              onClick={() => runMeetingMutation.mutate()}
              disabled={runMeetingMutation.isPending}
              data-testid="button-run-meeting"
            >
              <Play className="w-4 h-4 mr-2" />
              Run {activeMeetingType.charAt(0).toUpperCase() + activeMeetingType.slice(1)} Meeting
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard 
              icon={Users} 
              label="Active Agents" 
              value="12" 
              subtext="All operational"
              color="text-green-500"
            />
            <StatCard 
              icon={Activity} 
              label="Today's Actions" 
              value="156" 
              subtext="+23% from yesterday"
              color="text-blue-500"
            />
            <StatCard 
              icon={Calendar} 
              label="Meetings" 
              value="6" 
              subtext="Types available"
              color="text-purple-500"
            />
            <StatCard 
              icon={isConnected ? Wifi : WifiOff} 
              label="Prime Brain" 
              value={isConnected ? "Online" : "Connecting..."} 
              subtext={isConnected ? `${clientCount} connected` : "Reconnecting..."}
              color={isConnected ? "text-green-500" : "text-yellow-500"}
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0">
              <Card className="border-border/50 bg-card/80 backdrop-blur-sm mb-6">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-semibold">Meeting Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <MeetingTabs 
                    types={MEETING_TYPES}
                    activeType={activeMeetingType}
                    onTypeChange={handleMeetingTypeChange}
                    isLoading={reportLoading}
                  />
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Meeting Report</h3>
                  <MeetingReport 
                    report={report || null} 
                    isLoading={reportLoading} 
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Nano Agents</h3>
                  <AgentGrid agents={NANO_AGENTS} />
                </div>
              </div>
            </div>

            <div className="w-full lg:w-96 lg:shrink-0">
              <div className="h-[500px] lg:h-[calc(100vh-280px)] lg:sticky lg:top-24">
                <ChatInterface 
                  messages={chatMessages}
                  onSendMessage={handleSendMessage}
                  isLoading={chatMutation.isPending}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "chat" && (
        <div className="max-w-4xl mx-auto">
          <ChatInterface 
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            isLoading={chatMutation.isPending}
          />
        </div>
      )}
    </div>
  );
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  subtext,
  color 
}: { 
  icon: React.ElementType;
  label: string;
  value: string;
  subtext: string;
  color: string;
}) {
  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-9 h-9 rounded-lg bg-muted flex items-center justify-center ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
            {label}
          </span>
        </div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
      </CardContent>
    </Card>
  );
}
