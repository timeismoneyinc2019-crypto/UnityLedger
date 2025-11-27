import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, integer, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  walletAddress: text("wallet_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  walletAddress: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const meetingReports = pgTable("meeting_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  summary: text("summary").notNull(),
  agentContributions: jsonb("agent_contributions").notNull().$type<AgentContribution[]>(),
  actionItems: jsonb("action_items").notNull().$type<ActionItem[]>(),
  metrics: jsonb("metrics").$type<MetricUpdate[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMeetingReportSchema = createInsertSchema(meetingReports).omit({
  id: true,
  createdAt: true,
});

export type InsertMeetingReport = z.infer<typeof insertMeetingReportSchema>;
export type SelectMeetingReport = typeof meetingReports.$inferSelect;

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  role: text("role").notNull(),
  content: text("content").notNull(),
  agentId: text("agent_id"),
  agentName: text("agent_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type SelectChatMessage = typeof chatMessages.$inferSelect;

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  report: text("report").notNull(),
  severity: text("severity").notNull().default("info"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type SelectAuditLog = typeof auditLogs.$inferSelect;

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  type: text("type").notNull(),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  currency: text("currency").notNull(),
  status: text("status").notNull().default("pending"),
  stripePaymentId: text("stripe_payment_id"),
  txHash: text("tx_hash"),
  fromAddress: text("from_address"),
  toAddress: text("to_address"),
  chain: text("chain"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type SelectTransaction = typeof transactions.$inferSelect;

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
