// db/stats.go
package db

import (
	"fmt"
	"time"

	//"speed-roulette/backend/models"
)

type NumberCount struct {
	Number int `json:"number"`
	Count  int `json:"count"`
}

type RoundStats struct {
	ColorCounts    map[string]int `json:"colorCounts"`
	ParityCounts   map[string]int `json:"parityCounts"`
	HalfCounts     map[string]int `json:"halfCounts"`
	DozenCounts    map[string]int `json:"dozenCounts"`
	RowCounts      map[string]int `json:"rowCounts"`
	HottestNumbers []NumberCount  `json:"hottestNumbers"`
	ColdestNumbers []NumberCount  `json:"coldestNumbers"`
}

func GetRoundsStats(rangeParam string) (*RoundStats, error) {
	db, err := Connect()
	if err != nil {
		return nil, err
	}
	defer db.Close()

	var timeBoundary string
	today := time.Now().Truncate(24 * time.Hour)

	switch rangeParam {
	case "today":
		timeBoundary = today.Format("2006-01-02")
	case "week":
		weekStart := today.AddDate(0, 0, -int(today.Weekday()))
		timeBoundary = weekStart.Format("2006-01-02")
	case "month":
		monthStart := time.Date(today.Year(), today.Month(), 1, 0, 0, 0, 0, time.Local)
		timeBoundary = monthStart.Format("2006-01-02")
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

	stats := &RoundStats{
		ColorCounts:    make(map[string]int),
		ParityCounts:   make(map[string]int),
		HalfCounts:     make(map[string]int),
		DozenCounts:    make(map[string]int),
		RowCounts:      make(map[string]int),
		HottestNumbers: []NumberCount{},
		ColdestNumbers: []NumberCount{},
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
	}

	// Step 1: Get hottest numbers
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
		stats.HottestNumbers = append(stats.HottestNumbers, NumberCount{Number: number, Count: count})
		hottestSet[number] = true
	}
	rows.Close()

	// Step 2: Coldest numbers (excluding hottest)
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
		stats.ColdestNumbers = append(stats.ColdestNumbers, NumberCount{Number: number, Count: count})
		if len(stats.ColdestNumbers) == 7 {
			break
		}
	}

	return stats, nil
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
