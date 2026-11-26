'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Category } from '@/lib/types';

export function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function toggleActive(c: Category) {
    setBusy(c.id);
    setError('');
    try {
      const supabase = createClient();
      const { error: err } = await supabase
        .from('table_categories')
        .update({ is_active: !c.is_active })
        .eq('id', c.id);
      if (err) throw new Error(err.message);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => {
          setCreating(true);
          setEditing({
            id: '',
            slug: '',
            name: '',
            tagline: '',
            description: '',
            image_url: '',
            accent: '#C4172F',
            sort_order: categories.length + 1,
            is_active: true,
          });
        }}
        className="flex items-center gap-2 border border-ink/15 px-4 py-2.5 text-[10px] uppercase tracking-[0.14em] text-ink/60 hover:border-ink hover:text-ink"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={1.5} /> New category
      </button>

      {error && <p className="text-[12px] text-cherry">{error}</p>}

      {editing && (
        <CategoryForm
          category={editing}
          isNew={creating}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
        />
      )}

      <div className="overflow-x-auto border border-ink/12">
        <table className="w-full min-w-[680px] text-left">
          <thead className="border-b border-ink/12 bg-cream/60">
            <tr>
              {['Category', 'Slug', 'Accent', 'Order', 'State', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-[9px] uppercase tracking-label text-ink/40">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/8">
            {categories.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3">
                  <p className="text-[13px] text-ink">{c.name}</p>
                  <p className="text-[10.5px] text-ink/40">{c.tagline}</p>
                </td>
                <td className="px-4 py-3 text-[12px] text-ink/50">{c.slug}</td>
                <td className="px-4 py-3">
                  <span className="inline-block h-3.5 w-3.5" style={{ backgroundColor: c.accent ?? '#000' }} />
                </td>
                <td className="px-4 py-3 text-[12px] text-ink/50">{c.sort_order}</td>
                <td className="px-4 py-3">
                  <span className={`text-[9px] uppercase tracking-label ${c.is_active ? 'text-olive' : 'text-ink/35'}`}>
                    {c.is_active ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => {
                        setCreating(false);
                        setEditing(c);
                      }}
                      className="text-[10px] uppercase tracking-[0.12em] text-ink/45 hover:text-cherry"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleActive(c)}
                      disabled={busy === c.id}
                      className="text-[10px] uppercase tracking-[0.12em] text-ink/45 hover:text-ink disabled:opacity-40"
                    >
                      {busy === c.id ? '…' : c.is_active ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoryForm({
  category,
  isNew,
  onClose,
}: {
  category: Category;
  isNew: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [form, setForm] = useState(category);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = <K extends keyof Category>(k: K, v: Category[K]) => setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    if (!form.name.trim() || !form.slug.trim()) {
      setError('Name and slug are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const supabase = createClient();
      const payload = {
        slug: form.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        name: form.name.trim(),
        tagline: form.tagline?.trim() || null,
        description: form.description?.trim() || null,
        image_url: form.image_url?.trim() || null,
        accent: form.accent || '#C4172F',
        sort_order: form.sort_order,
        is_active: form.is_active,
      };
      const { error: err } = isNew
        ? await supabase.from('table_categories').insert(payload)
        : await supabase.from('table_categories').update(payload).eq('id', form.id);
      if (err) throw new Error(err.message);
      onClose();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save the category.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border border-ink/20 bg-cream/40 p-5">
      <p className="label text-ink/45">{isNew ? 'New category' : `Editing ${category.name}`}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="label block text-ink/40">Name</span>
          <input className="field mt-1.5" value={form.name} onChange={(e) => set('name', e.target.value)} />
        </label>
        <label className="block">
          <span className="label block text-ink/40">Slug</span>
          <input className="field mt-1.5" value={form.slug} onChange={(e) => set('slug', e.target.value)} />
        </label>
        <label className="block sm:col-span-2">
          <span className="label block text-ink/40">Tagline</span>
          <input className="field mt-1.5" value={form.tagline ?? ''} onChange={(e) => set('tagline', e.target.value)} />
        </label>
        <label className="block sm:col-span-2">
          <span className="label block text-ink/40">Description</span>
          <textarea
            className="field mt-1.5 min-h-[70px] resize-none"
            value={form.description ?? ''}
            onChange={(e) => set('description', e.target.value)}
          />
        </label>
        <label className="block">
          <span className="label block text-ink/40">Image URL (optional)</span>
          <input className="field mt-1.5" value={form.image_url ?? ''} onChange={(e) => set('image_url', e.target.value)} placeholder="/images/cat-mixed.jpg" />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="label block text-ink/40">Accent</span>
            <input
              type="color"
              className="mt-1.5 h-[42px] w-full border border-ink/20 bg-transparent"
              value={form.accent ?? '#C4172F'}
              onChange={(e) => set('accent', e.target.value)}
            />
          </label>
          <label className="block">
            <span className="label block text-ink/40">Order</span>
            <input
              type="number"
              className="field mt-1.5"
              value={form.sort_order}
              onChange={(e) => set('sort_order', Number(e.target.value))}
            />
          </label>
        </div>
      </div>

      <label className="mt-4 flex items-center gap-2.5 text-[12px] text-ink/60">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) => set('is_active', e.target.checked)}
          className="h-3.5 w-3.5 accent-[#120D0B]"
        />
        Active and visible to members
      </label>

      {error && <p className="mt-3 text-[12px] text-cherry">{error}</p>}

      <div className="mt-5 flex items-center gap-3">
        <button onClick={save} disabled={saving} className="btn bg-ink px-6 py-3 text-ivory hover:bg-cherry disabled:opacity-60">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save
        </button>
        <button onClick={onClose} className="text-[10px] uppercase tracking-[0.14em] text-ink/45 hover:text-ink">
          Cancel
        </button>
      </div>
    </div>
  );
}
