from getpass import getpass

from sqlalchemy import func, select

from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models import User


def main() -> None:
    email = input("Administrator email: ").strip().lower()
    username = input("Administrator username: ").strip().lower()
    display_name = input("Administrator display name: ").strip()
    password = getpass("Administrator password (12+ characters): ")
    confirmation = getpass("Confirm password: ")
    if password != confirmation:
        raise SystemExit("Passwords did not match.")
    if len(password) < 12:
        raise SystemExit("Password must contain at least 12 characters.")

    with SessionLocal.begin() as db:
        if db.scalar(select(func.count()).select_from(User).where(User.role == "admin")):
            raise SystemExit("An administrator already exists; use the authorized review process.")
        if db.scalar(
            select(User.id).where(
                (func.lower(User.email) == email) | (func.lower(User.username) == username)
            )
        ):
            raise SystemExit("Email or username is already registered.")
        db.add(
            User(
                email=email,
                username=username,
                display_name=display_name,
                password_hash=hash_password(password),
                role="admin",
                is_student=False,
                verification_status="none",
            )
        )
    print("Administrator account created.")


if __name__ == "__main__":
    main()
