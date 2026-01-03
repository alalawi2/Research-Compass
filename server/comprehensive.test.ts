import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as stats from "../shared/statistics";

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
    } as any,
  };

  return { ctx };
}

describe("Comprehensive Functionality Tests", () => {
  describe("Statistical Calculations - Direct Library Tests", () => {
    it("calculates independent t-test sample size correctly", () => {
      const result = stats.calculateTTestIndependent({
        alpha: 0.05,
        power: 0.8,
        effectSize: 0.5,
        ratio: 1,
      });

      expect(result).toBeDefined();
      expect(result.sampleSize).toBeGreaterThan(0);
      expect(result.totalSampleSize).toBeGreaterThan(0);
      expect(result.power).toBe(0.8);
      expect(result.alpha).toBe(0.05);
      expect(result.effectSize).toBe(0.5);
      
      // Verify reasonable sample size for this scenario
      expect(result.sampleSize).toBeGreaterThan(30);
      expect(result.sampleSize).toBeLessThan(200);
    });

    it("calculates paired t-test sample size correctly", () => {
      const result = stats.calculateTTestPaired({
        alpha: 0.05,
        power: 0.8,
        effectSize: 0.5,
      });

      expect(result).toBeDefined();
      expect(result.sampleSize).toBeGreaterThan(0);
      expect(result.power).toBe(0.8);
      
      // Paired tests generally need fewer participants
      expect(result.sampleSize).toBeGreaterThan(20);
      expect(result.sampleSize).toBeLessThan(100);
    });

    it("calculates ANOVA sample size correctly", () => {
      const result = stats.calculateANOVA({
        alpha: 0.05,
        power: 0.8,
        effectSize: 0.25,
        numGroups: 3,
      });

      expect(result).toBeDefined();
      expect(result.sampleSize).toBeGreaterThan(0);
      expect(result.totalSampleSize).toBeGreaterThan(0);
      expect(result.totalSampleSize).toBe(result.sampleSize * 3);
      
      // Verify reasonable sample size for ANOVA with 3 groups
      expect(result.sampleSize).toBeGreaterThan(30);
      expect(result.sampleSize).toBeLessThan(300);
    });

    it("calculates chi-square test sample size correctly", () => {
      const result = stats.calculateChiSquare({
        alpha: 0.05,
        power: 0.8,
        effectSize: 0.3,
        df: 1,
      });

      expect(result).toBeDefined();
      expect(result.sampleSize).toBeGreaterThan(0);
      expect(result.power).toBe(0.8);
      
      // Verify reasonable sample size
      expect(result.sampleSize).toBeGreaterThan(50);
      expect(result.sampleSize).toBeLessThan(500);
    });

    it("calculates Mann-Whitney U test sample size correctly", () => {
      const result = stats.calculateMannWhitney({
        alpha: 0.05,
        power: 0.8,
        effectSize: 0.5,
        ratio: 1,
      });

      expect(result).toBeDefined();
      expect(result.sampleSize).toBeGreaterThan(0);
      expect(result.totalSampleSize).toBeGreaterThan(0);
    });

    it("calculates Wilcoxon test sample size correctly", () => {
      const result = stats.calculateWilcoxon({
        alpha: 0.05,
        power: 0.8,
        effectSize: 0.5,
      });

      expect(result).toBeDefined();
      expect(result.sampleSize).toBeGreaterThan(0);
    });

    it("calculates correlation test sample size correctly", () => {
      const result = stats.calculateCorrelation({
        alpha: 0.05,
        power: 0.8,
        rho: 0.3,
      });

      expect(result).toBeDefined();
      expect(result.sampleSize).toBeGreaterThan(0);
      
      // Correlation tests typically need reasonable sample sizes
      expect(result.sampleSize).toBeGreaterThan(50);
      expect(result.sampleSize).toBeLessThan(500);
    });

    it("calculates log-rank test sample size correctly", () => {
      const result = stats.calculateLogRank({
        alpha: 0.05,
        power: 0.8,
        hazardRatio: 2,
        eventProbability: 0.5,
      });

      expect(result).toBeDefined();
      expect(result.sampleSize).toBeGreaterThan(0);
    });
  });

  describe("Effect Size Validation", () => {
    it("handles different effect sizes appropriately", () => {
      const smallEffect = stats.calculateTTestIndependent({
        alpha: 0.05,
        power: 0.8,
        effectSize: 0.2, // Small effect
        ratio: 1,
      });

      const largeEffect = stats.calculateTTestIndependent({
        alpha: 0.05,
        power: 0.8,
        effectSize: 0.8, // Large effect
        ratio: 1,
      });

      // Small effects should require larger samples
      expect(smallEffect.sampleSize).toBeGreaterThan(largeEffect.sampleSize);
    });

    it("handles different power levels appropriately", () => {
      const lowPower = stats.calculateTTestIndependent({
        alpha: 0.05,
        power: 0.7,
        effectSize: 0.5,
        ratio: 1,
      });

      const highPower = stats.calculateTTestIndependent({
        alpha: 0.05,
        power: 0.95,
        effectSize: 0.5,
        ratio: 1,
      });

      // Higher power should require larger samples
      expect(highPower.sampleSize).toBeGreaterThan(lowPower.sampleSize);
    });

    it("handles different alpha levels appropriately", () => {
      const strictAlpha = stats.calculateTTestIndependent({
        alpha: 0.01, // More strict
        power: 0.8,
        effectSize: 0.5,
        ratio: 1,
      });

      const relaxedAlpha = stats.calculateTTestIndependent({
        alpha: 0.1, // More relaxed
        power: 0.8,
        effectSize: 0.5,
        ratio: 1,
      });

      // Stricter alpha should require larger samples
      expect(strictAlpha.sampleSize).toBeGreaterThan(relaxedAlpha.sampleSize);
    });
  });

  describe("API Endpoint Tests", () => {
    it("authenticates users correctly", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const user = await caller.auth.me();
      expect(user).toBeDefined();
      expect(user?.email).toBe("test@example.com");
    });

    it("calculates sample size through API", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.sampleSize.calculate({
        testType: "ttest-independent",
        effectSize: 0.5,
        alpha: 0.05,
        power: 0.8,
      });

      expect(result).toBeDefined();
      expect(result.sampleSize).toBeGreaterThan(0);
    });

    it("validates input parameters", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // Invalid power (> 1)
      await expect(
        caller.sampleSize.calculate({
          testType: "ttest-independent",
          effectSize: 0.5,
          alpha: 0.05,
          power: 1.5,
        })
      ).rejects.toThrow();

      // Invalid alpha (> 0.5)
      await expect(
        caller.sampleSize.calculate({
          testType: "ttest-independent",
          effectSize: 0.5,
          alpha: 0.6,
          power: 0.8,
        })
      ).rejects.toThrow();

      // Negative effect size
      await expect(
        caller.sampleSize.calculate({
          testType: "ttest-independent",
          effectSize: -0.5,
          alpha: 0.05,
          power: 0.8,
        })
      ).rejects.toThrow();
    });

    it("handles all test types through API", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const testTypes = [
        { type: "ttest-independent", params: {} },
        { type: "ttest-paired", params: {} },
        { type: "anova", params: { numGroups: 3 } },
        { type: "chi-square", params: { df: 1 } },
        { type: "mann-whitney", params: {} },
        { type: "wilcoxon", params: {} },
        { type: "correlation", params: { rho: 0.3 } },
        { type: "log-rank", params: { hazardRatio: 2, eventProbability: 0.5 } },
      ];

      for (const test of testTypes) {
        const result = await caller.sampleSize.calculate({
          testType: test.type as any,
          effectSize: 0.5,
          alpha: 0.05,
          power: 0.8,
          ...test.params,
        });

        expect(result).toBeDefined();
        expect(result.sampleSize).toBeGreaterThan(0);
      }
    });
  });

  describe("Edge Cases and Boundary Conditions", () => {
    it("handles minimum power correctly", () => {
      const result = stats.calculateTTestIndependent({
        alpha: 0.05,
        power: 0.5, // Minimum realistic power
        effectSize: 0.5,
        ratio: 1,
      });

      expect(result).toBeDefined();
      expect(result.sampleSize).toBeGreaterThan(0);
    });

    it("handles maximum power correctly", () => {
      const result = stats.calculateTTestIndependent({
        alpha: 0.05,
        power: 0.99, // Very high power
        effectSize: 0.5,
        ratio: 1,
      });

      expect(result).toBeDefined();
      expect(result.sampleSize).toBeGreaterThan(0);
    });

    it("handles unequal group ratios", () => {
      const equal = stats.calculateTTestIndependent({
        alpha: 0.05,
        power: 0.8,
        effectSize: 0.5,
        ratio: 1,
      });

      const unequal = stats.calculateTTestIndependent({
        alpha: 0.05,
        power: 0.8,
        effectSize: 0.5,
        ratio: 2, // 2:1 ratio
      });

      expect(equal).toBeDefined();
      expect(unequal).toBeDefined();
      expect(unequal.totalSampleSize!).toBeGreaterThan(equal.totalSampleSize!);
    });

    it("handles large number of groups in ANOVA", () => {
      const result = stats.calculateANOVA({
        alpha: 0.05,
        power: 0.8,
        effectSize: 0.25,
        numGroups: 10, // Large number of groups
      });

      expect(result).toBeDefined();
      expect(result.sampleSize).toBeGreaterThan(0);
      expect(result.totalSampleSize).toBe(result.sampleSize * 10);
    });

    it("handles correlation with weak relationships", () => {
      const result = stats.calculateCorrelation({
        alpha: 0.05,
        power: 0.8,
        rho: 0.1, // Weak correlation
      });

      expect(result).toBeDefined();
      expect(result.sampleSize).toBeGreaterThan(0);
      
      // Weak correlations need large samples
      expect(result.sampleSize).toBeGreaterThan(500);
    });

    it("handles correlation with strong relationships", () => {
      const result = stats.calculateCorrelation({
        alpha: 0.05,
        power: 0.8,
        rho: 0.8, // Strong correlation
      });

      expect(result).toBeDefined();
      expect(result.sampleSize).toBeGreaterThan(0);
      
      // Strong correlations need smaller samples
      expect(result.sampleSize).toBeLessThan(100);
    });
  });

  describe("Mathematical Accuracy", () => {
    it("produces consistent results for same inputs", () => {
      const result1 = stats.calculateTTestIndependent({
        alpha: 0.05,
        power: 0.8,
        effectSize: 0.5,
        ratio: 1,
      });

      const result2 = stats.calculateTTestIndependent({
        alpha: 0.05,
        power: 0.8,
        effectSize: 0.5,
        ratio: 1,
      });

      expect(result1.sampleSize).toBe(result2.sampleSize);
      expect(result1.totalSampleSize).toBe(result2.totalSampleSize);
    });

    it("returns integer sample sizes", () => {
      const result = stats.calculateTTestIndependent({
        alpha: 0.05,
        power: 0.8,
        effectSize: 0.5,
        ratio: 1,
      });

      expect(Number.isInteger(result.sampleSize)).toBe(true);
      expect(Number.isInteger(result.totalSampleSize || 0)).toBe(true);
    });

    it("preserves input parameters in output", () => {
      const result = stats.calculateTTestIndependent({
        alpha: 0.05,
        power: 0.8,
        effectSize: 0.5,
        ratio: 1,
      });

      expect(result.alpha).toBe(0.05);
      expect(result.power).toBe(0.8);
      expect(result.effectSize).toBe(0.5);
    });
  });
});
