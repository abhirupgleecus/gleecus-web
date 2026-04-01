import { Cloud, Cog, Database, Smartphone, Shield, Sparkles } from "lucide-react";

const services = [
  {
    title: "Product Engineering",
    description:
      "Deliver enterprise-grade web and mobile products with modern architecture and disciplined release cycles.",
    icon: Cog,
  },
  {
    title: "Cloud Transformation",
    description:
      "Migrate and optimize workloads across cloud platforms with reliability, governance, and cost control.",
    icon: Cloud,
  },
  {
    title: "Data Platforms",
    description: "Build scalable data pipelines and analytics foundations that unlock faster business decisions.",
    icon: Database,
  },
  {
    title: "Digital Experience",
    description: "Create intuitive customer journeys across channels with thoughtful UX and robust frontend engineering.",
    icon: Smartphone,
  },
  {
    title: "Cybersecurity Enablement",
    description:
      "Strengthen platform security with best-practice controls, compliance support, and ongoing risk reduction.",
    icon: Shield,
  },
  {
    title: "AI & Automation",
    description:
      "Embed practical AI capabilities into business workflows to improve productivity and service outcomes.",
    icon: Sparkles,
  },
];

export default function ServicesPage() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-900">Our Services</h1>
        <p className="mt-3 max-w-2xl text-base text-neutral-600">
          Comprehensive technology capabilities to support your product roadmap, modernization journey, and innovation goals.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article key={service.title} className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-xl font-semibold text-neutral-900">{service.title}</h2>
                <p className="mt-2 text-base text-neutral-600">{service.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}