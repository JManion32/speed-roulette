package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/rs/cors"
	"speed-roulette/backend/db"
	"speed-roulette/backend/handlers"
)

func main() {
	fmt.Println("Starting Speed Roulette backend server...")

	db.InitDB()

	// Create a new mux
	mux := http.NewServeMux()
	mux.HandleFunc("/ws", handlers.WsEndpoint)
	mux.HandleFunc("/api/spin", handlers.HandleSpin)
	mux.HandleFunc("/api/payout", handlers.HandlePayout)
	http.HandleFunc("/api/game", handlers.HandleGame)
	http.HandleFunc("/api/round", handlers.HandleRound)

	// Enable CORS
	handler := cors.Default().Handler(mux)

	// Start server
	addr := ":8080"
	fmt.Printf("Server starting on %s\n", addr)
	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

