const teamMembers = [
  {
    name: "Aarav Mehta",
    title: "Head of Engineering",
    bio: "Leads architecture and delivery quality across enterprise modernization programs.",
  },
  {
    name: "Nisha Rao",
    title: "Director, Product Strategy",
    bio: "Shapes product roadmaps and aligns cross-functional teams around measurable outcomes.",
  },
  {
    name: "Rohit Menon",
    title: "Cloud Practice Lead",
    bio: "Builds resilient cloud operating models and migration playbooks for scale.",
  },
  {
    name: "Priya Kulkarni",
    title: "Design Lead",
    bio: "Designs thoughtful digital experiences that simplify complex journeys.",
  },
  {
    name: "Sanjay Patel",
    title: "AI Solutions Architect",
    bio: "Brings applied AI and automation patterns into enterprise products.",
  },
  {
    name: "Kavya Nair",
    title: "Delivery Manager",
    bio: "Ensures execution clarity, cadence, and stakeholder confidence across engagements.",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AboutMeetTheTeamPage() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-900">Meet The Team</h1>
        <p className="mt-3 max-w-2xl text-base text-neutral-600">
          A multidisciplinary group of strategists, engineers, and designers committed to high-quality outcomes.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <article key={member.name} className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">
                {initials(member.name)}
              </div>
              <h2 className="mt-4 text-xl font-semibold text-neutral-900">{member.name}</h2>
              <p className="text-sm font-medium text-primary">{member.title}</p>
              <p className="mt-3 text-base text-neutral-600">{member.bio}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}