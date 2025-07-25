
import React, { useState } from 'react';
import { Expense, HistoricalData, ExpenseCategory } from '../types';
import Card from './Card';
import { WalletIcon, ExpensesIcon, BalanceIcon, VisionIcon, MissionIcon, ChartIcon, AdviceIcon, ReportIcon, PlusIcon, TrashIcon, SaveIcon } from './icons';

interface DashboardProps {
  salary: number;
  setSalary: (salary: number) => void;
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
  totalExpenses: number;
  remainingBalance: number;
  familyVision: string;
  setFamilyVision: (vision: string) => void;
  familyMission: string;
  setFamilyMission: (mission: string) => void;
  historicalData: HistoricalData[];
  onSaveMonth: () => void;
  onGetAdvice: () => void;
  advice: string;
  isAdviceLoading: boolean;
  onExportPdf: () => void;
  onNarrateReport: () => void;
  isNarrationLoading: boolean;
  elevenLabsApiKey: string;
  setElevenLabsApiKey: (key: string) => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-RW', { style: 'currency', currency: 'RWF', minimumFractionDigits: 0 }).format(amount);
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c'];

const Dashboard: React.FC<DashboardProps> = (props) => {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div id="report-content" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 */}
        <div className="lg:col-span-2 space-y-6">
          <SummaryCard {...props} />
          <ChartsCard {...props} />
          <FinancialAdvisorCard {...props} />
          <ReportCard {...props} />
        </div>
        
        {/* Column 2 */}
        <div className="space-y-6">
          <SalaryCard {...props} />
          <ExpensesCard {...props} />
          <FamilyGoalsCard {...props} />
        </div>
      </div>
    </div>
  );
};

// Sub-components defined within Dashboard.tsx for simplicity
const SummaryCard: React.FC<DashboardProps> = ({ salary, totalExpenses, remainingBalance }) => (
    <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
                <div className="flex items-center justify-center space-x-2">
                    <WalletIcon className="h-6 w-6 text-green-500" />
                    <h3 className="text-sm font-medium text-slate-500">Total Income</h3>
                </div>
                <p className="mt-1 text-3xl font-semibold text-slate-900">{formatCurrency(salary)}</p>
            </div>
            <div>
                <div className="flex items-center justify-center space-x-2">
                    <ExpensesIcon className="h-6 w-6 text-red-500" />
                    <h3 className="text-sm font-medium text-slate-500">Total Expenses</h3>
                </div>
                <p className="mt-1 text-3xl font-semibold text-slate-900">{formatCurrency(totalExpenses)}</p>
            </div>
            <div>
                <div className="flex items-center justify-center space-x-2">
                    <BalanceIcon className="h-6 w-6 text-sky-500" />
                    <h3 className="text-sm font-medium text-slate-500">Remaining Balance</h3>
                </div>
                <p className={`mt-1 text-3xl font-semibold ${remainingBalance >= 0 ? 'text-slate-900' : 'text-red-600'}`}>
                    {formatCurrency(remainingBalance)}
                </p>
            </div>
        </div>
    </Card>
);

