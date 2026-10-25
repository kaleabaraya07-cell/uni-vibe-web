from datetime import datetime, timedelta, timezone

from app.core.security import hash_password
from app.models import AdminAuditLog, User, ViewSession


def register(client, *, email="student@example.com", username="campus_student"):
    return client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "username": username,
            "display_name": "Campus Student",
            "password": "a-long-test-password",
            "is_student": True,
            "university_id": "uni-test",
            "department": "Science",
        },
    )


def test_health_and_database_readiness(client):
    assert client.get("/api/v1/health").json() == {"status": "ok"}
    assert client.get("/api/v1/ready").json() == {"status": "ready"}


def test_register_creates_pending_student_with_hashed_password(client):
    response = register(client)
    assert response.status_code == 201
    assert response.json()["verification_status"] == "pending"
    assert response.json()["role"] == "user"
    user = client.app.state.test_session.query(User).one()
    assert user.password_hash != "a-long-test-password"


def test_registration_requires_existing_university_for_student(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "missing@example.com",
            "username": "missinguni",
            "display_name": "Missing University",
            "password": "a-long-test-password",
            "is_student": True,
            "university_id": "does-not-exist",
        },
    )
    assert response.status_code == 422
    assert response.json()["error"]["code"] == "invalid_request"


def test_registration_rejects_short_password(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "short@example.test",
            "username": "shortpass",
            "display_name": "Short Password",
            "password": "short",
        },
    )
    assert response.status_code == 422


def test_duplicate_account_is_conflict(client):
    assert register(client).status_code == 201
    response = register(client, username="another_name")
    assert response.status_code == 409
    assert response.json()["error"]["code"] == "conflict"


def test_login_me_and_logout_use_http_only_session_cookie(client):
    assert register(client).status_code == 201

    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "STUDENT@example.com", "password": "a-long-test-password"},
    )
    assert login_response.status_code == 200
    assert login_response.cookies.get("univibe_session")
    assert "httponly" in login_response.headers["set-cookie"].lower()

    current = client.get("/api/v1/auth/me")
    assert current.status_code == 200
    assert current.json()["email"] == "student@example.com"

    logout_response = client.post("/api/v1/auth/logout")
    assert logout_response.status_code == 204
    assert client.get("/api/v1/auth/me").status_code == 401


def test_public_profile_and_authenticated_profile_update(client):
    registered = register(client)
    login = client.post(
        "/api/v1/auth/login",
        json={"email": "student@example.com", "password": "a-long-test-password"},
    )
    assert login.status_code == 200

    profile = client.get(f"/api/v1/users/{registered.json()['id']}")
    assert profile.status_code == 200
    assert profile.json()["username"] == "campus_student"
    assert "email" not in profile.json()

    updated = client.patch(
        "/api/v1/auth/me",
        json={
            "display_name": "  Updated Student ",
            "bio": "  Campus contributor ",
            "department": "  Biology ",
        },
    )
    assert updated.status_code == 200
    assert updated.json()["display_name"] == "Updated Student"
    assert updated.json()["bio"] == "Campus contributor"
    assert updated.json()["department"] == "Biology"


def test_invalid_login_does_not_authenticate(client):
    assert register(client).status_code == 201
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "student@example.com", "password": "wrong-password"},
    )
    assert response.status_code == 401
    assert response.json()["error"]["code"] == "unauthorized"


def test_university_directory_and_missing_university_request(client):
    universities = client.get("/api/v1/universities")
    assert universities.status_code == 200
    assert [item["id"] for item in universities.json()] == ["uni-test"]

    request = client.post(
        "/api/v1/universities/requests",
        json={
            "name": "New University",
            "location": "New City",
            "applicant_email": "requester@example.com",
        },
    )
    assert request.status_code == 201
    assert request.json()["status"] == "pending"


def register_verified_student(client):
    response = register(client)
    assert response.status_code == 201
    user = client.app.state.test_session.get(User, response.json()["id"])
    user.verification_status = "verified"
    client.app.state.test_session.commit()
    login = client.post(
        "/api/v1/auth/login",
        json={"email": "student@example.com", "password": "a-long-test-password"},
    )
    assert login.status_code == 200
    return user


