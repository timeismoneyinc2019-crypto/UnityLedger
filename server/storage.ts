import { type User, type InsertUser, type MeetingReport, type ChatMessage, type MeetingType } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getMeetingReport(type: MeetingType): Promise<MeetingReport | undefined>;
  saveMeetingReport(report: MeetingReport): Promise<MeetingReport>;
  
  getChatHistory(): Promise<ChatMessage[]>;
  addChatMessage(message: ChatMessage): Promise<ChatMessage>;
  clearChatHistory(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private meetingReports: Map<MeetingType, MeetingReport>;
  private chatHistory: ChatMessage[];

  constructor() {
    this.users = new Map();
    this.meetingReports = new Map();
    this.chatHistory = [];
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getMeetingReport(type: MeetingType): Promise<MeetingReport | undefined> {
    return this.meetingReports.get(type);
  }

  async saveMeetingReport(report: MeetingReport): Promise<MeetingReport> {
    this.meetingReports.set(report.type, report);
    return report;
  }

  async getChatHistory(): Promise<ChatMessage[]> {
    return this.chatHistory;
  }

  async addChatMessage(message: ChatMessage): Promise<ChatMessage> {
    this.chatHistory.push(message);
    if (this.chatHistory.length > 100) {
      this.chatHistory = this.chatHistory.slice(-100);
    }
    return message;
  }

  async clearChatHistory(): Promise<void> {
    this.chatHistory = [];
  }
}

export const storage = new MemStorage();
