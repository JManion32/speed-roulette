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

// GameRequest contains all game data that will be stored in the leaderboard
type GameRequest struct {
    Nickname     string  `json:"nickname"`
    FinalBalance float64 `json:"final_balance"`
    RemSpins    int      `json:"rem_spins"`
    RemTime     int      `json:"rem_time"`
}

// NumProperties contains all the properties of a roulette number
type NumProperties struct {
	Color  string
	Parity string
	Half   string
	Dozen  string
	Row    string
}

// Request contains the user's nickname
type Request struct {
	Nickname string `json:"nickname"`
}

// GameResponse contains the request status and the user's daily rank
type GameResponse struct {
	Status string `json:"status"`
	Rank   int    `json:"rank"`
}

// RoundEntry is what is entered into the stats table in the db
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

// LeaderboardEntry is what is entered into the games table in the db
type LeaderboardEntry struct {
	Nickname     string 	`json:"nickname"`
	FinalBalance float64	`json:"final_balance"`
	RemTime      int        `json:"rem_time"`
	RemSpins     int        `json:"rem_spins"`
	PlayedAt     time.Time  `json:"played_at"`
}

// NumberCount stores the number and how many times it has occurred
type NumberCount struct {
	Number int `json:"number"`
	Count  int `json:"count"`
}

// RoundStats stores all round data including numbers and their properties
type RoundStats struct {
	ColorCounts    map[string]int `json:"colorCounts"`
	ParityCounts   map[string]int `json:"parityCounts"`
	HalfCounts     map[string]int `json:"halfCounts"`
	DozenCounts    map[string]int `json:"dozenCounts"`
	RowCounts      map[string]int `json:"rowCounts"`
	HottestNumbers []NumberCount  `json:"hottestNumbers"`
	ColdestNumbers []NumberCount  `json:"coldestNumbers"`
}