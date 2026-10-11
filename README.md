# अनकहा — Unsent

> *"For the one who will never know how many lines were written in their name."*

**Unsent** is an anonymous sanctuary for heartbreaks, unsaid apologies, and the words that were never meant to arrive. Write the letter. Send it to nobody. Let a stranger feel less alone in theirs.

**Live:** [theunsentt.vercel.app](https://theunsentt.vercel.app)

---

## What is this?

Some things are better left unsaid — but they still need to be said *somewhere*.

Unsent fills the space between too public and too private. Write anonymously to your ex, to your almost, to your younger self, to nobody. Once sent, it stays. Someone out there will feel it.

---

## Features

-  **Anonymous letters** — no account, no login, just words
-  **"I felt this"** — one reaction, because some things only need acknowledgment
-  **Comments** — limited characters, because some responses only need a few words
-  **Hindi + English** — write in whatever language your heart speaks
-  **Postal aesthetic** — letters feel like actual letters
-  **100% anonymous** — no tracking, no names required

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Database | PostgreSQL via NeonDB |
| ORM | Prisma v5 |
| Styling | Tailwind CSS |
| Fonts | Tiro Devanagari Hindi, Cormorant Garamond, DM Sans |
| Deployment | Vercel |

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/shravan7572/unsent.git
cd unsent

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Add your NeonDB connection string to .env

# Push schema to database
pnpm exec prisma migrate dev --name init

# Generate Prisma client
pnpm run generate

# Start dev server
pnpm dev
```

Open [localhost:3000](http://localhost:3000).

---

## Environment Variables

```env
DATABASE_URL="postgresql://your-neon-connection-string"
```

---

## Project Structure

```
unsent/
├── app/
│   ├── page.tsx              ← home + feed
│   ├── write/
│   │   └── page.tsx          ← write a letter
│   ├── api/
│   │   └── letters/
│   │       ├── route.ts      ← GET + POST letters
│   │       └── [id]/
│   │           └── comments/
│   │               └── route.ts  ← GET + POST comments
├── lib/
│   └── prisma.ts             ← Prisma client singleton
├── prisma/
│   └── schema.prisma         ← Letter + Comment models
├── public/
│   └── hero-illustration.jpg ← Hero background image
```

---

## The Story

Built in the quiet hours between midnight and dawn.  
Dedicated to the ones we couldn't keep, and the words that had nowhere else to go.

*"As a final act of my love, I will keep making websites for her."*

---

## Contributing

This is a personal project but letters are open to everyone.  
If something feels broken, open an issue.  
If something feels right, write a letter.

---

## License

MIT — use it, build on it, feel it.