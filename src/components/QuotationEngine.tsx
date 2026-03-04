import React from 'react';
import { formatCurrency } from '../utils';
import { QuotationData, ProjectTypology, FeeMethod, SurvivalData } from '../types';
import { AlertTriangle, Info, Calculator } from 'lucide-react';

interface QuotationEngineProps {
  data: QuotationData;
  setData: (data: QuotationData) => void;
  survival: SurvivalData;
}

const typologies: ProjectTypology[] = ['Residential', 'Commercial', 'Interior', 'Conservation', 'Institutional'];
const methods: FeeMethod[] = ['Percentage', 'LumpSum', 'PerSqFt', 'Hourly'];

export const QuotationEngine: React.FC<QuotationEngineProps> = ({ data, setData, survival }) => {
  const handleChange = (field: keyof QuotationData, value: any) => {
    setData({ ...data, [field]: value });
  };

  // Calculate ICPH from Survival Data for reference
  const totalFixedCost = survival.rent + survival.salaries + survival.software + survival.utilities + survival.insurance + survival.loans + survival.admin;
  const billableHoursCapacity = survival.totalHoursAvailable * (survival.utilizationRate / 100);
  const calculatedICPH = billableHoursCapacity > 0 ? totalFixedCost / billableHoursCapacity : 0;

  // Engine 2 Logic
  // 2.2 Project Base Cost = EstimatedProjectHours * ICPH
  const projectBaseCost = data.estimatedHours * data.hourlyCost;
  
  // 2.3 Overhead Allocation (if not embedded, here we assume it's a % add-on for simplicity or specific firm policy)
  const overheads = projectBaseCost * (data.overheadAllocation / 100);
  const totalProjectCost = projectBaseCost + overheads + data.variableCosts;
  
  // 2.4 Target Profit Margin Pricing: Fee = Cost / (1 - TargetProfitMargin)
  // This is superior to simply adding % because it ensures the margin is a % of the REVENUE, not the cost.
  const marginFactor = 1 - (data.profitMargin / 100);
  const feeBeforeRisk = marginFactor > 0 ? totalProjectCost / marginFactor : totalProjectCost;
  
  const riskMultiplier = 1 + (data.riskScore - 1) * 0.1; // 1.0 to 1.4
  const recommendedFee = feeBeforeRisk * riskMultiplier;
  
  // Contribution Margin Logic
  const contributionMargin = recommendedFee - data.variableCosts;
  const marginPercentage = recommendedFee > 0 ? (contributionMargin / recommendedFee) * 100 : 0;

  return (
    <div className="space-y-8 max-w-5xl">
      <header>
        <h2 className="text-2xl font-bold text-zinc-900">Project Quotation Engine</h2>
        <p className="text-zinc-500 mt-1">Structure professional fees based on effort, overheads, and risk.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 grid grid-cols-2 gap-6">
            <div className="col-span-2 md:col-span-1">
              <label className="label-text">Project Typology</label>
              <select 
                className="input-field"
                value={data.typology}
                onChange={(e) => handleChange('typology', e.target.value)}
              >
                {typologies.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="label-text">Fee Method</label>
              <select 
                className="input-field"
                value={data.feeMethod}
                onChange={(e) => handleChange('feeMethod', e.target.value)}
              >
                {methods.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            
            <div>
              <label className="label-text">Estimated Effort (Hours)</label>
              <input 
                type="number" 
                className="input-field" 
                value={data.estimatedHours}
                onChange={(e) => handleChange('estimatedHours', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label-text">Internal Hourly Cost (ICPH)</label>
              <div className="relative">
                <input 
                  type="number" 
                  className="input-field pr-10" 
                  value={data.hourlyCost}
                  onChange={(e) => handleChange('hourlyCost', Number(e.target.value))}
                />
                <button 
                  onClick={() => handleChange('hourlyCost', Math.round(calculatedICPH))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-900 transition-colors"
                  title="Use calculated ICPH"
                >
                  <Calculator size={14} />
                </button>
              </div>
              <p className="text-[10px] text-zinc-400 mt-1 italic">
                Calculated ICPH: {formatCurrency(calculatedICPH)}
              </p>
            </div>
            <div>
              <label className="label-text">Variable Costs (Direct)</label>
              <input 
                type="number" 
                className="input-field" 
                value={data.variableCosts}
                onChange={(e) => handleChange('variableCosts', Number(e.target.value))}
              />
              <p className="text-[10px] text-zinc-400 mt-1 italic">Travel, Printing, Consultants</p>
            </div>
          </div>

          <div className="glass-panel p-6 space-y-6">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Risk Multiplier Index</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-zinc-600">Complexity & Uncertainty Level</span>
                <span className="px-2 py-1 bg-zinc-100 rounded text-[10px] font-bold text-zinc-900">SCORE: {data.riskScore}/5</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="5" 
                step="0.5"
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
                value={data.riskScore}
                onChange={(e) => handleChange('riskScore', Number(e.target.value))}
              />
              <div className="grid grid-cols-5 text-[10px] font-bold text-zinc-400">
                <span>Standard</span>
                <span className="text-center">Moderate</span>
                <span className="text-center">Complex</span>
                <span className="text-center">High Risk</span>
                <span className="text-right">Extreme</span>
              </div>
              
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
                <AlertTriangle className="text-amber-600 shrink-0" size={18} />
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Risk Pricing:</strong> Young architects often forget to price risk. This multiplier accounts for client reliability, regulatory uncertainty, and contractor complexity.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 text-white p-8 rounded-2xl shadow-xl">
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2">Recommended Quote</p>
            <h4 className="text-4xl font-bold tracking-tight">{formatCurrency(recommendedFee)}</h4>
            
            <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Project Base Cost (ABC)</span>
                <span className="font-medium">{formatCurrency(projectBaseCost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Allocated Overhead ({data.overheadAllocation}%)</span>
                <span className="font-medium">{formatCurrency(overheads)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Direct Variable Costs</span>
                <span className="font-medium">{formatCurrency(data.variableCosts)}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-white/5">
                <span className="text-zinc-400">Target Margin ({data.profitMargin}%)</span>
                <span className="text-emerald-400 font-bold">Fee = Cost / {(1 - data.profitMargin / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Risk Multiplier</span>
                <span className="text-amber-400 font-bold">× {riskMultiplier.toFixed(2)}</span>
              </div>
          </div>

          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Info size={16} className="text-zinc-400" />
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Profitability Analysis</h3>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded ${marginPercentage > 40 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                {marginPercentage.toFixed(1)}% MARGIN
              </span>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Contribution Margin</p>
                <p className="text-xl font-bold text-zinc-900">{formatCurrency(contributionMargin)}</p>
                <p className="text-[10px] text-zinc-500 mt-1">Revenue minus direct variable costs</p>
              </div>

              <div className="space-y-3">
                <div className="h-4 w-full bg-zinc-100 rounded-full overflow-hidden flex">
                  <div className="bg-rose-400 h-full" style={{ width: `${(data.variableCosts / recommendedFee) * 100}%` }} />
                  <div className="bg-zinc-900 h-full" style={{ width: `${(contributionMargin / recommendedFee) * 100}%` }} />
                </div>
                <div className="grid grid-cols-2 gap-y-2 text-[10px] font-bold uppercase tracking-tight text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-rose-400" /> Variable Costs
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-zinc-900" /> Contribution
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
