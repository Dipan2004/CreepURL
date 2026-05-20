package handlers

import (
	"log"

	"github.com/creepurl/backend/services"
	"github.com/gofiber/fiber/v2"
)

type RedirectHandler struct {
	shortener *services.ShortenerService
}

func NewRedirectHandler(shortener *services.ShortenerService) *RedirectHandler {
	return &RedirectHandler{shortener: shortener}
}

func (h *RedirectHandler) Redirect(c *fiber.Ctx) error {
	slug := c.Params("slug")
	if slug == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   "missing_slug",
			"message": "No slug provided",
		})
	}

	link, err := h.shortener.Lookup(slug)
	if err != nil {
		log.Printf("Redirect lookup error for slug %q: %v", slug, err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   "lookup_error",
			"message": "Internal error during redirect",
		})
	}

	if link == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error":   "slug_not_found",
			"message": "This URL has dissolved into the void",
		})
	}

	return c.Redirect(link.OriginalURL, fiber.StatusMovedPermanently)
}

func (h *RedirectHandler) Stats(c *fiber.Ctx) error {
	slug := c.Params("slug")
	if slug == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   "missing_slug",
			"message": "No slug provided",
		})
	}

	link, err := h.shortener.Stats(slug)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   "stats_error",
			"message": "Failed to retrieve stats",
		})
	}

	if link == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error":   "slug_not_found",
			"message": "Slug not found in the corruption registry",
		})
	}

	return c.JSON(fiber.Map{
		"slug":            link.CreepySlug,
		"original_url":    link.OriginalURL,
		"full_short_url":  link.FullShortURL,
		"click_count":     link.ClickCount,
		"created_at":      link.CreatedAt,
		"last_clicked_at": link.LastClickedAt,
	})
}