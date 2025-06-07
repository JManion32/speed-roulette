package models

/*
-  validates submit bets
-  generates the random number
-  keeps track of the time
-  handles submit bets
-  round ends when user is out of money, time expires, or spins stop
-  tracks last numbers (array at the bottom)
-  holds game configuration settings (starting amount, timing)
*/

import (
    "math/rand"
    "time"
)

// GenerateNum generates a random roulette result
func GenerateNum() int {
    rand.Seed(time.Now().UnixNano())
    return rand.Intn(38) // 0-37 where 37 represents 00
}