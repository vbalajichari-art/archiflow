import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '../utils';
import { CashFlowItem } from '../types';

interface CashFlowEngineProps {
  data: CashFlowItem[];
  setData: (data: CashFlowItem[]) => void;
}

export const CashFlowEngine: React.FC<CashFlowEngineProps> = ({ data, setData }) => {
  const handleUpdate = (index: number, field: keyof CashFlowItem, value: any) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    setData(newData);
  };

  const chartData = data.map((item, index) => {
    const net = item.inflow - item.outflow;
    let cumulative = 0;
    for (let i = 0; i <= index; i++) {
      cumulative += (data[i].inflow - data[i].outflow);
    }
    return {
      ...item,
      net,
      cumulative
    };
  });

  // Working Capital Metrics
  const totalReceivables = data.reduce((acc, curr) => acc + curr.receivables, 0);
  const totalInflow = data.reduce((acc, curr) => acc + curr.inflow, 0);
  const arDays = totalInflow > 0 ? (totalReceivables / totalInflow) * 180 : 0; // 180 days period

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-zinc-900">Cash Flow Forecast Engine</h2>
        <p className="text-zinc-500 mt-1">Map monthly inflows vs outflows to predict runway and working capital efficiency.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 h-[400px]">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-6">6-Month Cash Position</h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#18181b" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#18181b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#a1a1aa' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#a1a1aa' }}
                  tickFormatter={(value) => `₹${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [formatCurrency(value), '']}
                />
                <Area 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="#18181b" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCumulative)" 
                  name="Cumulative Reserve"
                />
                <Area 
                  type="monotone" 
                  dataKey="inflow" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorInflow)" 
                  name="Monthly Inflow"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-panel p-6">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-6">Monthly Projections</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100">
                    <th className="pb-4">Month</th>
                    <th className="pb-4">Inflow</th>
                    <th className="pb-4">Outflow</th>
                    <th className="pb-4">Receivables</th>
                    <th className="pb-4">Net</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {data.map((item, index) => (
                    <tr key={item.month}>
                      <td className="py-4 font-semibold text-zinc-900">{item.month}</td>
                      <td className="py-4">
                        <input 
                          type="number" 
                          className="w-24 px-2 py-1 border border-zinc-100 rounded text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900"
                          value={item.inflow}
                          onChange={(e) => handleUpdate(index, 'inflow', Number(e.target.value))}
                        />
                      </td>
                      <td className="py-4">
                        <input 
                          type="number" 
                          className="w-24 px-2 py-1 border border-zinc-100 rounded text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900"
                          value={item.outflow}
                          onChange={(e) => handleUpdate(index, 'outflow', Number(e.target.value))}
                        />
                      </td>
                      <td className="py-4">
                        <input 
                          type="number" 
                          className="w-24 px-2 py-1 border border-zinc-100 rounded text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900"
                          value={item.receivables}
                          onChange={(e) => handleUpdate(index, 'receivables', Number(e.target.value))}
                        />
                      </td>
                      <td className={`py-4 font-mono font-bold ${item.inflow - item.outflow >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {formatCurrency(item.inflow - item.outflow)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 text-white p-8 rounded-2xl shadow-xl">
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2">AR Days (Receivables)</p>
            <h4 className={`text-4xl font-bold tracking-tight ${arDays > 60 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {arDays.toFixed(0)} Days
            </h4>
            <p className="text-zinc-500 text-xs mt-4 leading-relaxed">
              {arDays > 60 
                ? "High AR Days indicate cash stress. Your collection cycle is slower than the industry benchmark." 
                : "Your collection cycle is efficient. Cash is converting quickly from receivables."}
            </p>
          </div>

          <div className="glass-panel p-6">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Working Capital Health</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600">Total Receivables</span>
                <span className="text-sm font-bold text-zinc-900">{formatCurrency(totalReceivables)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600">Cash Conversion</span>
                <span className="text-sm font-bold text-emerald-600">Healthy</span>
              </div>
              <div className="pt-4 border-t border-zinc-100">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-2">Theory Note</p>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Revenue ≠ Cash. The Cash Conversion Cycle (CCC) measures how long each rupee is tied up in the practice before it returns as cash.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
