export default function AboutWhoWeArePage() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 md:grid-cols-2 md:px-6 lg:px-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Who We Are</h1>
          <p className="mt-4 text-base text-neutral-600">
            Gleecus TechLabs is a technology services partner focused on helping organizations translate ambitious ideas
            into dependable digital solutions. Our teams blend strategy, product thinking, and engineering excellence.
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-neutral-900">Our Mission</h2>
          <p className="mt-3 text-base text-neutral-600">
            To empower enterprises with practical innovation through strong engineering foundations, transparent delivery,
            and long-term technology partnerships.
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-neutral-900">Our Story</h2>
          <p className="mt-3 text-base text-neutral-600">
            Founded to bridge business strategy and software execution, Gleecus has grown into a multidisciplinary team
            trusted by clients for modernization, product launches, and scale programs across sectors.
          </p>

          <h2 className="mt-8 text-2xl font-semibold text-neutral-900">Our Values</h2>
          <ul className="mt-3 space-y-2 text-base text-neutral-600">
            <li>Ownership with accountability in every sprint and milestone.</li>
            <li>Customer-centric decisions informed by measurable outcomes.</li>
            <li>Continuous learning and quality-focused engineering culture.</li>
          </ul>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex h-full min-h-80 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 via-accent/10 to-neutral-50 p-8">
            <p className="max-w-sm text-center text-lg font-medium text-neutral-900">
              Visual Placeholder: team at work, collaboration moments, and innovation workshops.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}