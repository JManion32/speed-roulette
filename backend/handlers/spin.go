package handlers

import (
	"encoding/json"
	"net/http"
	"speed-roulette/backend/game"
)

func HandleSpin(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	result := game.GenerateNum()
	json.NewEncoder(w).Encode(map[string]int{"number": result})
}
