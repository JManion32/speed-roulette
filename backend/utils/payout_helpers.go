package utils
import "speed-roulette/backend/models"

// Indexes of each number in the grid starting from index [1] ([0] is not a number, [1] = 92, [2] = 46, etc)
var indexes [38]int = [38]int{
	0, 92, 46, 0, 94, 48, 2, 96, 50, 4, 98, 52, 6, 100, 54, 8, 102, 56, 10,
	104, 58, 12, 106, 60, 14, 108, 62, 16, 110, 64, 18, 112, 66, 20, 114, 68, 22,
}

// Returns what is at the grid index
func GetGridIndex(result int) int {
	return indexes[result]
}

// Returns i of array containing grid indexes
func GetNum(index int) int {
	for i := range indexes {
		if indexes[i] == index {
			return i
		}
	}
	return -1
}

// For all non-exact inner bets (ex: chip placed between 7 and 10)
func GetMultiplier(bet models.Bet, result int) float64 {
	var index int

	if bet.GridIndex < 114 {
		if bet.GridIndex%2 == 0 {
			if result == GetNum(bet.GridIndex-24) || result == GetNum(bet.GridIndex-22) ||
				result == GetNum(bet.GridIndex+22) || result == GetNum(bet.GridIndex+24) {
				return 9
			}
		} else {
			if (bet.GridIndex >= 23 && bet.GridIndex <= 45) || (bet.GridIndex >= 69 && bet.GridIndex <= 91) {
				if GetGridIndex(result) == bet.GridIndex-23 || GetGridIndex(result) == bet.GridIndex+23 {
					return 18
				}
			} else {
				if GetGridIndex(result) == bet.GridIndex-1 || GetGridIndex(result) == bet.GridIndex+1 {
					return 18
				}
			}
		}
	} else {
		if bet.GridIndex%2 == 0 {
			// -22 gives the index in the bottom right of the avenue
			index = GetNum(bet.GridIndex - 22)
			if index == result || index+1 == result || index+2 == result ||
				index-1 == result || index-2 == result || index-3 == result {
				return 6
			}
		} else {
			// -23 gives the index at the bottom of the street
			index = GetNum(bet.GridIndex - 23)
			if index == result || index+1 == result || index+2 == result {
				return 12
			}
		}
	}

	return 0
}

// Red/Black/Even/Odd/Half/Dozen/Row Helpers

func IsRed(number int) bool {
	redNumbers := map[int]bool{
		1: true, 3: true, 5: true, 7: true, 9: true, 12: true,
		14: true, 16: true, 18: true, 19: true, 21: true, 23: true,
		25: true, 27: true, 30: true, 32: true, 34: true, 36: true,
	}
	return redNumbers[number]
}

func IsBlack(number int) bool {
	return number > 0 && number <= 36 && !IsRed(number)
}

func IsEven(number int) bool {
	return number > 0 && number <= 36 && number%2 == 0
}

func IsOdd(number int) bool {
	return number > 0 && number <= 36 && number%2 == 1
}

func IsLow(number int) bool {
	return number >= 1 && number <= 18
}

func IsHigh(number int) bool {
	return number >= 19 && number <= 36
}

func GetDozenNum(number int) int {
	if number >= 1 && number <= 12 {
		return 0
	} else if number >= 13 && number <= 24 {
		return 1
	} else if number >= 25 && number <= 36 {
		return 2
	}
	return -1
}

func GetRowNum(number int) int {
	if number == 0 || number == 37 {
		return -1
	}
	switch number % 3 {
	case 1:
		return 2 // Bottom row
	case 2:
		return 1 // Middle row
	case 0:
		return 0 // Top row
	}
	return -1
}