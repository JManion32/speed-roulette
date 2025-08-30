// Define chip types
export interface Chip {
    value: number;
    color: string;
    isMax?: boolean;
}

// Define Bet
export interface Bet {
    gridIndex: number;
    gridId: string;
    chipValue: number;
    chipColor: string;
}

// Track each individual bet action for better undo functionality
export interface BetAction {
    gridIndex: number;
    gridId: string;
    chipValue: number;
}
