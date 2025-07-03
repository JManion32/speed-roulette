package utils

import (
	"crypto/rand"
	"math/big"
)

func GenerateNum() int {
	max := big.NewInt(38)
	n, err := rand.Int(rand.Reader, max)
	if err != nil {
		panic(err)
	}
	return int(n.Int64())
}
