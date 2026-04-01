import { createElement, useEffect, useMemo, useRef, useState } from "react";

import { uploadPostAttachment } from "../../api/client";
import { ApiError } from "../../api/http";
import { toErrorMessage } from "../../utils/errors";
import FieldError from "./FieldError";

import "trix";
import "trix/dist/trix.css";

interface RichTextEditorProps {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  token?: string | null;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}

interface TrixEditorController {
  loadHTML: (html: string) => void;
}

interface TrixAttachment {
  file?: File;
  setUploadProgress: (progress: number) => void;
  setAttributes: (attributes: Record<string, string | number>) => void;
  remove: () => void;
}

interface TrixAttachmentEvent extends Event {
  attachment: TrixAttachment;
}

interface TrixEditorElement extends HTMLElement {
  editor?: TrixEditorController;
  value?: string;
}

const DEFAULT_MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
const parsedAttachmentLimit = Number(import.meta.env.VITE_POST_ATTACHMENT_MAX_BYTES);
const MAX_ATTACHMENT_BYTES =
  Number.isFinite(parsedAttachmentLimit) && parsedAttachmentLimit > 0
    ? parsedAttachmentLimit
    : DEFAULT_MAX_ATTACHMENT_BYTES;
const ALLOWED_ATTACHMENT_MIME_TYPES = new Set([
  "application/msword",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/webp",
  "text/plain",
]);

function isAllowedAttachment(file: File): boolean {
  return ALLOWED_ATTACHMENT_MIME_TYPES.has(file.type.toLowerCase());
}

export default function RichTextEditor({
  id,
  label,
  value,
  onChange,
  token,
  error,
  disabled = false,
  placeholder = "Write your post content...",
}: RichTextEditorProps) {
  const generatedId = useMemo(
    () => id || `rich-text-${Math.random().toString(36).slice(2, 10)}`,
    [id],
  );

  const inputId = `${generatedId}-input`;
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const editorRef = useRef<TrixEditorElement | null>(null);
  const lastEditorValueRef = useRef<string>(value || "");

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadingFilename, setUploadingFilename] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  useEffect(() => {
    const hiddenInput = hiddenInputRef.current;
    const editor = editorRef.current;
    if (!editor || !editor.editor || !hiddenInput) {
      return;
    }

    const nextValue = value || "";
    if (nextValue !== lastEditorValueRef.current) {
      hiddenInput.value = nextValue;
      editor.editor.loadHTML(nextValue);
      lastEditorValueRef.current = nextValue;
    }
  }, [value]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    const handleChange = (event: Event) => {
      const trixEditor = event.target as TrixEditorElement;
      const nextValue = trixEditor.value ?? hiddenInputRef.current?.value ?? "";
      lastEditorValueRef.current = nextValue;
      onChange(nextValue);
    };

    const handleAttachmentAdd = async (event: Event) => {
      const attachmentEvent = event as TrixAttachmentEvent;
      const attachment = attachmentEvent.attachment;
      const file = attachment.file;

      if (!file) {
        return;
      }

      if (!token) {
        setUploadError("You must be logged in to upload attachments.");
        attachment.remove();
        return;
      }

      if (!isAllowedAttachment(file)) {
        setUploadError("Unsupported attachment type. Use common image, PDF, DOC/DOCX, or TXT files.");
        attachment.remove();
        return;
      }

      if (file.size > MAX_ATTACHMENT_BYTES) {
        setUploadError(`Attachment exceeds ${Math.floor(MAX_ATTACHMENT_BYTES / (1024 * 1024))} MB limit.`);
        attachment.remove();
        return;
      }

      setUploadError(null);
      setUploadingFilename(file.name);
      setUploadProgress(0);

      try {
        const uploaded = await uploadPostAttachment(file, token, (percent) => {
          attachment.setUploadProgress(percent);
          setUploadProgress(percent);
        });

        attachment.setAttributes({
          url: uploaded.url,
          href: uploaded.href,
          filename: uploaded.filename,
          filesize: uploaded.filesize,
          contentType: uploaded.content_type,
        });
        attachment.setUploadProgress(100);
      } catch (err) {
        const message =
          err instanceof ApiError
            ? toErrorMessage(err.data, err.message || "Attachment upload failed.")
            : "Attachment upload failed.";

        setUploadError(message);
        attachment.remove();
      } finally {
        setUploadingFilename(null);
      }
    };

    editor.addEventListener("trix-change", handleChange);
    editor.addEventListener("trix-attachment-add", handleAttachmentAdd);

    return () => {
      editor.removeEventListener("trix-change", handleChange);
      editor.removeEventListener("trix-attachment-add", handleAttachmentAdd);
    };
  }, [onChange, token]);

  return (
    <div>
      <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-neutral-700">
        {label}
      </label>
      <div className={`rich-text-editor-shell ${error ? "rich-text-editor-shell--error" : ""}`}>
        <input ref={hiddenInputRef} id={inputId} type="hidden" defaultValue={value} />
        {createElement("trix-editor", {
          ref: editorRef,
          input: inputId,
          placeholder,
          className: disabled ? "trix-content pointer-events-none opacity-60" : "trix-content",
          "aria-disabled": disabled,
        })}
      </div>

      {uploadingFilename ? (
        <p className="mt-2 text-sm text-neutral-600">
          Uploading {uploadingFilename} ({uploadProgress}%)
        </p>
      ) : null}

      {uploadError ? <p className="mt-2 text-sm font-medium text-danger">{uploadError}</p> : null}
      <FieldError message={error} />
    </div>
  );
}
