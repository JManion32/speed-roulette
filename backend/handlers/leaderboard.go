// handlers/leaderboard.go
package handlers

import (
	"encoding/json"
	"net/http"

	"speed-roulette/backend/db"
	"speed-roulette/backend/utils"
)

func HandleLeaderboard(w http.ResponseWriter, r *http.Request) {

	ip := utils.GetClientIP(r)
	if err := utils.CheckIPLeaderboardLimit(ip); err != nil {
		http.Error(w, err.Error(), http.StatusTooManyRequests)
		return
	}

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	rangeParam := r.URL.Query().Get("range")
	if rangeParam == "" {
		rangeParam = "today"
	}

	entries, err := db.GetLeaderboard(rangeParam)
	if err != nil {
		http.Error(w, "Failed to load leaderboard: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(entries)
}
