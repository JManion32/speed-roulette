package redis

import (
	"context"
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/redis/go-redis/v9"
)

// Ctx is the global context used for Redis operations.
var Ctx = context.Background()

// Client is the Redis client instance shared across the application.
var Client *redis.Client

// InitRedis initializes and connects the global Redis client using environment configuration.
func InitRedis() {
	addr := os.Getenv("REDIS_ADDRESS")
	pass := os.Getenv("REDIS_PASSWORD")
	dbStr := os.Getenv("REDIS_DB")

	db, err := strconv.Atoi(dbStr)
	if err != nil {
		log.Fatalf("Invalid REDIS_DB: %v", err)
	}

	Client = redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: pass,
		DB:       db,
	})

	if err := Client.Ping(Ctx).Err(); err != nil {
		panic(fmt.Sprintf("Failed to connect to Redis: %v", err))
	}

	fmt.Println("Connected to Redis")
}
