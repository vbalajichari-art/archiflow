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
  squareFootage?: number;
  ratePerSqFt?: number;
  projectValue?: number;
  feePercentage?: number;
  lumpSumAmount?: number;
  billingRate?: number;
}

export interface CashFlowItem {
  month: string;
  inflow: number;
  outflow: number;
  receivables: number;
}

export interface RiskData {
  practiceMonthlyCost: number;
  personalMonthlyExpense: number;
  currentBuffer: number;
  monthlyFixedCosts: number;
  personalExpenses: number;
  safetyMonths: number;
}

export interface GrowthData {
  juniorSalary: number;
  productivityGain: number;
  newProjectPotential: number;
  expectedBillableHours: number;
  billingRate: number;
  realizationRate: number;
  investmentCost: number;
  annualBenefit: number;
  discountRate: number;
}

export interface SeparationData {
  revenue: number;
  taxRate: number;
  reinvestmentRate: number;
  ownerSalary: number;
}

export interface SplitModel {
  operations: number;
  tax: number;
  reinvestment: number;
  emergency: number;
  profit: number;
}
