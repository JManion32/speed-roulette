FROM golang:latest

# Install tzdata so Go can use named timezones like America/New_York
RUN apt-get update && apt-get install -y tzdata

# Set timezone to America/New_York
ENV TZ=America/New_York

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

CMD ["go", "run", "main.go"]
