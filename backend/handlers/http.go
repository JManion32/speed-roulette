package handlers

import (
	"encoding/json"
	"net/http"
	"speed-roulette/backend/db"
	"speed-roulette/backend/models"
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
  //go models.SaveRound(result)
  json.NewEncoder(w).Encode(map[string]int{"number": result})
}



//===================================================================

type PayoutRequest struct {
	Bets   []models.Bet `json:"bets"`
	Result int          `json:"result"`
}

type PayoutResponse struct {
	Payout float64 `json:"payout"`
}

func HandlePayout(w http.ResponseWriter, r *http.Request) {
	// CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Handle preflight request
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	var req PayoutRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	payout := game.Payout(req.Bets, req.Result)

	resp := PayoutResponse{Payout: payout}
	json.NewEncoder(w).Encode(resp)
}

func HandleFinishGame(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	type FinishGameRequest struct {
		Nickname     string  `json:"nickname"`
		FinalBalance float64 `json:"finalBalance"`
		TurnsUsed    int     `json:"turnsUsed"`
		TimeUsed     int     `json:"timeUsed"`
	}

	var req FinishGameRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// Insert game and get game ID
	gameID, err := db.InsertGame(req.Nickname, req.FinalBalance, req.TurnsUsed, req.TimeUsed)
	if err != nil {
		http.Error(w, "DB error", http.StatusInternalServerError)
		return
	}

	// Get rank
	rank, err := db.GetPlayerRank(req.FinalBalance)
	if err != nil {
		http.Error(w, "Rank error", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"game_id": gameID,
		"rank":    rank,
	})
}
