import type { ToolContent } from "./types";

const localBiz =
  "The figures you enter are processed only in your browser and are not transmitted or stored. This makes the calculator safe for confidential pricing and cost information.";

export const businessContent: Record<string, ToolContent> = {
  "profit-margin-calculator": {
    intro: [
      "The Profit Margin Calculator shows gross profit, profit margin and markup from your cost and selling price. Add the number of units to see total revenue and profit.",
      "Margin and markup are shown together because they are easily confused: both use the same profit, but margin divides by the selling price while markup divides by the cost.",
    ],
    why: [
      "Margin tells you what share of every sale you keep before overheads. It is the number lenders, investors and marketplaces use when comparing businesses, and it helps you check that discounts or rising supplier costs have not erased your profit.",
    ],
    steps: [
      "Choose your currency symbol.",
      "Enter the cost per unit (what you pay to make or buy the item).",
      "Enter the selling price per unit.",
      "Optionally enter the number of units sold.",
      "Read profit, margin and markup; expand the explanation to see the formulas.",
    ],
    examples: [
      { title: "Retail product", body: "Cost 60, price 100. Profit = 40. Margin = 40 ÷ 100 = 40%. Markup = 40 ÷ 60 = 66.7%." },
      { title: "Checking a sale price", body: "If the same item is discounted to 75, profit falls to 15 and margin to 20% — half the original margin from a 25% price cut." },
    ],
    formats: ["Cost and price as non-negative numbers with decimals.", "Any currency symbol (display only, no conversion)."],
    limitations: [
      "This is gross margin. Net margin also subtracts overheads, taxes and interest, which this tool does not ask for.",
      "No currency conversion or live exchange rates are used.",
    ],
    privacy: localBiz,
    faq: [
      { q: "What is a good profit margin?", a: "It varies hugely by industry: grocery retail may run on single-digit gross margins, while software and services often exceed 60%. Compare with businesses similar to yours." },
      { q: "Can margin exceed 100%?", a: "No. Margin is profit divided by price, and profit can never exceed the price. Markup, however, can be well above 100%." },
      { q: "What if the margin is negative?", a: "You are selling below cost. The calculator highlights this and shows the loss per unit." },
    ],
    related: ["markup-calculator", "product-pricing-calculator", "break-even-calculator", "discount-calculator"],
  },

  "product-pricing-calculator": {
    intro: [
      "The Product Pricing Calculator works backwards from your costs to the selling price that delivers the profit margin you want — after marketplace or payment fees. It can also add sales tax or VAT on top to show the customer-facing price.",
    ],
    why: [
      "Sellers on marketplaces often add a fixed percentage to cost and later discover that platform fees, which are charged on the selling price, consumed most of the profit. Solving for the price directly avoids this trap.",
    ],
    steps: [
      "Enter the product cost and other per-unit costs such as packaging.",
      "Enter the profit margin you want as a percentage of the selling price.",
      "Enter any percentage fee (for example a marketplace commission) and fixed per-order fee.",
      "Optionally enter a tax rate to add on top.",
      "Read the recommended price, tax-inclusive price, profit and fees.",
    ],
    examples: [
      { title: "Handmade item on a marketplace", body: "Cost 12 + packaging 1.50 = 13.50. Fee 8% + 0.30 per order. Target margin 35%. Price = (13.50 + 0.30) ÷ (1 − 0.08 − 0.35) = 24.21. Profit = 24.21 − 13.50 − 2.24 = 8.47, which is 35% of the price." },
      { title: "Adding VAT", body: "With a 20% rate, the same item's customer price becomes 24.21 × 1.2 = 29.05. The extra 4.84 is tax owed, not profit." },
    ],
    formats: ["All costs and fees as non-negative numbers.", "Percentages from 0 upward; fee% + margin% must be below 100%."],
    limitations: [
      "We do not know your marketplace's current fee schedule or your local tax rate — enter them from official sources.",
      "Psychological pricing (for example rounding to .99) is left to you; adjust the final number and check margin with the Profit Margin Calculator.",
    ],
    privacy: localBiz,
    faq: [
      { q: "Why not just add 35% to my cost?", a: "Adding 35% to cost is a 35% markup, which equals only about a 26% margin, and fees reduce it further. This calculator targets the true margin after fees." },
      { q: "What if fee% plus margin% is 100% or more?", a: "No price can achieve that, because the fees and margin would consume the entire price. The tool shows an explanatory error." },
      { q: "Should tax be included in my margin?", a: "No. Sales tax and VAT are collected on behalf of the government, so margins are calculated on the price before tax." },
    ],
    related: ["profit-margin-calculator", "markup-calculator", "vat-calculator", "shipping-cost-calculator"],
  },

  "discount-calculator": {
    intro: [
      "The Discount Calculator gives the final price after a percentage or fixed-amount discount and shows exactly how much you save. You can stack a second discount and add sales tax to see the true checkout total.",
    ],
    why: [
      "Stacked offers such as “20% off plus an extra 10%” sound like 30% but are actually 28%, because the second discount applies to an already reduced price. Shoppers can use this tool to compare deals; sellers can check what a promotion will really cost them.",
    ],
    steps: [
      "Enter the original price and pick a currency symbol.",
      "Choose percent or fixed-amount discount and enter its value.",
      "Optionally add a second discount, applied after the first.",
      "Optionally enter a tax rate, applied to the discounted price.",
      "Read the final price, savings and effective discount.",
    ],
    examples: [
      { title: "Seasonal sale", body: "Price 80 with 25% off: savings 20, final price 60." },
      { title: "Stacked coupon", body: "100 with 20% off then 10% off: 100 × 0.8 × 0.9 = 72. Effective discount 28%, not 30%." },
      { title: "Fixed voucher", body: "A 15-off voucher on a 50 item gives 35, an effective 30% discount." },
    ],
    formats: ["Prices and fixed discounts as non-negative numbers.", "Percentage discounts between 0 and 100."],
    limitations: [
      "Whether tax is calculated before or after a coupon depends on local rules and the type of coupon; this tool applies tax after discounts.",
      "Final prices are not allowed to go below zero.",
    ],
    privacy: localBiz,
    faq: [
      { q: "Does the order of stacked percentage discounts matter?", a: "No. 20% then 10% and 10% then 20% both give 28% total. Order does matter when you mix fixed and percentage discounts." },
      { q: "How do I find the original price from a sale price?", a: "Divide the sale price by (1 − discount ÷ 100). For example, 60 after 25% off came from 60 ÷ 0.75 = 80." },
    ],
    related: ["percentage-calculator", "profit-margin-calculator", "vat-calculator", "markup-calculator"],
  },

  "markup-calculator": {
    intro: [
      "The Markup Calculator works in two directions: find the selling price from a cost and a markup percentage, or find the markup percentage from a cost and selling price. It also shows the equivalent profit margin.",
    ],
    why: [
      "Cost-plus pricing — adding a fixed percentage on top of cost — is common in wholesale, construction quotes, restaurants and retail. Knowing how markup relates to margin prevents pricing errors when a supplier or buyer talks in the other term.",
    ],
    steps: [
      "Choose whether you want the selling price or the markup.",
      "Enter the cost.",
      "Enter the markup percentage or the selling price.",
      "Read the result, profit and equivalent margin.",
    ],
    examples: [
      { title: "Wholesale to retail", body: "Cost 40 with a 50% markup: price = 40 × 1.5 = 60, profit 20, margin 33.3%." },
      { title: "Keystone pricing", body: "A 100% markup (doubling the cost) equals a 50% margin." },
    ],
    formats: ["Cost and price as non-negative numbers.", "Markup above −100%."],
    limitations: [
      "Markup from price cannot be calculated when the cost is zero.",
      "This tool ignores platform fees and tax; use the Product Pricing Calculator when those apply.",
      "Make sure “cost” includes everything you pay per unit (purchase price, inbound shipping, packaging); otherwise the real markup is lower than it appears.",
    ],
    privacy: localBiz,
    faq: [
      { q: "What markup should I use?", a: "There is no universal figure. Many retailers use 50–100% on goods, restaurants often mark food up by 200% or more, and contractors may add 10–20% on materials. Start from the margin you need to cover overheads and work backwards." },
      { q: "Can markup be negative?", a: "Yes. A negative markup means you are selling below cost, for example during a clearance sale. The calculator accepts values down to −100% (giving a price of zero)." },
      { q: "What is the difference between markup and margin?", a: "Markup = profit ÷ cost. Margin = profit ÷ price. For the same sale, markup is always the larger number when profit is positive." },
      { q: "How do I convert markup to margin?", a: "Margin = markup ÷ (1 + markup), using decimals. 50% markup → 0.5 ÷ 1.5 = 33.3% margin." },
    ],
    related: ["profit-margin-calculator", "product-pricing-calculator", "discount-calculator", "break-even-calculator"],
  },

  "break-even-calculator": {
    intro: [
      "The Break-Even Calculator tells you how many units you must sell to cover your fixed costs, and the revenue that represents. Add a target profit to see the volume needed to earn it.",
      "It also reports contribution margin — how much each sale contributes towards fixed costs after paying its own variable costs.",
    ],
    why: [
      "Break-even analysis is a quick sanity check for a new product, a price change or a business plan. If the required volume is unrealistic for your market, you know to rethink pricing or costs before investing.",
    ],
    steps: [
      "Enter fixed costs for the period you are analysing (for example monthly rent and salaries).",
      "Enter the selling price per unit and the variable cost per unit.",
      "Optionally enter a target profit for the same period.",
      "Read the units required (rounded up), revenue and contribution margin.",
    ],
    examples: [
      { title: "Small bakery", body: "Fixed costs 5,000 per month, price 25 per cake, variable cost 10. Contribution 15. Break-even = 5,000 ÷ 15 = 333.3, so 334 cakes and about 8,334 in revenue." },
      { title: "With a profit goal", body: "Adding a 3,000 profit target: (5,000 + 3,000) ÷ 15 = 534 cakes." },
    ],
    formats: ["Non-negative numbers; price must be greater than variable cost."],
    limitations: [
      "Assumes price and variable cost stay constant at all volumes, which is rarely true for large changes.",
      "Mixed products need a weighted-average contribution margin; this calculator handles one product at a time.",
    ],
    privacy: localBiz,
    faq: [
      { q: "Why is the unit count rounded up?", a: "You cannot sell a fraction of a unit, and selling one unit fewer would leave a small loss." },
      { q: "What if price is lower than variable cost?", a: "Every sale loses money, so there is no break-even point. The calculator explains this instead of showing a negative number." },
    ],
    related: ["profit-margin-calculator", "product-pricing-calculator", "markup-calculator", "shipping-cost-calculator"],
  },

  "shipping-cost-calculator": {
    intro: [
      "The Shipping Cost Calculator estimates the cost of sending a parcel using your carrier's own rates. It calculates volumetric (dimensional) weight, decides the chargeable weight, and adds base fees, fuel surcharge and handling.",
      "It does not fetch live prices. Instead it shows exactly how carriers typically price parcels, so you can plug in the numbers from your contract or published rate card.",
    ],
    why: [
      "Large, light parcels are charged by size rather than weight. Sellers who ignore volumetric weight under-charge for shipping and lose money on every order. Estimating in advance also helps you pick box sizes and set shipping fees at checkout.",
    ],
    steps: [
      "Choose metric or imperial units.",
      "Enter actual weight, box dimensions and number of parcels.",
      "Check the volumetric divisor your carrier uses (common values are 5000 or 6000 for cm/kg and 139 or 166 for in/lb).",
      "Enter base fee per parcel, rate per kg or lb, fuel surcharge and handling.",
      "Read volumetric weight, chargeable weight and the estimated total.",
    ],
    examples: [
      { title: "Light but bulky box", body: "2 kg in a 40 × 30 × 20 cm box with divisor 5000: volumetric weight = 24,000 ÷ 5,000 = 4.8 kg, so you are billed for 4.8 kg, not 2 kg." },
      { title: "Fuel surcharge", body: "With a base fee of 5 and 3.50 per kg on 4.8 kg, transport = 21.80. A 12% fuel surcharge adds 2.62." },
    ],
    formats: ["Weights in kg or lb, dimensions in cm or in.", "Any rates and currency you enter."],
    limitations: [
      "No live carrier rates are fetched; prices change frequently and differ by account.",
      "Carriers may round weight up to the next 0.5 or 1 unit, and may add residential, remote-area, oversize or customs charges.",
    ],
    privacy: localBiz,
    faq: [
      { q: "What is volumetric weight?", a: "A weight calculated from parcel size (length × width × height ÷ divisor) so that bulky parcels are priced for the space they take up in a vehicle." },
      { q: "Which divisor should I use?", a: "Check your carrier's terms. Express services often use 5000 (cm/kg); some economy services use 6000." },
    ],
    related: ["product-pricing-calculator", "profit-margin-calculator", "break-even-calculator", "vat-calculator"],
  },

  "vat-calculator": {
    intro: [
      "The VAT Calculator adds VAT to a net price or removes it from a gross price using any rate you enter. It works equally for GST and sales tax, since the arithmetic is the same.",
      "Quick-rate buttons provide common percentages as shortcuts but are not tied to any particular country, because rates change and differ by product category.",
    ],
    why: [
      "Invoices must often show net, tax and gross amounts separately. The most common mistake when removing VAT is taking the rate as a percentage of the gross price, which overstates the tax; this calculator does it correctly and explains why.",
    ],
    steps: [
      "Choose “Add VAT” if you have a price without tax, or “Remove VAT” if your price already includes tax.",
      "Enter the amount and the VAT rate.",
      "Read the net amount, VAT amount and gross amount.",
      "Expand the explanation to see the formula.",
    ],
    examples: [
      { title: "Adding 20% VAT", body: "Net 100 × 0.20 = 20 VAT. Gross = 120." },
      { title: "Removing 20% VAT", body: "Gross 120 ÷ 1.20 = 100 net, so VAT = 20. Taking 20% of 120 would wrongly give 24." },
    ],
    formats: ["Amounts as non-negative numbers.", "Rates from 0 to 100%."],
    limitations: [
      "We do not provide or update official tax rates. Always confirm the applicable rate with your tax authority.",
      "Rounding rules for invoices (per line or per total) vary by country; results are shown to 2 decimals.",
    ],
    privacy: localBiz,
    faq: [
      { q: "Is VAT the same as sales tax?", a: "Both are consumption taxes and the arithmetic is the same, but VAT is collected at each stage of the supply chain while sales tax is usually collected only at the final sale." },
      { q: "How do I find the VAT in a price that includes it?", a: "VAT = gross − gross ÷ (1 + rate). For 20%, that is gross × 1/6." },
    ],
    related: ["product-pricing-calculator", "discount-calculator", "profit-margin-calculator", "percentage-calculator"],
  },
};
