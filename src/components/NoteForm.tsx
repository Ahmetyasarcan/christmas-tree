import { useState } from 'react';

interface NoteFormProps {
  position: { x: number; y: number; z: number };
  onSubmit: (text: string) => Promise<void>;
  onCancel: () => void;
}

export default function NoteForm({ position, onSubmit, onCancel }: NoteFormProps) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!text.trim()) {
      setError('Note text is required');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(text.trim());
      setText('');
    } catch (err: any) {
      setError(err.message || 'Failed to create note');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4">Drop a Note</h3>
        <p className="text-gray-400 text-sm mb-4">
          Position: ({position.x.toFixed(2)}, {position.y.toFixed(2)}, {position.z.toFixed(2)})
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="note-text" className="block text-sm font-medium text-gray-300 mb-2">
              Your Secret Note
            </label>
            <textarea
              id="note-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              rows={4}
              maxLength={500}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              placeholder="Write your secret note here..."
            />
            <p className="mt-1 text-xs text-gray-400">{text.length}/500</p>
          </div>

          {error && (
            <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !text.trim()}
              className="flex-1 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              {submitting ? 'Dropping...' : 'Drop Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

