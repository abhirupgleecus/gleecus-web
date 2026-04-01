import { request } from "./http";
import type { ContactCreateRequest, ContactSubmission } from "../types/contact";
import type { LoginRequest, LoginResponse, SignupRequest } from "../types/auth";
import type { InvitationCreateRequest, InvitationResponse } from "../types/invitation";
import type { Post, PostCreateRequest, PostType } from "../types/post";

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
