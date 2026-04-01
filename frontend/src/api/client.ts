import { ApiError, buildApiUrl, request } from "./http";
import type { ContactCreateRequest, ContactSubmission } from "../types/contact";
import type { LoginRequest, LoginResponse, SignupRequest } from "../types/auth";
import type { InvitationCreateRequest, InvitationResponse } from "../types/invitation";
import type { Post, PostAttachmentUploadResponse, PostCreateRequest, PostType } from "../types/post";
import type { ManagedUser } from "../types/user";

export function login(payload: LoginRequest): Promise<LoginResponse> {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function signup(token: string, payload: SignupRequest): Promise<LoginResponse> {
  return request<LoginResponse>("/auth/signup", {
    method: "POST",
    query: { token },
    body: payload,
  });
}

export async function getPosts(type?: PostType): Promise<Post[]> {
  const data = await request<Post[]>("/posts/", {
    query: type ? { type } : undefined,
  });

  if (!type) {
    return data;
  }

  // Backend currently returns all posts; client-side filter keeps list views correct.
  return data.filter((post) => post.type === type);
}

export function getPostById(postId: string): Promise<Post> {
  return request<Post>(`/posts/${postId}`);
}

export function createPost(payload: PostCreateRequest, token: string): Promise<Post> {
  return request<Post>("/posts/", {
    method: "POST",
    body: payload,
    token,
  });
}

export function uploadPostAttachment(
  file: File,
  token: string,
  onProgress?: (percent: number) => void,
): Promise<PostAttachmentUploadResponse> {
  const url = buildApiUrl("/posts/attachments");

  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("Accept", "application/json");

    xhr.upload.onprogress = (event) => {
      if (!onProgress || !event.lengthComputable) {
        return;
      }

      const percent = Math.round((event.loaded / event.total) * 100);
      onProgress(percent);
    };

    xhr.onerror = () => {
      reject(new ApiError("Network error while uploading attachment.", 0));
    };

    xhr.onload = () => {
      const status = xhr.status;
      const raw = xhr.responseText;
      let parsed: unknown;

      if (raw) {
        try {
          parsed = JSON.parse(raw);
        } catch {
          parsed = raw;
        }
      }

      if (status < 200 || status >= 300) {
        const detail =
          typeof parsed === "object" && parsed !== null && "detail" in parsed
            ? (parsed as { detail?: unknown }).detail
            : undefined;
        const message = typeof detail === "string" ? detail : "Attachment upload failed.";
        reject(new ApiError(message, status, parsed));
        return;
      }

      resolve(parsed as PostAttachmentUploadResponse);
    };

    xhr.send(formData);
  });
}

export function deletePost(postId: string, token: string): Promise<void> {
  return request<void>(`/posts/${postId}`, {
    method: "DELETE",
    token,
  });
}

export function createInvitation(payload: InvitationCreateRequest, token: string): Promise<InvitationResponse> {
  return request<InvitationResponse>("/invitations/", {
    method: "POST",
    body: payload,
    token,
  });
}

export function getUsers(token: string): Promise<ManagedUser[]> {
  return request<ManagedUser[]>("/users/", {
    token,
  });
}

export function deleteUser(userId: string, token: string): Promise<void> {
  return request<void>(`/users/${userId}`, {
    method: "DELETE",
    token,
  });
}

export function submitContact(payload: ContactCreateRequest): Promise<ContactSubmission> {
  return request<ContactSubmission>("/contact/", {
    method: "POST",
    body: payload,
  });
}

export function getContactSubmissions(token: string): Promise<ContactSubmission[]> {
  return request<ContactSubmission[]>("/contact/submissions", {
    token,
  });
}
