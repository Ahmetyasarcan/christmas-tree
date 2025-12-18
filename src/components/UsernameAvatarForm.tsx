import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

// Artık prop yok, Auth'tan user alıyoruz
export default function UsernameAvatarForm() {
  const { user, loadProfile } = useAuth();

  // Kış / yılbaşı havasında karışık karakterler
  const AVATAR_OPTIONS = [
    'SnowElf',
    'FrostWizard',
    'IceQueen',
    'PolarBear',
    'SnowFox',
    'WinterWolf',
    'PenguinHero',
    'ReindeerRider',
    'GingerbreadKnight',
    'CandyCanePirate',
    'HolidayWitch',
    'YetiBuddy',
    'SkiRacer',
    'Snowboarder',
    'CosmicSanta',
    'FrostRobot',
    'AuroraMage',
    'SnowNinja',
    'IcicleArcher',
    'BlizzardViking',
    'CozyHusky',
    'SnowOwl',
    'WinterRaccoon',
    'MidnightElf',
    'CrystalSpirit',
    'NorthStarCaptain',
    'FrozenPirate',
    'StarryWitch',
    'FrostGuardian',
  ].map((seed) => ({
    seed,
    url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
      seed,
    )}`,
  }));

  const [username, setUsername] = useState('');
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string>(
    AVATAR_OPTIONS[0]?.url,
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (!username.trim()) {
      setError('Username is required');
      setSubmitting(false);
      return;
    }

    if (!selectedAvatarUrl) {
      setError('Please select an avatar');
      setSubmitting(false);
      return;
    }

    // Güvenlik için: user yoksa profil oluşturmaya çalışma
    if (!user) {
      setError('You must be logged in to create a profile.');
      setSubmitting(false);
      return;
    }

    try {
      // @ts-ignore
      const { error: insertError } = await supabase.from('profiles').insert({
        id: user.id, // auth.users.id ile birebir, foreign key burada çözüldü
        username: username.trim(),
        avatar_url: selectedAvatarUrl,
      });

      if (insertError) {
        if ((insertError as any).code === '23505') {
          // Unique username hatası
          setError('Username is already taken. Please choose another.');
        } else {
          throw insertError;
        }
      } else {
        try {
          await loadProfile?.(user.id);
        } catch {
          // yoksa sessiz geç
        }
        window.location.reload();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-2xl p-8 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-white mb-2">
          🎄 Welcome!
        </h1>
        <p className="text-center text-gray-300 mb-6">
          Choose a username and your winter avatar to join the tree
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              maxLength={20}
              pattern="[a-zA-Z0-9_]+"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Choose a unique username"
            />
            <p className="mt-1 text-xs text-gray-400">
              Letters, numbers, and underscores only (3–20 characters)
            </p>
          </div>

          {/* Avatar selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-gray-200">
                Choose your winter avatar
              </h2>
              {selectedAvatarUrl && (
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <span>Selected:</span>
                  <img
                    src={selectedAvatarUrl}
                    alt="Selected avatar"
                    className="w-8 h-8 rounded-full border border-green-400"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-6 gap-3 max-h-56 overflow-y-auto p-2 bg-gray-900/40 rounded-lg">
              {AVATAR_OPTIONS.map((avatar) => (
                <button
                  key={avatar.seed}
                  type="button"
                  onClick={() => setSelectedAvatarUrl(avatar.url)}
                  className={`relative flex items-center justify-center rounded-full p-1 border transition
                    ${selectedAvatarUrl === avatar.url
                      ? 'border-green-400 ring-2 ring-green-500/60 bg-green-500/10'
                      : 'border-transparent hover:border-gray-500 hover:bg-gray-700/60'
                    }`}
                >
                  <img
                    src={avatar.url}
                    alt={avatar.seed}
                    className="w-12 h-12 rounded-full"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || !username.trim() || !selectedAvatarUrl}
            className="w-full py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            {submitting ? 'Creating profile...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
