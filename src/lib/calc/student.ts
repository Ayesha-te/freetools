export interface GradeScaleEntry {
  grade: string;
  points: number;
}

export interface GradeScale {
  id: string;
  name: string;
  entries: GradeScaleEntry[];
}

export const gradeScales: GradeScale[] = [
  {
    id: "us4",
    name: "4.0 scale (A, B, C, D, F)",
    entries: [
      { grade: "A", points: 4 },
      { grade: "B", points: 3 },
      { grade: "C", points: 2 },
      { grade: "D", points: 1 },
      { grade: "F", points: 0 },
    ],
  },
  {
    id: "us4pm",
    name: "4.0 scale with plus/minus",
    entries: [
      { grade: "A", points: 4 },
      { grade: "A-", points: 3.7 },
      { grade: "B+", points: 3.3 },
      { grade: "B", points: 3 },
      { grade: "B-", points: 2.7 },
      { grade: "C+", points: 2.3 },
      { grade: "C", points: 2 },
      { grade: "C-", points: 1.7 },
      { grade: "D+", points: 1.3 },
      { grade: "D", points: 1 },
      { grade: "F", points: 0 },
    ],
  },
  {
    id: "us43",
    name: "4.3 scale (A+ = 4.3)",
    entries: [
      { grade: "A+", points: 4.3 },
      { grade: "A", points: 4 },
      { grade: "A-", points: 3.7 },
      { grade: "B+", points: 3.3 },
      { grade: "B", points: 3 },
      { grade: "B-", points: 2.7 },
      { grade: "C+", points: 2.3 },
      { grade: "C", points: 2 },
      { grade: "C-", points: 1.7 },
      { grade: "D", points: 1 },
      { grade: "F", points: 0 },
    ],
  },
  {
    id: "five",
    name: "5.0 scale (A = 5)",
    entries: [
      { grade: "A", points: 5 },
      { grade: "B", points: 4 },
      { grade: "C", points: 3 },
      { grade: "D", points: 2 },
      { grade: "E", points: 1 },
      { grade: "F", points: 0 },
    ],
  },
];

export interface WeightedItem {
  value: number;
  weight: number;
}

export interface WeightedResult {
  average: number;
  totalWeight: number;
  totalWeighted: number;
}

/** Credit-weighted average: Σ(value × weight) / Σ weight. Returns null when no weight. */
export function weightedAverage(items: WeightedItem[]): WeightedResult | null {
  let totalWeight = 0;
  let totalWeighted = 0;
  for (const it of items) {
    if (!Number.isFinite(it.value) || !Number.isFinite(it.weight) || it.weight < 0) {
      throw new Error("Values and weights must be valid non-negative numbers.");
    }
    totalWeight += it.weight;
    totalWeighted += it.value * it.weight;
  }
  if (totalWeight <= 0) return null;
  return { average: totalWeighted / totalWeight, totalWeight, totalWeighted };
}

/** Update an existing CGPA with one or more new semesters. */
export function updateCgpa(prevCgpa: number, prevCredits: number, semesters: WeightedItem[]) {
  return weightedAverage([{ value: prevCgpa, weight: prevCredits }, ...semesters]);
}

export function percentOf(percent: number, of: number) {
  return (percent / 100) * of;
}
export function whatPercent(part: number, whole: number) {
  if (whole === 0) return null;
  return (part / whole) * 100;
}
export function percentChange(from: number, to: number) {
  if (from === 0) return null;
  return ((to - from) / Math.abs(from)) * 100;
}

export interface MarksRow {
  obtained: number;
  total: number;
}
export function marksSummary(rows: MarksRow[]) {
  let obtained = 0;
  let total = 0;
  for (const r of rows) {
    if (r.total <= 0) throw new Error("Maximum marks must be greater than zero.");
    if (r.obtained < 0 || r.obtained > r.total) throw new Error("Obtained marks must be between 0 and the maximum.");
    obtained += r.obtained;
    total += r.total;
  }
  if (total === 0) return null;
  return { obtained, total, percentage: (obtained / total) * 100 };
}
/** Marks still required to reach a target percentage given the grand total. */
export function marksNeeded(targetPercent: number, obtained: number, total: number) {
  return Math.max(0, (targetPercent / 100) * total - obtained);
}

export interface Assessment {
  score: number; // percent 0..100+
  weight: number; // percent of course
}
/**
 * Current weighted grade over completed work, and the score needed on the
 * remaining weight (e.g. a final exam) to reach the target overall grade.
 */
export function gradeProjection(items: Assessment[], target: number, finalWeight: number) {
  const completedWeight = items.reduce((s, i) => s + i.weight, 0);
  const earned = items.reduce((s, i) => s + (i.score * i.weight) / 100, 0);
  const current = completedWeight > 0 ? (earned / completedWeight) * 100 : null;
  let needed: number | null = null;
  if (finalWeight > 0) {
    needed = ((target - earned) / finalWeight) * 100;
  }
  return { completedWeight, earned, current, needed, totalWeight: completedWeight + finalWeight };
}

export interface StudySubject {
  name: string;
  credits: number;
  difficulty: 1 | 2 | 3; // easy, medium, hard
}
export const difficultyFactor: Record<1 | 2 | 3, number> = { 1: 0.75, 2: 1, 3: 1.5 };

export function studyPlan(subjects: StudySubject[], hoursPerCredit: number, studyDays: number) {
  if (studyDays < 1 || studyDays > 7) throw new Error("Study days must be between 1 and 7.");
  const rows = subjects.map((s) => {
    const weekly = s.credits * hoursPerCredit * difficultyFactor[s.difficulty];
    return { ...s, weekly, perDay: weekly / studyDays };
  });
  const totalWeekly = rows.reduce((a, r) => a + r.weekly, 0);
  return { rows, totalWeekly, perDay: totalWeekly / studyDays };
}
