package utils

import "speed-roulette/backend/models"

func SumBets(bets []models.Bet) float64 {
	var total float64
	for _, b := range bets {
		total += b.ChipValue
	}
	return total
}
