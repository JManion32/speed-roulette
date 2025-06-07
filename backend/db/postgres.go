package db

import (
	"database/sql"
	"fmt"
	"log"

	//"speed-roulette/backend/models"

	_ "github.com/lib/pq"
)

// Connection parameters - replace with environment variables in production
const (
	host     = "localhost"
	port     = 5432
	user     = "postgres"
	password = "your-password"
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
		end_time TIMESTAMP,
		game_date DATE DEFAULT CURRENT_DATE,
		final_balance DECIMAL(12,2) NOT NULL,
		spins_used INTEGER NOT NULL,
		time_used INTEGER NOT NULL
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
		is_bottom_row BOOLEAN,
		time_remaining INTEGER NOT NULL
	);`

	if _, err := db.Exec(createGamesTable); err != nil {
		log.Fatal("Failed to create games table:", err)
	}

	if _, err := db.Exec(createRoundsTable); err != nil {
		log.Fatal("Failed to create rounds table:", err)
	}

	log.Println("✅ Database initialized successfully.")
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

/*
func LogRound(r models.Round) error {
	db, err := Connect()
	if err != nil {
		return err
	}
	defer db.Close()

	_, err = db.Exec(`
		INSERT INTO rounds (
			result_number, is_red, is_black, is_green,
			is_even, is_odd, is_low, is_high,
			is_first_dozen, is_second_dozen, is_third_dozen,
			is_top_row, is_middle_row, is_bottom_row,
			time_remaining
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
	`, r.ResultNumber, r.IsRed, r.IsBlack, r.IsGreen,
		r.IsEven, r.IsOdd, r.IsLow, r.IsHigh,
		r.IsFirstDozen, r.IsSecondDozen, r.IsThirdDozen,
		r.IsTopRow, r.IsMiddleRow, r.IsBottomRow,
		r.TimeRemaining)

	return err
}
*/
