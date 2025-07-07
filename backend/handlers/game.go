package handlers

import (
	"encoding/json"
	"math"
	"net/http"

	"speed-roulette/backend/auth"
	"speed-roulette/backend/db"
	"speed-roulette/backend/models"
)

// HandleGame manages the validation and logging of the game when it is completed
func HandleGame(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	nickname, err := auth.GetNicknameFromToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	var req models.GameRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON: "+err.Error(), http.StatusBadRequest)
		return
	}

	if req.Nickname != nickname {
		http.Error(w, "Nickname/token mismatch", http.StatusForbidden)
		return
	}

	balance, err := auth.GetBalanceFromToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if math.Abs(balance-req.FinalBalance) > 0.01 {
		http.Error(w, "Balance mismatch. Score not saved.", http.StatusForbidden)
		return
	}

	if _, err := db.InsertGame(nickname, balance, req.RemSpins, req.RemTime); err != nil {
		http.Error(w, "Database error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	rank, err := db.GetPlayerRank(balance)
	if err != nil {
		http.Error(w, "Failed to get rank: "+err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(models.GameResponse{
		Status: "success",
		Rank:   rank,
	})
}
