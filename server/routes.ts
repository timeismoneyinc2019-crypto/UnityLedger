import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { generateMeetingReport, askAgents, runAudit } from "./ai/nano_meetings";
import type { MeetingType, ChatMessage } from "@shared/schema";
import { randomUUID } from "crypto";

const VALID_MEETING_TYPES: MeetingType[] = ["daily", "weekly", "monthly", "quarterly", "annually", "oncall"];

const clients = new Set<WebSocket>();

function broadcast(event: string, data: unknown) {
  const message = JSON.stringify({ event, data, timestamp: new Date().toISOString() });
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws) => {
    clients.add(ws);
    console.log("WebSocket client connected. Total clients:", clients.size);

    ws.send(JSON.stringify({
      event: "connected",
      data: { message: "Connected to UnityPay 2045 Prime Brain", clients: clients.size },
      timestamp: new Date().toISOString(),
    }));

    broadcast("client_count", { count: clients.size });

    ws.on("close", () => {
      clients.delete(ws);
      console.log("WebSocket client disconnected. Total clients:", clients.size);
      broadcast("client_count", { count: clients.size });
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      clients.delete(ws);
    });
  });

  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      service: "UnityPay 2045 Prime Brain",
      timestamp: new Date().toISOString(),
      agents: 12,
      connectedClients: clients.size,
    });
  });

  app.get("/api/meetings/:type", async (req, res) => {
    try {
      const type = req.params.type as MeetingType;
      
      if (!VALID_MEETING_TYPES.includes(type)) {
        return res.status(400).json({ 
          error: "Invalid meeting type",
          validTypes: VALID_MEETING_TYPES,
        });
      }

      let report = await storage.getMeetingReport(type);
      
      if (!report) {
        report = await generateMeetingReport(type);
        await storage.saveMeetingReport(report);
      }

      res.json(report);
    } catch (error) {
      console.error("Error fetching meeting report:", error);
      res.status(500).json({ error: "Failed to fetch meeting report" });
    }
  });

  app.post("/api/meetings/:type/run", async (req, res) => {
    try {
      const type = req.params.type as MeetingType;
      
      if (!VALID_MEETING_TYPES.includes(type)) {
        return res.status(400).json({ 
          error: "Invalid meeting type",
          validTypes: VALID_MEETING_TYPES,
        });
      }

      broadcast("meeting_started", { type, message: `${type.charAt(0).toUpperCase() + type.slice(1)} meeting in progress...` });

      const report = await generateMeetingReport(type);
      await storage.saveMeetingReport(report);

      broadcast("meeting_completed", { type, report });

      res.json(report);
    } catch (error) {
      console.error("Error running meeting:", error);
      broadcast("meeting_error", { error: "Meeting generation failed" });
      res.status(500).json({ error: "Failed to run meeting" });
    }
  });

  app.post("/api/meetings/ask", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      const userMessage: ChatMessage = {
        id: randomUUID(),
        role: "user",
        content: message,
        timestamp: new Date().toISOString(),
      };
      await storage.addChatMessage(userMessage);

      broadcast("chat_message", userMessage);

      const { response, agentName } = await askAgents(message);

      const assistantMessage: ChatMessage = {
        id: randomUUID(),
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
        agentName,
      };
      await storage.addChatMessage(assistantMessage);

      broadcast("chat_message", assistantMessage);

      res.json({ 
        response, 
        agentName,
        messageId: assistantMessage.id,
      });
    } catch (error) {
      console.error("Error asking agents:", error);
      res.status(500).json({ error: "Failed to get response from agents" });
    }
  });

  app.get("/api/chat/history", async (req, res) => {
    try {
      const history = await storage.getChatHistory();
      res.json(history);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  });

  app.delete("/api/chat/history", async (req, res) => {
    try {
      await storage.clearChatHistory();
      broadcast("chat_cleared", { message: "Chat history cleared" });
      res.json({ success: true });
    } catch (error) {
      console.error("Error clearing chat history:", error);
      res.status(500).json({ error: "Failed to clear chat history" });
    }
  });

  app.post("/api/audit/run", async (req, res) => {
    try {
      broadcast("audit_started", { message: "Security audit in progress..." });
      
      const report = await runAudit();
      await storage.saveAuditLog({ report, severity: "info" });
      
      broadcast("audit_completed", { report });
      
      res.json({ report, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error("Error running audit:", error);
      broadcast("audit_error", { error: "Audit failed" });
      res.status(500).json({ error: "Failed to run audit" });
    }
  });

  app.get("/api/agents", (req, res) => {
    const agents = [
      { id: "athena", name: "Athena", role: "Strategy & Vision", status: "active" },
      { id: "helios", name: "Helios", role: "Quantum-Security", status: "active" },
      { id: "solara", name: "Solara", role: "Crypto Analysis", status: "active" },
      { id: "nexus", name: "Nexus", role: "Multi-Chain Orchestration", status: "active" },
      { id: "artemis", name: "Artemis", role: "UX & Design", status: "active" },
      { id: "morpheus", name: "Morpheus", role: "Behavior & Risk", status: "active" },
      { id: "gaia", name: "Gaia", role: "Ecosystem Growth", status: "active" },
      { id: "orion", name: "Orion", role: "Compliance", status: "active" },
      { id: "chronos", name: "Chronos", role: "Time-Based Operations", status: "active" },
      { id: "phoenix", name: "Phoenix", role: "Recovery & Resilience", status: "active" },
      { id: "aurora", name: "Aurora", role: "Innovation & R&D", status: "active" },
      { id: "sentinel", name: "Sentinel", role: "Monitoring & Alerts", status: "active" },
    ];
    res.json(agents);
  });

  app.get("/api/audit/logs", async (req, res) => {
    try {
      const logs = await storage.getAuditLogs();
      res.json(logs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  });

  app.get("/api/portfolio", (req, res) => {
    res.json({
      totalValue: "$12,450.00",
      upxBalance: "45,000 UPX",
      upxValue: "$9,000.00",
      change24h: 5.2,
      walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f6aa45",
    });
  });

  app.get("/api/transactions", async (req, res) => {
    try {
      const transactions = [
        { id: "1", type: "purchase", amount: "5000", currency: "UPX", status: "completed", txHash: "0xabc...123", chain: "Ethereum", createdAt: new Date().toISOString() },
        { id: "2", type: "transfer", amount: "1000", currency: "UPX", status: "completed", txHash: "0xdef...456", chain: "Polygon", createdAt: new Date(Date.now() - 86400000).toISOString() },
        { id: "3", type: "purchase", amount: "2500", currency: "UPX", status: "pending", chain: "Ethereum", createdAt: new Date(Date.now() - 172800000).toISOString() },
      ];
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  return httpServer;
}
