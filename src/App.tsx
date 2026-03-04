import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { SurvivalEngine } from './components/SurvivalEngine';
import { QuotationEngine } from './components/QuotationEngine';
import { CashFlowEngine } from './components/CashFlowEngine';
import { RiskEngine } from './components/RiskEngine';
import { GrowthEngine } from './components/GrowthEngine';
import { SeparationEngine } from './components/SeparationEngine';
import { Menu } from 'lucide-react';
import { 
  SurvivalData, 
  QuotationData, 
  CashFlowItem, 
  RiskData, 
  GrowthData, 
  SplitModel,
  SeparationData
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initial States
  const [survival, setSurvival] = useState<SurvivalData>({
    rent: 30000,
    salaries: 120000,
    software: 8000,
    utilities: 5000,
    insurance: 2000,
    loans: 15000,
    admin: 5000,
    bufferPercent: 20,
    totalHoursAvailable: 160,
    utilizationRate: 75,
    realizationRate: 90,
    targetBillingRate: 2500,
    avgVariableCostPerHour: 400,
    targetCMR: 60,
  });

  const [quotation, setQuotation] = useState<QuotationData>({
    typology: 'Residential',
    feeMethod: 'Percentage',
    estimatedHours: 120,
    hourlyCost: 1200,
    overheadAllocation: 15,
    profitMargin: 25,
    riskScore: 2,
    variableCosts: 5000,
    squareFootage: 2500,
    ratePerSqFt: 150,
    projectValue: 5000000,
    feePercentage: 5,
    lumpSumAmount: 350000,
    billingRate: 2500,
  });

  const [cashflow, setCashflow] = useState<CashFlowItem[]>([
    { month: 'Mar', inflow: 250000, outflow: 180000, receivables: 45000 },
    { month: 'Apr', inflow: 180000, outflow: 190000, receivables: 60000 },
    { month: 'May', inflow: 320000, outflow: 200000, receivables: 30000 },
    { month: 'Jun', inflow: 150000, outflow: 180000, receivables: 85000 },
    { month: 'Jul', inflow: 400000, outflow: 220000, receivables: 20000 },
    { month: 'Aug', inflow: 280000, outflow: 190000, receivables: 40000 },
  ]);

  const [risk, setRisk] = useState<RiskData>({
    practiceMonthlyCost: 190000,
    personalMonthlyExpense: 60000,
    currentBuffer: 450000,
    monthlyFixedCosts: 190000,
    personalExpenses: 60000,
    safetyMonths: 3,
  });

  const [growth, setGrowth] = useState<GrowthData>({
    juniorSalary: 25000,
    productivityGain: 0.4,
    newProjectPotential: 600000,
    expectedBillableHours: 120,
    billingRate: 1500,
    realizationRate: 0.85,
    investmentCost: 200000,
    annualBenefit: 80000,
    discountRate: 12,
  });

  const [separation, setSeparation] = useState<SeparationData>({
    revenue: 250000,
    taxRate: 20,
    reinvestmentRate: 15,
    ownerSalary: 60000,
  });

  const [split, setSplit] = useState<SplitModel>({
    operations: 50,
    tax: 20,
    reinvestment: 15,
    emergency: 10,
    profit: 5,
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard survival={survival} quotation={quotation} cashflow={cashflow} risk={risk} growth={growth} split={split} />;
      case 'survival':
        return <SurvivalEngine data={survival} setData={setSurvival} />;
      case 'quotation':
        return <QuotationEngine data={quotation} setData={setQuotation} survival={survival} />;
      case 'cashflow':
        return <CashFlowEngine data={cashflow} setData={setCashflow} />;
      case 'risk':
        return <RiskEngine data={risk} setData={setRisk} />;
      case 'growth':
        return <GrowthEngine data={growth} setData={setGrowth} />;
      case 'separation':
        return <SeparationEngine data={separation} setData={setSeparation} />;
      default:
        return <Dashboard survival={survival} quotation={quotation} cashflow={cashflow} risk={risk} growth={growth} split={split} />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col lg:flex-row">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />
      
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-zinc-200 p-4 sticky top-0 z-30 flex items-center justify-between">
        <h1 className="text-lg font-bold tracking-tight text-zinc-900 flex items-center gap-2">
          <div className="w-6 h-6 bg-zinc-900 rounded-md flex items-center justify-center text-white font-mono text-sm">A</div>
          Archiflow
        </h1>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-zinc-500 hover:text-zinc-900"
        >
          <Menu size={24} />
        </button>
      </header>

      <main className="flex-1 lg:ml-64 p-4 md:p-10">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
          
          <footer className="mt-16 pt-8 border-t border-zinc-200 text-zinc-400">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <p className="text-sm">© 2026 Balaji Venkatachary. All rights reserved.</p>
              <div className="max-w-md">
                <p className="text-[10px] leading-relaxed italic">
                  <strong>Disclaimer:</strong> This tool is intended for estimation and decision-support purposes only. 
                  Calculations are based on user-provided data and architectural practice benchmarks. 
                  Final financial decisions should be verified with a qualified accountant or financial advisor.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
