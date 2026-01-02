import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
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

  return { ctx };
}

describe("feedback", () => {
  it("submits feedback successfully", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.feedback.submit({
      type: "feature",
      subject: "New Feature Request",
      message: "Please add support for meta-analysis calculations",
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("success", true);
  });

  it("accepts all feedback types", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const types: Array<"bug" | "feature" | "feedback" | "question"> = [
      "bug",
      "feature",
      "feedback",
      "question",
    ];

    for (const type of types) {
      const result = await caller.feedback.submit({
        type,
        subject: `Test ${type}`,
        message: `Testing ${type} submission`,
      });

      expect(result.success).toBe(true);
    }
  });

  it("retrieves user feedback", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.feedback.getUserFeedback();

    expect(Array.isArray(result)).toBe(true);
  });
});
