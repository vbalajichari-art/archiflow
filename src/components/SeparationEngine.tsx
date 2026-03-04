import React from 'react';
import { formatCurrency } from '../utils';
import { SeparationData } from '../types';
import { Wallet, Briefcase, ArrowRightLeft, Info, ShieldCheck, ShieldAlert } from 'lucide-react';

interface SeparationEngineProps {
  data: SeparationData;
  setData: (data: SeparationData) => void;
}

export const SeparationEngine: React.FC<SeparationEngineProps> = ({ data, setData }) => {
  const handleChange = (field: keyof SeparationData, value: number) => {
    setData({ ...data, [field]: value });
  };

  const totalRevenue = data.revenue;
  const taxReserve = totalRevenue * (data.taxRate / 100);
  const practiceReserve = totalRevenue * (data.reinvestmentRate / 100);
  const netProfit = totalRevenue - taxReserve - practiceReserve;
  
  // Sustainable Salary Logic
  const sustainableSalary = netProfit * 0.7; // Max 70% of net profit as salary
  const personalDraw = data.ownerSalary;
  const isSustainable = personalDraw <= sustainableSalary;

  return (
    <div className="space-y-8 max-w-5xl">
      <header>
        <h2 className="text-2xl font-bold text-zinc-900">Personal–Practice Separation</h2>
        <p className="text-zinc-500 mt-1">Calculate sustainable owner drawings while ensuring practice longevity and tax compliance.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label-text">Monthly Gross Revenue</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={data.revenue}
                  onChange={(e) => handleChange('revenue', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="label-text">Tax Reserve Rate (%)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={data.taxRate}
                  onChange={(e) => handleChange('taxRate', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="label-text">Reinvestment Rate (%)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={data.reinvestmentRate}
                  onChange={(e) => handleChange('reinvestmentRate', Number(e.target.value))}
                />
                <p className="text-[10px] text-zinc-400 mt-1 italic">Benchmark: 15-30%</p>
              </div>
              <div>
                <label className="label-text">Desired Owner Salary</label>
                <input 
                  type="number" 
                  className="input-field border-zinc-900" 
                  value={data.ownerSalary}
                  onChange={(e) => handleChange('ownerSalary', Number(e.target.value))}
                />
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-6">Monthly Fund Allocation</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-zinc-50 rounded-xl">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Tax Reserve</p>
                  <p className="text-sm font-bold text-zinc-900">{formatCurrency(taxReserve)}</p>
                </div>
                <div className="p-4 bg-zinc-50 rounded-xl">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Reinvestment</p>
                  <p className="text-sm font-bold text-zinc-900">{formatCurrency(practiceReserve)}</p>
                </div>
                <div className="p-4 bg-zinc-50 rounded-xl">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Net Profit</p>
                  <p className="text-sm font-bold text-emerald-600">{formatCurrency(netProfit)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 text-white p-8 rounded-2xl shadow-xl">
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2">Sustainable Salary Cap</p>
            <h4 className="text-4xl font-bold tracking-tight">{formatCurrency(sustainableSalary)}</h4>
            
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className={`flex items-center gap-3 p-4 rounded-xl ${isSustainable ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                {isSustainable ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
                <span className="text-xs font-bold uppercase tracking-widest">
                  {isSustainable ? 'Sustainable Draw' : 'Excessive Draw'}
                </span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6">
            <div className="flex items-center gap-2 mb-4">
              <Info size={16} className="text-zinc-400" />
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">The Golden Rule</h3>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed italic">
              "You are an employee of your practice first, and an owner second. Pay your practice its reinvestment before you pay yourself your bonus."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
