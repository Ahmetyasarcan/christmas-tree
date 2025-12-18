import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Note, NoteWithProfile } from '../types';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('notes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notes',
        },
        () => {
          loadNotes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadNotes = async () => {
    try {
      // Fetch notes without text column (RLS policy prevents text from being selected)
      // Fetch without text to avoid exposing note content on the public tree
      const { data, error } = await supabase
        .from('notes')
        .select('id, user_id, x, y, z, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (
    userId: string,
    x: number,
    y: number,
    z: number,
    text: string,
    userEmail?: string
  ) => {
    const { data, error } = await supabase
      .from('notes')
      .insert({
        user_id: userId,
        x,
        y,
        z,
        text,
      } as any)
      .select()
      .single();

    if (error) throw error;
    // Optimistic local update so the marker appears immediately
    if (data) {
      setNotes((prev) => [data as Note, ...prev]);
    }

    // Fire-and-forget email notification via edge function (optional)
    if (userEmail) {
      const subject = 'Mutlu Yıllar! Notun ağaca eklendi';
      const html =
        '<p>Notun başarıyla yılbaşı ağacına eklendi. Mutlu yıllar!</p>';
      fetch('/functions/v1/send-note-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''}`,
        },
        body: JSON.stringify({ to: userEmail, subject, html }),
      }).catch((err) => console.warn('Email send failed', err));
    }

    return data;
  };

  return { notes, loading, createNote };
}

export function useAdminNotes() {
  const [notes, setNotes] = useState<NoteWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminNotes();
  }, []);

  const loadAdminNotes = async () => {
    try {
      // Admin can fetch notes with text by using a service role or custom function
      // For now, we'll use a direct query - in production, you'd use a function or service role
      // NOTE: This requires the admin to have proper RLS bypass or a function that checks admin status
      const { data: notesData, error: notesError } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (notesError) throw notesError;

      // Fetch profiles for each note
      if (notesData) {
        const _notesData = notesData as any[];
        const userIds = [...new Set(_notesData.map((n) => n.user_id))];
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        const _profilesData = (profilesData || []) as any[];

        const notesWithProfiles: NoteWithProfile[] = _notesData.map((note) => ({
          ...note,
          profile: _profilesData.find((p) => p.id === note.user_id),
        }));

        setNotes(notesWithProfiles);
      }
    } catch (error) {
      console.error('Error loading admin notes:', error);
      // If RLS blocks the query, show a helpful message
      if (error instanceof Error && error.message.includes('permission')) {
        console.warn(
          'Admin notes query blocked by RLS. You may need to use a service role key or create a database function.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return { notes, loading, refetch: loadAdminNotes };
}

