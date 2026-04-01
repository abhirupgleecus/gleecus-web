export interface ContactCreateRequest {
  full_name: string;
  business_email: string;
  service_category?: string;
  message: string;
  captcha_token: string;
}

export interface ContactSubmission {
  id: string;
  full_name: string;
  business_email: string;
  service_category?: string | null;
  message: string;
  submitted_at: string;
}