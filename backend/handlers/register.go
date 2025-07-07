package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"speed-roulette/backend/auth"
	"speed-roulette/backend/redis"
	"speed-roulette/backend/models"
)

// HandleRegister generates a user token and sets its expiration
func HandleRegister(w http.ResponseWriter, r *http.Request) {

	ip := auth.GetClientIP(r)
	if err := auth.CheckIPRateLimit(ip); err != nil {
		http.Error(w, err.Error(), http.StatusTooManyRequests)
		return
	}

	var req models.Request
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Nickname == "" {
		http.Error(w, "Invalid nickname", http.StatusBadRequest)
		return
	}

	token := auth.GenerateToken(16)

	// Set nickname token with 3 minute expiration
	if err := redis.Client.Set(redis.Ctx, "token:"+token, req.Nickname, 3 * time.Minute).Err(); err != nil {
		http.Error(w, "Could not save token", http.StatusInternalServerError)
		return
	}

	// Set balance token with 3 minute expiration
	if err := redis.Client.Set(redis.Ctx, "balance:"+token, 20.0, 3 * time.Minute).Err(); err != nil {
		http.Error(w, "Could not save balance", http.StatusInternalServerError)
		return
	}

	resp := map[string]string{
		"token": token,
	}
	json.NewEncoder(w).Encode(resp)
}
