import { Link } from "react-router-dom";

import Button from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="max-w-lg rounded-lg border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-primary">404</p>
        <h1 className="mt-2 text-3xl font-bold text-neutral-900">Page not found</h1>
        <p className="mt-3 text-base text-neutral-600">The page you are looking for does not exist or may have moved.</p>
        <div className="mt-6">
          <Link to="/">
            <Button type="button">Go to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}