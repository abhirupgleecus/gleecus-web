import { ArrowRight, Sparkles, Workflow, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../components/ui/Button";

const serviceHighlights = [
  {
    title: "Product Engineering",
    description: "Design and build resilient digital products from idea to scalable release.",
    icon: Workflow,
  },
  {
    title: "Cloud Transformation",
    description: "Modernize workloads and data platforms with secure cloud-native architectures.",
    icon: ShieldCheck,
  },
  {
    title: "AI-Led Innovation",
    description: "Apply practical AI and automation to accelerate decisions and customer outcomes.",
    icon: Sparkles,
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-white py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-white to-accent/10" aria-hidden="true" />
        <div className="absolute -left-20 top-10 h-48 w-48 rounded-full bg-primary/10" aria-hidden="true" />
        <div className="absolute right-0 top-20 h-56 w-56 rounded-full bg-accent/10" aria-hidden="true" />

        <div className="relative mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
          <p className="mb-4 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            Digital Innovation Partner
          </p>
          <h1 className="max-w-3xl text-4xl font-bold text-neutral-900 md:text-5xl">
            Building dependable technology experiences that move business forward.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-neutral-600">
            Gleecus TechLabs helps enterprises transform ideas into dependable digital products through engineering,
            cloud, and AI capabilities delivered by multidisciplinary teams.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/services">
              <Button type="button">
                Explore Services
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button type="button" variant="secondary">
                Start a Conversation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-neutral-900 md:text-3xl">Services At A Glance</h2>
          <p className="mt-2 max-w-2xl text-base text-neutral-600">
            End-to-end delivery capabilities designed for enterprise velocity and long-term maintainability.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {serviceHighlights.map((service) => {
              const Icon = service.icon;
              return (
                <article key={service.title} className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-xl font-semibold text-neutral-900">{service.title}</h3>
                  <p className="mt-2 text-base text-neutral-600">{service.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 md:grid-cols-2 md:px-6 lg:px-8">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 md:text-3xl">Why Gleecus</h2>
            <p className="mt-4 text-base text-neutral-600">
              We combine strategic thinking with delivery discipline. Our teams embed deeply with client stakeholders,
              prioritize measurable outcomes, and deliver with transparency at every stage.
            </p>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6 shadow-sm">
            <ul className="space-y-3 text-base text-neutral-600">
              <li>Business-aligned engineering roadmaps with clear milestones.</li>
              <li>Secure-by-design delivery practices across cloud and application layers.</li>
              <li>Flexible engagement models for discovery, build, and scale phases.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-primary py-16">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 px-4 md:flex-row md:items-center md:px-6 lg:px-8">
          <div>
            <h2 className="text-2xl font-bold text-white md:text-3xl">Ready to shape your next digital milestone?</h2>
            <p className="mt-2 text-base text-white/90">Tell us your business challenge and we will propose a practical delivery path.</p>
          </div>
          <Link to="/contact">
            <Button type="button" variant="secondary" className="border-white text-white hover:bg-white/10">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}