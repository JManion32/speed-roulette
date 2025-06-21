package handlers

import (
	"encoding/json"
	"net/http"
	"speed-roulette/backend/game"
	"speed-roulette/backend/models"
)

type PayoutRequest struct {
	Bets   []models.Bet `json:"bets"`
	Result int          `json:"result"`
}

type PayoutResponse struct {
	Payout float64 `json:"payout"`
}

func HandlePayout(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	var req PayoutRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	payout := game.Payout(req.Bets, req.Result)

	resp := PayoutResponse{Payout: payout}
	json.NewEncoder(w).Encode(resp)
}
