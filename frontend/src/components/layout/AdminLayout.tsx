import { Outlet } from "react-router-dom";

import AdminNavbar from "./AdminNavbar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminNavbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}