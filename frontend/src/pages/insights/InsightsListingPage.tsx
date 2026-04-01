import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import { getPosts } from "../../api/client";
import { ApiError } from "../../api/http";
import ErrorBanner from "../../components/ui/ErrorBanner";
import EmptyState from "../../components/ui/EmptyState";
import { CardSkeleton } from "../../components/ui/Skeleton";
import type { Post, PostType } from "../../types/post";
import { formatDate } from "../../utils/formatDate";
import { toErrorMessage } from "../../utils/errors";
import { truncateText } from "../../utils/text";

interface InsightsListingPageProps {
  title: string;
  postType: PostType;
  description: string;
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

export default function InsightsListingPage({ title, postType, description }: InsightsListingPageProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const detailBasePath = useMemo(
    () => (postType === "article" ? "/insights/articles" : "/insights/case-studies"),
    [postType],
  );

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await getPosts(postType);

        if (!mounted) {
          return;
        }

        const sorted = [...data].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        setPosts(sorted);
      } catch (err) {
        if (!mounted) {
          return;
        }

        if (err instanceof ApiError) {
          setError(toErrorMessage(err.data, "Unable to load posts right now."));
        } else {
          setError("Unable to load posts right now.");
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
  }, [postType]);

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-900">{title}</h1>
        <p className="mt-3 max-w-3xl text-base text-neutral-600">{description}</p>

        {error ? <div className="mt-8"><ErrorBanner message={error} /></div> : null}

        {loading ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : null}

        {!loading && !error && posts.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title={`No ${postType === "article" ? "articles" : "case studies"} yet`}
              description="New insights will appear here once they are published."
            />
          </div>
        ) : null}

        {!loading && !error && posts.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="flex h-full flex-col rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <h2 className="text-xl font-semibold text-neutral-900">{post.title}</h2>
                <p className="mt-2 text-sm text-neutral-500">
                  By {authorLabel(post)} · {formatDate(post.created_at)}
                </p>
                <p className="mt-4 flex-1 text-base text-neutral-600">{truncateText(post.body, 180)}</p>
                <Link to={`${detailBasePath}/${post.id}`} className="mt-5 inline-flex text-sm font-medium text-primary hover:text-primary-dark">
                  Read more
                </Link>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}