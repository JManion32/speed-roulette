package game

import (
    "math/rand"
    "time"
)

// GenerateNum generates a random roulette result
func GenerateNum() int {
    rand.Seed(time.Now().UnixNano())
    return rand.Intn(38) // 0-37 where 37 represents 00
}