const SalaryCard: React.FC<Pick<DashboardProps, 'salary' | 'setSalary'>> = ({ salary, setSalary }) => (
    <Card>
        <div className="flex items-center space-x-3">
            <WalletIcon className="h-6 w-6 text-green-500"/>
            <h2 className="text-lg font-bold">Monthly Salary</h2>
        </div>
        <div className="mt-4 relative">
            <input
                type="number"
                value={salary === 0 ? '' : salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                placeholder="Enter your total monthly salary"
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-sky-500 focus:border-sky-500"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">RWF</span>
        </div>
    </Card>
);

const ExpensesCard: React.FC<Pick<DashboardProps, 'expenses' | 'setExpenses'>> = ({ expenses, setExpenses }) => {
    const [newCategory, setNewCategory] = useState('');

    const updateExpense = (id: string, key: 'amount' | 'dueDate', value: string | number) => {
        setExpenses(expenses.map(exp => exp.id === id ? { ...exp, [key]: value } : exp));
    };

    const addExpense = () => {
        if (newCategory.trim() === '') return;
        const newExpense: Expense = {
            id: new Date().getTime().toString(),
            category: newCategory,
            amount: 0,
        };
        setExpenses([...expenses, newExpense]);
        setNewCategory('');
    };
    
    const removeExpense = (id: string) => {
        setExpenses(expenses.filter(exp => exp.id !== id));
    };

    return (
        <Card>
            <div className="flex items-center space-x-3">
                <ExpensesIcon className="h-6 w-6 text-red-500"/>
                <h2 className="text-lg font-bold">Expenses</h2>
            </div>
            <div className="mt-4 space-y-3">
                {expenses.map((expense) => (
                    <div key={expense.id} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={expense.category}
                            readOnly
                            className="w-1/2 p-2 bg-slate-100 rounded-md text-sm truncate"
                            title={expense.category}
                        />
                        <div className="relative w-1/2">
                           <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm">RWF</span>
                            <input
                                type="number"
                                value={expense.amount === 0 ? '' : expense.amount}
                                onChange={(e) => updateExpense(expense.id, 'amount', Number(e.target.value))}
                                placeholder="0"
                                className="w-full pl-10 pr-2 py-2 border rounded-md text-sm focus:ring-sky-500 focus:border-sky-500"
                            />
                        </div>
                        <button onClick={() => removeExpense(expense.id)} className="text-slate-400 hover:text-red-500">
                           <TrashIcon className="h-5 w-5"/>
                        </button>
                    </div>
                ))}
            </div>
            <div className="mt-4 flex space-x-2">
                <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name"
                    className="flex-grow p-2 border rounded-md text-sm focus:ring-sky-500 focus:border-sky-500"
                />
                <button onClick={addExpense} className="bg-sky-500 text-white p-2 rounded-md hover:bg-sky-600">
                    <PlusIcon className="h-5 w-5"/>
                </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">You can add custom expense categories like "Entertainment" or "Tithes".</p>
        </Card>
    );
};

const ChartsCard: React.FC<Pick<DashboardProps, 'expenses' | 'totalExpenses' | 'salary' | 'historicalData' | 'onSaveMonth'>> = ({ expenses, totalExpenses, salary, historicalData, onSaveMonth }) => {
    // Recharts components are available globally from the CDN, check if it's loaded.
    const Recharts = (window as any).Recharts;

    if (!Recharts) {
        return (
            <Card>
                <div className="flex items-center space-x-3">
                    <ChartIcon className="h-6 w-6 text-sky-500"/>
                    <h2 className="text-lg font-bold">Financial Analysis</h2>
                </div>
                <div className="flex justify-center items-center" style={{ height: '580px' }}>
                    <p className="text-slate-500 animate-pulse">Loading Charts...</p>
                </div>
            </Card>
        );
    }

    const { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } = Recharts;

    const expenseData = expenses
        .filter(e => e.amount > 0)
        .map(e => ({ name: e.category, value: e.amount }));

    const incomeData = [
        { name: 'Total Expenses', value: totalExpenses },
        { name: 'Remaining', value: Math.max(0, salary - totalExpenses) },
    ];
    
    return (
        <Card>
            <div className="flex items-center space-x-3">
                <ChartIcon className="h-6 w-6 text-sky-500"/>
                <h2 className="text-lg font-bold">Financial Analysis</h2>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                <div>
                    <h3 className="font-semibold text-center mb-2">Income vs. Expenses</h3>
                     <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={incomeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label={({ name, value }) => `${name}: ${formatCurrency(value)}`}>
                                <Cell key={`cell-0`} fill="#FF8042" />
                                <Cell key={`cell-1`} fill="#00C49F" />
                            </Pie>
                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div>
                    <h3 className="font-semibold text-center mb-2">Expense Breakdown</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#82ca9d" paddingAngle={5} label>
                                {expenseData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="mt-8">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Monthly Expense Trend</h3>
                    <button onClick={onSaveMonth} className="flex items-center space-x-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-200 text-sm">
                        <SaveIcon className="h-4 w-4"/>
                        <span>Save Current Month</span>
                    </button>
                </div>
                 <ResponsiveContainer width="100%" height={250} className="mt-4">
                    <LineChart data={historicalData} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `${value/1000}k`} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                        <Line type="monotone" dataKey="totalExpenses" name="Expenses" stroke="#FF8042" strokeWidth={2} />
                         <Line type="monotone" dataKey="totalIncome" name="Income" stroke="#00C49F" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

const FamilyGoalsCard: React.FC<Pick<DashboardProps, 'familyVision' | 'setFamilyVision' | 'familyMission' | 'setFamilyMission'>> = ({ familyVision, setFamilyVision, familyMission, setFamilyMission }) => (
    <Card>
        <div className="space-y-6">
            <div>
                <div className="flex items-center space-x-3">
                    <VisionIcon className="h-6 w-6 text-purple-500"/>
                    <h2 className="text-lg font-bold">Our Family Vision</h2>
                </div>
                <textarea
                    value={familyVision}
                    onChange={(e) => setFamilyVision(e.target.value)}
                    rows={4}
                    placeholder="e.g., To be a financially independent family that creates lasting memories..."
                    className="mt-2 w-full p-2 border rounded-md text-sm focus:ring-sky-500 focus:border-sky-500"
                ></textarea>
            </div>
            <div>
                <div className="flex items-center space-x-3">
                    <MissionIcon className="h-6 w-6 text-indigo-500"/>
                    <h2 className="text-lg font-bold">Our Family Mission</h2>
                </div>
                <textarea
                    value={familyMission}
                    onChange={(e) => setFamilyMission(e.target.value)}
                    rows={4}
                    placeholder="e.g., We will save 20% of our income each month and invest in our children's education..."
                    className="mt-2 w-full p-2 border rounded-md text-sm focus:ring-sky-500 focus:border-sky-500"
                ></textarea>
            </div>
        </div>
    </Card>
);

const FinancialAdvisorCard: React.FC<Pick<DashboardProps, 'onGetAdvice' | 'advice' | 'isAdviceLoading'>> = ({ onGetAdvice, advice, isAdviceLoading }) => (
    <Card>
        <div className="flex items-center space-x-3">
            <AdviceIcon className="h-6 w-6 text-amber-500"/>
            <h2 className="text-lg font-bold">AI Financial Advisor</h2>
        </div>
        <p className="text-sm text-slate-600 mt-2">Get personalized financial tips based on your budget from our Gemini-powered AI.</p>
        <button onClick={onGetAdvice} disabled={isAdviceLoading} className="mt-4 w-full bg-amber-500 text-white font-bold py-2 px-4 rounded-md hover:bg-amber-600 disabled:bg-amber-300 flex items-center justify-center">
            {isAdviceLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
                'Get Advice'
            )}
        </button>
        {advice && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-sm text-amber-900 whitespace-pre-wrap">{advice}</p>
            </div>
        )}
    </Card>
);

const ReportCard: React.FC<Pick<DashboardProps, 'onExportPdf' | 'onNarrateReport' | 'isNarrationLoading' | 'elevenLabsApiKey' | 'setElevenLabsApiKey'>> = (props) => (
    <Card>
        <div className="flex items-center space-x-3">
            <ReportIcon className="h-6 w-6 text-cyan-500"/>
            <h2 className="text-lg font-bold">Monthly Report</h2>
        </div>
        <p className="text-sm text-slate-600 mt-2">Export your monthly summary as a PDF or listen to an audio narration.</p>
        <div className="mt-4 space-y-4">
             <button onClick={props.onExportPdf} className="w-full bg-cyan-500 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-600">
                Export to PDF
            </button>
            <div className="border-t pt-4">
                <h3 className="font-semibold text-slate-700">Audio Narration (Bonus)</h3>
                 <p className="text-xs text-slate-500 mt-1">Powered by ElevenLabs. Requires an API key.</p>
                <input
                    type="password"
                    value={props.elevenLabsApiKey}
                    onChange={(e) => props.setElevenLabsApiKey(e.target.value)}
                    placeholder="Enter ElevenLabs API Key"
                    className="mt-2 w-full p-2 border rounded-md text-sm focus:ring-sky-500 focus:border-sky-500"
                />
                 <button onClick={props.onNarrateReport} disabled={props.isNarrationLoading || !props.elevenLabsApiKey} className="mt-2 w-full bg-slate-700 text-white font-bold py-2 px-4 rounded-md hover:bg-slate-800 disabled:bg-slate-400 flex items-center justify-center">
                    {props.isNarrationLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                        'Narrate Report'
                    )}
                </button>
            </div>
        </div>
    </Card>
);


export default Dashboard;
