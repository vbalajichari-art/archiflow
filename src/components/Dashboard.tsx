import React from 'react';
import { formatCurrency } from '../utils';
import { 
  SurvivalData, 
  QuotationData, 
  CashFlowItem, 
  RiskData, 
  GrowthData, 
  SplitModel 
} from '../types';
import { 
  ShieldAlert, 
  TrendingUp, 
  ShieldCheck, 
  Zap,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface DashboardProps {
  survival: SurvivalData;
  quotation: QuotationData;
  cashflow: CashFlowItem[];
  risk: RiskData;
  growth: GrowthData;
  split: SplitModel;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  survival, 
  cashflow, 
  risk, 
}) => {
  const totalFixedCost = survival.rent + survival.salaries + survival.software + survival.utilities + survival.insurance + survival.loans + survival.admin;
  const adjustedFixedCost = totalFixedCost * (1 + survival.bufferPercent / 100);
  
  // 1.4 Break-Even Revenue = FixedCost / CMR
  const cmr = survival.targetCMR / 100;
  const breakEvenRevenue = cmr > 0 ? adjustedFixedCost / cmr : 0;

  // 1.5 Break-Even Billable Hours
  const effectiveBillingRate = survival.targetBillingRate * (survival.realizationRate / 100);
  const denominator = effectiveBillingRate - survival.avgVariableCostPerHour;
  const breakEvenHours = denominator > 0 ? adjustedFixedCost / denominator : 0;
  const billableHoursCapacity = survival.totalHoursAvailable * (survival.utilizationRate / 100);
  const icph = billableHoursCapacity > 0 ? totalFixedCost / billableHoursCapacity : 0;
  
  const currentCash = cashflow[0].inflow - cashflow[0].outflow;
  const sixMonthReserve = cashflow.reduce((acc, curr) => acc + (curr.inflow - curr.outflow), 0);
  
  const idealEmergencyFund = (risk.practiceMonthlyCost * 3) + (risk.personalMonthlyExpense * 6);
  const riskExposure = Math.max(0, idealEmergencyFund - risk.currentBuffer);
  const stabilityScore = Math.min(100, (risk.currentBuffer / idealEmergencyFund) * 100);

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-zinc-900">Practice Overview</h2>
        <p className="text-zinc-500 mt-1">Real-time financial health and decision readiness.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <ShieldAlert size={20} />
            </div>
            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded">SURVIVAL</span>
          </div>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Break-Even Revenue</p>
          <h4 className="text-2xl font-bold text-zinc-900">{formatCurrency(breakEvenRevenue)}</h4>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase">
              <span>Required Hours</span>
              <span className="text-zinc-900">{breakEvenHours.toFixed(1)} hrs</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase">
              <span>Capacity</span>
              <span className="text-zinc-900">{billableHoursCapacity.toFixed(1)} hrs</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp size={20} />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">CASH FLOW</span>
          </div>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">6-Month Reserve</p>
          <h4 className={`text-2xl font-bold ${sixMonthReserve < 0 ? 'text-rose-600' : 'text-zinc-900'}`}>
            {formatCurrency(sixMonthReserve)}
          </h4>
          <div className={`mt-4 flex items-center gap-1 text-[10px] font-medium ${sixMonthReserve < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
            {sixMonthReserve < 0 ? <ArrowDownRight size={10} /> : <ArrowUpRight size={10} />}
            Projected trajectory
          </div>
        </div>

        <div className="glass-panel p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <ShieldCheck size={20} />
            </div>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">STABILITY</span>
          </div>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Stability Score</p>
          <h4 className="text-2xl font-bold text-zinc-900">{stabilityScore.toFixed(0)}%</h4>
          <div className="mt-4 h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500" style={{ width: `${stabilityScore}%` }} />
          </div>
        </div>

        <div className="glass-panel p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-zinc-900 text-white rounded-lg">
              <Zap size={20} />
            </div>
            <span className="text-[10px] font-bold text-zinc-900 bg-zinc-100 px-2 py-1 rounded">RISK</span>
          </div>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Risk Exposure</p>
          <h4 className="text-2xl font-bold text-zinc-900">{formatCurrency(riskExposure)}</h4>
          <div className="mt-4 flex items-center justify-between text-[10px] font-bold uppercase">
            <span className="text-zinc-400">ICPH</span>
            <span className="text-zinc-900">{formatCurrency(icph)}/hr</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-8">
          <h3 className="text-lg font-bold text-zinc-900 mb-6">Strategic Readiness</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${stabilityScore > 70 ? 'bg-emerald-500 text-white' : 'bg-zinc-200 text-zinc-500'}`}>
                {stabilityScore > 70 ? '✓' : '!'}
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900">Hiring Readiness</h4>
                <p className="text-xs text-zinc-500 mt-1">
                  {stabilityScore > 70 
                    ? "Your stability score is high. You can safely consider adding a junior architect to your team." 
                    : "Focus on building your 3-month practice buffer before adding permanent payroll costs."}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${sixMonthReserve > breakEvenRevenue * 2 ? 'bg-emerald-500 text-white' : 'bg-zinc-200 text-zinc-500'}`}>
                {sixMonthReserve > breakEvenRevenue * 2 ? '✓' : '!'}
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900">Equipment Investment</h4>
                <p className="text-xs text-zinc-500 mt-1">
                  {sixMonthReserve > breakEvenRevenue * 2 
                    ? "Cash reserves are healthy. Good time to invest in software or hardware that improves productivity." 
                    : "Delay non-essential capital expenditure until cash flow trajectory improves."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-2xl p-8 text-white">
          <h3 className="text-lg font-bold mb-6">Action Items</h3>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-sm text-zinc-400">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Review project quotes with a minimum risk multiplier of 1.2x
            </li>
            <li className="flex items-center gap-3 text-sm text-zinc-400">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Move {formatCurrency(breakEvenRevenue * 0.2)} to tax reserve this month
            </li>
            <li className="flex items-center gap-3 text-sm text-zinc-400">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
              Follow up on retention payments for completed projects
            </li>
          </ul>
          <button className="mt-8 w-full py-3 bg-white text-zinc-900 rounded-xl font-bold text-sm hover:bg-zinc-100 transition-colors">
            Generate Monthly Report
          </button>
        </div>
      </div>
    </div>
  );
};
