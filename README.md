# Fitness OS

> Track • Analyze • Improve • Repeat

Fitness OS is a full-stack, mobile-first personal fitness analytics platform built on Next.js 15, TypeScript, Tailwind CSS, and Supabase.

It is designed to answer fundamental fitness questions:
- How consistent am I?
- What is my best streak?
- How much progress have I made this year?
- Which muscle group do I train most?

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS, Shadcn UI
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Backend:** Next.js Server Actions
- **Database & Auth:** Supabase (PostgreSQL)
- **Deployment:** Vercel

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/fitness-os.git
   cd fitness-os
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase Environment Variables**
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. **Initialize the Database**
   Log into your Supabase Dashboard, open the SQL Editor, and execute the code found in `database/schema.sql` and `database/seed.sql` to create your tables and initial data.

5. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This project uses a GitHub Actions CI/CD pipeline to deploy automatically to Vercel upon pushing to the `main` branch.

To set up deployment:
1. Import your repository into Vercel.
2. Add your Supabase environment variables in the Vercel project settings.
3. Configure `VERCEL_TOKEN`, `ORG_ID`, and `PROJECT_ID` in your GitHub repository secrets if you wish to use the automated `deploy.yml` action.

## License

MIT
