package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"speed-roulette/backend/redis"
	"speed-roulette/backend/utils"
)

func HandleRegister(w http.ResponseWriter, r *http.Request) {
	type request struct {
		Nickname string `json:"nickname"`
	}

	var req request
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Nickname == "" {
		http.Error(w, "Invalid nickname", http.StatusBadRequest)
		return
	}

	token := utils.GenerateToken(16)

	// Set nickname token
	if err := redis.Client.Set(redis.Ctx, "token:"+token, req.Nickname, 24*time.Hour).Err(); err != nil {
		http.Error(w, "Could not save token", http.StatusInternalServerError)
		return
	}

	// Set balance token
	if err := redis.Client.Set(redis.Ctx, "balance:"+token, 20.0, 10*time.Minute).Err(); err != nil {
		http.Error(w, "Could not save balance", http.StatusInternalServerError)
		return
	}

	resp := map[string]string{
		"token": token,
	}
	json.NewEncoder(w).Encode(resp)
}
