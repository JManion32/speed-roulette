package models

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
	RemSpins     int     `json:"rem_spins"`
	RemTime      int     `json:"rem_time"`
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
