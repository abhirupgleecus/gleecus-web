import { Fragment, useEffect, useState } from "react";

import { getContactSubmissions } from "../../api/client";
import { ApiError } from "../../api/http";
import EmptyState from "../../components/ui/EmptyState";
import ErrorBanner from "../../components/ui/ErrorBanner";
import { TableSkeleton } from "../../components/ui/Skeleton";
import { useAuth } from "../../context/AuthContext";
import type { ContactSubmission } from "../../types/contact";
import { formatDate } from "../../utils/formatDate";
import { toErrorMessage } from "../../utils/errors";
import { truncateText } from "../../utils/text";

export default function AdminQueriesPage() {
  const { token } = useAuth();
  const [queries, setQueries] = useState<ContactSubmission[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    const authToken = token;
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await getContactSubmissions(authToken);

        if (!mounted) {
          return;
        }

        const sorted = [...data].sort(
          (a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime(),
        );
        setQueries(sorted);
      } catch (err) {
        if (!mounted) {
          return;
        }

        if (err instanceof ApiError) {
          setError(toErrorMessage(err.data, "Unable to load submissions right now."));
        } else {
          setError("Unable to load submissions right now.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [token]);

  return (
    <section>
      <h1 className="text-3xl font-bold text-neutral-900">Contact Queries</h1>
      <p className="mt-2 text-base text-neutral-600">Review all website inquiries submitted through the contact form.</p>

      {error ? <div className="mt-4"><ErrorBanner message={error} /></div> : null}

      {loading ? <div className="mt-4"><TableSkeleton rows={6} /></div> : null}

      {!loading && !error && queries.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No submissions yet" description="Incoming inquiries from the contact page will appear here." />
        </div>
      ) : null}

      {!loading && !error && queries.length > 0 ? (
        <div className="mt-4 overflow-x-auto rounded-lg border border-neutral-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Business Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Service Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Message</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Submitted At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {queries.map((query) => {
                const isExpanded = expandedId === query.id;

                return (
                  <Fragment key={query.id}>
                    <tr>
                      <td className="px-4 py-4 text-sm text-neutral-900">
                        <button
                          type="button"
                          className="text-left hover:text-primary"
                          onClick={() => setExpandedId((prev) => (prev === query.id ? null : query.id))}
                        >
                          {query.full_name}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-sm text-neutral-600">{query.business_email}</td>
                      <td className="px-4 py-4 text-sm text-neutral-600">{query.service_category || "-"}</td>
                      <td className="px-4 py-4 text-sm text-neutral-600">{truncateText(query.message, 80)}</td>
                      <td className="px-4 py-4 text-sm text-neutral-600">{formatDate(query.submitted_at)}</td>
                    </tr>
                    {isExpanded ? (
                      <tr key={`${query.id}-expanded`}>
                        <td colSpan={5} className="bg-neutral-50 px-4 py-4 text-sm text-neutral-600">
                          <p className="font-medium text-neutral-900">Full Message</p>
                          <p className="mt-1 whitespace-pre-line">{query.message}</p>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}

