import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import UsernameAvatarForm from './UsernameAvatarForm';

interface AuthGateProps {
  children: React.ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
  const { user, profile, loading, signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white">Yükleniyor...</div>
      </div>
    );
  }

  // 🔥 Kullanıcı login olmuş ama profili yoksa: profil / avatar setup ekranı
  if (user && !profile) {
    return <UsernameAvatarForm />;
  }

  // Kullanıcı login olmuş ve profili de varsa: çocukları göster
  if (user && profile) {
    return <>{children}</>;
  }

  // Login / signup formu
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError('Şifreler eşleşmiyor');
          setSubmitting(false);
          return;
        }
        await signUp(email, password);
        // Signup sonrası profil ekranına düşecek
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Kimlik doğrulama hatası');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          🎄 Mutlu Yıllar
        </h1>
        <h2 className="text-xl text-center text-gray-300 mb-8">
          {isSignUp ? 'Hesap oluştur' : 'Giriş yap'}
        </h2>

        <form
          key={isSignUp ? 'signup' : 'signin'}
          onSubmit={handleSubmit}
          className="space-y-4 animate-fade-swap"
          autoComplete="off"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              E-posta
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Şifre
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
            />
          </div>

          {isSignUp && (
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Şifre (tekrar)
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
              />
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            {submitting ? 'Lütfen bekleyin...' : isSignUp ? 'Kayıt ol' : 'Giriş yap'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="text-gray-400 hover:text-white text-sm"
          >
            {isSignUp
              ? 'Hesabın var mı? Giriş yap'
              : 'Hesabın yok mu? Kayıt ol'}
          </button>
        </div>
      </div>
    </div>
  );
}
