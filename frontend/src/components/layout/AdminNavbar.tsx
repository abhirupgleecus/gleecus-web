import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import Logo from "./Logo";

function navLinkClass(isActive: boolean) {
  return [
    "border-b-2 px-1 py-6 text-sm font-medium transition-colors",
    isActive ? "border-primary text-primary" : "border-transparent text-neutral-600 hover:text-primary",
  ].join(" ");
}

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const userLabel = useMemo(() => {
    if (!user?.id) {
      return "User";
    }

    return `User ${user.id.slice(0, 8)}`;
  }, [user?.id]);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white">
      <nav className="mx-auto flex w-full max-w-7xl items-center px-4 md:px-6 lg:px-8">
        <div className="py-4">
          <Logo />
        </div>

        <div className="hidden flex-1 items-center justify-center md:flex">
          <NavLink to="/admin/publish" className={({ isActive }) => navLinkClass(isActive)}>
            Publish
          </NavLink>
          <NavLink to="/admin/queries" className={({ isActive }) => navLinkClass(isActive)}>
            Queries
          </NavLink>
        </div>

        <div className="relative ml-auto">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border border-neutral-200 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span className="font-medium text-neutral-900">{userLabel}</span>
            <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">{user?.role}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
          </button>

          {isMenuOpen ? (
            <div className="absolute right-0 mt-2 w-44 rounded-lg border border-neutral-200 bg-white p-2 shadow-md">
              <Button
                type="button"
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
              >
                Log out
              </Button>
            </div>
          ) : null}
        </div>
      </nav>
    </header>
  );
}