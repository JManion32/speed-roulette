package handlers

import (
	"encoding/json"
	"net/http"

	"speed-roulette/backend/game"
	"speed-roulette/backend/models"
	"speed-roulette/backend/redis"
	"speed-roulette/backend/utils"
)

type PayoutRequest struct {
	Bets   []models.Bet `json:"bets"`
	Result int          `json:"result"`
}

type PayoutResponse struct {
	Payout float64 `json:"payout"`
}

func HandlePayout(w http.ResponseWriter, r *http.Request) {
	utils.SetupCORS(&w, r)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	var req PayoutRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	totalBet := utils.SumBets(req.Bets)
	token, balance, err := utils.ValidateAndGetBalance(r, totalBet)
	if err != nil {
		http.Error(w, err.Error(), http.StatusForbidden)
		return
	}

	if err := utils.CheckRateLimit(token); err != nil {
		http.Error(w, err.Error(), http.StatusTooManyRequests)
		return
	}

	payout := game.Payout(req.Bets, req.Result)
	newBalance := balance - totalBet + payout
	redis.Client.Set(redis.Ctx, "balance:"+token, newBalance, 0)

	json.NewEncoder(w).Encode(PayoutResponse{Payout: payout})
}
