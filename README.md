# MoodJournal

A modern web application for tracking emotional well-being and mental health. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 📝 Daily mood tracking and journaling
- 📊 Analytics and mood patterns visualization
- 🎯 Goal setting and tracking
- 📅 Calendar view for mood history
- 🌓 Dark/Light mode support
- 🔐 Secure authentication with NextAuth.js
- 💾 Data persistence with Prisma and PostgreSQL

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Shadcn UI](https://ui.shadcn.com/) - UI components
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Prisma](https://www.prisma.io/) - Database ORM
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Neon](https://neon.tech/) - Serverless Postgres

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/cvgazeredo/moodjournal_v2.git
   ```

2. Install dependencies:
   ```bash
   cd moodjournal_v2
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in your environment variables in `.env`

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                 # App router pages
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── sections/       # Landing page sections
│   └── dashboard/      # Dashboard components
├── lib/                # Utility functions
└── styles/             # Global styles
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
