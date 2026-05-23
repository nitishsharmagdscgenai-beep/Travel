// Currency utility functions
export const formatINR = (amount) => {
  if (!amount && amount !== 0) return "0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumberINR = (amount) => {
  return new Intl.NumberFormat("en-IN").format(amount);
};

export const getBudgetSuggestion = (destination, days) => {
  const suggestions = {
    goa: { budget: 3000, moderate: 6000, luxury: 15000 },
    manali: { budget: 2500, moderate: 5000, luxury: 12000 },
    jaipur: { budget: 2000, moderate: 4500, luxury: 10000 },
    delhi: { budget: 2000, moderate: 5000, luxury: 12000 },
    mumbai: { budget: 2500, moderate: 6000, luxury: 15000 },
    kerala: { budget: 2500, moderate: 5500, luxury: 13000 },
    default: { budget: 2000, moderate: 5000, luxury: 12000 },
  };

  const destKey = destination?.toLowerCase();
  const suggestion = suggestions[destKey] || suggestions.default;

  return {
    budget: suggestion.budget * days,
    moderate: suggestion.moderate * days,
    luxury: suggestion.luxury * days,
  };
};

export const calculatePerDayBudget = (totalBudget, days) => {
  return Math.round(totalBudget / days);
};
