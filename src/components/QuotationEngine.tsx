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

  // Typology Complexity Multipliers
  const typologyMultipliers: Record<ProjectTypology, number> = {
    'Residential': 1.0,
    'Commercial': 1.15,
    'Institutional': 1.25,
    'Interior': 1.20,
    'Conservation': 1.35
  };

  // Engine 2 Logic
  // 2.2 Project Base Cost = EstimatedProjectHours * ICPH
  const projectBaseCost = data.estimatedHours * data.hourlyCost;
  
  // 2.3 Overhead Allocation (if not embedded, here we assume it's a % add-on for simplicity or specific firm policy)
  const overheads = projectBaseCost * (data.overheadAllocation / 100);
  const totalProjectCost = projectBaseCost + overheads + data.variableCosts;
  
  // 2.4 Target Profit Margin Pricing: Fee = Cost / (1 - TargetProfitMargin)
  const marginFactor = 1 - (data.profitMargin / 100);
  const feeBeforeRisk = marginFactor > 0 ? totalProjectCost / marginFactor : totalProjectCost;
  
  const riskMultiplier = 1 + (data.riskScore - 1) * 0.1; // 1.0 to 1.4
  const typologyMultiplier = typologyMultipliers[data.typology] || 1.0;
  const costPlusFee = feeBeforeRisk * riskMultiplier * typologyMultiplier;
  
  // Market-Based Fee Calculation
  let marketBasedFee = 0;
  switch (data.feeMethod) {
    case 'PerSqFt':
      marketBasedFee = (data.squareFootage || 0) * (data.ratePerSqFt || 0);
      break;
    case 'Percentage':
      marketBasedFee = (data.projectValue || 0) * ((data.feePercentage || 0) / 100);
      break;
    case 'LumpSum':
      marketBasedFee = data.lumpSumAmount || 0;
      break;
    case 'Hourly':
      marketBasedFee = data.estimatedHours * (data.billingRate || 0);
      break;
  }

  const finalFee = marketBasedFee > 0 ? marketBasedFee : costPlusFee;
  const isProfitable = finalFee >= costPlusFee;
  
  // Contribution Margin Logic
  const contributionMargin = finalFee - data.variableCosts;
  const marginPercentage = finalFee > 0 ? (contributionMargin / finalFee) * 100 : 0;

  return (
    <div className="space-y-8 max-w-5xl">
      <header>
        <h2 className="text-2xl font-bold text-zinc-900">Project Quotation Engine</h2>
        <p className="text-zinc-500 mt-1">Structure professional fees based on effort, overheads, and risk.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 space-y-6">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Project Scope & Scale</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2 md:col-span-1">
                <label className="label-text">Project Typology</label>
                <select 
                  className="input-field"
                  value={data.typology}
                  onChange={(e) => handleChange('typology', e.target.value)}
                >
                  {typologies.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2 md:col-span-1">
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
                <label className="label-text">Total Square Footage (SqFt)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={data.squareFootage || ''}
                  placeholder="e.g. 2500"
                  onChange={(e) => handleChange('squareFootage', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="label-text">Estimated Project Value</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={data.projectValue || ''}
                  placeholder="e.g. 5000000"
                  onChange={(e) => handleChange('projectValue', Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 space-y-6">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Internal Effort & Costs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
          </div>

          <div className="glass-panel p-6 space-y-6">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Market-Based Pricing</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {data.feeMethod === 'PerSqFt' && (
                <div className="sm:col-span-2">
                  <label className="label-text">Target Rate per SqFt</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={data.ratePerSqFt || ''}
                    placeholder="e.g. 150"
                    onChange={(e) => handleChange('ratePerSqFt', Number(e.target.value))}
                  />
                </div>
              )}

              {data.feeMethod === 'Percentage' && (
                <div className="sm:col-span-2">
                  <label className="label-text">Fee Percentage (%)</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={data.feePercentage || ''}
                    placeholder="e.g. 5"
                    onChange={(e) => handleChange('feePercentage', Number(e.target.value))}
                  />
                </div>
              )}

              {data.feeMethod === 'LumpSum' && (
                <div className="sm:col-span-2">
                  <label className="label-text">Lump Sum Amount</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={data.lumpSumAmount || ''}
                    placeholder="e.g. 350000"
                    onChange={(e) => handleChange('lumpSumAmount', Number(e.target.value))}
                  />
                </div>
              )}

              {data.feeMethod === 'Hourly' && (
                <div className="sm:col-span-2">
                  <label className="label-text">Client Billing Rate (per Hour)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      className="input-field pr-10" 
                      value={data.billingRate || ''}
                      placeholder="e.g. 2500"
                      onChange={(e) => handleChange('billingRate', Number(e.target.value))}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400">
                      / HR
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1 italic">
                    Suggested Min. Billing Rate: {formatCurrency(costPlusFee / data.estimatedHours)}/hr
                  </p>
                </div>
              )}
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
          <div className="bg-zinc-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
            {!isProfitable && (
              <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                Underpriced
              </div>
            )}
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2">Proposed Quote</p>
            <h4 className="text-4xl font-bold tracking-tight">{formatCurrency(finalFee)}</h4>
            
            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Min. Profitable Fee (Cost-Plus)</span>
                <span className="font-medium text-zinc-300">{formatCurrency(costPlusFee)}</span>
              </div>
              
              <div className="pt-3 border-t border-white/5 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Project Base Cost</span>
                  <span className="text-zinc-400">{formatCurrency(projectBaseCost)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Overheads ({data.overheadAllocation}%)</span>
                  <span className="text-zinc-400">{formatCurrency(overheads)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Risk Multiplier</span>
                  <span className="text-zinc-400">× {riskMultiplier.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Typology Complexity ({data.typology})</span>
                  <span className="text-zinc-400">× {typologyMultiplier.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {!isProfitable && (
              <div className="mt-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex gap-2">
                <AlertTriangle size={14} className="text-rose-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-rose-200 leading-relaxed">
                  <strong>Warning:</strong> Your proposed fee is below your internal cost-plus benchmark. You are not covering your ICPH and target profit.
                </p>
              </div>
            )}

            {(data.squareFootage || data.projectValue) && (
              <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.squareFootage && data.squareFootage > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Eq. Rate / SqFt</p>
                    <p className="text-lg font-bold text-zinc-300">{formatCurrency(finalFee / data.squareFootage)}</p>
                  </div>
                )}
                {data.projectValue && data.projectValue > 0 && (
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Eq. Fee %</p>
                    <p className="text-lg font-bold text-zinc-300">{((finalFee / data.projectValue) * 100).toFixed(2)}%</p>
                  </div>
                )}
              </div>
            )}
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
                  <div className="bg-rose-400 h-full" style={{ width: `${Math.min(100, (data.variableCosts / finalFee) * 100)}%` }} />
                  <div className="bg-zinc-900 h-full" style={{ width: `${Math.max(0, (contributionMargin / finalFee) * 100)}%` }} />
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
