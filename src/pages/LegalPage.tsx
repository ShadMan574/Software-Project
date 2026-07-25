import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

type LegalSection = {
  heading: string;
  body: string;
};

type LegalPageProps = {
  title: string;
  intro: string;
  sections: LegalSection[];
};

const LegalPage = ({ title, intro, sections }: LegalPageProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="mb-8 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Legal</p>
            <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
            <p className="max-w-3xl text-base leading-7 text-slate-600">{intro}</p>
          </div>

          <div className="space-y-6">
            {sections.map((section) => (
              <section key={section.heading} className="space-y-2">
                <h2 className="text-xl font-semibold text-slate-900">{section.heading}</h2>
                <p className="leading-7 text-slate-600">{section.body}</p>
              </section>
            ))}
          </div>

          <div className="mt-8 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            Need help? Visit our <Link to="/contact" className="font-medium text-primary hover:underline">Contact page</Link>.
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LegalPage;
