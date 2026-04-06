export interface AllStats {
    colorCounts: Record<string, number>;
    parityCounts: Record<string, number>;
    halfCounts: Record<string, number>;
    dozenCounts: Record<string, number>;
    rowCounts: Record<string, number>;
    hottestNumbers: { number: number; count: number }[];
    coldestNumbers: { number: number; count: number }[];
    numSpins: number;
    completedGames: number;
    totalWon: number;
}
