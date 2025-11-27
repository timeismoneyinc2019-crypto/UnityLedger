import OpenAI from "openai";
import { randomUUID } from "crypto";
import type { 
  MeetingType, 
  MeetingReport, 
  AgentContribution, 
  ActionItem, 
  MetricUpdate,
  NanoAgent 
} from "@shared/schema";

// This is using Replit's AI Integrations service, which provides OpenAI-compatible API access 
// without requiring your own OpenAI API key. Charges are billed to your Replit credits.
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

const NANO_AGENTS: NanoAgent[] = [
  { id: "athena", name: "Athena", role: "Strategy & Vision", description: "Oversees strategic planning", icon: "Brain", color: "#7A1DFF", status: "active" },
  { id: "helios", name: "Helios", role: "Quantum-Security", description: "Manages security protocols", icon: "Shield", color: "#FFD700", status: "active" },
  { id: "solara", name: "Solara", role: "Crypto Analysis", description: "Analyzes crypto markets", icon: "TrendingUp", color: "#00C8FF", status: "active" },
  { id: "nexus", name: "Nexus", role: "Multi-Chain Orchestration", description: "Coordinates cross-chain transactions", icon: "Network", color: "#4A00D9", status: "active" },
  { id: "artemis", name: "Artemis", role: "UX & Design", description: "Optimizes user experience", icon: "Palette", color: "#FF6B9D", status: "active" },
  { id: "morpheus", name: "Morpheus", role: "Behavior & Risk", description: "Analyzes user behavior", icon: "Eye", color: "#9B59B6", status: "active" },
  { id: "gaia", name: "Gaia", role: "Ecosystem Growth", description: "Drives ecosystem expansion", icon: "Globe", color: "#2ECC71", status: "active" },
  { id: "orion", name: "Orion", role: "Compliance", description: "Ensures regulatory compliance", icon: "Scale", color: "#E74C3C", status: "active" },
  { id: "chronos", name: "Chronos", role: "Time-Based Operations", description: "Manages scheduled tasks", icon: "Clock", color: "#F39C12", status: "active" },
  { id: "phoenix", name: "Phoenix", role: "Recovery & Resilience", description: "Handles disaster recovery", icon: "Flame", color: "#E67E22", status: "active" },
  { id: "aurora", name: "Aurora", role: "Innovation & R&D", description: "Explores emerging tech", icon: "Lightbulb", color: "#1ABC9C", status: "active" },
  { id: "sentinel", name: "Sentinel", role: "Monitoring & Alerts", description: "24/7 system monitoring", icon: "Bell", color: "#3498DB", status: "active" },
];

const MEETING_PROMPTS: Record<MeetingType, string> = {
  daily: `You are the Prime Brain orchestrating a daily standup meeting for UnityPay 2045, a revolutionary multi-chain payment platform.
Generate a concise daily report covering:
- Today's priorities across all 12 nano agents
- Any blockers or concerns
- Quick wins achieved
- Focus areas for today
Keep it brief and action-oriented.`,

  weekly: `You are the Prime Brain orchestrating a weekly planning meeting for UnityPay 2045.
Generate a comprehensive weekly report covering:
- Week's accomplishments and milestones
- Key metrics and performance indicators
- Challenges faced and solutions implemented
- Goals for the upcoming week
- Cross-agent collaboration highlights`,

  monthly: `You are the Prime Brain orchestrating a monthly review meeting for UnityPay 2045.
Generate a detailed monthly report covering:
- Monthly KPIs and targets achieved
- Major feature releases or updates
- User growth and engagement metrics
- Security audit results
- Strategic initiatives progress
- Budget and resource allocation review`,

  quarterly: `You are the Prime Brain orchestrating a quarterly strategy alignment meeting for UnityPay 2045.
Generate a strategic quarterly report covering:
- Quarterly OKRs achievement rate
- Market position and competitive analysis
- Revenue and transaction volume trends
- Regulatory compliance updates
- Technology roadmap progress
- Partnership and ecosystem developments
- Risk assessment and mitigation strategies`,

  annually: `You are the Prime Brain orchestrating the annual planning and roadmap meeting for UnityPay 2045.
Generate an executive annual report covering:
- Year-in-review: major achievements and milestones
- Financial performance summary
- User base growth and retention
- Technology evolution and innovations
- Vision and strategy for the upcoming year
- Major initiatives and investments planned
- Global expansion progress`,

  oncall: `You are the Prime Brain orchestrating an emergency on-call meeting for UnityPay 2045.
Generate an incident response report covering:
- Current system status and any active incidents
- Recent alerts and their severity
- Actions taken and pending
- Escalation status
- Communication to stakeholders
Keep it urgent and focused on resolution.`,
};

