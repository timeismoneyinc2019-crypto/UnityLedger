import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Zap, Play } from "lucide-react";
import { CONTRACT_CONFIG } from "@/lib/contractConfig";
import { NANO_AGENTS } from "@shared/schema";

interface InteractiveBoardroomProps {
  onRunSimulation?: () => void;
  isSimulationLoading?: boolean;
  discussion?: string;
}

export function InteractiveBoardroom({
  onRunSimulation,
  isSimulationLoading = false,
  discussion = "Boardroom awaiting updates...",
}: InteractiveBoardroomProps) {
  const [balances, setBalances] = useState<Record<string, string>>({});

  // Generate mock balances (in production, fetch from blockchain)
  useEffect(() => {
    const mockBalances = NANO_AGENTS.reduce(
      (acc, agent) => {
        acc[agent] = (Math.random() * 10000).toFixed(2);
        return acc;
      },
      {} as Record<string, string>
    );
    setBalances(mockBalances);
  }, []);

  return (
    <div className="space-y-6">
      {/* Contract Info */}
      <Card className="bg-gradient-to-r from-purple-950/50 to-indigo-950/50 border-purple-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-purple-300">UPX Contract Connected</CardTitle>
              <p className="text-xs text-muted-foreground mt-2 font-mono">
                {CONTRACT_CONFIG.UPX_TOKEN_ADDRESS}
              </p>
            </div>
            <Badge variant="outline" className="border-purple-500/50 text-purple-300">
              {CONTRACT_CONFIG.NETWORK}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Nano Agent Balances */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-500" />
            Nano Agent Balances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {NANO_AGENTS.map((agent) => (
              <div
                key={agent}
                className="p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20"
              >
                <p className="text-xs font-semibold text-purple-300">{agent}</p>
                <p className="text-sm font-mono font-bold text-white mt-2">
                  {balances[agent] || "0"} UPX
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Run Simulation Button */}
      {onRunSimulation && (
        <Button
          onClick={onRunSimulation}
          disabled={isSimulationLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          size="lg"
          data-testid="button-run-simulation"
        >
          <Play className="w-4 h-4 mr-2" />
          {isSimulationLoading ? "Running Simulation..." : "Run Nano Agent Simulation"}
        </Button>
      )}

      {/* Discussion Log */}
      {discussion && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Boardroom Discussion</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48 w-full rounded border border-purple-500/20 p-3 bg-black/20">
              <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap">
                {discussion}
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
