package handlers

import (
	"log"

	"github.com/creepurl/backend/services"
	"github.com/gofiber/fiber/v2"
)

type TransformHandler struct {
	service *services.TransformService
}

func NewTransformHandler(service *services.TransformService) *TransformHandler {
	return &TransformHandler{service: service}
}

func (h *TransformHandler) Transform(c *fiber.Ctx) error {
	var req struct {
		URL              string `json:"url"`
		DestructionLevel int    `json:"destruction_level"`
	}

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   "invalid_request",
			"message": "Request body could not be parsed",
		})
	}

	if req.DestructionLevel == 0 {
		req.DestructionLevel = 3
	}

	result, err := h.service.Transform(req.URL, req.DestructionLevel, c.BaseURL())
	if err != nil {
		log.Printf("Transform error: %v", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   "transform_failed",
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(result)
}

func HealthCheck(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"status":  "operational",
		"version": "1.0.0",
	})
}
