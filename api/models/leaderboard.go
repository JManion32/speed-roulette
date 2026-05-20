package models

import (
	"time"
)

// LeaderboardEntry is what is entered into the games table in the db
type LeaderboardEntry struct {
	Nickname     string    `json:"nickname"`
	FinalBalance float64   `json:"final_balance"`
	RemTime      int       `json:"rem_time"`
	RemSpins     int       `json:"rem_spins"`
	PlayedAt     time.Time `json:"played_at"`
}
