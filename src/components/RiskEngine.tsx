import React from 'react';
import { formatCurrency } from '../utils';
import { RiskData } from '../types';
import { Shield, ShieldAlert, ShieldCheck, Info } from 'lucide-react';

interface RiskEngineProps {
  data: RiskData;
  setData: (data: RiskData) => void;
}

export const RiskEngine: React.FC<RiskEngineProps> = ({ data, setData }) => {
  const handleChange = (field: keyof RiskData, value: number) => {
    setData({ ...data, [field]: value });
  };

  // Layered Contingency Logic
  const projectContingency = data.monthlyFixedCosts * 0.15; // Placeholder for project-specific risk
  const practiceContingency = data.monthlyFixedCosts * data.safetyMonths;
  const personalContingency = data.personalExpenses * 6;
  const totalBufferRequired = projectContingency + practiceContingency + personalContingency;

  return (
    <div className="space-y-8 max-w-5xl">
      <header>
        <h2 className="text-2xl font-bold text-zinc-900">Contingency & Risk Buffer</h2>
        <p className="text-zinc-500 mt-1">Calculate the three layers of financial protection required for a resilient practice.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="label-text">Monthly Fixed Costs (Practice)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={data.monthlyFixedCosts}
                  onChange={(e) => handleChange('monthlyFixedCosts', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="label-text">Monthly Personal Expenses</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={data.personalExpenses}
                  onChange={(e) => handleChange('personalExpenses', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="label-text">Practice Safety Months</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={data.safetyMonths}
                  onChange={(e) => handleChange('safetyMonths', Number(e.target.value))}
                />
                <p className="text-[10px] text-zinc-400 mt-1 italic">Recommended: 3-6 months</p>
              </div>
              <div>
                <label className="label-text">Current Total Cash Buffer</label>
                <input 
                  type="number" 
                  className="input-field border-zinc-900" 
                  value={data.currentBuffer}
                  onChange={(e) => handleChange('currentBuffer', Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">The Three Layers of Defense</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Shield size={18} className="text-zinc-400" />
                    <div>
                      <p className="text-xs font-bold text-zinc-900">Layer 1: Project Contingency</p>
                      <p className="text-[10px] text-zinc-500">Covers scope creep & site delays</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-zinc-900">{formatCurrency(projectContingency)}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className="text-emerald-500" />
                    <div>
                      <p className="text-xs font-bold text-zinc-900">Layer 2: Practice Survival</p>
                      <p className="text-[10px] text-zinc-500">Covers fixed costs during dry spells</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-zinc-900">{formatCurrency(practiceContingency)}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <ShieldAlert size={18} className="text-amber-500" />
                    <div>
                      <p className="text-xs font-bold text-zinc-900">Layer 3: Personal Runway</p>
                      <p className="text-[10px] text-zinc-500">6 months of personal survival</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-zinc-900">{formatCurrency(personalContingency)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 text-white p-8 rounded-2xl shadow-xl">
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2">Total Ideal Buffer</p>
            <h4 className="text-4xl font-bold tracking-tight">{formatCurrency(totalBufferRequired)}</h4>
            
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-zinc-500">Current Status</span>
                <span className="font-bold">{(data.currentBuffer / totalBufferRequired * 100).toFixed(0)}% Funded</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${data.currentBuffer >= totalBufferRequired ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: `${Math.min(100, (data.currentBuffer / totalBufferRequired) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="glass-panel p-6">
            <div className="flex items-center gap-2 mb-4">
              <Info size={16} className="text-zinc-400" />
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Risk Strategy</h3>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Never use Practice Contingency for Personal Expenses. The separation of these buffers is what prevents a bad project from becoming a personal financial crisis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
