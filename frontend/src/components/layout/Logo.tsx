import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="inline-flex items-center gap-2" aria-label="Gleecus TechLabs home">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">G</span>
      <span className="text-lg font-semibold text-neutral-900">Gleecus TechLabs</span>
    </Link>
  );
}