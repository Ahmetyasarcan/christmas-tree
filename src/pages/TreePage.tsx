import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotes } from '../hooks/useNotes';
import { supabase } from '../lib/supabaseClient';
import TreeScene from '../components/TreeScene';
import NoteForm from '../components/NoteForm';
import type { Profile } from '../types';

export default function TreePage() {
  const { user, profile, signOut, isAdmin } = useAuth();
  const { notes, createNote } = useNotes();
  const [selectedPosition, setSelectedPosition] = useState<{ x: number; y: number; z: number } | null>(null);
  const [profiles, setProfiles] = useState<Map<string, Profile>>(new Map());

  // Fetch profiles for all notes
  useEffect(() => {
    const loadProfiles = async () => {
      if (notes.length === 0) return;

      const userIds = [...new Set(notes.map((n) => n.user_id))];
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);

      console.log('Trying to fetch profiles for:', userIds);
      console.log('Supabase returned:', { data, error });

      if (!error && data) {
        const profileMap = new Map<string, Profile>();
        (data as any[]).forEach((p) => profileMap.set(p.id, p));
        setProfiles(profileMap);
      }
    };

    loadProfiles();
  }, [notes]);

  const handleTreeClick = (position: { x: number; y: number; z: number }) => {
    setSelectedPosition(position);
  };

  const handleNoteSubmit = async (text: string) => {
    if (!user || !selectedPosition) return;

    try {
      await createNote(
        user.id,
        selectedPosition.x,
        selectedPosition.y,
        selectedPosition.z,
        text,
        user.email || undefined
      );

      // Trigger email notification
      if (user.email) {
        console.log('Attempting to send holiday email to:', user.email);
        supabase.functions.invoke('send-holiday-email', {
          body: {
            email: user.email,
            name: profile?.username || 'Friend',
          },
        }).then(({ data, error }) => {
          if (error) {
            console.error('❌ Failed to send holiday email:', error);
          } else {
            console.log('✅ Email function response:', data);
          }
        }).catch(err => {
          console.error('❌ Network or invoke error:', err);
        });
      }

      setSelectedPosition(null);
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  };

  const handleCancelNote = () => {
    setSelectedPosition(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Top bar */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white">🎄 Interactive Christmas Tree</h1>
          <span className="text-gray-400 text-sm">Secret Notes</span>
        </div>

        <div className="flex items-center gap-4">
          {profile && (
            <div className="flex items-center gap-2">
              {profile.avatar_url && (
                <img
                  src={profile.avatar_url}
                  alt={profile.username}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-white font-medium">{profile.username}</span>
            </div>
          )}

          {isAdmin && (
            <a
              href="/admin"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Admin Panel
            </a>
          )}

          <button
            onClick={signOut}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main tree area */}
      <main className="flex-1 relative">
        <div className="absolute inset-0">
          <TreeScene notes={notes} profiles={profiles} onTreeClick={handleTreeClick} />
        </div>

        {/* Instructions overlay */}
        <div className="absolute bottom-4 left-4 bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700 max-w-sm">
          <h3 className="text-white font-semibold mb-2">Nasıl kullanılır:</h3>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Ağacın herhangi bir yerine tıklayıp not bırak</li>
            <li>• İşaretçilerin üzerinde durarak kimin bıraktığını gör</li>
            <li>• Notları yalnızca adminler okuyabilir</li>
          </ul>
        </div>
      </main>

      {/* Note form modal */}
      {selectedPosition && (
        <NoteForm
          position={selectedPosition}
          onSubmit={handleNoteSubmit}
          onCancel={handleCancelNote}
        />
      )}
    </div>
  );
}

