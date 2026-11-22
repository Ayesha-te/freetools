import { describe, it, expect } from "vitest";
import { weightedAverage, updateCgpa, percentOf, whatPercent, percentChange, marksSummary, marksNeeded, gradeProjection, studyPlan } from "@/lib/calc/student";

describe("student calculators", () => {
  it("credit-weighted GPA", () => {
    const r = weightedAverage([{ value: 4, weight: 3 }, { value: 3, weight: 4 }, { value: 2, weight: 1 }]);
    expect(r!.average).toBeCloseTo((12 + 12 + 2) / 8, 10);
    expect(r!.totalWeight).toBe(8);
  });
  it("returns null with zero credits and rejects invalid values", () => {
    expect(weightedAverage([])).toBeNull();
    expect(weightedAverage([{ value: 3, weight: 0 }])).toBeNull();
    expect(() => weightedAverage([{ value: NaN, weight: 3 }])).toThrow();
    expect(() => weightedAverage([{ value: 3, weight: -1 }])).toThrow();
  });
  it("updates CGPA", () => {
    expect(updateCgpa(3.5, 60, [{ value: 4, weight: 15 }])!.average).toBeCloseTo((210 + 60) / 75, 10);
  });
  it("percentages", () => {
    expect(percentOf(15, 200)).toBe(30);
    expect(whatPercent(45, 60)).toBe(75);
    expect(whatPercent(1, 0)).toBeNull();
    expect(percentChange(80, 100)).toBe(25);
    expect(percentChange(100, 80)).toBe(-20);
    expect(percentChange(0, 5)).toBeNull();
    expect(percentChange(-50, -25)).toBe(50);
  });
  it("marks", () => {
    const s = marksSummary([{ obtained: 78, total: 100 }, { obtained: 45, total: 50 }]);
    expect(s!.obtained).toBe(123);
    expect(s!.percentage).toBeCloseTo(82, 10);
    expect(() => marksSummary([{ obtained: 120, total: 100 }])).toThrow();
    expect(() => marksSummary([{ obtained: 1, total: 0 }])).toThrow();
    expect(marksNeeded(80, 300, 500)).toBe(100);
    expect(marksNeeded(50, 300, 500)).toBe(0);
  });
  it("grade projection and final exam needed", () => {
    const g = gradeProjection([{ score: 90, weight: 20 }, { score: 80, weight: 30 }], 85, 50);
    expect(g.current).toBeCloseTo(84, 10);
    expect(g.needed).toBeCloseTo(((85 - 42) / 50) * 100, 10);
  });
  it("study plan", () => {
    const p = studyPlan([{ name: "Math", credits: 3, difficulty: 3 }, { name: "Art", credits: 2, difficulty: 1 }], 2, 5);
    expect(p.rows[0].weekly).toBe(9);
    expect(p.rows[1].weekly).toBe(3);
    expect(p.totalWeekly).toBe(12);
    expect(p.perDay).toBeCloseTo(2.4);
    expect(() => studyPlan([], 2, 8)).toThrow();
  });
});
