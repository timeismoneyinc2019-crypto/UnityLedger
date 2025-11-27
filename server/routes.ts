import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateMeetingReport, askAgents, runAudit } from "./ai/nano_meetings";
import type { MeetingType, ChatMessage } from "@shared/schema";
import { randomUUID } from "crypto";

const VALID_MEETING_TYPES: MeetingType[] = ["daily", "weekly", "monthly", "quarterly", "annually", "oncall"];

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      service: "UnityPay 2045 Prime Brain",
      timestamp: new Date().toISOString(),
      agents: 12,
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

      const report = await generateMeetingReport(type);
      await storage.saveMeetingReport(report);

      res.json(report);
    } catch (error) {
      console.error("Error running meeting:", error);
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

      const { response, agentName } = await askAgents(message);

      const assistantMessage: ChatMessage = {
        id: randomUUID(),
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
        agentName,
      };
      await storage.addChatMessage(assistantMessage);

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
      res.json({ success: true });
    } catch (error) {
      console.error("Error clearing chat history:", error);
      res.status(500).json({ error: "Failed to clear chat history" });
    }
  });

  app.post("/api/audit/run", async (req, res) => {
    try {
      const report = await runAudit();
      res.json({ report, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error("Error running audit:", error);
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

  return httpServer;
}
