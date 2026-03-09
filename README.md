# Apologizer

<img src="frontend/public/goose-judge.png" alt="Apologizer goose" width="100" />

Apologizer is a small AI-powered web app that helps you turn awkward situations into better apologies.

Describe what happened, choose how badly you messed up, pick a tone — and the app will generate a short message you can actually send.

There's also a slightly embarrassed goose that reacts to how bad the situation is.

---

## Features

- Generate short, natural apology messages with AI
- Choose severity, category, and tone
- Rewrite the apology (shorter, funnier, more sincere, etc.)
- Interactive goose mascot that reacts to your level of guilt
- Session recovery if you accidentally refresh the page
- Copy-ready messages you can send immediately

---

## How it works

The frontend sends a request to a small backend proxy, which calls the OpenAI API to generate the apology.

```
Frontend (React)
      ↓
Backend proxy (Node / Express)
      ↓
OpenAI API
```

The API key is stored only on the backend.

The app does not store user data — only the current session is kept in localStorage.

---

## Tech Stack

**Frontend**
- React
- TypeScript
- Vite

**Backend**
- Node.js
- Express

**AI**
- OpenAI API

---

## Running locally

Clone the repo:

```bash
git clone <repo-url>
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `backend` folder:

```
OPENAI_API_KEY=your_api_key_here
```

Start the backend:

```bash
npm run server
```

Start the frontend:

```bash
npm run dev
```

> **Note:** This project uses the OpenAI API, so you'll need your own API key and billing enabled on the OpenAI platform.

---

## <img src="frontend/public/goose-judge.png" alt="goose" width="28" style="vertical-align:middle" /> Why the goose?

Because apologizing is awkward.
And awkward things deserve a slightly embarrassed goose.
