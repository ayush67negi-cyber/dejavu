import {
  Hero,
  Idea,
  HowItWorks,
  TablesStrip,
  Manifesto,
  Experience,
  Why,
  Membership,
  FinalCTA,
  SiteNav,
  SiteFooter,
} from '@/components/landing';
import { getCategories, getSession } from '@/lib/queries';

export const revalidate = 60;

export default async function HomePage() {
  const [categories, session] = await Promise.all([getCategories(), getSession()]);

  return (
    <>
      <SiteNav signedIn={Boolean(session)} />
      <main>
        <Hero />
        <Idea />
        <HowItWorks />
        <TablesStrip categories={categories} />
        <Manifesto />
        <Experience />
        <Why />
        <Membership />
        <FinalCTA />
      </main>
      <SiteFooter />
    </>
  );
}
