// handlers/leaderboard.go
package handlers

import (
	"encoding/json"
	"net/http"

	"speed-roulette/backend/db"
)

func HandleLeaderboard(w http.ResponseWriter, r *http.Request) {
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
