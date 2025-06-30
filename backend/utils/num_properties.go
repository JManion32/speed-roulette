package utils

import (
	"speed-roulette/backend/models"
)

func GetNumProperties(num int) models.NumProperties {
	return models.NumProperties{
		Color:  GetColor(num),
		Parity: GetParity(num),
		Half:   GetHalf(num),
		Dozen:  GetDozen(num),
		Row:    GetRow(num),
	}
}

func GetColor(num int) string {
	if isRed(num) {
		return "red"
	} else if isBlack(num) {
		return "black"
	}
	return "green"
}

func GetParity(num int) string {
	if num >= 2 && num <= 36 && num%2 == 0 {
		return "even"
	} else if num >= 1 && num <= 35 && num%2 == 1 {
		return "odd"
	}
	return "none"
}

func GetHalf(num int) string {
	if num >= 1 && num <= 18 {
		return "low"
	} else if num >= 19 && num <= 36 {
		return "high"
	}
	return "none"
}

func GetDozen(num int) string {
	if num >= 1 && num <= 12 {
		return "first"
	} else if num >= 13 && num <= 24 {
		return "second"
	} else if num >= 25 && num <= 36 {
		return "third"
	}
	return "none"
}

func GetRow(num int) string {
	if isTopRow(num) {
		return "top"
	} else if isMiddleRow(num) {
		return "middle"
	} else if isBottomRow(num) {
		return "bottom"
	}
	return "none"
}


// =-=-=-=-=-=-=-=-=-=-
// Helper functions
// =-=-=-=-=-=-=-=-=-=-

func isRed(number int) bool {
	redNumbers := map[int]bool{
		1: true, 3: true, 5: true, 7: true, 9: true, 12: true,
		14: true, 16: true, 18: true, 19: true, 21: true, 23: true,
		25: true, 27: true, 30: true, 32: true, 34: true, 36: true,
	}
	return redNumbers[number]
}

func isBlack(number int) bool {
	blackNumbers := map[int]bool{
		2: true, 4: true, 6: true, 8: true, 10: true, 11: true,
		13: true, 15: true, 17: true, 20: true, 22: true, 24: true,
		26: true, 28: true, 29: true, 31: true, 33: true, 35: true,
	}
	return blackNumbers[number]
}

func isTopRow(number int) bool {
	topRow := map[int]bool{
		3: true, 6: true, 9: true, 12: true, 15: true, 18: true,
		21: true, 24: true, 27: true, 30: true, 33: true, 36: true,
	}
	return topRow[number]
}

func isMiddleRow(number int) bool {
	middleRow := map[int]bool{
		2: true, 5: true, 8: true, 11: true, 14: true, 17: true,
		20: true, 23: true, 26: true, 29: true, 32: true, 35: true,
	}
	return middleRow[number]
}

func isBottomRow(number int) bool {
	bottomRow := map[int]bool{
		1: true, 4: true, 7: true, 10: true, 13: true, 16: true,
		19: true, 22: true, 25: true, 28: true, 31: true, 34: true,
	}
	return bottomRow[number]
}

