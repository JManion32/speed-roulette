package tests

import (
	"testing"

	"speed-roulette/backend/models"
	"speed-roulette/backend/utils"
)

func TestSumBets(t *testing.T) {
	tests := []struct {
		name     string
		bets     []models.Bet
		expected float64
	}{
		{
			name:     "no bets",
			bets:     []models.Bet{},
			expected: 0,
		},
		{
			name: "single bet",
			bets: []models.Bet{
				{ChipValue: 5.5},
			},
			expected: 5.5,
		},
		{
			name: "multiple bets",
			bets: []models.Bet{
				{ChipValue: 1},
				{ChipValue: 2.25},
				{ChipValue: 3.75},
			},
			expected: 7.0,
		},
	}

	for _, tc := range tests {
		tc := tc // capture range variable
		t.Run(tc.name, func(t *testing.T) {
			if got := utils.SumBets(tc.bets); got != tc.expected {
				t.Fatalf("SumBets() = %v, want %v", got, tc.expected)
			}
		})
	}
}
