// Currency conversion utilities

export interface ExchangeRates {
  USD: number;
  EUR: number;
  GBP: number;
  INR: number;
  JPY: number;
  AUD: number;
  CAD: number;
}

// Mock exchange rates - in production, fetch from a real API
const mockExchangeRates: ExchangeRates = {
  USD: 83.25, // 1 USD = 83.25 INR
  EUR: 90.50, // 1 EUR = 90.50 INR
  GBP: 105.75, // 1 GBP = 105.75 INR
  INR: 1, // Base currency
  JPY: 0.56, // 1 JPY = 0.56 INR
  AUD: 54.20, // 1 AUD = 54.20 INR
  CAD: 61.35, // 1 CAD = 61.35 INR
};

export const convertToINR = (amount: number, fromCurrency: keyof ExchangeRates): number => {
  if (fromCurrency === 'INR') return amount;
  const rate = mockExchangeRates[fromCurrency];
  return Math.round(amount * rate);
};

export const convertFromINR = (amountINR: number, toCurrency: keyof ExchangeRates): number => {
  if (toCurrency === 'INR') return amountINR;
  const rate = mockExchangeRates[toCurrency];
  return Math.round((amountINR / rate) * 100) / 100;
};

export const formatCurrency = (amount: number, currency: keyof ExchangeRates = 'INR'): string => {
  const formatters = {
    INR: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }),
    USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
    EUR: new Intl.NumberFormat('en-DE', { style: 'currency', currency: 'EUR' }),
    GBP: new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }),
    JPY: new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }),
    AUD: new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }),
    CAD: new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }),
  };

  return formatters[currency].format(amount);
};

export const getCurrencySymbol = (currency: keyof ExchangeRates): string => {
  const symbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    AUD: 'A$',
    CAD: 'C$',
  };

  return symbols[currency];
};

export const getExchangeRates = (): ExchangeRates => {
  return mockExchangeRates;
};

// Fetch real-time exchange rates (placeholder for real API)
export const fetchExchangeRates = async (): Promise<ExchangeRates> => {
  // In production, integrate with a real exchange rate API like:
  // - Fixer.io
  // - CurrencyAPI
  // - Exchange Rates API
  
  try {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockExchangeRates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return mockExchangeRates;
  }
};

export const getBudgetCategories = (totalBudgetINR: number) => {
  return {
    budget: totalBudgetINR < 50000, // Less than ₹50,000
    midrange: totalBudgetINR >= 50000 && totalBudgetINR < 150000, // ₹50k - ₹150k
    luxury: totalBudgetINR >= 150000 // More than ₹150,000
  };
};

export const getRecommendedBudgetRange = (destination: string, days: number) => {
  // Basic budget calculation per day in INR
  const budgetRanges = {
    budget: { min: 2000, max: 4000 }, // ₹2k-4k per day
    midrange: { min: 4000, max: 8000 }, // ₹4k-8k per day
    luxury: { min: 8000, max: 20000 }, // ₹8k-20k per day
  };

  return {
    budget: {
      min: budgetRanges.budget.min * days,
      max: budgetRanges.budget.max * days,
    },
    midrange: {
      min: budgetRanges.midrange.min * days,
      max: budgetRanges.midrange.max * days,
    },
    luxury: {
      min: budgetRanges.luxury.min * days,
      max: budgetRanges.luxury.max * days,
    },
  };
};
