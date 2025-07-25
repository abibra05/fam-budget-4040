
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Expense, HistoricalData, ExpenseCategory } from './types';
import Dashboard from './components/Dashboard';
import { generateFinancialAdvice } from './services/geminiService';
import { generatePdf } from './services/pdfService';
import { narrateText } from './services/elevenLabsService';
import { HeaderIcon } from './components/icons';

const App: React.FC = () => {
  const [salary, setSalary] = useState<number>(() => {
    const saved = localStorage.getItem('salary');
    return saved ? JSON.parse(saved) : 0;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [
      { id: '1', category: ExpenseCategory.FOOD, amount: 0 },
      { id: '2', category: ExpenseCategory.CHILDREN, amount: 0 },
      { id: '3', category: ExpenseCategory.RENT, amount: 0 },
      { id: '4', category: ExpenseCategory.UTILITIES, amount: 0 },
      { id: '5', category: ExpenseCategory.TRANSPORT, amount: 0 },
      { id: '6', category: ExpenseCategory.COMMUNICATION, amount: 0 },
      { id: '7', category: ExpenseCategory.EMERGENCY_FUND, amount: 0 },
      { id: '8', category: ExpenseCategory.SAVINGS, amount: 0 },
    ];
  });

  const [familyVision, setFamilyVision] = useState<string>(() => localStorage.getItem('familyVision') || '');
  const [familyMission, setFamilyMission] = useState<string>(() => localStorage.getItem('familyMission') || '');

  const [historicalData, setHistoricalData] = useState<HistoricalData[]>(() => {
    const saved = localStorage.getItem('historicalData');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState<string>(() => localStorage.getItem('elevenLabsApiKey') || '');

  const [advice, setAdvice] = useState<string>('');
  const [isAdviceLoading, setIsAdviceLoading] = useState<boolean>(false);
  const [isNarrationLoading, setIsNarrationLoading] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('salary', JSON.stringify(salary));
  }, [salary]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('familyVision', familyVision);
  }, [familyVision]);

  useEffect(() => {
    localStorage.setItem('familyMission', familyMission);
  }, [familyMission]);
  
  useEffect(() => {
    localStorage.setItem('historicalData', JSON.stringify(historicalData));
  }, [historicalData]);

  useEffect(() => {
    localStorage.setItem('elevenLabsApiKey', elevenLabsApiKey);
  }, [elevenLabsApiKey]);

  const totalExpenses = useMemo(() => expenses.reduce((acc, expense) => acc + expense.amount, 0), [expenses]);
  const remainingBalance = useMemo(() => salary - totalExpenses, [salary, totalExpenses]);

  const handleGetAdvice = useCallback(async () => {
    setIsAdviceLoading(true);
    setAdvice('');
    try {
      const budgetDetails = {
        salary,
        expenses,
        remainingBalance
      };
      const result = await generateFinancialAdvice(budgetDetails);
      setAdvice(result);
    } catch (error) {
      console.error("Failed to get financial advice:", error);
      setAdvice("Sorry, I couldn't fetch financial advice at the moment. Please check your API key and try again.");
    } finally {
      setIsAdviceLoading(false);
    }
  }, [salary, expenses, remainingBalance]);

  const handleSaveMonth = useCallback(() => {
    const month = new Date().toLocaleString('default', { month: 'short', year: 'numeric' });
    const newData: HistoricalData = { month, totalExpenses, totalIncome: salary };
    
    setHistoricalData(prevData => {
        const existingMonthIndex = prevData.findIndex(d => d.month === month);
        if (existingMonthIndex !== -1) {
            const updatedData = [...prevData];
            updatedData[existingMonthIndex] = newData;
            return updatedData;
        } else {
            return [...prevData, newData].slice(-12); // Keep last 12 months
        }
    });
    alert(`${month} data has been saved!`);
  }, [salary, totalExpenses]);

  const handleExportPdf = useCallback(() => {
    generatePdf('report-content');
  }, []);

  const handleNarrateReport = useCallback(async () => {
    if (!elevenLabsApiKey) {
        alert("Please enter your ElevenLabs API key.");
        return;
    }
    setIsNarrationLoading(true);
    try {
        const summaryText = `Here is your monthly financial summary. Your total income is ${salary} Rwandan Francs. You have spent a total of ${totalExpenses} Rwandan Francs, leaving a balance of ${remainingBalance} Rwandan Francs. Your main expenses are in ${expenses.filter(e => e.amount > 0).map(e => e.category).join(', ')}. Your family vision is: ${familyVision || 'not set'}.`;
        const audioUrl = await narrateText(summaryText, elevenLabsApiKey);
        if (audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play();
        }
    } catch (error) {
        console.error("Narration failed:", error);
        alert("Failed to narrate the report. Please check your ElevenLabs API key and console for errors.");
    } finally {
        setIsNarrationLoading(false);
    }
  }, [salary, totalExpenses, remainingBalance, familyVision, expenses, elevenLabsApiKey]);


  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center space-x-3">
            <HeaderIcon/>
            <h1 className="text-2xl font-bold text-slate-900">Family Budget Manager</h1>
        </div>
      </header>
      <main>
        <Dashboard
          salary={salary}
          setSalary={setSalary}
          expenses={expenses}
          setExpenses={setExpenses}
          totalExpenses={totalExpenses}
          remainingBalance={remainingBalance}
          familyVision={familyVision}
          setFamilyVision={setFamilyVision}
          familyMission={familyMission}
          setFamilyMission={setFamilyMission}
          historicalData={historicalData}
          onSaveMonth={handleSaveMonth}
          onGetAdvice={handleGetAdvice}
          advice={advice}
          isAdviceLoading={isAdviceLoading}
          onExportPdf={handleExportPdf}
          onNarrateReport={handleNarrateReport}
          isNarrationLoading={isNarrationLoading}
          elevenLabsApiKey={elevenLabsApiKey}
          setElevenLabsApiKey={setElevenLabsApiKey}
        />
      </main>
    </div>
  );
};

export default App;
