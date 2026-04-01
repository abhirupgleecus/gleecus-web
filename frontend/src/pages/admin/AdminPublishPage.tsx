import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

import { createInvitation, createPost, deletePost, getPosts } from "../../api/client";
import { ApiError } from "../../api/http";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import ErrorBanner from "../../components/ui/ErrorBanner";
import FieldError from "../../components/ui/FieldError";
import RichTextEditor from "../../components/ui/RichTextEditor";
import { TableSkeleton } from "../../components/ui/Skeleton";
import { useAuth } from "../../context/AuthContext";
import type { UserRole } from "../../types/auth";
import type { Post, PostType } from "../../types/post";
import { formatDate } from "../../utils/formatDate";
import { toErrorMessage } from "../../utils/errors";
import { htmlToPlainText } from "../../utils/richText";

interface PublishFormState {
  title: string;
  type: PostType;
  body: string;
}

interface InviteFormState {
  email: string;
  role: UserRole;
}

function resolveAuthor(post: Post) {
  if (post.author_name) {
    return post.author_name;
  }

  if (post.author?.username) {
    return post.author.username;
  }

  return `Author ${post.author_id.slice(0, 8)}`;
}

export default function AdminPublishPage() {
  const { token, user } = useAuth();

  const [inviteForm, setInviteForm] = useState<InviteFormState>({
    email: "",
    role: "admin",
  });
  const [inviteFieldErrors, setInviteFieldErrors] = useState<Record<string, string>>({});
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [inviteSubmitting, setInviteSubmitting] = useState(false);

  const [form, setForm] = useState<PublishFormState>({
    title: "",
    type: "article",
    body: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);

  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [confirmPostId, setConfirmPostId] = useState<string | null>(null);

  const selectedPost = useMemo(() => posts.find((post) => post.id === confirmPostId) ?? null, [confirmPostId, posts]);

  const loadPosts = useCallback(async () => {
    if (!token) {
      return;
    }

    setLoadingPosts(true);
    setPostsError(null);

    try {
      const [articles, caseStudies] = await Promise.all([getPosts("article"), getPosts("case_study")]);
      const unique = new Map<string, Post>();

      [...articles, ...caseStudies].forEach((post) => {
        unique.set(post.id, post);
      });

      const sorted = [...unique.values()].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

      setPosts(sorted);
    } catch (err) {
      if (err instanceof ApiError) {
        setPostsError(toErrorMessage(err.data, "Unable to load posts right now."));
      } else {
        setPostsError("Unable to load posts right now.");
      }
    } finally {
      setLoadingPosts(false);
    }
  }, [token]);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  async function onInviteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors: Record<string, string> = {};

    if (!inviteForm.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteForm.email)) {
      errors.email = "Enter a valid email address.";
    }

    if (!inviteForm.role) {
      errors.role = "Role is required.";
    }

    setInviteFieldErrors(errors);
    setInviteError(null);
    setInviteSuccess(null);

    if (Object.keys(errors).length > 0 || !token) {
      return;
    }

    setInviteSubmitting(true);

    try {
      const response = await createInvitation(
        {
          email: inviteForm.email,
          role: inviteForm.role,
        },
        token,
      );

      setInviteForm({ email: "", role: "admin" });
      setInviteSuccess(
        `Invitation sent to ${response.email} as ${response.role}. Token expires on ${formatDate(response.expires_at)}.`,
      );
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 403) {
          setInviteError("Only superadmin users can send invitations.");
        } else {
          setInviteError(toErrorMessage(err.data, "Unable to send invitation right now."));
        }
      } else {
        setInviteError("Unable to send invitation right now.");
      }
    } finally {
      setInviteSubmitting(false);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors: Record<string, string> = {};

    if (!form.title.trim()) {
      errors.title = "Title is required.";
    }

    if (!form.body.trim()) {
      errors.body = "Body is required.";
    } else if (!htmlToPlainText(form.body)) {
      errors.body = "Body is required.";
    }

    setFieldErrors(errors);
    setFormError(null);
    setFormSuccess(null);

    if (Object.keys(errors).length > 0 || !token) {
      return;
    }

    setSubmitting(true);

    try {
      await createPost(form, token);
      setForm({ title: "", type: "article", body: "" });
      setFormSuccess("Post published successfully.");
      await loadPosts();
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(toErrorMessage(err.data, "Unable to publish post right now."));
      } else {
        setFormError("Unable to publish post right now.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function onConfirmDelete() {
    if (!token || !selectedPost) {
      return;
    }

    setDeletingPostId(selectedPost.id);

    try {
      await deletePost(selectedPost.id, token);
      setPosts((prev) => prev.filter((post) => post.id !== selectedPost.id));
      setConfirmPostId(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setPostsError(toErrorMessage(err.data, "Unable to delete post right now."));
      } else {
        setPostsError("Unable to delete post right now.");
      }
    } finally {
      setDeletingPostId(null);
    }
  }

  return (
    <div className="space-y-10">
      {user?.role === "superadmin" ? (
        <section className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-neutral-900">Invite Users</h1>
          <p className="mt-2 text-base text-neutral-600">
            Invite a new admin or superadmin user. Invitation links expire after 48 hours.
          </p>

          <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={onInviteSubmit} noValidate>
            {inviteError ? (
              <div className="md:col-span-2">
                <ErrorBanner message={inviteError} />
              </div>
            ) : null}
            {inviteSuccess ? (
              <div className="rounded-lg border border-success/40 bg-success/10 p-4 text-sm font-medium text-success md:col-span-2">
                {inviteSuccess}
              </div>
            ) : null}

            <div>
              <label htmlFor="invite_email" className="mb-1 block text-sm font-medium text-neutral-700">
                Email
              </label>
              <input
                id="invite_email"
                type="email"
                value={inviteForm.email}
                onChange={(event) => setInviteForm((prev) => ({ ...prev, email: event.target.value }))}
                className={`w-full rounded-lg border px-4 py-2.5 text-base transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                  inviteFieldErrors.email ? "border-danger focus:ring-danger/40" : "border-neutral-200"
                }`}
              />
              <FieldError message={inviteFieldErrors.email} />
            </div>

            <div>
              <label htmlFor="invite_role" className="mb-1 block text-sm font-medium text-neutral-700">
                Role
              </label>
              <select
                id="invite_role"
                value={inviteForm.role}
                onChange={(event) => setInviteForm((prev) => ({ ...prev, role: event.target.value as UserRole }))}
                className={`w-full rounded-lg border px-4 py-2.5 text-base transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                  inviteFieldErrors.role ? "border-danger focus:ring-danger/40" : "border-neutral-200"
                }`}
              >
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
              <FieldError message={inviteFieldErrors.role} />
            </div>

            <div className="md:col-span-2">
              <Button type="submit" loading={inviteSubmitting}>
                Send Invitation
              </Button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-3xl font-bold text-neutral-900">Publish Content</h2>
        <p className="mt-2 text-base text-neutral-600">Create and publish new articles or case studies for the public insights pages.</p>

        <form className="mt-6 grid gap-4" onSubmit={onSubmit} noValidate>
          {formError ? <ErrorBanner message={formError} /> : null}
          {formSuccess ? (
            <div className="rounded-lg border border-success/40 bg-success/10 p-4 text-sm font-medium text-success">{formSuccess}</div>
          ) : null}

          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-neutral-700">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              className={`w-full rounded-lg border px-4 py-2.5 text-base transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                fieldErrors.title ? "border-danger focus:ring-danger/40" : "border-neutral-200"
              }`}
            />
            <FieldError message={fieldErrors.title} />
          </div>

          <div>
            <span className="mb-1 block text-sm font-medium text-neutral-700">Type</span>
            <div className="flex flex-wrap gap-4">
              <label className="inline-flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="radio"
                  name="type"
                  value="article"
                  checked={form.type === "article"}
                  onChange={() => setForm((prev) => ({ ...prev, type: "article" }))}
                  className="h-4 w-4 accent-primary"
                />
                Article
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="radio"
                  name="type"
                  value="case_study"
                  checked={form.type === "case_study"}
                  onChange={() => setForm((prev) => ({ ...prev, type: "case_study" }))}
                  className="h-4 w-4 accent-primary"
                />
                Case Study
              </label>
            </div>
          </div>

          <RichTextEditor
            id="body"
            label="Body"
            value={form.body}
            token={token}
            onChange={(nextBody) => {
              setForm((prev) => ({ ...prev, body: nextBody }));
              if (fieldErrors.body) {
                setFieldErrors((prev) => ({ ...prev, body: "" }));
              }
            }}
            error={fieldErrors.body}
          />

          <div>
            <Button type="submit" loading={submitting}>
              Publish Post
            </Button>
          </div>
        </form>
      </section>

      <section>
        <h3 className="text-2xl font-bold text-neutral-900">Published Posts</h3>
        <p className="mt-2 text-base text-neutral-600">Manage all existing articles and case studies.</p>

        {postsError ? <div className="mt-4"><ErrorBanner message={postsError} /></div> : null}

        {loadingPosts ? <div className="mt-4"><TableSkeleton rows={6} /></div> : null}

        {!loadingPosts && !postsError && posts.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="No published posts" description="Create your first article or case study using the form above." />
          </div>
        ) : null}

        {!loadingPosts && !postsError && posts.length > 0 ? (
          <div className="mt-4 overflow-x-auto rounded-lg border border-neutral-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Author</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700">Date</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="px-4 py-4 text-sm text-neutral-900">{post.title}</td>
                    <td className="px-4 py-4 text-sm text-neutral-600">{post.type === "article" ? "Article" : "Case Study"}</td>
                    <td className="px-4 py-4 text-sm text-neutral-600">{resolveAuthor(post)}</td>
                    <td className="px-4 py-4 text-sm text-neutral-600">{formatDate(post.created_at)}</td>
                    <td className="px-4 py-4 text-right">
                      <Button type="button" variant="danger" onClick={() => setConfirmPostId(post.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>

      <ConfirmDialog
        isOpen={Boolean(selectedPost)}
        title="Delete post"
        message={`Are you sure you want to delete \"${selectedPost?.title ?? "this post"}\"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={Boolean(deletingPostId)}
        onCancel={() => {
          if (!deletingPostId) {
            setConfirmPostId(null);
          }
        }}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
}
