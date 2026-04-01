import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getPostById } from "../../api/client";
import { ApiError } from "../../api/http";
import ErrorBanner from "../../components/ui/ErrorBanner";
import { CardSkeleton, SkeletonBlock } from "../../components/ui/Skeleton";
import type { Post } from "../../types/post";
import { formatDate } from "../../utils/formatDate";
import { toErrorMessage } from "../../utils/errors";

interface InsightDetailPageProps {
  listPath: string;
  listLabel: string;
}

function authorLabel(post: Post): string {
  if (post.author_name) {
    return post.author_name;
  }

  if (post.author?.username) {
    return post.author.username;
  }

  return `Author ${post.author_id.slice(0, 8)}`;
}

export default function InsightDetailPage({ listPath, listLabel }: InsightDetailPageProps) {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Post ID is missing.");
      return;
    }

    const postId = id;
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await getPostById(postId);

        if (mounted) {
          setPost(data);
        }
      } catch (err) {
        if (!mounted) {
          return;
        }

        if (err instanceof ApiError && err.status === 404) {
          setError("The requested post was not found.");
        } else if (err instanceof ApiError) {
          setError(toErrorMessage(err.data, "Unable to load this post right now."));
        } else {
          setError("Unable to load this post right now.");
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
  }, [id]);

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto w-full max-w-4xl px-4 md:px-6 lg:px-8">
        <Link to={listPath} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to {listLabel}
        </Link>

        {loading ? (
          <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
            <SkeletonBlock className="mb-4 h-8 w-4/5" />
            <SkeletonBlock className="mb-6 h-4 w-1/2" />
            <CardSkeleton />
          </div>
        ) : null}

        {error ? (
          <div className="mt-8">
            <ErrorBanner message={error} />
          </div>
        ) : null}

        {!loading && !error && post ? (
          <article className="mt-8 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-bold text-neutral-900">{post.title}</h1>
            <p className="mt-2 text-sm text-neutral-500">
              By {authorLabel(post)} · {formatDate(post.created_at)}
            </p>
            <div className="mt-6 whitespace-pre-line text-base text-neutral-600">{post.body}</div>
          </article>
        ) : null}
      </div>
    </section>
  );
}
