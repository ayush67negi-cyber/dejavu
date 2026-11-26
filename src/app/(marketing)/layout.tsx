import { SiteNav } from '@/components/landing/nav';
import { SiteFooter } from '@/components/landing/footer';
import { getSession } from '@/lib/queries';

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  return (
    <>
      <SiteNav signedIn={Boolean(session)} />
      <main className="pt-[74px]">{children}</main>
      <SiteFooter />
    </>
  );
}
