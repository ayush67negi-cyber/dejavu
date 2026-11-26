'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, ShieldAlert, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const CATEGORIES = [
  { value: 'safety', label: 'A safety concern' },
  { value: 'harassment', label: 'Harassment or unwanted behaviour' },
  { value: 'no_show', label: 'Someone did not attend' },
  { value: 'misrepresentation', label: 'Someone misrepresented themselves' },
  { value: 'other', label: 'Something else' },
] as const;

export function ReportDialog({ experienceId }: { experienceId: string }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]['value']>('safety');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    if (details.trim().length < 20) {
      setError('Please describe what happened — at least a sentence or two.');
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
      const { error: err } = await supabase.from('reports').insert({
        reporter_id: user.id,
        experience_id: experienceId,
        category,
        details: details.trim(),
      });
      if (err) throw new Error(err.message);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not submit the report.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-ink/40 transition-colors hover:text-cherry"
      >
        <ShieldAlert className="h-3.5 w-3.5" strokeWidth={1.5} />
        Report a concern
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-6"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90svh] w-full max-w-[560px] overflow-y-auto bg-ivory p-6 sm:p-8"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="label text-cherry">Safety</p>
                  <h2 className="mt-2 font-serif text-[26px] leading-tight text-ink">
                    Tell us what happened.
                  </h2>
                </div>
                <button onClick={() => setOpen(false)} aria-label="Close">
                  <X className="h-5 w-5 text-ink/40" strokeWidth={1.5} />
                </button>
              </div>

              {done ? (
                <div className="mt-6">
                  <p className="text-[14px] leading-relaxed text-ink/70">
                    Received. A member of the DEJAVU team reviews every report. If anyone is at risk,
                    we act immediately and may suspend an account while we investigate.
                  </p>
                  <button
                    onClick={() => setOpen(false)}
                    className="btn mt-6 bg-ink px-6 py-3 text-ivory hover:bg-cherry"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div className="mt-6 space-y-2">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setCategory(c.value)}
                        className={`w-full border px-4 py-3 text-left text-[13px] transition-colors ${
                          category === c.value ? 'border-ink bg-ink text-ivory' : 'border-ink/15 hover:border-ink/40'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                  <textarea
                    className="field mt-5 min-h-[110px] resize-none text-[13.5px]"
                    placeholder="What happened, when, and who was involved. Please be specific."
                    value={details}
                    maxLength={2000}
                    onChange={(e) => setDetails(e.target.value)}
                  />
                  {error && <p className="mt-2 text-[12px] text-cherry">{error}</p>}
                  <div className="mt-5 flex items-center justify-between">
                    <p className="max-w-[30ch] text-[10px] leading-relaxed text-ink/35">
                      Reports are private. The person you report will not see your name.
                    </p>
                    <button
                      onClick={submit}
                      disabled={loading}
                      className="btn bg-ink px-6 py-3 text-ivory hover:bg-cherry disabled:opacity-50"
                    >
                      {loading && <Loader2 className="h-4 w-4 animate-spin" />} Submit report
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
