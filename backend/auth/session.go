package auth

import (
	"errors"
	"fmt"
	"net/http"
	"speed-roulette/backend/redis"
	"strings"
)

// ExtractToken extracts and returns the token string from the Authorization header.
func ExtractToken(r *http.Request) (string, error) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return "", errors.New("missing Authorization header")
	}

	parts := strings.Split(authHeader, "Bearer ")
	if len(parts) != 2 {
		return "", errors.New("invalid Authorization header format")
	}

	return strings.TrimSpace(parts[1]), nil
}

// GetNicknameFromToken gets nickname from Redis using the token
func GetNicknameFromToken(r *http.Request) (string, error) {
	token, err := ExtractToken(r)
	if err != nil {
		return "", err
	}

	nickname, err := redis.Client.Get(redis.Ctx, "token:"+token).Result()
	if err != nil {
		return "", errors.New("invalid or expired token")
	}

	return nickname, nil
}

// GetBalanceFromToken gets balance from Redis using the token
func GetBalanceFromToken(r *http.Request) (float64, error) {
	token, err := ExtractToken(r)
	if err != nil {
		return 0, err
	}

	balanceStr, err := redis.Client.Get(redis.Ctx, "balance:"+token).Result()
	if err != nil {
		return 0, errors.New("invalid or expired balance token")
	}

	balance, err := parseBalance(balanceStr)
	if err != nil {
		return 0, errors.New("malformed balance in Redis")
	}

	return balance, nil
}

// Helper to safely parse balance
func parseBalance(balanceStr string) (float64, error) {
	var val float64
	_, err := fmt.Sscanf(balanceStr, "%f", &val)
	return val, err
}

// ValidateAndGetBalance prevents invalid balances that could give the user an unfair advantage
func ValidateAndGetBalance(r *http.Request, totalBet float64) (string, float64, error) {
	token, err := ExtractToken(r)
	if err != nil {
		return "", 0, err
	}

	balance, err := GetBalanceFromToken(r)
	if err != nil {
		return "", 0, err
	}

	if totalBet > balance {
		return "", 0, errors.New("bet exceeds user balance")
	}

	return token, balance, nil
}
