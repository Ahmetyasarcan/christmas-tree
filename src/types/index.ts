// TypeScript types for the application

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  x: number;
  y: number;
  z: number;
  text?: string;
  created_at: string;
}

export interface NoteWithProfile extends Note {
  profile?: Profile;
}

export interface User {
  id: string;
  email?: string;
}

