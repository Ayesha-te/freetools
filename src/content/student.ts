import type { ToolContent } from "./types";

const localCalc =
  "All calculations run in your browser. The grades, marks and names you enter are not sent to any server or stored after you leave the page.";

export const studentContent: Record<string, ToolContent> = {
  "gpa-calculator": {
    intro: [
      "The GPA Calculator works out a credit-weighted grade point average for one semester or term. Enter each course's letter grade and credit hours and the result updates instantly.",
      "Because institutions use different scales, you can choose a 4.0 scale, a 4.0 scale with plus/minus grades, a 4.3 scale, a 5.0 scale, or edit the grade points yourself.",
    ],
    why: [
      "Knowing your GPA before official results are published helps you check scholarship eligibility, plan course loads and spot whether one weak grade will pull your average below a threshold.",
      "Weighting by credits matters: an A in a 4-credit course raises your GPA more than an A in a 1-credit lab. A simple average of grade points gives the wrong answer whenever credit loads differ.",
    ],
    steps: [
      "Select the grading scale your institution uses, or choose Custom and type each grade's point value.",
      "For each course, choose the letter grade and enter its credit hours. Course names are optional.",
      "Add or remove rows as needed.",
      "Read your semester GPA, total credits and quality points.",
      "Open “How this was calculated” to see the formula with your numbers.",
    ],
    examples: [
      { title: "Typical semester on a 4.0 scale", body: "A (4 credits) = 16 points, B (3 credits) = 9 points, A (3 credits) = 12 points, C (2 credits) = 4 points. Total 41 points ÷ 12 credits = 3.42 GPA." },
      { title: "Effect of plus/minus grades", body: "On a plus/minus scale, B+ in a 3-credit course is 3.3 × 3 = 9.9 points rather than 9.0, which can raise a semester GPA by several hundredths." },
    ],
    formats: ["Letter grades from the selected scale.", "Credit hours from 0 to 50, including half credits such as 1.5.", "Custom grade point values with decimals."],
    limitations: [
      "Your institution may treat pass/fail, withdrawn, incomplete or repeated courses differently. Leave such courses out unless your handbook says they count.",
      "Some schools use percentage-based or 10-point systems; set a custom scale if yours differs.",
      "This is an estimate. Your official transcript is the authoritative record.",
    ],
    privacy: localCalc,
    faq: [
      { q: "What is a good GPA?", a: "It depends on context. On a 4.0 scale, 3.0 is often the minimum for good standing in graduate programmes and 3.5+ is commonly required for honours, but requirements vary widely." },
      { q: "How do I convert a percentage to GPA?", a: "There is no universal conversion. Use your institution's official table to map percentages to letter grades, then enter those grades here." },
      { q: "Should I include failed courses?", a: "Usually yes: an F typically counts as 0 points with full credits. Check whether your school replaces failed grades when a course is retaken." },
      { q: "What is the difference between GPA and CGPA?", a: "GPA usually refers to one term. CGPA (cumulative GPA) combines all terms, weighted by credits. Use our CGPA Calculator for that." },
    ],
    related: ["cgpa-calculator", "grade-calculator", "percentage-calculator", "marks-calculator"],
  },

  "cgpa-calculator": {
    intro: [
      "The CGPA Calculator combines several semester GPAs into one cumulative GPA, weighting each semester by the credits it carried. It can also update an existing CGPA when a new semester's results arrive.",
      "It works with any scale — 4.0, 4.3, 5.0 or 10-point — because the maximum you enter is used only to check your inputs.",
    ],
    why: [
      "Scholarships, internships and graduate applications often specify a minimum CGPA. Projecting it in advance shows what you need to achieve in coming terms.",
      "A common mistake is averaging semester GPAs directly. If one semester had 12 credits and another 20, they do not count equally, and this calculator handles that correctly.",
    ],
    steps: [
      "Choose “From all semesters” to enter each semester, or “Update existing CGPA” if you already know your current CGPA and total credits.",
      "Enter the maximum GPA on your scale.",
      "Enter each semester's GPA and credit hours, adding rows as needed.",
      "Read your cumulative GPA and total credits; expand the explanation to check the arithmetic.",
    ],
    examples: [
      { title: "Two unequal semesters", body: "Semester 1: GPA 3.40 over 12 credits (40.8 points). Semester 2: GPA 3.80 over 18 credits (68.4 points). CGPA = 109.2 ÷ 30 = 3.64, not the simple average of 3.60." },
      { title: "Updating after a new term", body: "Current CGPA 3.25 over 60 credits plus a new semester of 3.90 over 15 credits gives (195 + 58.5) ÷ 75 = 3.38." },
    ],
    formats: ["Semester GPAs between 0 and your scale maximum.", "Credits greater than 0 per semester.", "Any number of semesters."],
    limitations: [
      "If your institution recalculates CGPA from individual course grades (for example replacing retaken courses), results may differ slightly from a semester-level calculation.",
      "The “percent of max” figure is not an official percentage conversion; universities publish their own formulas.",
    ],
    privacy: localCalc,
    faq: [
      { q: "Can I calculate CGPA on a 10-point scale?", a: "Yes. Set the maximum GPA to 10 and enter your SGPA values and credits." },
      { q: "Why is my CGPA different from the average of my GPAs?", a: "Because semesters with more credits carry more weight. The calculator uses the credit-weighted formula, which is how most institutions compute CGPA." },
      { q: "How can I raise my CGPA by a target amount?", a: "Use the update mode and try different values for the next semester's GPA to see their effect. The more credits you have already completed, the smaller the change each new semester makes." },
    ],
    related: ["gpa-calculator", "grade-calculator", "study-hours-calculator", "percentage-calculator"],
  },

  "percentage-calculator": {
    intro: [
      "The Percentage Calculator answers the four everyday percentage questions on one page: what X% of a number is, what percentage one number is of another, how much a value has increased or decreased in percent, and the result of adding or subtracting a percentage.",
      "Every answer includes the formula filled in with your values, so you can learn the method and not just copy the result.",
    ],
    why: [
      "Percentages appear in exam scores, discounts, tax, interest, salary changes and statistics. Mixing up the base value is the most common mistake — for example, a fall from 100 to 80 is a 20% decrease, but rising from 80 back to 100 is a 25% increase.",
    ],
    steps: [
      "Find the card that matches your question.",
      "Type the two numbers; results update as you type.",
      "Open “How this was calculated” to see the formula with your inputs.",
    ],
    examples: [
      { title: "Exam score", body: "You scored 45 out of 60. Using “X is what percent of Y”: (45 ÷ 60) × 100 = 75%." },
      { title: "Price increase", body: "A subscription went from 80 to 100. Percentage change = (100 − 80) ÷ 80 × 100 = 25% increase." },
      { title: "Tip or commission", body: "15% of 200 = 0.15 × 200 = 30." },
    ],
    formats: ["Any positive or negative numbers, including decimals."],
    limitations: [
      "Percentage change from zero is undefined, and the tool says so rather than showing infinity.",
      "Results are shown to 4 decimal places; round according to your context.",
    ],
    privacy: localCalc,
    faq: [
      { q: "Why does +20% then −20% not give the original number?", a: "The second percentage applies to a different base. 100 + 20% = 120, then 120 − 20% = 96." },
      { q: "What is the difference between percent and percentage points?", a: "If an interest rate moves from 4% to 5%, it rose by 1 percentage point but by 25 percent relative to the old rate." },
      { q: "How do I calculate percentage change with negative numbers?", a: "The calculator divides by the absolute value of the old number, which gives the conventional direction of change." },
    ],
    related: ["marks-calculator", "discount-calculator", "grade-calculator", "vat-calculator"],
  },

  "marks-calculator": {
    intro: [
      "The Marks Calculator totals the marks you obtained across several subjects, compares them with the maximum marks available, and shows your overall percentage. It also tells you how many marks you need in upcoming exams to reach a target percentage.",
      "Each subject can have a different maximum, such as 100 for theory papers and 50 for practicals.",
    ],
    why: [
      "Many school boards and universities report results as an aggregate percentage. Calculating it by hand across eight or nine subjects with different maximums is error-prone. This tool also helps you set realistic goals before final exams.",
    ],
    steps: [
      "For each subject, enter marks obtained and maximum marks. Subject names are optional.",
      "Add or remove subjects as needed; the per-subject percentage shows in each row.",
      "Read your total marks and overall percentage.",
      "To plan ahead, enter a target percentage and the maximum marks still available in upcoming exams.",
    ],
    examples: [
      { title: "Board exam aggregate", body: "English 78/100, Mathematics 91/100, Science 84/100 gives 253/300 = 84.33%." },
      { title: "Marks needed", body: "You have 300 out of 400 so far and a final paper worth 100. To reach 80% overall (400 of 500), you need 400 − 300 = 100 more marks — a perfect score on the final paper. Aiming for 75% instead (375 of 500) needs 75 out of 100." },
    ],
    formats: ["Obtained marks between 0 and the maximum for each subject.", "Maximum marks above zero; decimals allowed."],
    limitations: [
      "Boards that use “best five subjects”, grace marks or moderation are not modelled automatically — remove or adjust rows yourself.",
      "The aggregate percentage weights subjects by their maximum marks, which is the standard method but may differ from weighted-credit systems.",
    ],
    privacy: localCalc,
    faq: [
      { q: "How is the overall percentage calculated?", a: "(Total marks obtained ÷ total maximum marks) × 100. It is not the average of subject percentages unless every subject has the same maximum." },
      { q: "Can I enter half marks?", a: "Yes, decimals such as 47.5 are accepted." },
      { q: "How do I convert my percentage to CGPA?", a: "Conversions are set by each institution or board. Check their official formula; do not rely on generic multipliers." },
    ],
    related: ["percentage-calculator", "grade-calculator", "gpa-calculator", "cgpa-calculator"],
  },

  "grade-calculator": {
    intro: [
      "The Grade Calculator works out your current course grade from weighted assessments and tells you the score you need on the remaining work — usually the final exam — to finish with your target grade.",
      "Enter each assignment, quiz or exam as a percentage with its weight in the course syllabus.",
    ],
    why: [
      "Weighted grading means a 90% on homework worth 10% matters much less than a 70% on a midterm worth 30%. Seeing the exact score needed on the final helps you decide how to divide revision time between courses.",
    ],
    steps: [
      "Enter each completed assessment's score (%) and weight (%) from your syllabus.",
      "Enter the weight of the work not yet graded, such as a 40% final exam.",
      "Enter your target overall grade.",
      "Read your current grade, the points already earned, and the score needed on the remaining work.",
    ],
    examples: [
      { title: "Final exam needed", body: "Assignments 88% (weight 20) and midterm 76% (weight 30) give 17.6 + 22.8 = 40.4 points. To finish with 80% and a final worth 50%, you need (80 − 40.4) ÷ 50 × 100 = 79.2% on the final." },
      { title: "Already secure", body: "If you have earned 72 of 100 course points with 20% left, you need 0% on the final to keep 70%, so the calculator reports the target as already secured." },
    ],
    formats: ["Scores as percentages (0–150% to allow extra credit).", "Weights as percentages; the total should not exceed 100%."],
    limitations: [
      "Courses that drop the lowest score, use curves or require passing the final separately are not modelled.",
      "If your syllabus uses points rather than percentages, convert each item to a percentage first (score ÷ maximum × 100).",
    ],
    privacy: localCalc,
    faq: [
      { q: "What if my weights don't add up to 100?", a: "That is fine while some work is ungraded. The current grade is based on the completed weight only. If weights exceed 100%, the tool shows an error." },
      { q: "What does a needed score above 100% mean?", a: "The target cannot be reached through the remaining work alone, unless extra credit is available." },
      { q: "Can I use letter grades?", a: "Convert letter grades to the percentage your instructor uses (for example, B = 85%) and enter that number." },
    ],
    related: ["gpa-calculator", "marks-calculator", "percentage-calculator", "study-hours-calculator"],
  },

  "study-hours-calculator": {
    intro: [
      "The Study Hours Calculator estimates how much independent study each of your subjects needs per week, based on its credit hours and how difficult you find it. It then splits the total across the number of days you plan to study.",
      "The result is a simple, editable weekly plan you can copy into a calendar or planner.",
    ],
    why: [
      "A widely used guideline in higher education is about two to three hours of study outside class for every credit hour. Turning that rule into concrete daily numbers makes it easier to spot an unrealistic workload before the semester gets busy.",
      "Adjusting for difficulty helps you give more time to challenging subjects instead of splitting time equally.",
    ],
    steps: [
      "Set your hours per credit (2 is a common starting point) and the number of study days per week.",
      "List your subjects with their credit hours and a difficulty level.",
      "Read the total weekly hours, the daily average and the per-subject breakdown.",
      "Adjust the ratio or study days until the plan feels sustainable.",
    ],
    examples: [
      { title: "Three-subject term", body: "Calculus (4 credits, hard): 4 × 2 × 1.5 = 12 h. History (3, medium): 6 h. Art (2, easy): 3 h. Total 21 h per week, or 4 h 12 m per day across 5 days." },
      { title: "Lighter plan", body: "Lowering the ratio to 1.5 hours per credit gives 15 h 45 m per week for the same subjects — useful during exam-free weeks." },
    ],
    formats: ["Credits from 0 to 30 per subject.", "Hours per credit from 0 to 10.", "1 to 7 study days per week."],
    limitations: [
      "The difficulty multipliers (0.75, 1 and 1.5) are simple planning assumptions, not research-validated constants.",
      "Actual study needs depend on assessments, prior knowledge and personal pace. Use the plan as a starting point and review it after a few weeks.",
    ],
    privacy: localCalc,
    faq: [
      { q: "How many hours should I study per credit?", a: "Guidance from many universities is 2–3 hours per credit hour per week, but your institution or course leader may recommend a different figure." },
      { q: "Is more than 8 hours a day realistic?", a: "Rarely for long periods. The tool warns you above 8 hours per day so you can spread work across more days or reduce the ratio." },
      { q: "Does this include class time?", a: "No. It estimates independent study outside scheduled classes." },
    ],
    related: ["gpa-calculator", "grade-calculator", "cgpa-calculator", "word-counter"],
  },
};
