package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/rs/cors"
	"speed-roulette/backend/db"
	"speed-roulette/backend/handlers"
	"speed-roulette/backend/middleware"
	"speed-roulette/backend/redis"
)

func main() {
	fmt.Println("Starting Speed Roulette backend server...")

	db.InitDB()
	redis.InitRedis()

	mux := http.NewServeMux()
	mux.HandleFunc("/api/register", handlers.HandleRegister)
    mux.HandleFunc("/api/leaderboards", handlers.HandleAllLeaderboards)

	// Protected routes
	mux.HandleFunc("/api/round", middleware.RequireAuth(handlers.HandleRound)) // Each spin
	mux.HandleFunc("/api/game", middleware.RequireAuth(handlers.HandleGame)) // End of game
	mux.HandleFunc("/api/logout", middleware.RequireAuth(handlers.HandleLogout)) // User returns home or end of game

	// Enable CORS
	handler := cors.Default().Handler(mux)

	// Start server
	addr := ":8080"
	fmt.Printf("Server starting on %s\n", addr)
	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
