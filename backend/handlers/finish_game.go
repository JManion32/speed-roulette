package handlers

import (
	"encoding/json"
	"net/http"
	"speed-roulette/backend/db"
	"speed-roulette/backend/models"
)

func HandleFinishGame(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.GameRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request: "+err.Error(), http.StatusBadRequest)
		return
	}

	gameID, err := db.InsertGame(req.Nickname, req.FinalBalance, req.SpinsUsed, req.TimeUsed)
	if err != nil {
		http.Error(w, "Failed to save game: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
		"status":  "success",
		"game_id": gameID,
	})
}
