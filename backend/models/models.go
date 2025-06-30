package models

import (
	"time"
)

// Bet represents a bet placed on the roulette table
type Bet struct {
    GridIndex int     `json:"gridIndex"`
    GridID    string  `json:"gridId"`
    ChipValue float64 `json:"chipValue"`
}

type GameRequest struct {
    Nickname     string  `json:"nickname"`
    FinalBalance float64 `json:"final_balance"`
    RemSpins    int      `json:"rem_spins"`
    RemTime     int      `json:"rem_time"`
}

type NumProperties struct {
	Color  string
	Parity string
	Half   string
	Dozen  string
	Row    string
}

type PayoutRequest struct {
	Bets   []Bet        `json:"bets"`
	Result int          `json:"result"`
}

type PayoutResponse struct {
	Payout float64 `json:"payout"`
}

type Request struct {
	Nickname string `json:"nickname"`
}

type GameResponse struct {
	Status string `json:"status"`
	Rank   int    `json:"rank"`
}

type RoundEntry struct {
	RoundID   int       `json:"round_id"`
	Number    int       `json:"number"`
	Color     string    `json:"color"`
	Parity    string    `json:"parity"`
	Half      string    `json:"half"`
	Dozen     string    `json:"dozen"`
	Row       string    `json:"row"`
	PlayedAt  time.Time `json:"played_at"`
}

type LeaderboardEntry struct {
	Nickname     string 	`json:"nickname"`
	FinalBalance float64	`json:"final_balance"`
	RemTime      int        `json:"rem_time"`
	RemSpins     int        `json:"rem_spins"`
	PlayedAt     time.Time  `json:"played_at"`
}
