package utils

import "speed-roulette/backend/models"

// SumBets gets the sum of the bets to ensure it doesn't exceed the user's current balance
func SumBets(bets []models.Bet) float64 {
	var total float64
	for _, b := range bets {
		total += b.ChipValue
	}
	return total
}
