def import_models():
    from app.models.user import User  # noqa
    from app.models.invitation import Invitation  # noqa
    from app.models.post import Post  # noqa
    from app.models.contact_submission import ContactSubmission  # noqa