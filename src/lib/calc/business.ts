export function profitMargin(cost: number, revenue: number) {
  const profit = revenue - cost;
  return {
    profit,
    margin: revenue !== 0 ? (profit / revenue) * 100 : null,
    markup: cost !== 0 ? (profit / cost) * 100 : null,
  };
}

/** Price required so that (price - cost) / price = margin. */
export function priceForMargin(cost: number, marginPercent: number) {
  if (marginPercent >= 100) return null;
  return cost / (1 - marginPercent / 100);
}

export interface PricingInput {
  unitCost: number;
  extraCosts: number; // packaging, labour etc. per unit
  feePercent: number; // marketplace/payment fee as % of selling price
  feeFixed: number; // fixed fee per sale
  targetMargin: number; // % of net selling price
  taxPercent: number; // sales tax added on top
}
/**
 * Solve price P (before tax) such that profit/P = margin, where
 * profit = P - cost - fixed fee - P*fee%.  => P = (cost + fixed) / (1 - fee% - margin%)
 */
export function productPrice(i: PricingInput) {
  const cost = i.unitCost + i.extraCosts;
  const denom = 1 - i.feePercent / 100 - i.targetMargin / 100;
  if (denom <= 0) return null;
  const price = (cost + i.feeFixed) / denom;
  const fees = price * (i.feePercent / 100) + i.feeFixed;
  const profit = price - cost - fees;
  const tax = price * (i.taxPercent / 100);
  return { cost, price, fees, profit, tax, priceWithTax: price + tax, markup: cost > 0 ? (profit / cost) * 100 : null };
}

export function applyDiscounts(price: number, discounts: { type: "percent" | "fixed"; value: number }[], taxPercent = 0) {
  let current = price;
  for (const d of discounts) {
    if (d.type === "percent") current -= current * (d.value / 100);
    else current -= d.value;
  }
  current = Math.max(0, current);
  const saved = price - current;
  const tax = current * (taxPercent / 100);
  return {
    final: current,
    saved,
    effectivePercent: price > 0 ? (saved / price) * 100 : 0,
    tax,
    finalWithTax: current + tax,
  };
}

export function priceFromMarkup(cost: number, markupPercent: number) {
  const price = cost * (1 + markupPercent / 100);
  return { price, profit: price - cost, margin: price !== 0 ? ((price - cost) / price) * 100 : null };
}
export function markupFromPrice(cost: number, price: number) {
  if (cost === 0) return null;
  return { markup: ((price - cost) / cost) * 100, profit: price - cost, margin: price !== 0 ? ((price - cost) / price) * 100 : null };
}

export function breakEven(fixed: number, price: number, variable: number, targetProfit = 0) {
  const contribution = price - variable;
  if (contribution <= 0) return null;
  const units = (fixed + targetProfit) / contribution;
  return {
    contribution,
    contributionRatio: price > 0 ? (contribution / price) * 100 : 0,
    units,
    unitsRounded: Math.ceil(units - 1e-9),
    revenue: units * price,
  };
}

export interface ShippingInput {
  weight: number; // kg or lb
  length: number;
  width: number;
  height: number;
  divisor: number; // e.g. 5000 cm³/kg, 139 in³/lb
  quantity: number;
  baseFee: number;
  ratePerUnit: number; // per kg/lb of chargeable weight
  fuelPercent: number;
  handling: number;
}
export function shippingCost(i: ShippingInput) {
  if (i.divisor <= 0) throw new Error("Volumetric divisor must be greater than zero.");
  const volumetric = (i.length * i.width * i.height) / i.divisor;
  const chargeablePer = Math.max(i.weight, volumetric);
  const chargeable = chargeablePer * i.quantity;
  const transport = i.baseFee * i.quantity + chargeable * i.ratePerUnit;
  const fuel = transport * (i.fuelPercent / 100);
  const total = transport + fuel + i.handling;
  return { volumetric, chargeablePer, chargeable, transport, fuel, total, usesVolumetric: volumetric > i.weight };
}

export function addVat(net: number, rate: number) {
  const vat = net * (rate / 100);
  return { net, vat, gross: net + vat };
}
export function removeVat(gross: number, rate: number) {
  const net = gross / (1 + rate / 100);
  return { net, vat: gross - net, gross };
}

export function formatMoney(value: number, symbol: string, decimals = 2) {
  if (!Number.isFinite(value)) return "—";
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return `${sign}${symbol}${abs}`;
}
