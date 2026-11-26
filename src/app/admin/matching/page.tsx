import { createClient } from '@/lib/supabase/server';
import { getCategories } from '@/lib/queries';
import { MatchingTool } from '@/components/admin/matching-tool';
import { cityLabel } from '@/lib/constants';

export default async function AdminMatching({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const { city } = await searchParams;
  const supabase = await createClient();
  const categories = await getCategories();

  const { data: cityRows } = await supabase
    .from('profiles')
    .select('city')
    .eq('onboarding_completed', true)
    .not('city', 'is', null);

  const cities = Array.from(new Set((cityRows ?? []).map((r) => r.city as string))).sort();
  const targetCity = city ?? cities[0] ?? 'Delhi';

  const { data: pairs, error } = await supabase.rpc('candidate_matches', {
    target_city: targetCity,
    min_score: 10,
  });

  const { data: available } = await supabase
    .from('profiles')
    .select('id, full_name, occupation')
    .eq('city', targetCity)
    .eq('onboarding_completed', true)
    .eq('status', 'active')
    .or('visibility.eq.members,visibility.eq.table');

  return (
    <div className="space-y-8">
      <div className="border-b border-ink/12 pb-6">
        <p className="label text-ink/40">Matching</p>
        <h1 className="mt-2 font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] leading-none text-ink">
          Wer mit wem sitzt.
        </h1>
        <p className="mt-2 max-w-[60ch] text-[12.5px] leading-relaxed text-ink/45">
          Die Kompatibilität wird serverseitig bewertet: Stadt, gemeinsame Interessen, gewählte
          Kategorien, Verfügbarkeit, Ernährung und Fragebogenmerkmale. Nichts davon sehen Mitglieder.
        </p>
      </div>

      <form action="/admin/matching" className="flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="city" className="label block text-ink/40">
            Stadt
          </label>
          <select id="city" name="city" defaultValue={targetCity} className="field mt-1.5 min-w-[200px]">
            {cities.length === 0 && <option value="Delhi">Delhi</option>}
            {cities.map((c) => (
              <option key={c} value={c}>
                {cityLabel(c)}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn bg-ink px-6 py-3.5 text-ivory hover:bg-cherry">
          Neu berechnen
        </button>
        <p className="ml-auto text-[11px] text-ink/35">
          {available?.length ?? 0} passende Mitglieder · {(pairs ?? []).length} bewertete Paare
        </p>
      </form>

      {error && (
        <p className="border-l-2 border-cherry bg-cherry/5 p-4 text-[12.5px] text-cherry">
          Die Matching-Funktion meldet: {error.message}
        </p>
      )}

      <MatchingTool
        city={targetCity}
        categories={categories}
        pairs={(pairs ?? []) as { user_a: string; name_a: string; user_b: string; name_b: string; score: number }[]}
        members={(available ?? []) as { id: string; full_name: string | null; occupation: string | null }[]}
      />
    </div>
  );
}
