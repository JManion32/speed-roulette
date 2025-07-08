package middleware

import (
    "net/http"
	"os"
)

// SetupCORS modularizes this setup that is reused in several places
func SetupCORS(w *http.ResponseWriter, r *http.Request) {
	(*w).Header().Set("Access-Control-Allow-Origin", os.Getenv("CORS_ORIGIN"))
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}
