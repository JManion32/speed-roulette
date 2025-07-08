package handlers

import (
	"net/http"

	"speed-roulette/backend/auth"
	"speed-roulette/backend/middleware"
	"speed-roulette/backend/redis"
)

// HandleLogout ensures token and balance associated with the user is cleared
func HandleLogout(w http.ResponseWriter, r *http.Request) {
	middleware.SetupCORS(&w, r)

	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	token, err := auth.ExtractToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	// Delete both Redis keys associated with the token
	_ = redis.Client.Del(redis.Ctx, "token:"+token)
	_ = redis.Client.Del(redis.Ctx, "balance:"+token)

	w.WriteHeader(http.StatusOK)
}
