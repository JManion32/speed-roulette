package main

import (
	"fmt"
	"log"
	"net/http"

	//"speed-roulette/backend/db"
	"speed-roulette/backend/handlers"
)

func main() {
	fmt.Println("Starting Speed Roulette backend server...")

	// Initialize DB
	//db.InitDB()

	// Register handlers
	http.HandleFunc("/ws", handlers.WsEndpoint)
	http.HandleFunc("/api/spin", handlers.HandleSpin)
	http.HandleFunc("/api/payout", handlers.HandlePayout)
	//http.HandleFunc("/api/finish_game", handlers.HandleFinishGame)

	// Print registered routes
	fmt.Println("Registered routes:")
	fmt.Println("- /ws (WebSocket endpoint)")
	fmt.Println("- /api/spin")

	// Start server with additional logging
	addr := ":8080"
	fmt.Printf("Server starting on %s\n", addr)

	if err := http.ListenAndServe(addr, nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
