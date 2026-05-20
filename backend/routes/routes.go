package routes

import (
	"github.com/creepurl/backend/handlers"
	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App, transform *handlers.TransformHandler, redirect *handlers.RedirectHandler) {
	app.Get("/health", handlers.HealthCheck)

	api := app.Group("/api")
	api.Post("/transform", transform.Transform)
	api.Get("/stats/:slug", redirect.Stats)

	// catch-all redirect — must be last
	app.Get("/:slug", redirect.Redirect)
}