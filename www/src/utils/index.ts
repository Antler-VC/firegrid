export const nth = (n: number) =>
  n + (['st', 'nd', 'rd'][((((n + 90) % 100) - 10) % 10) - 1] || 'th');
