// db/stats.go
package db

import (
	"fmt"
	"sort"
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

	var timeCondition string
	today := time.Now().Truncate(24 * time.Hour)

	switch rangeParam {
	case "today":
		timeCondition = fmt.Sprintf("WHERE round_date_time >= '%s'", today.Format("2006-01-02"))
	case "week":
		weekStart := today.AddDate(0, 0, -int(today.Weekday()))
		timeCondition = fmt.Sprintf("WHERE round_date_time >= '%s'", weekStart.Format("2006-01-02"))
	case "month":
		monthStart := time.Date(today.Year(), today.Month(), 1, 0, 0, 0, 0, time.Local)
		timeCondition = fmt.Sprintf("WHERE round_date_time >= '%s'", monthStart.Format("2006-01-02"))
	case "allTime":
		timeCondition = ""
	default:
		return nil, fmt.Errorf("invalid range value")
	}

	query := fmt.Sprintf(`
		SELECT number, color, parity, half, dozen, row
		FROM rounds
		%s;
	`, timeCondition)

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

	// Sort numbers by frequency
	var sorted []NumberCount
	for number, count := range numCounts {
		sorted = append(sorted, NumberCount{Number: number, Count: count})
	}
	sort.Slice(sorted, func(i, j int) bool {
		return sorted[i].Count > sorted[j].Count
	})

	for i := 0; i < 5 && i < len(sorted); i++ {
		stats.HottestNumbers = append(stats.HottestNumbers, sorted[i])
	}
	for i := len(sorted) - 1; i >= 0 && len(stats.ColdestNumbers) < 5; i-- {
		stats.ColdestNumbers = append(stats.ColdestNumbers, sorted[i])
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
