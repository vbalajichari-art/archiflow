import React from 'react';
import { formatCurrency } from '../utils';
import { SurvivalData } from '../types';

interface SurvivalEngineProps {
  data: SurvivalData;
  setData: (data: SurvivalData) => void;
}

export const SurvivalEngine: React.FC<SurvivalEngineProps> = ({ data, setData }) => {
  const handleChange = (field: keyof SurvivalData, value: number) => {
    setData({ ...data, [field]: value });
  };

  const totalFixedCost = 
    data.rent + data.salaries + data.software + data.utilities + 
    data.insurance + data.loans + data.admin;
  
  const bufferAmount = totalFixedCost * (data.bufferPercent / 100);
  const adjustedFixedCost = totalFixedCost + bufferAmount;
  
  // 1.4 Break-Even Revenue = FixedCost / CMR
  const cmr = data.targetCMR / 100;
  const breakEvenRevenue = cmr > 0 ? adjustedFixedCost / cmr : 0;
  
  // 1.5 Break-Even Billable Hours
  const effectiveBillingRate = data.targetBillingRate * (data.realizationRate / 100);
  const denominator = effectiveBillingRate - data.avgVariableCostPerHour;
  const breakEvenHours = denominator > 0 ? adjustedFixedCost / denominator : 0;
  
  // Current Capacity
  const billableHoursCapacity = data.totalHoursAvailable * (data.utilizationRate / 100);

  return (
    <div className="space-y-8 max-w-4xl">
      <header>
        <h2 className="text-2xl font-bold text-zinc-900">Practice Survival Engine</h2>
        <p className="text-zinc-500 mt-1">Calculate the minimum monthly revenue your practice needs to stay viable.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-6 space-y-4">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Monthly Fixed Costs</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-text">Office Rent</label>
              <input 
                type="number" 
                className="input-field" 
                value={data.rent} 
                onChange={(e) => handleChange('rent', Number(e.target.value))} 
              />
            </div>
            <div>
              <label className="label-text">Salaries (Incl. Self)</label>
              <input 
                type="number" 
                className="input-field" 
                value={data.salaries} 
                onChange={(e) => handleChange('salaries', Number(e.target.value))} 
              />
            </div>
            <div>
              <label className="label-text">Software Subs</label>
              <input 
                type="number" 
                className="input-field" 
                value={data.software} 
                onChange={(e) => handleChange('software', Number(e.target.value))} 
              />
            </div>
            <div>
              <label className="label-text">Utilities</label>
              <input 
                type="number" 
                className="input-field" 
                value={data.utilities} 
                onChange={(e) => handleChange('utilities', Number(e.target.value))} 
              />
            </div>
            <div>
              <label className="label-text">Insurance</label>
              <input 
                type="number" 
                className="input-field" 
                value={data.insurance} 
                onChange={(e) => handleChange('insurance', Number(e.target.value))} 
              />
            </div>
            <div>
              <label className="label-text">EMI / Loans</label>
              <input 
                type="number" 
                className="input-field" 
                value={data.loans} 
                onChange={(e) => handleChange('loans', Number(e.target.value))} 
              />
            </div>
            <div>
              <label className="label-text">Admin / Misc</label>
              <input 
                type="number" 
                className="input-field" 
                value={data.admin} 
                onChange={(e) => handleChange('admin', Number(e.target.value))} 
              />
            </div>
            <div>
              <label className="label-text">Safety Buffer (%)</label>
              <input 
                type="number" 
                className="input-field" 
                value={data.bufferPercent} 
                onChange={(e) => handleChange('bufferPercent', Number(e.target.value))} 
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Efficiency & Rates</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-text">Total Monthly Hours</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={data.totalHoursAvailable} 
                  onChange={(e) => handleChange('totalHoursAvailable', Number(e.target.value))} 
                />
              </div>
              <div>
                <label className="label-text">Utilization Rate (%)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={data.utilizationRate} 
                  onChange={(e) => handleChange('utilizationRate', Number(e.target.value))} 
                />
              </div>
              <div>
                <label className="label-text">Realization Rate (%)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={data.realizationRate} 
                  onChange={(e) => handleChange('realizationRate', Number(e.target.value))} 
                />
              </div>
              <div>
                <label className="label-text">Target CMR (%)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={data.targetCMR} 
                  onChange={(e) => handleChange('targetCMR', Number(e.target.value))} 
                />
              </div>
              <div>
                <label className="label-text">Target Billing Rate</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={data.targetBillingRate} 
                  onChange={(e) => handleChange('targetBillingRate', Number(e.target.value))} 
                />
              </div>
              <div>
                <label className="label-text">Var. Cost / Hour</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={data.avgVariableCostPerHour} 
                  onChange={(e) => handleChange('avgVariableCostPerHour', Number(e.target.value))} 
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-xl space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase">
              <span>Billable Capacity</span>
              <span className="text-zinc-900">{billableHoursCapacity.toFixed(1)} hrs</span>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase">
              <span>Effective Rate</span>
              <span className="text-zinc-900">{formatCurrency(effectiveBillingRate)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 text-white p-8 rounded-2xl shadow-xl">
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2">Break-Even Revenue</p>
            <h4 className="text-4xl font-bold tracking-tight">{formatCurrency(breakEvenRevenue)}</h4>
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
              <div>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Fixed Cost (Adj)</p>
                <p className="text-lg font-semibold">{formatCurrency(adjustedFixedCost)}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Target CMR</p>
                <p className="text-lg font-semibold">{data.targetCMR}%</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6">
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2">Break-Even Billable Hours</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-3xl font-bold text-zinc-900">{breakEvenHours.toFixed(1)}</h4>
              <span className="text-zinc-400 text-sm font-medium">hours / month</span>
            </div>
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
              <p className="text-xs text-emerald-700 leading-relaxed">
                <strong>Capacity Check:</strong> You have {billableHoursCapacity.toFixed(1)} billable hours available. 
                {billableHoursCapacity >= breakEvenHours 
                  ? " You are currently above the break-even threshold." 
                  : " You are under-capacity. Increase utilization or billing rate."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
