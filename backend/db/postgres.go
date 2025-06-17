package db

import (
	"database/sql"
	"fmt"
	"log"

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
		final_balance DECIMAL(12,2) NOT NULL,
		spins_used INTEGER NOT NULL,
		time_used INTEGER NOT NULL,
		game_date_time DATE DEFAULT CURRENT_DATE
	);`

	createRoundsTable := `
	CREATE TABLE IF NOT EXISTS rounds (
		round_id SERIAL PRIMARY KEY,
		game_id INTEGER REFERENCES games(game_id),
		round_number INTEGER NOT NULL,
		result_number INTEGER NOT NULL,
		is_red BOOLEAN,
		is_black BOOLEAN,
		is_green BOOLEAN,
		is_even BOOLEAN,
		is_odd BOOLEAN,
		is_low BOOLEAN,
		is_high BOOLEAN,
		is_first_dozen BOOLEAN,
		is_second_dozen BOOLEAN,
		is_third_dozen BOOLEAN,
		is_top_row BOOLEAN,
		is_middle_row BOOLEAN,
		is_bottom_row BOOLEAN
	);`

	if _, err := db.Exec(createGamesTable); err != nil {
		log.Fatal("Failed to create games table:", err)
	}

	if _, err := db.Exec(createRoundsTable); err != nil {
		log.Fatal("Failed to create rounds table:", err)
	}

	log.Println("Database initialized successfully.")
}

func InsertGame(nickname string, balance float64, turnsUsed, timeUsed int) (int, error) {
	db, err := Connect()
	if err != nil {
		return 0, err
	}
	defer db.Close()

	var gameID int
	err = db.QueryRow(`
		INSERT INTO games (nickname, final_balance, turns_used, time_used)
		VALUES ($1, $2, $3, $4)
		RETURNING game_id
	`, nickname, balance, turnsUsed, timeUsed).Scan(&gameID)
	return gameID, err
}

func GetPlayerRank(balance float64) (int, error) {
	db, err := Connect()
	if err != nil {
		return 0, err
	}
	defer db.Close()

	var rank int
	err = db.QueryRow(`
		SELECT COUNT(*) + 1 AS rank
		FROM games
		WHERE final_balance > $1
	`, balance).Scan(&rank)
	return rank, err
}