export async function generateMeetingReport(type: MeetingType): Promise<MeetingReport> {
  const prompt = MEETING_PROMPTS[type];
  
  // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are the Prime Brain of UnityPay 2045, an AI-powered multi-chain payment governance platform. 
You coordinate 12 Executive Nano Agents: Athena (Strategy), Helios (Security), Solara (Crypto), Nexus (Multi-Chain), 
Artemis (UX), Morpheus (Risk), Gaia (Growth), Orion (Compliance), Chronos (Time-Ops), Phoenix (Recovery), 
Aurora (Innovation), and Sentinel (Monitoring).

Respond in JSON format with the following structure:
{
  "summary": "Executive summary of the meeting (2-3 paragraphs)",
  "agentContributions": [
    {"agentId": "agent_id", "agentName": "Agent Name", "role": "Agent Role", "insight": "Key insight or update", "priority": "high|medium|low"}
  ],
  "actionItems": [
    {"title": "Action item title", "assignedTo": "Agent Name", "priority": "high|medium|low", "status": "pending"}
  ],
  "metrics": [
    {"name": "Metric Name", "value": "Current Value", "change": number, "trend": "up|down|stable"}
  ]
}

Include contributions from at least 6 agents and 4-6 action items. Make metrics relevant to the meeting type.`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
    max_completion_tokens: 2048,
  });

  const content = response.choices[0]?.message?.content || "{}";
  let parsed: any;
  
  try {
    parsed = JSON.parse(content);
  } catch {
    parsed = {
      summary: "Meeting report generation encountered an issue. Please try again.",
      agentContributions: [],
      actionItems: [],
      metrics: [],
    };
  }

  const report: MeetingReport = {
    id: randomUUID(),
    type,
    timestamp: new Date().toISOString(),
    summary: parsed.summary || "No summary available.",
    agentContributions: (parsed.agentContributions || []).map((c: any) => ({
      agentId: c.agentId || "unknown",
      agentName: c.agentName || "Unknown Agent",
      role: c.role || "Unknown Role",
      insight: c.insight || "No insight provided.",
      priority: c.priority || "medium",
    })) as AgentContribution[],
    actionItems: (parsed.actionItems || []).map((a: any, index: number) => ({
      id: `action-${index}-${Date.now()}`,
      title: a.title || "Untitled action",
      assignedTo: a.assignedTo || "Unassigned",
      priority: a.priority || "medium",
      status: a.status || "pending",
      dueDate: a.dueDate,
    })) as ActionItem[],
    metrics: parsed.metrics as MetricUpdate[] || [],
  };

  return report;
}

export async function askAgents(message: string): Promise<{ response: string; agentName: string }> {
  const selectedAgent = NANO_AGENTS[Math.floor(Math.random() * NANO_AGENTS.length)];
  
  // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are ${selectedAgent.name}, the ${selectedAgent.role} Nano Agent of UnityPay 2045.
Your expertise: ${selectedAgent.description}

You are part of a team of 12 Executive Nano Agents working under the Prime Brain to govern a revolutionary 
multi-chain payment platform. Respond helpfully and in character, providing insights relevant to your role.

Keep responses concise but informative. Use your specialized knowledge to provide unique perspectives.`,
      },
      {
        role: "user",
        content: message,
      },
    ],
    max_completion_tokens: 1024,
  });

  return {
    response: response.choices[0]?.message?.content || "I apologize, I couldn't process that request. Please try again.",
    agentName: selectedAgent.name,
  };
}

export async function runAudit(): Promise<string> {
  // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are the Helios Nano Agent, responsible for Quantum-Security at UnityPay 2045.
Perform a high-level security audit covering:
- Node.js + React + potential Solidity vulnerabilities
- Top 10 security recommendations
- 3 example safe code patterns
- Overall security score (1-100)

Format your response as a clear, professional security audit report.`,
      },
      {
        role: "user",
        content: "Run a comprehensive security audit for the UnityPay 2045 platform.",
      },
    ],
    max_completion_tokens: 2048,
  });

  return response.choices[0]?.message?.content || "Audit could not be completed.";
}
