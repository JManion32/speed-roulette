package utils

import (
	"errors"
	"time"

	"speed-roulette/backend/redis"
)

const rateLimitTTL = 2 * time.Second

func CheckRateLimit(token string) error {
	key := "rate:" + token

	// Try to set the key with NX (only if not exists) and 2s expiry
	set, err := redis.Client.SetNX(redis.Ctx, key, 1, rateLimitTTL).Result()
	if err != nil {
		return errors.New("rate limit check failed")
	}

	if !set {
		return errors.New("too many requests: slow down")
	}

	return nil
}

func CheckIPRateLimit(ip string) error {
	key := "rate:ip:" + ip

	// Use INCR with expiry to simulate a sliding window
	count, _ := redis.Client.Incr(redis.Ctx, key).Result()
	if count == 1 {
		redis.Client.Expire(redis.Ctx, key, 10*time.Second) // Reset every 10s
	}
	if count > 20 {
		return errors.New("Too many registrations from your network. Try again shortly.")
	}

	return nil
}

// Rate Limit for viewing the leaderboard page
func CheckIPLeaderboardLimit(ip string) error {
	key := "rate:leaderboard:" + ip

	// Allow up to 10 requests per 2 seconds
	count, _ := redis.Client.Incr(redis.Ctx, key).Result()
	if count == 1 {
		redis.Client.Expire(redis.Ctx, key, 2*time.Second)
	}
	if count > 10 {
		return errors.New("Too many leaderboard requests. Try again shortly.")
	}

	return nil
}

// Rate Limit for viewing the stats page
func CheckIPStatsLimit(ip string) error {
	key := "rate:stats:" + ip

	// Allow up to 10 requests per 2 seconds
	count, _ := redis.Client.Incr(redis.Ctx, key).Result()
	if count == 1 {
		redis.Client.Expire(redis.Ctx, key, 2*time.Second)
	}
	if count > 10 {
		return errors.New("Too many stats requests. Try again shortly.")
	}

	return nil
}
