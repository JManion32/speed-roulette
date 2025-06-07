package models

// Shared data structures used by both bet and game

// Bet represents a bet placed on the roulette table
type Bet struct {
    GridIndex int     `json:"gridIndex"`
    GridID    string  `json:"gridId"`
    ChipValue float64 `json:"chipValue"`
}

// BetRequest represents a request to place bets
type BetRequest struct {
    Bets []Bet `json:"bets"`
}

// BetResponse represents the response to a bet request
type BetResponse struct {
    Success    bool    `json:"success"`
    Message    string  `json:"message"`
    TotalBet   float64 `json:"totalBet"`
    NewBalance float64 `json:"newBalance"`
}

// NumRequest represents a request to spin the wheel
type NumRequest struct {
    Bets []Bet `json:"bets"` 
}

// ResultNum represents the result of a spin, shouldn't need all this info idk
type ResultNum struct {
    Number      int     `json:"number"`
    Color       string  `json:"color"`
    WinningBets []Bet   `json:"winningBets"`
    TotalBet    float64 `json:"totalBet"`
    TotalWon    float64 `json:"totalWon"`
    NewBalance  float64 `json:"newBalance"`
}

type Round struct {
	ResultNumber   int
	IsRed          bool
	IsBlack        bool
	IsGreen        bool
	IsEven         bool
	IsOdd          bool
	IsLow          bool
	IsHigh         bool
	IsFirstDozen   bool
	IsSecondDozen  bool
	IsThirdDozen   bool
	IsTopRow       bool
	IsMiddleRow    bool
	IsBottomRow    bool
	TimeRemaining  int
}
