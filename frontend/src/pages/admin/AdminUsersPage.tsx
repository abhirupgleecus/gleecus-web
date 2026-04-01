import { useCallback, useEffect, useMemo, useState } from "react";

import { deleteUser, getUsers } from "../../api/client";
import { ApiError } from "../../api/http";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import ErrorBanner from "../../components/ui/ErrorBanner";
import { TableSkeleton } from "../../components/ui/Skeleton";
import { useAuth } from "../../context/AuthContext";
import type { ManagedUser } from "../../types/user";
import { formatDate } from "../../utils/formatDate";
import { toErrorMessage } from "../../utils/errors";

export default function AdminUsersPage() {
  const { token, user } = useAuth();

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [confirmUserId, setConfirmUserId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const selectedUser = useMemo(
    () => users.find((item) => item.id === confirmUserId) ?? null,
    [confirmUserId, users],
  );

  const loadUsers = useCallback(async () => {
    if (!token) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getUsers(token);
      const sorted = [...data].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setUsers(sorted);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 403) {
          setError("Only superadmin users can access user management.");
        } else {
          setError(toErrorMessage(err.data, "Unable to load users right now."));
        }
      } else {
        setError("Unable to load users right now.");
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  async function onConfirmDelete() {
    if (!token || !selectedUser) {
      return;
    }

    setDeleting(true);

    try {
      await deleteUser(selectedUser.id, token);
      setUsers((prev) => prev.filter((item) => item.id !== selectedUser.id));
      setConfirmUserId(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(toErrorMessage(err.data, "Unable to delete user right now."));
      } else {
        setError("Unable to delete user right now.");
      }
    } finally {
      setDeleting(false);
    }
  }

  if (user?.role !== "superadmin") {
    return (
      <section>
        <h1 className="text-3xl font-bold text-neutral-900">User Management</h1>
        <div className="mt-4">
          <ErrorBanner message="Only superadmin users can access this page." />
        </div>
      </section>
    );
  }

  return (
    <section>
      <h1 className="text-3xl font-bold text-neutral-900">User Management</h1>
      <p className="mt-2 text-base text-neutral-600">View and manage all admin and superadmin accounts.</p>

      {error ? (
        <div className="mt-4">
          <ErrorBanner message={error} />
        </div>
      ) : null}

      {loading ? (
        <div className="mt-4">
          <TableSkeleton rows={6} />
        </div>
      ) : null}

      {!loading && !error && users.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No users found" description="Invited admin and superadmin accounts will appear here." />
        </div>
      ) : null}

      {!loading && !error && users.length > 0 ? (
        <div className="mt-4 overflow-x-auto rounded-lg border border-neutral-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Username</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Active</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Created At</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {users.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-4 text-sm text-neutral-900">{item.username}</td>
                  <td className="px-4 py-4 text-sm text-neutral-600">{item.email}</td>
                  <td className="px-4 py-4 text-sm text-neutral-600">{item.role}</td>
                  <td className="px-4 py-4 text-sm text-neutral-600">{item.is_active ? "Yes" : "No"}</td>
                  <td className="px-4 py-4 text-sm text-neutral-600">{formatDate(item.created_at)}</td>
                  <td className="px-4 py-4 text-right">
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => setConfirmUserId(item.id)}
                      disabled={item.id === user.id}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <ConfirmDialog
        isOpen={Boolean(selectedUser)}
        title="Delete user"
        message={`Are you sure you want to delete \"${selectedUser?.username ?? "this user"}\"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
        onCancel={() => {
          if (!deleting) {
            setConfirmUserId(null);
          }
        }}
        onConfirm={onConfirmDelete}
      />
    </section>
  );
}
