package auth

import (
	"net/http"
	"strings"
)

// GetClientIP extracts client IP even behind a proxy
func GetClientIP(r *http.Request) string {
	// Check X-Forwarded-For first (used by proxies)
	if forwarded := r.Header.Get("X-Forwarded-For"); forwarded != "" {
		// It's a comma-separated list: take the first one
		parts := strings.Split(forwarded, ",")
		return strings.TrimSpace(parts[0])
	}
	// Fall back to remote address
	ip := strings.Split(r.RemoteAddr, ":")[0]
	return ip
}
