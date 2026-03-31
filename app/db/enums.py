from enum import Enum


class UserRole(str, Enum):
    ADMIN = "admin"
    SUPERADMIN = "superadmin"


class PostType(str, Enum):
    ARTICLE = "article"
    CASE_STUDY = "case_study"