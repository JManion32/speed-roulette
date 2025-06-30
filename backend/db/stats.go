// db/stats.go
package db

import (
	"fmt"
	"time"

	"speed-roulette/backend/models"
)

func GetRounds(rangeParam string) ([]models.RoundEntry, error) {
	db, err := Connect()
	if err != nil {
		return nil, err
	}
	defer db.Close()

	var query string
	today := time.Now().Truncate(24 * time.Hour)
	switch rangeParam {
	case "today":
		query = fmt.Sprintf(`
			SELECT round_id, number, color, parity, half, dozen, row, round_date_time
			FROM rounds
			WHERE round_date_time >= '%s'
			ORDER BY round_date_time DESC
			LIMIT 100;
		`, today.Format("2006-01-02"))
	case "week":
		weekStart := today.AddDate(0, 0, -int(today.Weekday()))
		query = fmt.Sprintf(`
			SELECT round_id, number, color, parity, half, dozen, row, round_date_time
			FROM rounds
			WHERE round_date_time >= '%s'
			ORDER BY round_date_time DESC
			LIMIT 100;
		`, weekStart.Format("2006-01-02"))
	case "month":
		monthStart := time.Date(today.Year(), today.Month(), 1, 0, 0, 0, 0, time.Local)
		query = fmt.Sprintf(`
			SELECT round_id, number, color, parity, half, dozen, row, round_date_time
			FROM rounds
			WHERE round_date_time >= '%s'
			ORDER BY round_date_time DESC
			LIMIT 100;
		`, monthStart.Format("2006-01-02"))
	case "allTime":
		query = `
			SELECT round_id, number, color, parity, half, dozen, row, round_date_time
			FROM rounds
			ORDER BY round_date_time DESC
			LIMIT 100;`
	default:
		return nil, fmt.Errorf("invalid range value")
	}

	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []models.RoundEntry
	for rows.Next() {
		var entry models.RoundEntry
		if err := rows.Scan(&entry.RoundID, &entry.Number, &entry.Color, &entry.Parity, &entry.Half, &entry.Dozen, &entry.Row, &entry.PlayedAt); err != nil {
			return nil, err
		}
		results = append(results, entry)
	}

	return results, nil
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
