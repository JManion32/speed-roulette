package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"speed-roulette/backend/db"
)

func HandleGetRank(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	balanceStr := r.URL.Query().Get("balance")
	balance, err := strconv.ParseFloat(balanceStr, 64)
	if err != nil {
		http.Error(w, "Invalid balance parameter", http.StatusBadRequest)
		return
	}

	rank, err := db.GetPlayerRank(balance)
	if err != nil {
		http.Error(w, "Failed to get rank: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]int{"rank": rank})
}
