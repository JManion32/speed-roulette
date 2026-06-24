# Speed Roulette
[![CI](https://github.com/JManion32/speed-roulette/actions/workflows/ci.yml/badge.svg)](https://github.com/JManion32/speed-roulette/actions/workflows/ci.yml)

A fast-paced browser game that puts a twist on classic casino roulette.

---

## About

Inspired by the intensity of speed chess, Speed Roulette puts an interesting twist on the beloved high-stakes casino game. Players start with 
**20** dollars, **10** possible spins, and just **60** seconds on the clock. When bets are submitted, the winning number is revealed, earnings are paid out, and 
the clock starts ticking again just **2.5** seconds later.

Compete for a spot on the daily leaderboard by making quick decisions, taking bold risks, and hitting 
big payouts!

---

## Tech Stack

### Frontend  
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

### Backend 
![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)

### Database & Caching 
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

### Infrastructure & DevOps 
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![DigitalOcean](https://img.shields.io/badge/DigitalOcean-0080FF?style=for-the-badge&logo=digitalocean&logoColor=white)
![Route 53](https://img.shields.io/badge/AWS_Route_53-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)  
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![Certbot](https://img.shields.io/badge/Certbot-003A70?style=for-the-badge&logo=letsencrypt&logoColor=white)

### Tooling / Dev Dependencies
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Stylelint](https://img.shields.io/badge/Stylelint-263238?style=for-the-badge&logo=stylelint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)
![Cypress](https://img.shields.io/badge/Cypress-17202C?style=for-the-badge&logo=cypress&logoColor=white)  
![golangci-lint](https://img.shields.io/badge/golangci--lint-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![gofmt](https://img.shields.io/badge/gofmt-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![Go Test](https://img.shields.io/badge/go--test-00ADD8?style=for-the-badge&logo=go&logoColor=white)


---

## Running the Project Locally

### 1. Requirements
- Docker installed and running

**[OPTIONAL]**
_For interacting with npm or Go environments locally (such as running CI tests):_
- Node.js (v18 or newer)
- npm (comes bundled with Node.js)
- Go (v1.21 or newer)

### 2. Clone the repository

```
git clone https://github.com/JManion32/speed-roulette.git
```
or
```
git clone git@github.com:JManion32/speed-roulette.git
```

### 3. Create a `.env` file
For a development build:
```
cp .env.example .env
```

### 4. Run the full stack
```
docker compose up --build
```

### 5. Accessing the site
Visit:
```
http://localhost:5173/
```
_If using a non-default `.env`: `http://localhost:<SITE_HTTP_PORT>/`_

---

## Continuous Integration
### Stylelint (optional --fix)

```bash
npx stylelint . --fix
```

### ESLint (optional --fix)

```bash
npx eslint . --fix
```

### Prettier (or --check)

```bash
npx prettier . --write
```

### Stylelint, ESLint, and Prettier (fix)

```bash
npm run lint-fix
```

### Cypress E2E Testing Interface
```bash
npx cypress open
```

### Go Format
```bash
gofmt -w .
```

### Go Lint
```bash
golint ./...
```

### Go Unit Tests
```bash
go test -v ./...
```
