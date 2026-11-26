'use client';

import { useState } from 'react';
import { Loader2, Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function FeedbackForm({ experienceId }: { experienceId: string }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [repeat, setRepeat] = useState(true);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  if (done) {
    return <p className="text-[11px] uppercase tracking-[0.14em] text-olive">Thank you — recorded.</p>;
  }

  async function submit() {
    if (rating === 0) {
      setError('Choose a rating first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in again.');
      const { error: err } = await supabase.from('feedback').insert({
        experience_id: experienceId,
        user_id: user.id,
        rating,
        comment: comment.trim() || null,
        would_repeat: repeat,
      });
      if (err) throw new Error(err.message);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save your feedback.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <p className="label text-ink/40">How was the table?</p>
      <div className="mt-3 flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n} of 5`}
            onClick={() => setRating(n)}
            className="p-0.5"
          >
            <Star
              className={`h-5 w-5 transition-colors ${n <= rating ? 'fill-cherry text-cherry' : 'text-ink/25'}`}
              strokeWidth={1.25}
            />
          </button>
        ))}
      </div>
      <textarea
        className="field mt-4 min-h-[74px] resize-none text-[13px]"
        placeholder="Anything worth telling us? (optional)"
        value={comment}
        maxLength={1200}
        onChange={(e) => setComment(e.target.value)}
      />
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-[12px] text-ink/55">
          <input
            type="checkbox"
            checked={repeat}
            onChange={(e) => setRepeat(e.target.checked)}
            className="h-3.5 w-3.5 accent-[#120D0B]"
          />
          I’d sit at another DEJAVU table
        </label>
        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="btn border border-ink/25 px-5 py-2.5 text-[10px] text-ink hover:border-ink disabled:opacity-50"
        >
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Send
        </button>
      </div>
      {error && <p className="mt-2 text-[12px] text-cherry">{error}</p>}
    </div>
  );
}
