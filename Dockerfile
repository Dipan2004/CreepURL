FROM golang:1.21-alpine AS builder

WORKDIR /src

COPY backend/go.mod backend/go.sum ./backend/
WORKDIR /src/backend
RUN go mod download

COPY backend/ ./

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o /out/creepurl main.go

FROM alpine:3.20

WORKDIR /app

RUN adduser -D -u 10001 appuser && chown appuser:appuser /app

COPY --from=builder --chown=appuser:appuser /out/creepurl ./creepurl
COPY --chown=appuser:appuser backend/database ./database

ENV PORT=7860
ENV DB_PATH=./creepurl.db

EXPOSE 7860

USER appuser

CMD ["./creepurl"]
