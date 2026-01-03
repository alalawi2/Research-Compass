import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(role: "user" | "admin" = "user"): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("Feedback System", () => {
  it("should submit feedback successfully", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.feedback.submit({
      type: "feedback",
      subject: "Great tool!",
      message: "Rating: 5/5 stars\n\nThis is an excellent research assistant platform.",
    });

    expect(result).toEqual({ success: true });
  });

  it("should submit bug report", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.feedback.submit({
      type: "bug",
      subject: "Calculator issue",
      message: "Rating: 3/5 stars\n\nFound a bug in the sample size calculator.",
    });

    expect(result).toEqual({ success: true });
  });

  it("should submit feature request", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.feedback.submit({
      type: "feature",
      subject: "Add more tests",
      message: "Rating: 4/5 stars\n\nWould love to see more statistical tests added.",
    });

    expect(result).toEqual({ success: true });
  });

  it("should allow admin to view all feedback", async () => {
    const adminCtx = createAuthContext("admin");
    const caller = appRouter.createCaller(adminCtx);

    const feedback = await caller.feedback.getAll();

    expect(Array.isArray(feedback)).toBe(true);
    // Feedback should have user information joined
    if (feedback.length > 0) {
      expect(feedback[0]).toHaveProperty("userName");
      expect(feedback[0]).toHaveProperty("userEmail");
      expect(feedback[0]).toHaveProperty("type");
      expect(feedback[0]).toHaveProperty("subject");
      expect(feedback[0]).toHaveProperty("message");
    }
  });

  it("should prevent non-admin from viewing all feedback", async () => {
    const userCtx = createAuthContext("user");
    const caller = appRouter.createCaller(userCtx);

    await expect(caller.feedback.getAll()).rejects.toThrow("Admin access required");
  });

  it("should allow users to view their own feedback", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const feedback = await caller.feedback.getUserFeedback();

    expect(Array.isArray(feedback)).toBe(true);
  });
});
