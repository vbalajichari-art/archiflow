import React from 'react';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Calculator, 
  TrendingUp, 
  ShieldCheck, 
  Rocket, 
  SplitSquareVertical,
  X
} from 'lucide-react';
import { cn } from '../utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'survival', label: 'Survival Engine', icon: ShieldAlert },
  { id: 'quotation', label: 'Quotation Engine', icon: Calculator },
  { id: 'cashflow', label: 'Cash Flow Forecast', icon: TrendingUp },
  { id: 'risk', label: 'Risk & Contingency', icon: ShieldCheck },
  { id: 'growth', label: 'Growth & Reinvest', icon: Rocket },
  { id: 'separation', label: 'Wealth Separation', icon: SplitSquareVertical },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={cn(
        "w-64 h-screen bg-white border-r border-zinc-200 flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-bottom border-zinc-100 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
              <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white font-mono text-lg">A</div>
              Archiflow
            </h1>
            <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-[0.2em] mt-1">Practice OS v1.0</p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-zinc-400 hover:text-zinc-900"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                activeTab === tab.id 
                  ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200" 
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-zinc-100">
          <div className="bg-zinc-50 rounded-xl p-4">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Current Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-zinc-700">Practice Stable</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
