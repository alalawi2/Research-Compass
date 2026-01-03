import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  projects, 
  InsertProject,
  sampleSizeCalculations,
  InsertSampleSizeCalculation,
  proposals,
  InsertProposal,
  chatConversations,
  InsertChatConversation,
  chatMessages,
  InsertChatMessage,
  budgets,
  InsertBudget,
  timelines,
  InsertTimeline,
  savedPapers,
  InsertSavedPaper,
  feedback,
  InsertFeedback,
  projectCollaborators,
  InsertProjectCollaborator,
  proposalComments,
  InsertProposalComment,
  proposalRevisions,
  InsertProposalRevision,
  projectActivities,
  InsertProjectActivity,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Project queries
export async function createProject(userId: number, data: { title: string; description?: string; studyType?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(projects).values({
    userId,
    title: data.title,
    description: data.description,
    studyType: data.studyType,
  });
  return result;
}

export async function getUserProjects(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(projects).where(eq(projects.userId, userId)).orderBy(projects.updatedAt);
}

export async function getProjectById(projectId: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);
  
  if (result.length === 0 || result[0].userId !== userId) return undefined;
  return result[0];
}

export async function updateProject(projectId: number, userId: number, data: Partial<InsertProject>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(projects)
    .set(data)
    .where(eq(projects.id, projectId));
}

export async function deleteProject(projectId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(projects).where(eq(projects.id, projectId));
}

// Sample size calculation queries
export async function saveSampleSizeCalculation(data: InsertSampleSizeCalculation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(sampleSizeCalculations).values(data);
}

export async function getProjectCalculations(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(sampleSizeCalculations)
    .where(eq(sampleSizeCalculations.projectId, projectId))
    .orderBy(sampleSizeCalculations.createdAt);
}

// Proposal queries
export async function createProposal(data: InsertProposal) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(proposals).values(data);
}

export async function getProjectProposals(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(proposals)
    .where(eq(proposals.projectId, projectId))
    .orderBy(proposals.version);
}

export async function updateProposal(proposalId: number, data: Partial<InsertProposal>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(proposals)
    .set(data)
    .where(eq(proposals.id, proposalId));
}

// Chat conversation queries
export async function createChatConversation(userId: number, projectId?: number, title?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(chatConversations).values({
    userId,
    projectId,
    title,
  });
  
  // Return the inserted ID
  const insertId = (result as any).insertId;
  return { id: Number(insertId) };
}

export async function getUserConversations(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(chatConversations)
    .where(eq(chatConversations.userId, userId))
    .orderBy(chatConversations.updatedAt);
}

export async function saveChatMessage(data: InsertChatMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(chatMessages).values(data);
}

export async function getConversationMessages(conversationId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(chatMessages)
    .where(eq(chatMessages.conversationId, conversationId))
    .orderBy(chatMessages.createdAt);
}

// Budget queries
export async function createBudget(data: InsertBudget) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(budgets).values(data);
}

export async function getProjectBudget(projectId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(budgets)
    .where(eq(budgets.projectId, projectId))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function updateBudget(budgetId: number, data: Partial<InsertBudget>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(budgets)
    .set(data)
    .where(eq(budgets.id, budgetId));
}

// Timeline queries
export async function createTimelinePhase(data: InsertTimeline) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(timelines).values(data);
}

export async function getProjectTimeline(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(timelines)
    .where(eq(timelines.projectId, projectId));
}

export async function updateTimelinePhase(phaseId: number, data: Partial<InsertTimeline>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(timelines)
    .set(data)
    .where(eq(timelines.id, phaseId));
}

export async function deleteTimelinePhase(phaseId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.delete(timelines)
    .where(eq(timelines.id, phaseId));
}

// Feedback queries
export async function saveFeedback(data: InsertFeedback) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(feedback).values(data);
}

export async function getUserFeedback(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(feedback)
    .where(eq(feedback.userId, userId))
    .orderBy(feedback.createdAt);
}

// Saved papers queries
export async function savePaper(data: InsertSavedPaper) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(savedPapers).values(data);
}

export async function getProjectPapers(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(savedPapers)
    .where(eq(savedPapers.projectId, projectId))
    .orderBy(savedPapers.createdAt);
}

// Feedback queries
export async function createFeedback(data: InsertFeedback) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(feedback).values(data);
}

export async function getAllFeedback() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(feedback).orderBy(feedback.createdAt);
}


// Collaboration queries
export async function addProjectCollaborator(data: InsertProjectCollaborator) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(projectCollaborators).values(data);
}

export async function getProjectCollaborators(projectId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(projectCollaborators)
    .where(eq(projectCollaborators.projectId, projectId));
}

export async function removeProjectCollaborator(collaboratorId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.delete(projectCollaborators)
    .where(eq(projectCollaborators.id, collaboratorId));
}

export async function addProposalComment(data: InsertProposalComment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(proposalComments).values(data);
  return Number((result as any).insertId);
}

export async function getProposalComments(proposalId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(proposalComments)
    .where(eq(proposalComments.proposalId, proposalId))
    .orderBy(proposalComments.createdAt);
}

export async function addProposalRevision(data: InsertProposalRevision) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(proposalRevisions).values(data);
}

export async function getProposalRevisions(proposalId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(proposalRevisions)
    .where(eq(proposalRevisions.proposalId, proposalId))
    .orderBy(proposalRevisions.version);
}

export async function addProjectActivity(data: InsertProjectActivity) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(projectActivities).values(data);
}

export async function getProjectActivities(projectId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(projectActivities)
    .where(eq(projectActivities.projectId, projectId))
    .orderBy(projectActivities.createdAt)
    .limit(limit);
}
