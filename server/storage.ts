import { type User, type InsertUser, type Message, type InsertMessage, type Memo, type InsertMemo } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserOnlineStatus(id: string, isOnline: boolean): Promise<void>;
  getOnlineUsers(): Promise<User[]>;
  
  createMessage(message: InsertMessage & { userId: string }): Promise<Message>;
  getMessages(channel?: string, limit?: number): Promise<Message[]>;
  
  createMemo(memo: InsertMemo & { userId: string }): Promise<Memo>;
  getUserMemos(userId: string): Promise<Memo[]>;
  updateMemo(id: string, memo: Partial<InsertMemo>): Promise<Memo | undefined>;
  deleteMemo(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private messages: Map<string, Message>;
  private memos: Map<string, Memo>;

  constructor() {
    this.users = new Map();
    this.messages = new Map();
    this.memos = new Map();
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
    const user: User = { 
      ...insertUser, 
      id, 
      isOnline: true, 
      lastSeen: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserOnlineStatus(id: string, isOnline: boolean): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.isOnline = isOnline;
      user.lastSeen = new Date();
      this.users.set(id, user);
    }
  }

  async getOnlineUsers(): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.isOnline);
  }

  async createMessage(messageData: InsertMessage & { userId: string }): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      id,
      content: messageData.content,
      userId: messageData.userId,
      username: messageData.username,
      timestamp: new Date(),
      channel: messageData.channel || "general",
    };
    this.messages.set(id, message);
    return message;
  }

  async getMessages(channel: string = "general", limit: number = 50): Promise<Message[]> {
    const channelMessages = Array.from(this.messages.values())
      .filter(msg => msg.channel === channel)
      .sort((a, b) => (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0))
      .slice(-limit);
    return channelMessages;
  }

  async createMemo(memoData: InsertMemo & { userId: string }): Promise<Memo> {
    const id = randomUUID();
    const memo: Memo = {
      id,
      title: memoData.title,
      content: memoData.content,
      userId: memoData.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.memos.set(id, memo);
    return memo;
  }

  async getUserMemos(userId: string): Promise<Memo[]> {
    return Array.from(this.memos.values())
      .filter(memo => memo.userId === userId)
      .sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0));
  }

  async updateMemo(id: string, memoData: Partial<InsertMemo>): Promise<Memo | undefined> {
    const memo = this.memos.get(id);
    if (memo) {
      const updatedMemo = {
        ...memo,
        ...memoData,
        updatedAt: new Date(),
      };
      this.memos.set(id, updatedMemo);
      return updatedMemo;
    }
    return undefined;
  }

  async deleteMemo(id: string): Promise<boolean> {
    return this.memos.delete(id);
  }
}

export const storage = new MemStorage();
