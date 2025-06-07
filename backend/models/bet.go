package models

//import "speed-roulette/backend/logproxy"

// Corner rules and multiple grids make this especially difficult, need a system
func Payout(bets []Bet, result int) float64 {
	var payout float64 = 0
	for _, bet := range bets {
		switch bet.GridID {
		case "inner":
			if bet.GridIndex == GetGridIndex(result) {
				payout += bet.ChipValue * 36
			}
			payout += bet.ChipValue * GetMultiplier(bet, result)
		case "zeros-split":
			switch bet.GridIndex {
			case 0:
				if result == 0 || result == 3 {
					payout += bet.ChipValue * 18
				}
			case 1:
				if result == 0 || result == 2 || result == 3 {
					payout += bet.ChipValue * 12
				}
			case 2:
				if result == 0 || result == 2 {
					payout += bet.ChipValue * 18
				}
			case 3:
				if result == 0 || result == 2 || result == 37 {
					payout += bet.ChipValue * 18
				}
			case 4:
				if result == 2 || result == 37 {
					payout += bet.ChipValue * 18
				}
			case 5:
				if result == 1 || result == 2 || result == 37 {
					payout += bet.ChipValue * 12
				}
			case 6:
				if result == 1 || result == 37 {
					payout += bet.ChipValue * 18
				}
			// Basket case
			case 7:
				if result == 0 || result == 1 || result == 2 ||
					result == 3 || result == 37 {
					payout += bet.ChipValue * 6
				}
			}
		case "zeros":
			if bet.GridIndex == 0 && result == 0 {
				payout += bet.ChipValue * 36
			} else if bet.GridIndex == 1 && (result == 0 || result == 37) {
				payout += bet.ChipValue * 18
			} else if bet.GridIndex == 2 && result == 37 {
				payout += bet.ChipValue * 36
			}
		case "dozens":
			if bet.GridIndex == GetDozen(result) {
				payout += bet.ChipValue * 3
			}
		case "rows":
			if bet.GridIndex == GetRow(result) {
				payout += bet.ChipValue * 3
			}
		case "outer":
			switch bet.GridIndex {
			case 0:
				if IsLow(result) {
					payout += bet.ChipValue * 2
				}
			case 1:
				if IsEven(result) {
					payout += bet.ChipValue * 2
				}
			case 2:
				if IsRed(result) {
					payout += bet.ChipValue * 2
				}
			case 3:
				if IsBlack(result) {
					payout += bet.ChipValue * 2
				}
			case 4:
				if IsOdd(result) {
					payout += bet.ChipValue * 2
				}
			case 5:
				if IsHigh(result) {
					payout += bet.ChipValue * 2
				}
			}
		}
	}
	
	//logproxy.SaveRound(result)

	return payout
}