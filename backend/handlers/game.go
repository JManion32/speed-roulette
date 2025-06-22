package handlers

import (
	"encoding/json"
	"math"
	"net/http"

	"speed-roulette/backend/db"
	"speed-roulette/backend/utils"
)

type GameRequest struct {
	Nickname     string  `json:"nickname"`
	FinalBalance float64 `json:"final_balance"`
	SpinsUsed    int     `json:"spins_used"`
	TimeUsed     int     `json:"time_used"`
}

func HandleGame(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Get nickname
	nickname, err := utils.GetNicknameFromToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	// Decode incoming request
	var req GameRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON: "+err.Error(), http.StatusBadRequest)
		return
	}

	if req.Nickname != nickname {
		http.Error(w, "Nickname/token mismatch", http.StatusForbidden)
		return
	}

	// Validate final balance
	balance, err := utils.GetBalanceFromToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if math.Abs(balance-req.FinalBalance) > 0.01 {
		http.Error(w, "Balance mismatch. Score not saved.", http.StatusForbidden)
		return
	}

	// Save to DB
	gameID, err := db.InsertGame(nickname, balance, req.SpinsUsed, req.TimeUsed)
	if err != nil {
		http.Error(w, "Database error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]any{
		"status":  "success",
		"game_id": gameID,
	})
}
