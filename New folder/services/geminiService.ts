
import { GoogleGenAI } from "@google/genai";
import { Expense } from '../types';

interface BudgetDetails {
  salary: number;
  expenses: Expense[];
  remainingBalance: number;
}

export const generateFinancialAdvice = async (budgetDetails: BudgetDetails): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const expenseSummary = budgetDetails.expenses
    .filter(e => e.amount > 0)
    .map(e => `- ${e.category}: ${e.amount} RWF`)
    .join('\n');

  const prompt = `
You are a friendly and helpful family financial advisor. Your advice should be encouraging and actionable.
Analyze the following monthly budget for a family in Rwanda and provide 3-5 concise, practical tips for improvement.
The currency is Rwandan Francs (RWF).

**Budget Overview:**
- **Monthly Salary:** ${budgetDetails.salary} RWF
- **Total Expenses:** ${budgetDetails.salary - budgetDetails.remainingBalance} RWF
- **Remaining Balance:** ${budgetDetails.remainingBalance} RWF

**Expense Breakdown:**
${expenseSummary}

**Instructions:**
1.  Start with an encouraging opening statement.
2.  Provide 3 to 5 specific, actionable financial tips.
3.  Comment on their savings and emergency fund contributions.
4.  Keep the tone positive and supportive.
5.  Format the output as clean, readable text. Do not use markdown.
`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to generate financial advice from Gemini API.");
  }
};
