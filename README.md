# ♟️ Speed Roulette

**A fast-paced browser game that puts a fast-paced twist on classic casino roulette.**

---

## 🚀 About

Inspired by the intensity of speed chess, Speed Roulette puts an interesting twist on the beloved high-stakes casino game. Players start with 
20 dollars, 10 possible spins, and just 60 seconds on the clock. When bets are submitted, the winning number is revealed, earnings are paid out, and 
the clock starts ticking again 2.5 seconds later. Compete for a spot on the daily leaderboard by making quick decisions, taking bold risks, and hitting 
big payouts.

---

## 🧰 Tech Stack

**Frontend**  
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Backend**  
![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)

**Database & Caching**  
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

**Infrastructure & DevOps**  
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)

**Tooling / Dev Dependencies**  
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Stylelint](https://img.shields.io/badge/Stylelint-263238?style=for-the-badge&logo=stylelint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)
![Cypress](https://img.shields.io/badge/Cypress-17202C?style=for-the-badge&logo=cypress&logoColor=white)  
![golangci-lint](https://img.shields.io/badge/golangci--lint-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![gofmt](https://img.shields.io/badge/gofmt-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![Go Test](https://img.shields.io/badge/go--test-00ADD8?style=for-the-badge&logo=go&logoColor=white)

---

## 🧪 Running the Project Locally

### Requirements
- Docker installed and running
- Docker Compose (v2 recommended)

### 1. Clone the repository

```bash
git clone https://github.com/JManion32/speed-roulette.git
cd speed-roulette
```

### 2. Configure the Environment
Create a `.env` file in the root directory:

```bash
ENV=development
BUILD_MODE=devserver
FRONTEND_PORT=5173

# PostgreSQL
POSTGRES_USERNAME=user
POSTGRES_PASSWORD=pass
POSTGRES_DB_NAME=speed-roulette
POSTGRES_DB_HOST=db
POSTGRES_DB_PORT=5432

# Redis
REDIS_ADDRESS=redis:6379
REDIS_PASSWORD=
REDIS_DB=0
```

### 3. Start the Full Stack

```bash
docker compose up --build
```
