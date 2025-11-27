import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type AgentStatus = "active" | "idle" | "processing";

export interface NanoAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: string;
  color: string;
  status: AgentStatus;
  lastAction?: string;
  lastActionTime?: string;
}

export type MeetingType = "daily" | "weekly" | "monthly" | "quarterly" | "annually" | "oncall";

export interface MeetingTypeInfo {
  id: MeetingType;
  label: string;
  description: string;
}

export interface MeetingReport {
  id: string;
  type: MeetingType;
  timestamp: string;
  summary: string;
  agentContributions: AgentContribution[];
  actionItems: ActionItem[];
  metrics?: MetricUpdate[];
}

export interface AgentContribution {
  agentId: string;
  agentName: string;
  role: string;
  insight: string;
  priority: "high" | "medium" | "low";
}

export interface ActionItem {
  id: string;
  title: string;
  assignedTo: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in_progress" | "completed";
  dueDate?: string;
}

export interface MetricUpdate {
  name: string;
  value: string;
  change: number;
  trend: "up" | "down" | "stable";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  agentId?: string;
  agentName?: string;
}

export interface BoardroomState {
  currentMeetingType: MeetingType;
  isLoading: boolean;
  reports: MeetingReport[];
  chatMessages: ChatMessage[];
}

export const NANO_AGENTS: NanoAgent[] = [
  {
    id: "athena",
    name: "Athena",
    role: "Strategy & Vision",
    description: "Oversees long-term strategic planning and vision alignment",
    icon: "Brain",
    color: "#7A1DFF",
    status: "active",
  },
  {
    id: "helios",
    name: "Helios",
    role: "Quantum-Security",
    description: "Manages quantum-resistant encryption and security protocols",
    icon: "Shield",
    color: "#FFD700",
    status: "active",
  },
  {
    id: "solara",
    name: "Solara",
    role: "Crypto Analysis",
    description: "Analyzes cryptocurrency markets and trading patterns",
    icon: "TrendingUp",
    color: "#00C8FF",
    status: "active",
  },
  {
    id: "nexus",
    name: "Nexus",
    role: "Multi-Chain Orchestration",
    description: "Coordinates cross-chain transactions and bridges",
    icon: "Network",
    color: "#4A00D9",
    status: "active",
  },
  {
    id: "artemis",
    name: "Artemis",
    role: "UX & Design",
    description: "Optimizes user experience and interface design",
    icon: "Palette",
    color: "#FF6B9D",
    status: "active",
  },
  {
    id: "morpheus",
    name: "Morpheus",
    role: "Behavior & Risk",
    description: "Analyzes user behavior and assesses risk patterns",
    icon: "Eye",
    color: "#9B59B6",
    status: "active",
  },
  {
    id: "gaia",
    name: "Gaia",
    role: "Ecosystem Growth",
    description: "Drives ecosystem expansion and partnership development",
    icon: "Globe",
    color: "#2ECC71",
    status: "active",
  },
  {
    id: "orion",
    name: "Orion",
    role: "Compliance",
    description: "Ensures regulatory compliance and legal adherence",
    icon: "Scale",
    color: "#E74C3C",
    status: "active",
  },
  {
    id: "chronos",
    name: "Chronos",
    role: "Time-Based Operations",
    description: "Manages scheduled tasks and time-sensitive operations",
    icon: "Clock",
    color: "#F39C12",
    status: "active",
  },
  {
    id: "phoenix",
    name: "Phoenix",
    role: "Recovery & Resilience",
    description: "Handles disaster recovery and system resilience",
    icon: "Flame",
    color: "#E67E22",
    status: "active",
  },
  {
    id: "aurora",
    name: "Aurora",
    role: "Innovation & R&D",
    description: "Explores emerging technologies and innovations",
    icon: "Lightbulb",
    color: "#1ABC9C",
    status: "active",
  },
  {
    id: "sentinel",
    name: "Sentinel",
    role: "Monitoring & Alerts",
    description: "24/7 system monitoring and anomaly detection",
    icon: "Bell",
    color: "#3498DB",
    status: "active",
  },
];

export const MEETING_TYPES: MeetingTypeInfo[] = [
  { id: "daily", label: "Daily", description: "Daily standup and priorities" },
  { id: "weekly", label: "Weekly", description: "Weekly progress and planning" },
  { id: "monthly", label: "Monthly", description: "Monthly review and metrics" },
  { id: "quarterly", label: "Quarterly", description: "Quarterly strategy alignment" },
  { id: "annually", label: "Annually", description: "Annual planning and roadmap" },
  { id: "oncall", label: "On-Call", description: "Emergency response meeting" },
];
