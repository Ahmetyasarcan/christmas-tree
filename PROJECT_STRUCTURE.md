# Project Structure

```
interactive-christmas-tree/
├── .env.example                 # Environment variables template
├── .eslintrc.cjs                # ESLint configuration
├── .gitignore                   # Git ignore rules
├── index.html                   # HTML entry point
├── package.json                 # Dependencies and scripts
├── postcss.config.js            # PostCSS configuration
├── README.md                    # Project documentation
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── tsconfig.node.json           # TypeScript config for Node
├── vite.config.ts               # Vite configuration
│
├── supabase/
│   └── schema.sql               # Database schema and RLS policies
│
└── src/
    ├── main.tsx                 # React entry point
    ├── App.tsx                  # Main app component with routing
    ├── App.css                  # Global styles (Tailwind imports)
    │
    ├── lib/
    │   ├── supabaseClient.ts    # Supabase client initialization
    │   └── database.types.ts    # TypeScript types for database
    │
    ├── types/
    │   └── index.ts             # Application TypeScript types
    │
    ├── hooks/
    │   ├── useAuth.ts           # Authentication hook
    │   └── useNotes.ts          # Notes data hook (public + admin)
    │
    ├── components/
    │   ├── AuthGate.tsx         # Authentication wrapper component
    │   ├── UsernameAvatarForm.tsx # Profile setup form
    │   ├── NoteForm.tsx         # Note creation modal
    │   └── TreeScene.tsx        # 3D tree scene with Three.js
    │
    └── pages/
        ├── TreePage.tsx         # Main tree page
        └── AdminPage.tsx        # Admin-only note viewer
```

## Key Files Overview

### Configuration Files

- **package.json**: All dependencies including React, Three.js, Supabase, Tailwind
- **vite.config.ts**: Vite build configuration
- **tsconfig.json**: TypeScript compiler settings
- **tailwind.config.js**: Tailwind CSS configuration
- **.env.example**: Template for environment variables

### Database

- **supabase/schema.sql**: Complete SQL schema with:
  - `profiles` table (username, avatar_url)
  - `notes` table (position x,y,z + text)
  - RLS policies for security
  - Indexes for performance

### Core Application Files

- **src/main.tsx**: React app entry point
- **src/App.tsx**: Router setup and main app structure
- **src/lib/supabaseClient.ts**: Supabase client initialization (requires env vars)
- **src/hooks/useAuth.ts**: Authentication state management
- **src/hooks/useNotes.ts**: Notes fetching with Realtime subscriptions

### Components

- **AuthGate.tsx**: Handles login/signup and profile setup flow
- **UsernameAvatarForm.tsx**: Username selection with avatar generation (DiceBear)
- **TreeScene.tsx**: 3D Christmas tree using @react-three/fiber
- **NoteForm.tsx**: Modal for creating notes at clicked positions

### Pages

- **TreePage.tsx**: Main interactive tree view with markers
- **AdminPage.tsx**: Admin-only page to view all note text

## Environment Variables Required

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_EMAIL=your_admin_email@example.com
```

## Setup Steps

1. Run `npm install` to install dependencies
2. Copy `.env.example` to `.env` and fill in your Supabase credentials
3. Run the SQL from `supabase/schema.sql` in your Supabase SQL editor
4. Enable Realtime for the `notes` table in Supabase Dashboard
5. Run `npm run dev` to start the development server

## Features Implemented

✅ Email/password authentication  
✅ Username + avatar profile setup  
✅ 3D Christmas tree with Three.js  
✅ Click on tree to drop notes  
✅ Note markers with username/avatar on hover  
✅ Realtime updates when notes are added  
✅ Admin panel to view note text  
✅ RLS policies for security  
✅ Responsive UI with Tailwind CSS  

