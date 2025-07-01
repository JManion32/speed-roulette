export interface RoundStats {
  colorCounts: Record<string, number>;
  parityCounts: Record<string, number>;
  halfCounts: Record<string, number>;
  dozenCounts: Record<string, number>;
  rowCounts: Record<string, number>;
  hottestNumbers: number[];
  coldestNumbers: number[];
}