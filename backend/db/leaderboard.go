// db/leaderboard.go
package db

import (
	"fmt"
	"time"
)

type LeaderboardEntry struct {
	Nickname     string 	`json:"nickname"`
	FinalBalance float64	`json:"final_balance"`
	RemTime      int        `json:"rem_time"`
	RemSpins     int        `json:"rem_spins"`
	PlayedAt     time.Time  `json:"played_at"`
}

func GetLeaderboard(rangeParam string) ([]LeaderboardEntry, error) {
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
			SELECT nickname, final_balance, rem_time, rem_spins, game_date_time
			FROM games
			WHERE final_balance > 0 AND game_date_time >= '%s'
			ORDER BY final_balance DESC
			LIMIT 100;
		`, today.Format("2006-01-02"))
	case "week":
		weekStart := today.AddDate(0, 0, -int(today.Weekday()))
		query = fmt.Sprintf(`
			SELECT nickname, final_balance, rem_time, rem_spins, game_date_time
			FROM games
			WHERE final_balance > 0 AND game_date_time >= '%s'
			ORDER BY final_balance DESC
			LIMIT 100;
		`, weekStart.Format("2006-01-02"))
	case "month":
		monthStart := time.Date(today.Year(), today.Month(), 1, 0, 0, 0, 0, time.Local)
		query = fmt.Sprintf(`
			SELECT nickname, final_balance, rem_time, rem_spins, game_date_time
			FROM games
			WHERE final_balance > 0 AND game_date_time >= '%s'
			ORDER BY final_balance DESC
			LIMIT 100;
		`, monthStart.Format("2006-01-02"))
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

	var results []LeaderboardEntry
	for rows.Next() {
		var entry LeaderboardEntry
		if err := rows.Scan(&entry.Nickname, &entry.FinalBalance, &entry.RemTime, &entry.RemSpins, &entry.PlayedAt); err != nil {
			return nil, err
		}
		results = append(results, entry)
	}

	return results, nil
}
