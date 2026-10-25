from app.core.config import BACKEND_ROOT, Settings


def test_relative_upload_directory_is_anchored_to_backend_root(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)

    settings = Settings(_env_file=None, uploads_dir="uploads")

    assert settings.uploads_dir == BACKEND_ROOT / "uploads"
    assert settings.uploads_dir.is_absolute()
