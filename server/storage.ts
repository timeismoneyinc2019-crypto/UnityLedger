import { randomUUID } from "crypto";
import { eq, desc } from "drizzle-orm";
import { db } from "./db";
import { 
  users, 
  meetingReports, 
  chatMessages, 
  auditLogs,
  transactions,
  type User, 
  type InsertUser,
  type MeetingReport,
  type ChatMessage,
  type MeetingType,
  type InsertAuditLog,
  type SelectAuditLog,
  type InsertTransaction,
  type SelectTransaction,
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getMeetingReport(type: MeetingType): Promise<MeetingReport | undefined>;
  saveMeetingReport(report: MeetingReport): Promise<MeetingReport>;
  getAllMeetingReports(): Promise<MeetingReport[]>;
  
  getChatHistory(): Promise<ChatMessage[]>;
  addChatMessage(message: ChatMessage): Promise<ChatMessage>;
  clearChatHistory(): Promise<void>;
  
  saveAuditLog(log: InsertAuditLog): Promise<SelectAuditLog>;
  getAuditLogs(): Promise<SelectAuditLog[]>;
  
  createTransaction(tx: InsertTransaction): Promise<SelectTransaction>;
  getTransactionsByUser(userId: string): Promise<SelectTransaction[]>;
  updateTransactionStatus(id: string, status: string): Promise<SelectTransaction | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getMeetingReport(type: MeetingType): Promise<MeetingReport | undefined> {
    const [report] = await db
      .select()
      .from(meetingReports)
      .where(eq(meetingReports.type, type))
      .orderBy(desc(meetingReports.createdAt))
      .limit(1);
    
    if (!report) return undefined;
    
    return {
      id: report.id,
      type: report.type as MeetingType,
      timestamp: report.createdAt.toISOString(),
      summary: report.summary,
      agentContributions: report.agentContributions,
      actionItems: report.actionItems,
      metrics: report.metrics ?? undefined,
    };
  }

  async saveMeetingReport(report: MeetingReport): Promise<MeetingReport> {
    const [saved] = await db.insert(meetingReports).values({
      id: report.id,
      type: report.type,
      summary: report.summary,
      agentContributions: report.agentContributions,
      actionItems: report.actionItems,
      metrics: report.metrics ?? null,
    }).returning();
    
    return {
      id: saved.id,
      type: saved.type as MeetingType,
      timestamp: saved.createdAt.toISOString(),
      summary: saved.summary,
      agentContributions: saved.agentContributions,
      actionItems: saved.actionItems,
      metrics: saved.metrics ?? undefined,
    };
  }

  async getAllMeetingReports(): Promise<MeetingReport[]> {
    const reports = await db
      .select()
      .from(meetingReports)
      .orderBy(desc(meetingReports.createdAt));
    
    return reports.map(report => ({
      id: report.id,
      type: report.type as MeetingType,
      timestamp: report.createdAt.toISOString(),
      summary: report.summary,
      agentContributions: report.agentContributions,
      actionItems: report.actionItems,
      metrics: report.metrics ?? undefined,
    }));
  }

  async getChatHistory(): Promise<ChatMessage[]> {
    const messages = await db
      .select()
      .from(chatMessages)
      .orderBy(desc(chatMessages.createdAt))
      .limit(100);
    
    return messages.reverse().map(msg => ({
      id: msg.id,
      role: msg.role as "user" | "assistant",
      content: msg.content,
      timestamp: msg.createdAt.toISOString(),
      agentId: msg.agentId ?? undefined,
      agentName: msg.agentName ?? undefined,
    }));
  }

  async addChatMessage(message: ChatMessage): Promise<ChatMessage> {
    const [saved] = await db.insert(chatMessages).values({
      id: message.id,
      role: message.role,
      content: message.content,
      agentId: message.agentId ?? null,
      agentName: message.agentName ?? null,
    }).returning();
    
    return {
      id: saved.id,
      role: saved.role as "user" | "assistant",
      content: saved.content,
      timestamp: saved.createdAt.toISOString(),
      agentId: saved.agentId ?? undefined,
      agentName: saved.agentName ?? undefined,
    };
  }

  async clearChatHistory(): Promise<void> {
    await db.delete(chatMessages);
  }

  async saveAuditLog(log: InsertAuditLog): Promise<SelectAuditLog> {
    const [saved] = await db.insert(auditLogs).values(log).returning();
    return saved;
  }

  async getAuditLogs(): Promise<SelectAuditLog[]> {
    return await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt));
  }

  async createTransaction(tx: InsertTransaction): Promise<SelectTransaction> {
    const [saved] = await db.insert(transactions).values(tx).returning();
    return saved;
  }

  async getTransactionsByUser(userId: string): Promise<SelectTransaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt));
  }

  async updateTransactionStatus(id: string, status: string): Promise<SelectTransaction | undefined> {
    const [updated] = await db
      .update(transactions)
      .set({ status })
      .where(eq(transactions.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
