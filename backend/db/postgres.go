package db

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/lib/pq"
)

// Connection parameters - replace with environment variables in production
const (
	host     = "localhost"
	port     = 5432
	user     = "postgres"
	password = "(Postgres2025)"
	dbname   = "roulette"
)

// Connect establishes a connection to the PostgreSQL database
func Connect() (*sql.DB, error) {
	connStr := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname,
	)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	// Verify connection
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return db, nil
}

// InitDB creates the necessary tables if they don't already exist
func InitDB() {
	db, err := Connect()
	if err != nil {
		log.Fatal("DB connection error:", err)
	}
	defer db.Close()

	createGamesTable := `
		CREATE TABLE IF NOT EXISTS games (
		game_id SERIAL PRIMARY KEY,
		nickname VARCHAR(50) NOT NULL,
		final_balance NUMERIC(12,2) NOT NULL,
		rem_spins INTEGER NOT NULL,
		rem_time INTEGER NOT NULL,
		game_date_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);`

	if _, err := db.Exec(createGamesTable); err != nil {
		log.Fatal("Failed to create games table:", err)
	}

	log.Println("Database initialized successfully.")
}

func InsertGame(nickname string, balance float64, remSpins int, remTime int) (int, error) {
	db, err := Connect()
	if err != nil {
		return 0, err
	}
	defer db.Close()

	var gameID int
	err = db.QueryRow(`
		INSERT INTO games (nickname, final_balance, rem_spins, rem_time)
		VALUES ($1, $2, $3, $4)
		RETURNING game_id
	`, nickname, balance, remSpins, remTime).Scan(&gameID)

	return gameID, err
}

func GetPlayerRank(balance float64) (int, error) {
	db, err := Connect()
	if err != nil {
		return 0, err
	}
	defer db.Close()

	today := time.Now().Truncate(24 * time.Hour).Format("2006-01-02")

	var rank int
	err = db.QueryRow(`
		SELECT COUNT(*) + 1 AS rank
		FROM games
		WHERE final_balance > $1
		AND final_balance > 0
		AND game_date_time >= $2
	`, balance, today).Scan(&rank)

	return rank, err
}
