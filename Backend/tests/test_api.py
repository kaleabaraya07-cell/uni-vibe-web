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
