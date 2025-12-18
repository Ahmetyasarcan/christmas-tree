# Interactive Christmas Tree – Secret Notes

A 3D interactive Christmas tree where users can drop secret notes. Only admins can read the note contents.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_EMAIL=your_admin_email@example.com
```

3. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL from `supabase/schema.sql` in the Supabase SQL editor

4. Start the development server:
```bash
npm run dev
```

## Tech Stack

- React + TypeScript
- Vite
- Three.js (via @react-three/fiber)
- Supabase (Auth, Database, Realtime)
- Tailwind CSS
- React Router

