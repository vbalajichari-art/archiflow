export type ProjectTypology = 'Residential' | 'Commercial' | 'Interior' | 'Conservation' | 'Institutional';
export type FeeMethod = 'Percentage' | 'LumpSum' | 'PerSqFt' | 'Hourly';

export interface SurvivalData {
  rent: number;
  salaries: number;
  software: number;
  utilities: number;
  insurance: number;
  loans: number; // EMI
  admin: number;
  bufferPercent: number;
  totalHoursAvailable: number;
  utilizationRate: number;
  realizationRate: number;
  targetBillingRate: number; // For Break-Even Hours calculation
  avgVariableCostPerHour: number; // Direct project costs per hour
  targetCMR: number; // Target Contribution Margin Ratio (%)
}

export interface QuotationData {
  typology: ProjectTypology;
  feeMethod: FeeMethod;
  estimatedHours: number;
  hourlyCost: number;
  overheadAllocation: number;
  profitMargin: number;
  riskScore: number; // 1-5
  variableCosts: number; // Direct project costs (travel, printing, etc.)
}

export interface CashFlowItem {
  month: string;
  inflow: number;
  outflow: number;
}

export interface RiskData {
  practiceMonthlyCost: number;
  personalMonthlyExpense: number;
  currentBuffer: number;
}

export interface GrowthData {
  juniorSalary: number;
  productivityGain: number;
  newProjectPotential: number;
}

export interface SplitModel {
  operations: number;
  tax: number;
  reinvestment: number;
  emergency: number;
  profit: number;
}
