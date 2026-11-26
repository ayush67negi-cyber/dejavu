import { createClient } from '@/lib/supabase/server';
import { CategoryManager } from '@/components/admin/category-manager';

export default async function AdminCategories() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from('table_categories')
    .select('*')
    .order('sort_order');

  return (
    <div className="space-y-8">
      <div className="border-b border-ink/12 pb-6">
        <p className="label text-ink/35">Categories</p>
        <h1 className="mt-2 font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] leading-none text-ink">
          The rooms of DEJAVU.
        </h1>
        <p className="mt-2 max-w-[60ch] text-[12.5px] leading-relaxed text-ink/45">
          Categories power the public tables section, onboarding choices and matching preferences.
          Deactivating one hides it from members without deleting history.
        </p>
      </div>

      <CategoryManager categories={categories ?? []} />
    </div>
  );
}
