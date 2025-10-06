export interface CoinCount {
  denomination: number;
  count: number;
  type: 'coin' | 'bill';
}

// Standard US currency denominations (in cents)
export const DENOMINATIONS = [
  { value: 10000, label: '$100', type: 'bill' as const },
  { value: 5000, label: '$50', type: 'bill' as const },
  { value: 2000, label: '$20', type: 'bill' as const },
  { value: 1000, label: '$10', type: 'bill' as const },
  { value: 500, label: '$5', type: 'bill' as const },
  { value: 100, label: '$1', type: 'bill' as const },
  { value: 25, label: '25¢', type: 'coin' as const },
  { value: 10, label: '10¢', type: 'coin' as const },
  { value: 5, label: '5¢', type: 'coin' as const },
  { value: 1, label: '1¢', type: 'coin' as const },
];

/**
 * Dynamic Programming solution for the coin change problem
 * Returns the minimum number of coins/bills needed and their breakdown
 */
export function calculateChange(amountInCents: number): CoinCount[] {
  if (amountInCents <= 0) return [];

  const coins = DENOMINATIONS.map(d => d.value);
  const n = coins.length;
  
  // DP array: dp[i] = minimum coins needed for amount i
  const dp = new Array(amountInCents + 1).fill(Infinity);
  dp[0] = 0;
  
  // parent[i] stores which coin was used to reach amount i
  const parent = new Array(amountInCents + 1).fill(-1);
  
  // Fill DP table
  for (let i = 1; i <= amountInCents; i++) {
    for (let j = 0; j < n; j++) {
      if (coins[j] <= i && dp[i - coins[j]] + 1 < dp[i]) {
        dp[i] = dp[i - coins[j]] + 1;
        parent[i] = j;
      }
    }
  }
  
  // Reconstruct solution
  const result: CoinCount[] = [];
  let current = amountInCents;
  
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
 * Format cents to dollar string
 */
export function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Get label for denomination
 */
export function getDenominationLabel(cents: number): string {
  const denom = DENOMINATIONS.find(d => d.value === cents);
  return denom?.label || `${cents}¢`;
}
