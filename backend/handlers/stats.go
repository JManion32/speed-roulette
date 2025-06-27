// handlers/stats.go
package handlers

import (
	"encoding/json"
	"net/http"

	"speed-roulette/backend/db"
	"speed-roulette/backend/utils"
)

func HandleAllStats(w http.ResponseWriter, r *http.Request) {
	ip := utils.GetClientIP(r)
	if err := utils.CheckIPLeaderboardLimit(ip); err != nil {
		http.Error(w, err.Error(), http.StatusTooManyRequests)
		return
	}

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	today, err1 := db.GetRounds("today")
	week, err2 := db.GetRounds("week")
	month, err3 := db.GetRounds("month")
	allTime, err4 := db.GetRounds("allTime")

	if err1 != nil || err2 != nil || err3 != nil || err4 != nil {
		http.Error(w, "Failed to load round statistics", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"today":   today,
		"week":    week,
		"month":   month,
		"allTime": allTime,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
