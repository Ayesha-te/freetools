import { describe, it, expect } from "vitest";
import { profitMargin, priceForMargin, productPrice, applyDiscounts, priceFromMarkup, markupFromPrice, breakEven, shippingCost, addVat, removeVat, formatMoney } from "@/lib/calc/business";

describe("business calculators", () => {
  it("profit margin & markup", () => {
    const r = profitMargin(60, 100);
    expect(r.profit).toBe(40);
    expect(r.margin).toBe(40);
    expect(r.markup).toBeCloseTo(66.6667, 3);
    expect(profitMargin(10, 0).margin).toBeNull();
  });
  it("price for margin", () => {
    expect(priceForMargin(60, 40)).toBeCloseTo(100, 10);
    expect(priceForMargin(60, 100)).toBeNull();
  });
  it("product pricing with fees", () => {
    const r = productPrice({ unitCost: 10, extraCosts: 2, feePercent: 10, feeFixed: 0.3, targetMargin: 30, taxPercent: 20 })!;
    expect(r.price).toBeCloseTo(12.3 / 0.6, 10);
    expect(r.profit / r.price).toBeCloseTo(0.3, 10);
    expect(r.priceWithTax).toBeCloseTo(r.price * 1.2, 10);
    expect(productPrice({ unitCost: 1, extraCosts: 0, feePercent: 50, feeFixed: 0, targetMargin: 50, taxPercent: 0 })).toBeNull();
  });
  it("stacked discounts", () => {
    const r = applyDiscounts(100, [{ type: "percent", value: 20 }, { type: "percent", value: 10 }]);
    expect(r.final).toBeCloseTo(72);
    expect(r.effectivePercent).toBeCloseTo(28);
    expect(applyDiscounts(10, [{ type: "fixed", value: 15 }]).final).toBe(0);
  });
  it("markup", () => {
    expect(priceFromMarkup(50, 50).price).toBe(75);
    expect(markupFromPrice(50, 75)!.markup).toBe(50);
    expect(markupFromPrice(0, 75)).toBeNull();
  });
  it("break-even", () => {
    const r = breakEven(10000, 50, 30)!;
    expect(r.units).toBe(500);
    expect(r.revenue).toBe(25000);
    expect(breakEven(10000, 33, 30)!.unitsRounded).toBe(3334);
    expect(breakEven(100, 10, 10)).toBeNull();
  });
  it("shipping uses chargeable weight", () => {
    const r = shippingCost({ weight: 2, length: 40, width: 30, height: 20, divisor: 5000, quantity: 1, baseFee: 5, ratePerUnit: 3, fuelPercent: 10, handling: 1 });
    expect(r.volumetric).toBe(4.8);
    expect(r.usesVolumetric).toBe(true);
    expect(r.total).toBeCloseTo((5 + 4.8 * 3) * 1.1 + 1, 10);
  });
  it("VAT add/remove round trip", () => {
    expect(addVat(100, 20).gross).toBe(120);
    const r = removeVat(120, 20);
    expect(r.net).toBeCloseTo(100);
    expect(r.vat).toBeCloseTo(20);
  });
  it("money format", () => {
    expect(formatMoney(-1234.5, "$")).toBe("-$1,234.50");
  });
});
