package auth

import (
	"crypto/rand"
	"encoding/hex"
)

// GenerateToken gives the user a unique token to validate their session
func GenerateToken(length int) string {
	bytes := make([]byte, length)
	_, err := rand.Read(bytes)
	if err != nil {
		panic("Failed to generate token")
	}
	return hex.EncodeToString(bytes)
}
