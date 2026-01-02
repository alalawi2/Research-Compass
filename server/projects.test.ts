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

describe("projects", () => {
  it("creates a new project successfully", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.projects.create({
      title: "Test Research Project",
      description: "A test project for vitest",
      studyType: "RCT",
    });

    expect(result).toBeDefined();
    // Project creation returns database result, not success object
  });

  it("lists user projects", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.projects.list();

    expect(Array.isArray(result)).toBe(true);
  });

  it("requires authentication for project creation", async () => {
    const ctx: TrpcContext = {
      user: null,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {
        clearCookie: () => {},
      } as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.projects.create({
        title: "Unauthorized Project",
        description: "Should fail",
        studyType: "RCT",
      })
    ).rejects.toThrow();
  });
});
