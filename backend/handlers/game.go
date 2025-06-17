package handlers

import (
	"encoding/json"
	"net/http"
	"speed-roulette/backend/db"
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

	var req GameRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON: "+err.Error(), http.StatusBadRequest)
		return
	}

	gameID, err := db.InsertGame(req.Nickname, req.FinalBalance, req.SpinsUsed, req.TimeUsed)
	if err != nil {
		http.Error(w, "Database error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":  "success",
		"game_id": gameID,
	})
}
