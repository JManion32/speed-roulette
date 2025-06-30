package handlers

import (
	"encoding/json"
	"net/http"
	"log"

	"speed-roulette/backend/auth"
	"speed-roulette/backend/db" 
	"speed-roulette/backend/models"
	"speed-roulette/backend/middleware"
	"speed-roulette/backend/redis"
	"speed-roulette/backend/utils"
)

func HandleRound(w http.ResponseWriter, r *http.Request) {
	middleware.SetupCORS(&w, r)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	var req struct {
		Bets []models.Bet `json:"bets"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	totalBet := utils.SumBets(req.Bets)
	token, balance, err := auth.ValidateAndGetBalance(r, totalBet)
	if err != nil {
		http.Error(w, err.Error(), http.StatusForbidden)
		return
	}

	if err := auth.CheckRateLimit(token); err != nil {
		http.Error(w, err.Error(), http.StatusTooManyRequests)
		return
	}

	result := utils.GenerateNum()

	// Log the round
	props := utils.GetNumProperties(result)
	err = db.InsertRound(result, props.Color, props.Parity, props.Half, props.Dozen, props.Row)
	if err != nil {
		log.Println("Failed to insert round:", err)
	}

	payout := utils.Payout(req.Bets, result)
	newBalance := balance - totalBet + payout
	redis.Client.Set(redis.Ctx, "balance:"+token, newBalance, 0)

	json.NewEncoder(w).Encode(struct {
		Number int     `json:"number"`
		Payout float64 `json:"payout"`
	}{
		Number: result,
		Payout: payout,
	})
}
