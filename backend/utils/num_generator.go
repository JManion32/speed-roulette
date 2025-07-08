package utils

import (
	"crypto/rand"
	"math/big"
)

// GenerateNum generates a random number 0 - 37 where 37 represents 00
func GenerateNum() int {
	max := big.NewInt(38)
	n, err := rand.Int(rand.Reader, max)
	if err != nil {
		panic(err)
	}
	return int(n.Int64())
}
