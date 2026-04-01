import { Menu, X, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import Logo from "./Logo";

function navLinkClass(isActive: boolean) {
  return [
    "border-b-2 px-1 py-6 text-sm font-medium transition-colors",
    isActive ? "border-primary text-primary" : "border-transparent text-neutral-600 hover:text-primary",
  ].join(" ");
}

export default function PublicNavbar() {
  const { token } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileInsightsOpen, setMobileInsightsOpen] = useState(false);
  const location = useLocation();

  const isAboutActive = useMemo(() => location.pathname.startsWith("/about"), [location.pathname]);
  const isInsightsActive = useMemo(() => location.pathname.startsWith("/insights"), [location.pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white">
      <nav className="mx-auto flex w-full max-w-7xl items-center px-4 md:px-6 lg:px-8">
        <div className="py-4">
          <Logo />
        </div>

        <div className="hidden flex-1 items-center justify-center md:flex">
          <NavLink to="/" className={({ isActive }) => navLinkClass(isActive)} end>
            Home
          </NavLink>
          <NavLink to="/services" className={({ isActive }) => navLinkClass(isActive)}>
            Services
          </NavLink>

          <div className="group relative">
            <button
              className={navLinkClass(isAboutActive)}
              type="button"
              aria-haspopup="menu"
              aria-label="About us menu"
            >
              <span className="inline-flex items-center gap-1">
                About Us <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </span>
            </button>
            <div className="invisible absolute left-0 top-full w-52 rounded-lg border border-neutral-200 bg-white p-2 opacity-0 shadow-md transition-all duration-200 ease-out group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <Link
                to="/about/who-we-are"
                className="block rounded-md px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-primary"
              >
                Who We Are
              </Link>
              <Link
                to="/about/meet-the-team"
                className="block rounded-md px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-primary"
              >
                Meet the Team
              </Link>
            </div>
          </div>

          <div className="group relative">
            <button
              className={navLinkClass(isInsightsActive)}
              type="button"
              aria-haspopup="menu"
              aria-label="Insights menu"
            >
              <span className="inline-flex items-center gap-1">
                Insights <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </span>
            </button>
            <div className="invisible absolute left-0 top-full w-52 rounded-lg border border-neutral-200 bg-white p-2 opacity-0 shadow-md transition-all duration-200 ease-out group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <Link
                to="/insights/articles"
                className="block rounded-md px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-primary"
              >
                Articles
              </Link>
              <Link
                to="/insights/case-studies"
                className="block rounded-md px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-primary"
              >
                Case Studies
              </Link>
            </div>
          </div>
        </div>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          {token ? (
            <NavLink to="/admin/publish">
              <Button type="button">Admin Panel</Button>
            </NavLink>
          ) : (
            <>
              <NavLink to="/login">
                <Button variant="ghost" type="button">
                  Admin Login
                </Button>
              </NavLink>
              <NavLink to="/contact">
                <Button variant="secondary" type="button">
                  Contact Us
                </Button>
              </NavLink>
            </>
          )}
        </div>

        <button
          className="ml-auto inline-flex items-center justify-center rounded-md p-2 text-neutral-600 hover:bg-neutral-50 hover:text-primary md:hidden"
          type="button"
          aria-expanded={isMobileOpen}
          aria-controls="mobile-public-nav"
          aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsMobileOpen((prev) => !prev)}
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {isMobileOpen ? (
        <div id="mobile-public-nav" className="border-t border-neutral-200 bg-white p-4 md:hidden">
          <div className="space-y-1">
            <Link
              to="/"
              className="block rounded-md px-3 py-2 font-medium text-neutral-600 hover:bg-neutral-50"
              onClick={() => setIsMobileOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/services"
              className="block rounded-md px-3 py-2 font-medium text-neutral-600 hover:bg-neutral-50"
              onClick={() => setIsMobileOpen(false)}
            >
              Services
            </Link>

            <button
              type="button"
              className="flex w-full items-center justify-between rounded-md px-3 py-2 font-medium text-neutral-600 hover:bg-neutral-50"
              onClick={() => setMobileAboutOpen((prev) => !prev)}
            >
              About Us
              <ChevronDown className={`h-4 w-4 transition-transform ${mobileAboutOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileAboutOpen ? (
              <div className="ml-3 space-y-1">
                <Link
                  to="/about/who-we-are"
                  className="block rounded-md px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Who We Are
                </Link>
                <Link
                  to="/about/meet-the-team"
                  className="block rounded-md px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Meet the Team
                </Link>
              </div>
            ) : null}

            <button
              type="button"
              className="flex w-full items-center justify-between rounded-md px-3 py-2 font-medium text-neutral-600 hover:bg-neutral-50"
              onClick={() => setMobileInsightsOpen((prev) => !prev)}
            >
              Insights
              <ChevronDown className={`h-4 w-4 transition-transform ${mobileInsightsOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileInsightsOpen ? (
              <div className="ml-3 space-y-1">
                <Link
                  to="/insights/articles"
                  className="block rounded-md px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Articles
                </Link>
                <Link
                  to="/insights/case-studies"
                  className="block rounded-md px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Case Studies
                </Link>
              </div>
            ) : null}

            {token ? (
              <Link
                to="/admin/publish"
                className="mt-2 block rounded-md bg-primary px-3 py-2 text-center font-medium text-white hover:bg-primary-dark"
                onClick={() => setIsMobileOpen(false)}
              >
                Admin Panel
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="mt-2 block rounded-md px-3 py-2 text-center font-medium text-neutral-600 hover:bg-neutral-50"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Admin Login
                </Link>
                <Link
                  to="/contact"
                  className="mt-2 block rounded-md border border-primary px-3 py-2 text-center font-medium text-primary hover:bg-primary/5"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Contact Us
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
