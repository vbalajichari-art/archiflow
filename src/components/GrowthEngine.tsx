import React from 'react';
import { formatCurrency } from '../utils';
import { GrowthData } from '../types';
import { Rocket, Users, Computer, ArrowRight, TrendingUp } from 'lucide-react';

interface GrowthEngineProps {
  data: GrowthData;
  setData: (data: GrowthData) => void;
}

export const GrowthEngine: React.FC<GrowthEngineProps> = ({ data, setData }) => {
  const handleChange = (field: keyof GrowthData, value: number) => {
    setData({ ...data, [field]: value });
  };

  // Hiring Logic (Marginal Productivity)
  const monthlyCost = data.juniorSalary;
  const expectedMonthlyRevenue = data.expectedBillableHours * data.billingRate * data.realizationRate;
  const incrementalContribution = expectedMonthlyRevenue - (monthlyCost * 0.1); // Assuming 10% overhead
  const breakEvenMonths = incrementalContribution > 0 ? (monthlyCost * 12) / incrementalContribution : 0;

  // Capital Investment (NPV Model)
  // NPV = Sum [ CashFlow_t / (1+r)^t ] - Initial Investment
  // Simplified for a 3-year horizon
  const r = data.discountRate / 100;
  const npv = 
    (data.annualBenefit / Math.pow(1 + r, 1)) + 
    (data.annualBenefit / Math.pow(1 + r, 2)) + 
    (data.annualBenefit / Math.pow(1 + r, 3)) - 
    data.investmentCost;
  
  const payback = data.annualBenefit > 0 ? data.investmentCost / data.annualBenefit : 0;

  return (
    <div className="space-y-8 max-w-5xl">
      <header>
        <h2 className="text-2xl font-bold text-zinc-900">Growth & Capital Budgeting</h2>
        <p className="text-zinc-500 mt-1">Grounded in marginal productivity theory and Net Present Value (NPV) models.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="glass-panel p-6 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-900">
                <Users size={20} />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Hiring Model (Marginal Productivity)</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Monthly Salary (CTC)</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={data.juniorSalary}
                    onChange={(e) => handleChange('juniorSalary', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="label-text">Billable Hours/Mo</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={data.expectedBillableHours}
                    onChange={(e) => handleChange('expectedBillableHours', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="label-text">Billing Rate</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={data.billingRate}
                    onChange={(e) => handleChange('billingRate', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="label-text">Realization (%)</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={data.realizationRate * 100}
                    onChange={(e) => handleChange('realizationRate', Number(e.target.value) / 100)}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100 grid grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-50 rounded-xl">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Monthly Contribution</p>
                <p className="text-lg font-bold text-zinc-900">{formatCurrency(incrementalContribution)}</p>
              </div>
              <div className="p-4 bg-zinc-50 rounded-xl">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Break-Even Time</p>
                <p className={`text-lg font-bold ${breakEvenMonths < 12 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {breakEvenMonths.toFixed(1)} Months
                </p>
              </div>
            </div>

            <div className={`p-4 rounded-xl border flex items-center justify-between ${breakEvenMonths < 12 ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
              <span className="text-xs font-bold text-zinc-700">Hire Recommendation</span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${breakEvenMonths < 12 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                {breakEvenMonths < 12 ? 'Advisable' : 'High Risk'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-900">
                <TrendingUp size={20} />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Capital Investment (NPV Model)</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Initial Investment</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={data.investmentCost}
                    onChange={(e) => handleChange('investmentCost', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="label-text">Annual Net Benefit</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={data.annualBenefit}
                    onChange={(e) => handleChange('annualBenefit', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="label-text">Discount Rate (%)</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={data.discountRate}
                    onChange={(e) => handleChange('discountRate', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="label-text">Payback Period</label>
                  <div className="input-field bg-zinc-50 font-bold text-zinc-900">
                    {payback.toFixed(1)} Years
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-zinc-900 rounded-2xl text-white">
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">3-Year Net Present Value</p>
              <h4 className={`text-3xl font-bold ${npv > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatCurrency(npv)}
              </h4>
              <p className="text-xs text-zinc-500 mt-4 leading-relaxed">
                {npv > 0 
                  ? "The investment is expected to generate value above the cost of capital. Proceed." 
                  : "The investment does not meet the required rate of return. Reconsider."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
