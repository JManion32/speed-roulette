package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"strconv"

	_ "github.com/lib/pq" // Import pq driver anonymously so its init() registers it with database/sql
)

// Connect establishes a connection to the PostgreSQL database
func Connect() (*sql.DB, error) {
	host := os.Getenv("POSTGRES_DB_HOST")
	portStr := os.Getenv("POSTGRES_DB_PORT")
	user := os.Getenv("POSTGRES_USERNAME")
	password := os.Getenv("POSTGRES_PASSWORD")
	dbname := os.Getenv("POSTGRES_DB_NAME")

	port, err := strconv.Atoi(portStr)
	if err != nil {
		return nil, fmt.Errorf("invalid DB_PORT: %s", portStr)
	}

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

	if _, err := db.Exec(`SET TIME ZONE 'America/New_York'`); err != nil {
		log.Fatal("Failed to set time zone:", err)
	}

	createGamesTable := `
		CREATE TABLE IF NOT EXISTS games (
			game_id SERIAL PRIMARY KEY,
			nickname VARCHAR(50) NOT NULL,
			final_balance NUMERIC(12,2) NOT NULL,
			rem_spins INTEGER NOT NULL,
			rem_time INTEGER NOT NULL,
			game_date_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
		);`

	if _, err := db.Exec(createGamesTable); err != nil {
		log.Fatal("Failed to create games table:", err)
	}

	createRoundsTable := `
		CREATE TABLE IF NOT EXISTS rounds (
			round_id SERIAL PRIMARY KEY,
			number INTEGER NOT NULL,
			color VARCHAR(10),
			parity VARCHAR(10),
			half VARCHAR(10),
			dozen VARCHAR(10),
			row VARCHAR(10),
			round_date_time TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
		);`
	
	if _, err := db.Exec(createRoundsTable); err != nil {
		log.Fatal("Failed to create rounds table:", err)
	}

	createNumbersTable := `
		CREATE TABLE IF NOT EXISTS numbers (
			number INTEGER PRIMARY KEY
		);`
	
	if _, err := db.Exec(createNumbersTable); err != nil {
		log.Fatal("Failed to create numbers table:", err)
	}

	populateNumbers := `
		INSERT INTO numbers (number)
		SELECT i FROM generate_series(0, 37) AS s(i)
		ON CONFLICT DO NOTHING;
	`

	if _, err := db.Exec(populateNumbers); err != nil {
		log.Fatal("Failed to populate numbers table:", err)
	}

	// Indexes to speed up stats queries on the rounds table
	createIndexes := []string{
		`CREATE INDEX IF NOT EXISTS idx_rounds_number ON rounds(number);`,
		`CREATE INDEX IF NOT EXISTS idx_rounds_color ON rounds(color);`,
		`CREATE INDEX IF NOT EXISTS idx_rounds_parity ON rounds(parity);`,
		`CREATE INDEX IF NOT EXISTS idx_rounds_half ON rounds(half);`,
		`CREATE INDEX IF NOT EXISTS idx_rounds_dozen ON rounds(dozen);`,
		`CREATE INDEX IF NOT EXISTS idx_rounds_row ON rounds(row);`,
		`CREATE INDEX IF NOT EXISTS idx_rounds_date ON rounds(round_date_time);`,
	}

	for _, indexQuery := range createIndexes {
		if _, err := db.Exec(indexQuery); err != nil {
			log.Printf("Warning: Failed to create index: %s — %v", indexQuery, err)
		}
	}

	log.Println("Database initialized successfully.")
}

// InsertRound adds the round to the rounds table (a round is the spin of a num)
func InsertRound(num int, color, parity, half, dozen, row string) error {
	db, err := Connect()
	if err != nil {
		return err
	}
	defer db.Close()

	var roundID int
	err = db.QueryRow(`
		INSERT INTO rounds (number, color, parity, half, dozen, row)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING round_id
	`, num, color, parity, half, dozen, row).Scan(&roundID)

	return err
}

// InsertGame adds the game result to the games table (for leaderboard)
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
