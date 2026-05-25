function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const prev: number[] = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let cur = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const above = prev[j] ?? 0;
      const diag = prev[j - 1] ?? 0;
      const next = Math.min(above + 1, cur + 1, diag + cost);
      prev[j - 1] = cur;
      cur = next;
    }
    prev[b.length] = cur;
  }
  return prev[b.length] ?? 0;
}

export function suggestPath(input: string, candidates: string[]): string | null {
  let best: { path: string; distance: number } | null = null;
  for (const c of candidates) {
    const d = levenshtein(input, c);
    if (!best || d < best.distance) best = { path: c, distance: d };
  }
  if (!best) return null;
  const threshold = Math.max(3, Math.floor(input.length * 0.3));
  return best.distance <= threshold ? best.path : null;
}
