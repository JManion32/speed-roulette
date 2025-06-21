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

	mux := http.NewServeMux()
	mux.HandleFunc("/api/register", handlers.HandleRegister)
	mux.HandleFunc("/api/leaderboard", handlers.HandleLeaderboard)

	// Protected routes
	mux.HandleFunc("/api/spin", middleware.RequireAuth(handlers.HandleSpin))
	mux.HandleFunc("/api/payout", middleware.RequireAuth(handlers.HandlePayout))
	mux.HandleFunc("/api/game", middleware.RequireAuth(handlers.HandleGame))
	mux.HandleFunc("/api/round", middleware.RequireAuth(handlers.HandleRound))
	mux.HandleFunc("/api/rank", middleware.RequireAuth(handlers.HandleGetRank))

	mux.HandleFunc("/ws", middleware.RequireAuth(handlers.WsEndpoint))

	// Enable CORS
	handler := cors.Default().Handler(mux)

	// Start server
	addr := ":8080"
	fmt.Printf("Server starting on %s\n", addr)
	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
