import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Research projects table - stores user research projects
 */
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  studyType: varchar("study_type", { length: 100 }), // RCT, observational, cohort, etc.
  status: mysqlEnum("status", ["draft", "in_progress", "completed", "archived"]).default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * Sample size calculations table - stores calculator results
 */
export const sampleSizeCalculations = mysqlTable("sample_size_calculations", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("project_id").notNull(),
  userId: int("user_id").notNull(),
  testType: varchar("test_type", { length: 100 }).notNull(), // t-test, ANOVA, chi-square, etc.
  parameters: text("parameters").notNull(), // JSON string of input parameters
  result: text("result").notNull(), // JSON string of calculation results
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SampleSizeCalculation = typeof sampleSizeCalculations.$inferSelect;
export type InsertSampleSizeCalculation = typeof sampleSizeCalculations.$inferInsert;

/**
 * Proposals table - stores research proposal drafts
 */
export const proposals = mysqlTable("proposals", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("project_id").notNull(),
  userId: int("user_id").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  introduction: text("introduction"),
  methods: text("methods"),
  results: text("results"),
  discussion: text("discussion"),
  references: text("references"),
  version: int("version").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Proposal = typeof proposals.$inferSelect;
export type InsertProposal = typeof proposals.$inferInsert;

/**
 * Chat conversations table - stores chatbot conversations
 */
export const chatConversations = mysqlTable("chat_conversations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  projectId: int("project_id"), // Optional: link to specific project
  title: varchar("title", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ChatConversation = typeof chatConversations.$inferSelect;
export type InsertChatConversation = typeof chatConversations.$inferInsert;

/**
 * Chat messages table - stores individual messages in conversations
 */
export const chatMessages = mysqlTable("chat_messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversation_id").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

/**
 * Budgets table - stores budget calculations
 */
export const budgets = mysqlTable("budgets", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("project_id").notNull(),
  userId: int("user_id").notNull(),
  categories: text("categories").notNull(), // JSON string of budget categories and amounts
  totalAmount: int("total_amount").notNull(),
  currency: varchar("currency", { length: 10 }).default("USD").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Budget = typeof budgets.$inferSelect;
export type InsertBudget = typeof budgets.$inferInsert;

/**
 * Timelines table - stores project timelines
 */
export const timelines = mysqlTable("timelines", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("project_id").notNull(),
  userId: int("user_id").notNull(),
  milestones: text("milestones").notNull(), // JSON string of timeline milestones
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Timeline = typeof timelines.$inferSelect;
export type InsertTimeline = typeof timelines.$inferInsert;

/**
 * Saved papers table - stores literature search results
 */
export const savedPapers = mysqlTable("saved_papers", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("project_id").notNull(),
  userId: int("user_id").notNull(),
  pubmedId: varchar("pubmed_id", { length: 50 }),
  title: varchar("title", { length: 500 }).notNull(),
  authors: text("authors"),
  abstract: text("abstract"),
  journal: varchar("journal", { length: 255 }),
  year: int("year"),
  doi: varchar("doi", { length: 100 }),
  url: varchar("url", { length: 500 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SavedPaper = typeof savedPapers.$inferSelect;
export type InsertSavedPaper = typeof savedPapers.$inferInsert;

/**
 * Feedback table - stores user feedback and feature requests
 */
export const feedback = mysqlTable("feedback", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  type: mysqlEnum("type", ["bug", "feature", "feedback", "question"]).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "reviewed", "resolved"]).default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = typeof feedback.$inferInsert;

/**
 * Project Collaborators table - stores project sharing and permissions
 */
export const projectCollaborators = mysqlTable("project_collaborators", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("project_id").notNull(),
  userId: int("user_id").notNull(),
  role: mysqlEnum("role", ["owner", "editor", "viewer"]).default("viewer").notNull(),
  invitedBy: int("invited_by").notNull(),
  invitedAt: timestamp("invited_at").defaultNow().notNull(),
  acceptedAt: timestamp("accepted_at"),
});

export type ProjectCollaborator = typeof projectCollaborators.$inferSelect;
export type InsertProjectCollaborator = typeof projectCollaborators.$inferInsert;

/**
 * Proposal Comments table - stores comments on proposal sections
 */
export const proposalComments = mysqlTable("proposal_comments", {
  id: int("id").autoincrement().primaryKey(),
  proposalId: int("proposal_id").notNull(),
  userId: int("user_id").notNull(),
  section: varchar("section", { length: 100 }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ProposalComment = typeof proposalComments.$inferSelect;
export type InsertProposalComment = typeof proposalComments.$inferInsert;

/**
 * Proposal Revisions table - stores version history of proposals
 */
export const proposalRevisions = mysqlTable("proposal_revisions", {
  id: int("id").autoincrement().primaryKey(),
  proposalId: int("proposal_id").notNull(),
  userId: int("user_id").notNull(),
  version: int("version").notNull(),
  content: text("content").notNull(),
  changeDescription: text("change_description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ProposalRevision = typeof proposalRevisions.$inferSelect;
export type InsertProposalRevision = typeof proposalRevisions.$inferInsert;

/**
 * Project Activity Feed table - stores activity log for projects
 */
export const projectActivities = mysqlTable("project_activities", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("project_id").notNull(),
  userId: int("user_id").notNull(),
  activityType: varchar("activity_type", { length: 100 }).notNull(),
  description: text("description").notNull(),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ProjectActivity = typeof projectActivities.$inferSelect;
export type InsertProjectActivity = typeof projectActivities.$inferInsert;
