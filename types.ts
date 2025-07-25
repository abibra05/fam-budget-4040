
export enum ExpenseCategory {
  FOOD = "Food and groceries",
  CHILDREN = "Children’s needs",
  RENT = "Rent or house payment",
  UTILITIES = "Electricity and water",
  TRANSPORT = "Transportation",
  COMMUNICATION = "Communication",
  EMERGENCY_FUND = "Emergency fund",
  SAVINGS = "Savings",
  OTHER = "Other",
}

export interface Expense {
  id: string;
  category: ExpenseCategory | string;
  amount: number;
  dueDate?: string;
}

export interface HistoricalData {
  month: string;
  totalExpenses: number;
  totalIncome: number;
}
