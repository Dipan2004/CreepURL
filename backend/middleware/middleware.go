package middleware

import (
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func SetupMiddleware(app *fiber.App) {
	app.Use(recover.New())

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST,OPTIONS",
		AllowHeaders: "Content-Type,Authorization",
	}))

	app.Use(requestLogger)
}

func requestLogger(c *fiber.Ctx) error {
	start := time.Now()
	err := c.Next()
	duration := time.Since(start)

	log.Printf("[%s] %s %s — %d (%s)",
		c.Method(),
		c.Path(),
		c.IP(),
		c.Response().StatusCode(),
		duration,
	)

	return err
}