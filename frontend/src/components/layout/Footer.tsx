export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-neutral-600 md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Gleecus TechLabs. All rights reserved.</p>
        <p>Digital innovation and technology services.</p>
      </div>
    </footer>
  );
}