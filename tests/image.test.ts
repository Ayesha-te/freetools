import { describe, it, expect } from "vitest";
import { compressToTarget, safeFilename, formatBytes } from "@/lib/image";

// Simulated encoder: size grows with quality and with scale².
const fakeEncode = (base: number) => async (q: number, s: number) => new Blob([new Uint8Array(Math.round(base * q * s * s))]);

describe("target-size compression", () => {
  it("returns max quality when already small", async () => {
    const r = await compressToTarget(fakeEncode(1000), 50_000);
    expect(r.hitTarget).toBe(true);
    expect(r.quality).toBe(0.95);
  });
  it("finds a quality under the target without exceeding it", async () => {
    const r = await compressToTarget(fakeEncode(100_000), 50_000);
    expect(r.hitTarget).toBe(true);
    expect(r.blob.size).toBeLessThanOrEqual(50_000);
    expect(r.quality).toBeGreaterThan(0.45);
    expect(r.scale).toBe(1);
  });
  it("downscales when minimum quality is too large", async () => {
    const r = await compressToTarget(fakeEncode(1_000_000), 50_000);
    expect(r.hitTarget).toBe(true);
    expect(r.scale).toBeLessThan(1);
    expect(r.blob.size).toBeLessThanOrEqual(50_000);
  });
  it("reports failure honestly when impossible", async () => {
    const r = await compressToTarget(async () => new Blob([new Uint8Array(100_000)]), 50_000);
    expect(r.hitTarget).toBe(false);
    expect(r.blob.size).toBe(100_000);
  });
});

describe("file helpers", () => {
  it("safe filenames", () => {
    expect(safeFilename("../../etc/pa ss<>wd.PNG", "jpg", "-compressed")).toBe("etc_pa-ss_wd-compressed.jpg");
    expect(safeFilename("photo.jpeg")).toBe("photo.jpeg");
    expect(safeFilename("...", "png")).toBe("file.png");
  });
  it("formats bytes", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(51200)).toBe("50.0 KB");
  });
});
