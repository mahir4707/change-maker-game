export interface CoinCount {
  denomination: number;
  count: number;
  type: 'coin' | 'bill';
}

// Indian Rupee denominations
export const DENOMINATIONS = [
  { value: 10, label: '₹10', type: 'coin' as const },
  { value: 5, label: '₹5', type: 'coin' as const },
  { value: 2, label: '₹2', type: 'coin' as const },
  { value: 1, label: '₹1', type: 'coin' as const },
];

/**
 * Dynamic Programming solution for the coin change problem
 * Returns the minimum number of coins needed and their breakdown
 */
export function calculateChange(amountInRupees: number): CoinCount[] {
  if (amountInRupees <= 0) return [];

  const coins = DENOMINATIONS.map(d => d.value);
  const n = coins.length;
  
  // DP array: dp[i] = minimum coins needed for amount i
  const dp = new Array(amountInRupees + 1).fill(Infinity);
  dp[0] = 0;
  
  // parent[i] stores which coin was used to reach amount i
  const parent = new Array(amountInRupees + 1).fill(-1);
  
  // Fill DP table
  for (let i = 1; i <= amountInRupees; i++) {
    for (let j = 0; j < n; j++) {
      if (coins[j] <= i && dp[i - coins[j]] + 1 < dp[i]) {
        dp[i] = dp[i - coins[j]] + 1;
        parent[i] = j;
      }
    }
  }
  
  // Reconstruct solution
  const result: CoinCount[] = [];
  let current = amountInRupees;
  
  while (current > 0) {
    const coinIndex = parent[current];
    if (coinIndex === -1) break;
    
    const denomination = coins[coinIndex];
    const existing = result.find(c => c.denomination === denomination);
    
    if (existing) {
      existing.count++;
    } else {
      result.push({
        denomination,
        count: 1,
        type: DENOMINATIONS[coinIndex].type,
      });
    }
    
    current -= denomination;
  }
  
  return result.sort((a, b) => b.denomination - a.denomination);
}

/**
 * Format rupees to string
 */
export function formatCurrency(rupees: number): string {
  return `₹${rupees.toFixed(0)}`;
}

/**
 * Get label for denomination
 */
export function getDenominationLabel(rupees: number): string {
  const denom = DENOMINATIONS.find(d => d.value === rupees);
  return denom?.label || `₹${rupees}`;
}
