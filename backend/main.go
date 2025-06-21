package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/rs/cors"
	"speed-roulette/backend/db"
	"speed-roulette/backend/handlers"
	"speed-roulette/backend/redis"
)

func main() {
	fmt.Println("Starting Speed Roulette backend server...")

	db.InitDB()
	redis.InitRedis()

	// Create a new mux
	mux := http.NewServeMux()
	mux.HandleFunc("/ws", handlers.WsEndpoint)
	mux.HandleFunc("/api/spin", handlers.HandleSpin)
	mux.HandleFunc("/api/payout", handlers.HandlePayout)
	mux.HandleFunc("/api/game", handlers.HandleGame)
	mux.HandleFunc("/api/round", handlers.HandleRound)
	mux.HandleFunc("/api/rank", handlers.HandleGetRank)
	mux.HandleFunc("/api/leaderboard", handlers.HandleLeaderboard)


	// Enable CORS
	handler := cors.Default().Handler(mux)

	// Start server
	addr := ":8080"
	fmt.Printf("Server starting on %s\n", addr)
	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
