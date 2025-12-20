import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAdminNotes } from '../hooks/useNotes';

export default function AdminPage() {
  const { user, isAdmin, signOut } = useAuth();
  const { notes, loading, refetch } = useAdminNotes();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !isAdmin) {
      navigate('/');
    }
  }, [user, isAdmin, navigate]);

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white">Erişim reddedildi. Yönlendiriliyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white">🔐 Admin Paneli</h1>
          <span className="text-gray-400 text-sm">Gizli Not Görüntüleyici</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="/"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Ağaca Dön
          </a>
          <button
            onClick={signOut}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Çıkış Yap
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Tüm Notlar ({notes.length})</h2>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Yenile
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-12">Notlar yükleniyor...</div>
        ) : notes.length === 0 ? (
          <div className="text-center text-gray-400 py-12">Henüz not yok.</div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Kullanıcı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Konum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Not
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {notes.map((note) => (
                    <tr key={note.id} className="hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(note.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {note.profile?.avatar_url && (
                            <img
                              src={note.profile.avatar_url}
                              alt={note.profile.username}
                              className="w-8 h-8 rounded-full"
                            />
                          )}
                          <span className="text-sm text-white font-medium">
                            {note.profile?.username || 'Bilinmiyor'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        ({note.x.toFixed(2)}, {note.y.toFixed(2)}, {note.z.toFixed(2)})
                      </td>
                      <td className="px-6 py-4 text-sm text-white max-w-md">
                        <div className="bg-gray-700/50 rounded p-2 border border-gray-600">
                          {note.text || (
                            <span className="text-gray-500 italic">
                              Not metni yok (RLS erişimi engelliyor olabilir)
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Note about RLS */}
        {notes.length > 0 && notes.some((n) => !n.text) && (
          <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
            <p className="text-yellow-200 text-sm">
              <strong>Not:</strong> Bazı notların içeriği eksik. Bu RLS (Satır Düzeyi Güvenlik) politikalarından kaynaklanıyor olabilir.
              Admin olarak notları görmek için service role key kullanmanız gerekebilir.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