def test_unverified_student_cannot_create_post(client):
    register(client)
    client.post(
        "/api/v1/auth/login",
        json={"email": "student@example.com", "password": "a-long-test-password"},
    )
    response = client.post(
        "/api/v1/posts",
        data={"caption": "Campus moment"},
        files={"media": ("photo.png", b"\x89PNG\r\n\x1a\nmedia", "image/png")},
    )
    assert response.status_code == 403


def test_verified_student_can_create_post_with_safe_upload(client, tmp_path, monkeypatch):
    from app.api.routes.posts import settings

    register_verified_student(client)
    monkeypatch.setattr(settings, "uploads_dir", tmp_path)
    response = client.post(
        "/api/v1/posts",
        data={"caption": "A campus moment"},
        files={"media": ("student-photo.png", b"\x89PNG\r\n\x1a\nimage-data", "image/png")},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["media_type"] == "image"
    assert data["media_url"].startswith("/api/v1/media/")
    assert len(list(tmp_path.iterdir())) == 1


def test_upload_rejects_unsupported_and_mismatched_media(client, tmp_path, monkeypatch):
    from app.api.routes.posts import settings

    register_verified_student(client)
    monkeypatch.setattr(settings, "uploads_dir", tmp_path)
    unsupported = client.post(
        "/api/v1/posts",
        data={"caption": "unsupported"},
        files={"media": ("file.svg", b"<svg/>", "image/svg+xml")},
    )
    assert unsupported.status_code == 415
    mismatch = client.post(
        "/api/v1/posts",
        data={"caption": "mismatch"},
        files={"media": ("file.png", b"not a png", "image/png")},
    )
    assert mismatch.status_code == 415
    assert list(tmp_path.iterdir()) == []


def test_authenticated_profile_image_upload_persists_and_is_retrievable(
    client, tmp_path, monkeypatch
):
    from app.api.routes.auth import settings

    response = register(client, email="profile@example.com", username="profile_user")
    user_id = response.json()["id"]
    assert client.post(
        "/api/v1/auth/login",
        json={"email": "profile@example.com", "password": "a-long-test-password"},
    ).status_code == 200
    monkeypatch.setattr(settings, "uploads_dir", tmp_path)

    uploaded = client.post(
        "/api/v1/auth/me/images/avatar",
        files={"image": ("avatar.png", b"\x89PNG\r\n\x1a\navatar-content", "image/png")},
    )
    assert uploaded.status_code == 200
    avatar_url = uploaded.json()["avatar_url"]
    assert avatar_url.startswith("/api/v1/media/")
    assert uploaded.json()["cover_image_url"] is None

    profile = client.get(f"/api/v1/users/{user_id}")
    assert profile.json()["avatar_url"] == avatar_url
    assert profile.json()["cover_image_url"] is None
    database_user = client.app.state.test_session.get(User, user_id)
    assert database_user.avatar_path == avatar_url.rsplit("/", 1)[1]
    assert database_user.cover_image_path is None

    image = client.get(avatar_url)
    assert image.status_code == 200
    assert image.content == b"\x89PNG\r\n\x1a\navatar-content"
    assert image.headers["content-type"] == "image/png"
    assert client.get("/api/v1/auth/me").json()["avatar_url"] == avatar_url


def test_profile_image_survives_database_and_app_restart(tmp_path, monkeypatch):
    from fastapi.testclient import TestClient
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker

    from app.api.routes.auth import settings
    from app.db.base import Base
    from app.db.session import get_db
    from app.main import create_app
    from app.models import University

    database_path = tmp_path / "profile-test.sqlite3"
    uploads_dir = tmp_path / "persistent-uploads"
    monkeypatch.setattr(settings, "uploads_dir", uploads_dir)

    def create_test_app():
        engine = create_engine(
            f"sqlite+pysqlite:///{database_path}",
            connect_args={"check_same_thread": False},
        )
        session_factory = sessionmaker(bind=engine, expire_on_commit=False)
        app = create_app()

        def override_get_db():
            with session_factory() as session:
                yield session

        app.dependency_overrides[get_db] = override_get_db
        return app, engine

    app, engine = create_test_app()
    Base.metadata.create_all(engine)
    with sessionmaker(bind=engine)() as session:
        session.add(
            University(
                id="uni-test",
                name="Example University",
                short_name="EXU",
                location="Test City",
                description="Restart persistence test fixture",
            )
        )
        session.commit()

    with TestClient(app) as first_client:
        registered = register(
            first_client, email="restart@example.com", username="restart_profile"
        )
        user_id = registered.json()["id"]
        assert first_client.post(
            "/api/v1/auth/login",
            json={"email": "restart@example.com", "password": "a-long-test-password"},
        ).status_code == 200
        uploaded = first_client.post(
            "/api/v1/auth/me/images/avatar",
            files={"image": ("avatar.png", b"\x89PNG\r\n\x1a\npersistent", "image/png")},
        )
        assert uploaded.status_code == 200
        avatar_url = uploaded.json()["avatar_url"]
        session_cookie = first_client.cookies.get("univibe_session")

    engine.dispose()
    restarted_app, restarted_engine = create_test_app()
    try:
        with TestClient(restarted_app) as restarted_client:
            restarted_client.cookies.set("univibe_session", session_cookie)
            assert restarted_client.get("/api/v1/auth/me").json()["avatar_url"] == avatar_url
            assert restarted_client.get(f"/api/v1/users/{user_id}").json()["avatar_url"] == avatar_url
            persisted_image = restarted_client.get(avatar_url)
            assert persisted_image.status_code == 200
            assert persisted_image.content == b"\x89PNG\r\n\x1a\npersistent"
    finally:
        restarted_engine.dispose()


def test_profile_image_upload_requires_authentication(client, tmp_path, monkeypatch):
    from app.api.routes.auth import settings

    monkeypatch.setattr(settings, "uploads_dir", tmp_path)
    response = client.post(
        "/api/v1/auth/me/images/avatar",
        files={"image": ("avatar.png", b"\x89PNG\r\n\x1a\nimage", "image/png")},
    )
    assert response.status_code == 401
    assert list(tmp_path.iterdir()) == []


def test_profile_image_upload_rejects_invalid_type_and_size_without_replacing(
    client, tmp_path, monkeypatch
):
    import app.api.routes.auth as auth_routes

    from app.api.routes.auth import settings

    registered = register(client, email="profile@example.com", username="profile_user")
    user_id = registered.json()["id"]
    client.post(
        "/api/v1/auth/login",
        json={"email": "profile@example.com", "password": "a-long-test-password"},
    )
    monkeypatch.setattr(settings, "uploads_dir", tmp_path)
    first = client.post(
        "/api/v1/auth/me/images/avatar",
        files={"image": ("avatar.png", b"\x89PNG\r\n\x1a\nfirst", "image/png")},
    )
    assert first.status_code == 200
    original_url = first.json()["avatar_url"]
    original_name = original_url.rsplit("/", 1)[1]

    invalid_type = client.post(
        "/api/v1/auth/me/images/avatar",
        files={"image": ("image.svg", b"<svg/>", "image/svg+xml")},
    )
    assert invalid_type.status_code == 415
    invalid_content = client.post(
        "/api/v1/auth/me/images/avatar",
        files={"image": ("image.png", b"not png", "image/png")},
    )
    assert invalid_content.status_code == 415

    monkeypatch.setattr(auth_routes, "PROFILE_IMAGE_MAX_BYTES", 10)
    oversized = client.post(
        "/api/v1/auth/me/images/avatar",
        files={"image": ("large.png", b"\x89PNG\r\n\x1a\nmore-than-ten", "image/png")},
    )
    assert oversized.status_code == 413
    database_user = client.app.state.test_session.get(User, user_id)
    assert database_user.avatar_path == original_name
    assert (tmp_path / original_name).exists()
    assert len(list(tmp_path.iterdir())) == 1


def test_profile_image_replacement_removes_old_media_and_other_users_cannot_change_it(
    client, tmp_path, monkeypatch
):
    from app.api.routes.auth import settings

    first_user = register(client, email="first@example.com", username="first_profile")
    first_id = first_user.json()["id"]
    client.post(
        "/api/v1/auth/login",
        json={"email": "first@example.com", "password": "a-long-test-password"},
    )
    monkeypatch.setattr(settings, "uploads_dir", tmp_path)
    first_upload = client.post(
        "/api/v1/auth/me/images/cover",
        files={"image": ("cover.webp", b"RIFF0000WEBPfirst", "image/webp")},
    )
    first_url = first_upload.json()["cover_image_url"]
    first_filename = first_url.rsplit("/", 1)[1]

    client.post("/api/v1/auth/logout")
    register(client, email="second@example.com", username="second_profile")
    client.post(
        "/api/v1/auth/login",
        json={"email": "second@example.com", "password": "a-long-test-password"},
    )
    second_upload = client.post(
        "/api/v1/auth/me/images/cover",
        files={"image": ("cover.webp", b"RIFF0000WEBPsecond", "image/webp")},
    )
    assert second_upload.status_code == 200
    first_database_user = client.app.state.test_session.get(User, first_id)
    assert first_database_user.cover_image_path == first_filename
    assert (tmp_path / first_filename).exists()
    assert client.get(f"/api/v1/users/{first_id}").json()["cover_image_url"] == first_url

    replacement = client.post(
        "/api/v1/auth/me/images/cover",
        files={"image": ("replacement.jpg", b"\xff\xd8\xffreplacement", "image/jpeg")},
    )
    assert replacement.status_code == 200
    replacement_url = replacement.json()["cover_image_url"]
    assert replacement_url != second_upload.json()["cover_image_url"]
    assert client.get(second_upload.json()["cover_image_url"]).status_code == 404
    assert client.get(replacement_url).content == b"\xff\xd8\xffreplacement"


def test_media_retrieval_rejects_non_generated_filenames(client, tmp_path, monkeypatch):
    from app.api.routes.posts import settings

    monkeypatch.setattr(settings, "uploads_dir", tmp_path)
    (tmp_path / "secret.txt").write_text("private")
    assert client.get("/api/v1/media/secret.txt").status_code == 404
    assert client.get("/api/v1/media/../secret.txt").status_code == 404


def test_reactions_comments_and_view_sessions_are_persisted_and_deduplicated(client):
    user = register_verified_student(client)
    created = client.post(
        "/api/v1/posts",
        data={
            "caption": "A text-only campus note",
            "category": "Campus life",
            "hashtags": "#Study #Campus",
        },
    )
    assert created.status_code == 201
    post_id = created.json()["id"]
    assert created.json()["category"] == "Campus life"
    assert created.json()["hashtags"] == ["#Study", "#Campus"]

    like = client.post(f"/api/v1/posts/{post_id}/likes")
    assert like.json() == {"active": True, "count": 1}
    assert [post["id"] for post in client.get("/api/v1/posts/liked").json()] == [post_id]
    assert client.post(f"/api/v1/posts/{post_id}/likes").json() == {
        "active": False,
        "count": 0,
    }
    assert client.post(f"/api/v1/posts/{post_id}/saves").json()["active"] is True
    assert client.post(f"/api/v1/posts/{post_id}/reposts").json()["active"] is True
    assert [post["id"] for post in client.get("/api/v1/posts/saved").json()] == [post_id]
    assert [post["id"] for post in client.get("/api/v1/posts/liked").json()] == []
    comment = client.post(
        f"/api/v1/posts/{post_id}/comments",
        json={"body": "  Great campus moment  "},
    )
    assert comment.status_code == 201
    assert comment.json()["body"] == "Great campus moment"
    assert comment.json()["author"]["username"] == "campus_student"
    assert client.get(f"/api/v1/posts/{post_id}/comments").json()[0]["body"] == "Great campus moment"

    start = client.post(f"/api/v1/posts/{post_id}/views/start")
    session_id = start.json()["view_session_id"]
    no_playback_report = client.post(
        f"/api/v1/posts/{post_id}/views/{session_id}/complete"
    )
    assert no_playback_report.status_code == 422
    assert client.app.state.test_session.get(ViewSession, session_id).completed_at is None

    early = client.post(
        f"/api/v1/posts/{post_id}/views/{session_id}/complete",
        json={"watched_seconds": 4},
    )
    assert early.status_code == 422

    view_session = client.app.state.test_session.get(
        ViewSession, session_id
    )
    view_session.started_at = datetime.now(timezone.utc) - timedelta(seconds=5)
    client.app.state.test_session.commit()
    waited_without_playback = client.post(
        f"/api/v1/posts/{post_id}/views/{session_id}/complete"
    )
    assert waited_without_playback.status_code == 422
    assert view_session.completed_at is None

    assert client.post(
        f"/api/v1/posts/{post_id}/views/{session_id}/complete",
        json={"watched_seconds": 4},
    ).status_code == 204

    second_session = client.post(f"/api/v1/posts/{post_id}/views/start").json()["view_session_id"]
    second = client.app.state.test_session.get(type(view_session), second_session)
    second.started_at = datetime.now(timezone.utc) - timedelta(seconds=6)
    client.app.state.test_session.commit()
    assert client.post(
        f"/api/v1/posts/{post_id}/views/{second_session}/complete",
        json={"watched_seconds": 5},
    ).status_code == 204

    feed = client.get("/api/v1/feed").json()["data"][0]
    assert feed["likes"] == 0
    assert feed["saves"] == 1
    assert feed["reposts"] == 1
    assert feed["comments"] == 1
    assert feed["views"] == 1
    assert user.id == feed["author"]["id"]
    assert client.get(f"/api/v1/feed?user_id={user.id}").json()["data"][0]["id"] == post_id
    assert client.get("/api/v1/feed?university_id=uni-test").json()["data"][0]["id"] == post_id
    search = client.get("/api/v1/search?query=campus").json()
    assert search["vibes"][0]["id"] == post_id
    assert search["people"][0]["id"] == user.id
    university_search = client.get("/api/v1/search?query=example").json()
    assert university_search["universities"][0]["id"] == "uni-test"
    year = datetime.now(timezone.utc).year
    university_ranking = client.get(
        f"/api/v1/rankings/universities?season_year={year}"
    ).json()
    assert university_ranking[0]["university_id"] == "uni-test"
    student_ranking = client.get(
        f"/api/v1/rankings/students?season_year={year}&limit=10"
    ).json()
    assert student_ranking[0]["user_id"] == user.id
    student_league = client.get(f"/api/v1/rankings/students/{user.id}?season_year={year}")
    assert student_league.status_code == 200
    assert student_league.json()["user_id"] == user.id


def test_student_verification_requires_admin_decision_and_audit(client):
    register(client)
    student = client.app.state.test_session.query(User).one()
    assert client.post(
        "/api/v1/auth/login",
        json={"email": "student@example.com", "password": "a-long-test-password"},
    ).status_code == 200
    assert client.get("/api/v1/verification/requests").status_code == 403

    request = client.post(
        "/api/v1/verification/requests",
        json={"university_email": "student@university.edu", "note": "Please review"},
    )
    assert request.status_code == 201
    verification_id = request.json()["id"]

    admin = User(
        email="admin@example.com",
        username="local_admin",
        display_name="Local Admin",
        password_hash=hash_password("another-long-admin-password"),
        role="admin",
        is_student=False,
        verification_status="none",
    )
    client.app.state.test_session.add(admin)
    client.app.state.test_session.commit()
    assert client.post(
        "/api/v1/auth/login",
        json={"email": "admin@example.com", "password": "another-long-admin-password"},
    ).status_code == 200

    decision = client.post(
        f"/api/v1/verification/requests/{verification_id}/decision",
        json={"decision": "approved", "note": "Verified locally"},
    )
    assert decision.status_code == 200
    assert client.app.state.test_session.get(User, student.id).verification_status == "verified"
    audit_rows = client.app.state.test_session.query(
        AdminAuditLog
    ).all()
    assert len(audit_rows) == 1
