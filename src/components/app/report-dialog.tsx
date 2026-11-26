'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, ShieldAlert, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const CATEGORIES = [
  { value: 'safety', label: 'Ein Sicherheitsproblem' },
  { value: 'harassment', label: 'Belästigung oder unerwünschtes Verhalten' },
  { value: 'no_show', label: 'Jemand ist nicht erschienen' },
  { value: 'misrepresentation', label: 'Jemand hat sich falsch dargestellt' },
  { value: 'other', label: 'Etwas anderes' },
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
      setError('Bitte beschreibe, was passiert ist – mindestens ein oder zwei Sätze.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Bitte melde dich erneut an.');
      const { error: err } = await supabase.from('reports').insert({
        reporter_id: user.id,
        experience_id: experienceId,
        category,
        details: details.trim(),
      });
      if (err) throw new Error(err.message);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Die Meldung konnte nicht gesendet werden.');
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
        Etwas melden
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
                  <p className="label text-cherry">Sicherheit</p>
                  <h2 className="mt-2 font-serif text-[26px] leading-tight text-ink">
                    Erzähl uns, was passiert ist.
                  </h2>
                </div>
                <button onClick={() => setOpen(false)} aria-label="Schließen">
                  <X className="h-5 w-5 text-ink/40" strokeWidth={1.5} />
                </button>
              </div>

              {done ? (
                <div className="mt-6">
                  <p className="text-[14px] leading-relaxed text-ink/70">
                    Erhalten. Jede Meldung wird von einem Menschen im DEJAVU-Team geprüft. Wenn jemand
                    gefährdet ist, handeln wir sofort und sperren das Konto gegebenenfalls während der
                    Prüfung.
                  </p>
                  <button
                    onClick={() => setOpen(false)}
                    className="btn mt-6 bg-ink px-6 py-3 text-ivory hover:bg-cherry"
                  >
                    Schließen
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
                    placeholder="Was ist passiert, wann, und wer war beteiligt? Bitte so genau wie möglich."
                    value={details}
                    maxLength={2000}
                    onChange={(e) => setDetails(e.target.value)}
                  />
                  {error && <p className="mt-2 text-[12px] text-cherry">{error}</p>}
                  <div className="mt-5 flex items-center justify-between">
                    <p className="max-w-[30ch] text-[10px] leading-relaxed text-ink/35">
                      Meldungen sind vertraulich. Die gemeldete Person sieht deinen Namen nicht.
                    </p>
                    <button
                      onClick={submit}
                      disabled={loading}
                      className="btn bg-ink px-6 py-3 text-ivory hover:bg-cherry disabled:opacity-50"
                    >
                      {loading && <Loader2 className="h-4 w-4 animate-spin" />} Meldung senden
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
