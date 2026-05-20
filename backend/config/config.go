package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port        string
	BaseURL     string
	DBPath      string
	Environment string
}

func Load() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, reading from environment")
	}

	return &Config{
		Port:        getEnv("PORT", "8080"),
		BaseURL:     getEnv("BASE_URL", "http://localhost:8080"),
		DBPath:      getEnv("DB_PATH", "./creepurl.db"),
		Environment: getEnv("ENVIRONMENT", "development"),
	}
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}