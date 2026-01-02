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

describe("sample size calculator", () => {
  it("calculates sample size for independent t-test", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.sampleSize.calculate({
      testType: "ttest-independent",
      effectSize: 0.5,
      alpha: 0.05,
      power: 0.8,
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("sampleSize");
    expect(typeof result.sampleSize).toBe("number");
    expect(result.sampleSize).toBeGreaterThan(0);
  });

  it("calculates sample size for chi-square test", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.sampleSize.calculate({
      testType: "chi-square",
      effectSize: 0.3,
      alpha: 0.05,
      power: 0.8,
      df: 1,
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("sampleSize");
    expect(result.sampleSize).toBeGreaterThan(0);
  });

  it("calculates sample size for ANOVA", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.sampleSize.calculate({
      testType: "anova",
      effectSize: 0.25,
      alpha: 0.05,
      power: 0.8,
      numGroups: 3,
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("sampleSize");
    expect(result.sampleSize).toBeGreaterThan(0);
  });

  it("validates power parameter range", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Power should be between 0 and 1
    await expect(
      caller.sampleSize.calculate({
        testType: "ttest-independent",
        effectSize: 0.5,
        alpha: 0.05,
        power: 1.5, // Invalid power
      })
    ).rejects.toThrow();
  });

  it("validates alpha parameter range", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Alpha should be between 0 and 1
    await expect(
      caller.sampleSize.calculate({
        testType: "ttest-independent",
        effectSize: 0.5,
        alpha: 1.5, // Invalid alpha
        power: 0.8,
      })
    ).rejects.toThrow();
  });
});
