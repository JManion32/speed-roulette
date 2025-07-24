package db

import (
	"fmt"
	"time"

	"speed-roulette/backend/models"
)

// GetLeaderboard returns a query for each date range (Today, This Week, This Month, This Year)
func GetLeaderboard(rangeParam string) ([]models.LeaderboardEntry, error) {
	db, err := Connect()
	if err != nil {
		return nil, err
	}
	defer db.Close()

	var query string

	// Use America/New_York for consistent local time logic
	loc, _ := time.LoadLocation("America/New_York")
	now := time.Now().In(loc)

	switch rangeParam {
	case "today":
		today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, loc).UTC()
		query = fmt.Sprintf(`
			SELECT nickname, final_balance, rem_time, rem_spins, game_date_time
			FROM games
			WHERE final_balance > 0 AND game_date_time >= '%s'
			ORDER BY final_balance DESC
			LIMIT 100;
		`, today.Format("2006-01-02 15:04:05"))

	case "week":
		offset := (int(now.Weekday()) + 6) % 7 // Monday = 0
		weekStart := time.Date(now.Year(), now.Month(), now.Day()-offset, 0, 0, 0, 0, loc).UTC()
		query = fmt.Sprintf(`
			SELECT nickname, final_balance, rem_time, rem_spins, game_date_time
			FROM games
			WHERE final_balance > 0 AND game_date_time >= '%s'
			ORDER BY final_balance DESC
			LIMIT 100;
		`, weekStart.Format("2006-01-02 15:04:05"))

	case "month":
		monthStart := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, loc).UTC()
		query = fmt.Sprintf(`
			SELECT nickname, final_balance, rem_time, rem_spins, game_date_time
			FROM games
			WHERE final_balance > 0 AND game_date_time >= '%s'
			ORDER BY final_balance DESC
			LIMIT 100;
		`, monthStart.Format("2006-01-02 15:04:05"))

	case "allTime":
		query = `
			SELECT nickname, final_balance, rem_time, rem_spins, game_date_time
			FROM games
			WHERE final_balance > 0
			ORDER BY final_balance DESC
			LIMIT 100;`

	default:
		return nil, fmt.Errorf("invalid range value")
	}

	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []models.LeaderboardEntry
	for rows.Next() {
		var entry models.LeaderboardEntry
		if err := rows.Scan(&entry.Nickname, &entry.FinalBalance, &entry.RemTime, &entry.RemSpins, &entry.PlayedAt); err != nil {
			return nil, err
		}
		results = append(results, entry)
	}

	return results, nil
}
