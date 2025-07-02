import { useEffect, useState } from "react";

// Types
import type { ResultNum } from "../types/WinningNum";

export function useResultNums() {
    const [winningNumber, setWinningNumber] = useState<string | null>(null);
    const isWinning = (num: string) => winningNumber === num;

    const [resultNums, setResultNums] = useState<ResultNum[]>([]);
    const addResultNum = (num: ResultNum) => {
        setResultNums((prev) => {
            const updated = [num, ...prev]; // newest result on the left
            return updated.slice(0, 9); // keep only the 9 most recent
        });
    };

    return {
        winningNumber,
        setWinningNumber,
        isWinning,
        resultNums,
        setResultNums,
        addResultNum,
    };
}
