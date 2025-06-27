// db/stats.go
package db

import (
	"fmt"
	"time"
)

type RoundEntry struct {
	RoundID   int       `json:"round_id"`
	Number    int       `json:"number"`
	Color     string    `json:"color"`
	Parity    string    `json:"parity"`
	Half      string    `json:"half"`
	Dozen     string    `json:"dozen"`
	Row       string    `json:"row"`
	PlayedAt  time.Time `json:"played_at"`
}

func GetRounds(rangeParam string) ([]RoundEntry, error) {
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

	var results []RoundEntry
	for rows.Next() {
		var entry RoundEntry
		if err := rows.Scan(&entry.RoundID, &entry.Number, &entry.Color, &entry.Parity, &entry.Half, &entry.Dozen, &entry.Row, &entry.PlayedAt); err != nil {
			return nil, err
		}
		results = append(results, entry)
	}

	return results, nil
}
