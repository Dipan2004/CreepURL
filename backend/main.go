package main

import (
	"log"
	"os"

	"github.com/creepurl/backend/config"
	"github.com/creepurl/backend/database"
	"github.com/creepurl/backend/handlers"
	"github.com/creepurl/backend/middleware"
	"github.com/creepurl/backend/routes"
	"github.com/creepurl/backend/services"
	"github.com/gofiber/fiber/v2"
)

func main() {
	cfg := config.Load()

	db, err := database.Connect(cfg.DBPath)
	if err != nil {
		log.Fatalf("Database connection failed: %v", err)
	}
	defer db.Close()

	if err := db.Migrate(); err != nil {
		log.Fatalf("Migration failed: %v", err)
	}

	// Build services
	transformService := services.NewTransformService(db, cfg.BaseURL)
	shortenerService := services.NewShortenerService(db, cfg.BaseURL)

	// Build handlers
	transformHandler := handlers.NewTransformHandler(transformService)
	redirectHandler := handlers.NewRedirectHandler(shortenerService)

	app := fiber.New(fiber.Config{
		AppName:               "CreepURL API v1.0.0",
		DisableStartupMessage: false,
	})

	middleware.SetupMiddleware(app)
	routes.Setup(app, transformHandler, redirectHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "7860"
	}

	log.Printf("CreepURL API starting on port %s [%s]", port, cfg.Environment)
	log.Printf("Base URL : %s", cfg.BaseURL)
	log.Printf("DB file  : %s", cfg.DBPath)

	log.Fatal(app.Listen(":" + port))
}
