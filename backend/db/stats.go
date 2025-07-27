package db

import (
	"fmt"
	"time"

	"speed-roulette/backend/models"
)

// GetAllStats queries all numbers and their properties within each range (Today, This Week, This Month, This Year)
func GetAllStats(rangeParam string) (*models.AllStats, error) {
	db, err := Connect()
	if err != nil {
		return nil, err
	}
	defer db.Close()

	loc, _ := time.LoadLocation("America/New_York")
	now := time.Now().In(loc)
	var timeBoundary string

	switch rangeParam {
	case "today":
		today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, loc).UTC()
		timeBoundary = today.Format("2006-01-02 15:04:05")

	case "week":
		offset := (int(now.Weekday()) + 6) % 7
		weekStart := time.Date(now.Year(), now.Month(), now.Day()-offset, 0, 0, 0, 0, loc).UTC()
		timeBoundary = weekStart.Format("2006-01-02 15:04:05")

	case "month":
		monthStart := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, loc).UTC()
		timeBoundary = monthStart.Format("2006-01-02 15:04:05")

	case "allTime":
		timeBoundary = ""

	default:
		return nil, fmt.Errorf("invalid range value")
	}

	// For non-"allTime" cases, apply WHERE filter to raw stats query
	var statsTimeCondition string
	if timeBoundary != "" {
		statsTimeCondition = fmt.Sprintf("WHERE round_date_time >= '%s'", timeBoundary)
	}

	query := fmt.Sprintf(`
		SELECT number, color, parity, half, dozen, row
		FROM rounds
		%s;
	`, statsTimeCondition)

	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	stats := &models.AllStats{
		ColorCounts:    make(map[string]int),
		ParityCounts:   make(map[string]int),
		HalfCounts:     make(map[string]int),
		DozenCounts:    make(map[string]int),
		RowCounts:      make(map[string]int),
		HottestNumbers: []models.NumberCount{},
		ColdestNumbers: []models.NumberCount{},
		NumSpins:       0,
		CompletedGames: 0,
		TotalWon:       0,
	}

	numCounts := make(map[int]int)

	for rows.Next() {
		var number int
		var color, parity, half, dozen, row string
		if err := rows.Scan(&number, &color, &parity, &half, &dozen, &row); err != nil {
			return nil, err
		}

		stats.ColorCounts[color]++
		stats.ParityCounts[parity]++
		stats.HalfCounts[half]++
		stats.DozenCounts[dozen]++
		stats.RowCounts[row]++
		numCounts[number]++
		stats.NumSpins++
	}

	// Count completed games
	var gamesQuery string
	if timeBoundary == "" {
		gamesQuery = `SELECT COUNT(*) FROM games`
	} else {
		gamesQuery = fmt.Sprintf(`SELECT COUNT(*) FROM games WHERE game_date_time >= '%s'`, timeBoundary)
	}

	err = db.QueryRow(gamesQuery).Scan(&stats.CompletedGames)
	if err != nil {
		return nil, err
	}

	var totalQuery string
	if timeBoundary == "" {
		totalQuery = `SELECT COALESCE(SUM(final_balance), 0) FROM games`
	} else {
		totalQuery = fmt.Sprintf(`SELECT COALESCE(SUM(final_balance), 0) FROM games WHERE game_date_time >= '%s'`, timeBoundary)
	}

	err = db.QueryRow(totalQuery).Scan(&stats.TotalWon)
	if err != nil {
		return nil, err
	}

	// Get hottest numbers
	var hottestQuery string
	if timeBoundary == "" {
		hottestQuery = `
			SELECT n.number, COUNT(r.number) AS count
			FROM numbers n
			LEFT JOIN rounds r ON n.number = r.number
			GROUP BY n.number
			ORDER BY count DESC,
         		CASE WHEN n.number = 37 THEN -1 ELSE n.number END ASC
			LIMIT 7;
		`
	} else {
		hottestQuery = fmt.Sprintf(`
			SELECT n.number, COUNT(r.number) AS count
			FROM numbers n
			LEFT JOIN rounds r ON n.number = r.number AND r.round_date_time >= '%s'
			GROUP BY n.number
			ORDER BY count DESC,
         		CASE WHEN n.number = 37 THEN -1 ELSE n.number END ASC
			LIMIT 7;
		`, timeBoundary)
	}

	rows, err = db.Query(hottestQuery)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	hottestSet := make(map[int]bool)
	for rows.Next() {
		var number, count int
		if err := rows.Scan(&number, &count); err != nil {
			return nil, err
		}
		stats.HottestNumbers = append(stats.HottestNumbers, models.NumberCount{Number: number, Count: count})
		hottestSet[number] = true
	}
	rows.Close()

	// Coldest numbers (excluding hottest)
	var coldestQuery string
	if timeBoundary == "" {
		coldestQuery = `
			SELECT n.number, COUNT(r.number) AS count
			FROM numbers n
			LEFT JOIN rounds r ON n.number = r.number
			GROUP BY n.number
			ORDER BY count ASC,
        		CASE WHEN n.number = 37 THEN -1 ELSE n.number END ASC

		`
	} else {
		coldestQuery = fmt.Sprintf(`
			SELECT n.number, COUNT(r.number) AS count
			FROM numbers n
			LEFT JOIN rounds r ON n.number = r.number AND r.round_date_time >= '%s'
			GROUP BY n.number
			ORDER BY count ASC,
        		CASE WHEN n.number = 37 THEN -1 ELSE n.number END ASC
		`, timeBoundary)
	}

	rows, err = db.Query(coldestQuery)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var number, count int
		if err := rows.Scan(&number, &count); err != nil {
			return nil, err
		}
		if hottestSet[number] {
			continue
		}
		stats.ColdestNumbers = append(stats.ColdestNumbers, models.NumberCount{Number: number, Count: count})
		if len(stats.ColdestNumbers) == 7 {
			break
		}
	}

	return stats, nil
}

// GetPlayerRank returns the player's daily rank
func GetPlayerRank(balance float64) (int, error) {
	db, err := Connect()
	if err != nil {
		return 0, err
	}
	defer db.Close()

	loc, _ := time.LoadLocation("America/New_York")
	now := time.Now().In(loc)
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, loc).UTC().Format("2006-01-02 15:04:05")

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
