package handlers

import (
	"encoding/json"
	"net/http"
	"speed-roulette/backend/db"
)

type RoundRequest struct {
	GameID         int  `json:"game_id"`
	RoundNumber    int  `json:"round_number"`
	ResultNumber   int  `json:"result_number"`
	IsRed          bool `json:"is_red"`
	IsBlack        bool `json:"is_black"`
	IsGreen        bool `json:"is_green"`
	IsEven         bool `json:"is_even"`
	IsOdd          bool `json:"is_odd"`
	IsLow          bool `json:"is_low"`
	IsHigh         bool `json:"is_high"`
	IsFirstDozen   bool `json:"is_first_dozen"`
	IsSecondDozen  bool `json:"is_second_dozen"`
	IsThirdDozen   bool `json:"is_third_dozen"`
	IsTopRow       bool `json:"is_top_row"`
	IsMiddleRow    bool `json:"is_middle_row"`
	IsBottomRow    bool `json:"is_bottom_row"`
}

func HandleRound(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req RoundRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON: "+err.Error(), http.StatusBadRequest)
		return
	}

	err := db.InsertRound(
		req.GameID,
		req.RoundNumber,
		req.ResultNumber,
		req.IsRed, req.IsBlack, req.IsGreen,
		req.IsEven, req.IsOdd,
		req.IsLow, req.IsHigh,
		req.IsFirstDozen, req.IsSecondDozen, req.IsThirdDozen,
		req.IsTopRow, req.IsMiddleRow, req.IsBottomRow,
	)

	if err != nil {
		http.Error(w, "Failed to insert round: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status":"round logged"}`))
}
