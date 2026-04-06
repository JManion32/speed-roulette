export interface Chip {
    value: number;
    color: string;
}

export interface Bet {
    gridIndex: number;
    gridId: string;
    chipValue: number;
    chipColor: string;
}

export interface BetAction {
    gridIndex: number;
    gridId: string;
    chipValue: number;
}
