package middleware

import (
	"net/http"
	"strings"

	"speed-roulette/backend/redis"
)

// RequireAuth protects API endpoints in the game by ensuring tokens are valid
func RequireAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		token := r.Header.Get("Authorization")
		token = strings.TrimPrefix(token, "Bearer ")

		if token == "" {
			http.Error(w, "Missing token", http.StatusUnauthorized)
			return
		}

		nickname, err := redis.Client.Get(redis.Ctx, "token:"+token).Result()
		if err != nil {
			http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
			return
		}

		r.Header.Set("X-Nickname", nickname)

		next(w, r)
	}
}
