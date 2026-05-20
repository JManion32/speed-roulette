package models

import (
	"time"
)

// RoundEntry is what is entered into the stats table in the db
type RoundEntry struct {
	RoundID  int       `json:"round_id"`
	Number   int       `json:"number"`
	Color    string    `json:"color"`
	Parity   string    `json:"parity"`
	Half     string    `json:"half"`
	Dozen    string    `json:"dozen"`
	Row      string    `json:"row"`
	PlayedAt time.Time `json:"played_at"`
}

// NumberCount stores the number and how many times it has occurred
type NumberCount struct {
	Number int `json:"number"`
	Count  int `json:"count"`
}

// AllStats stores all round data including numbers and their properties, as well as winnings and matches played
type AllStats struct {
	ColorCounts    map[string]int `json:"colorCounts"`
	ParityCounts   map[string]int `json:"parityCounts"`
	HalfCounts     map[string]int `json:"halfCounts"`
	DozenCounts    map[string]int `json:"dozenCounts"`
	RowCounts      map[string]int `json:"rowCounts"`
	HottestNumbers []NumberCount  `json:"hottestNumbers"`
	ColdestNumbers []NumberCount  `json:"coldestNumbers"`
	NumSpins       int            `json:"numSpins"`
	CompletedGames int            `json:"completedGames"`
	TotalWon       float64        `json:"totalWon"`
}
