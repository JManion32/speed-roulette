package handlers

import (
	"encoding/json"
	"net/http"
	"speed-roulette/backend/game"
	"speed-roulette/backend/utils"
)

func HandleSpin(w http.ResponseWriter, r *http.Request) {
	utils.SetupCORS(&w, r)

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	result := game.GenerateNum()
	json.NewEncoder(w).Encode(map[string]int{"number": result})
}
