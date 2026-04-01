import html
import re
from html.parser import HTMLParser

import bleach


ALLOWED_POST_TAGS = [
    "a",
    "blockquote",
    "br",
    "code",
    "del",
    "div",
    "em",
    "figcaption",
    "figure",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "hr",
    "img",
    "li",
    "ol",
    "p",
    "pre",
    "span",
    "strong",
    "ul",
]

ALLOWED_POST_ATTRIBUTES = {
    "*": ["class"],
    "a": ["href", "title", "target", "rel"],
    "figure": ["class", "data-trix-attachment", "data-trix-content-type", "data-trix-attributes"],
    "figcaption": ["class"],
    "img": ["src", "alt", "width", "height", "loading"],
}

ALLOWED_POST_PROTOCOLS = ["http", "https", "mailto"]


def _link_attribute_callback(attrs, _new=False):
    href_key = (None, "href")
    if href_key not in attrs:
        return attrs

    rel_key = (None, "rel")
    existing_rel = attrs.get(rel_key, "")
    rel_parts = {part for part in existing_rel.split() if part}
    rel_parts.update({"noopener", "noreferrer", "nofollow"})
    attrs[rel_key] = " ".join(sorted(rel_parts))
    attrs[(None, "target")] = "_blank"

    return attrs


_cleaner = bleach.Cleaner(
    tags=ALLOWED_POST_TAGS,
    attributes=ALLOWED_POST_ATTRIBUTES,
    protocols=ALLOWED_POST_PROTOCOLS,
    strip=True,
    strip_comments=True,
)


class _PlainTextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts: list[str] = []

    def handle_data(self, data: str):
        self.parts.append(data)


def sanitize_post_html(raw_html: str) -> str:
    cleaned_html = _cleaner.clean(raw_html or "")
    linkified_html = bleach.linkify(
        cleaned_html,
        callbacks=[_link_attribute_callback],
        skip_tags=["code", "pre"],
    )
    return linkified_html.strip()


def html_to_plain_text(value: str) -> str:
    parser = _PlainTextExtractor()
    parser.feed(value or "")
    parser.close()

    plain = html.unescape(" ".join(part.strip() for part in parser.parts if part.strip()))
    return re.sub(r"\s+", " ", plain).strip()
