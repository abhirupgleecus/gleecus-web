export type PostType = "article" | "case_study";

export interface Post {
  id: string;
  title: string;
  body: string;
  type: PostType;
  author_id: string;
  created_at: string;
  author_name?: string;
  author?: {
    username?: string;
  };
}

export interface PostCreateRequest {
  title: string;
  body: string;
  type: PostType;
}

export interface PostAttachmentUploadResponse {
  url: string;
  href: string;
  filename: string;
  content_type: string;
  filesize: number;
}
