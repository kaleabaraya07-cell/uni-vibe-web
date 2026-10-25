from functools import lru_cache
from pathlib import Path

from pydantic import SecretStr, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


BACKEND_ROOT = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=BACKEND_ROOT / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_env: str = "development"
    app_secret_key: SecretStr = SecretStr("local-development-key-change-before-deploy")
    database_url: str = (
        "postgresql+psycopg://uni_vibe_app@127.0.0.1:5432/uni_vibe_dev"
    )
    session_cookie_name: str = "univibe_session"
    session_ttl_seconds: int = 60 * 60 * 24 * 14
    session_cookie_secure: bool = False
    cors_origins: str = (
        "http://localhost:5173,http://127.0.0.1:5173,"
        "http://localhost:4173,http://127.0.0.1:4173"
    )
    uploads_dir: Path = BACKEND_ROOT / "uploads"
    max_upload_bytes: int = 50 * 1024 * 1024

    @field_validator("session_ttl_seconds", "max_upload_bytes")
    @classmethod
    def require_positive_limits(cls, value: int) -> int:
        if value <= 0:
            raise ValueError("Configured limits must be positive")
        return value

    @field_validator("uploads_dir", mode="before")
    @classmethod
    def resolve_uploads_dir(cls, value: Path | str) -> Path:
        path = Path(value)
        if not path.is_absolute():
            path = BACKEND_ROOT / path
        return path.resolve()

    @model_validator(mode="after")
    def require_production_secret(self) -> "Settings":
        if self.app_env.lower() == "production":
            if len(self.app_secret_key.get_secret_value()) < 32:
                raise ValueError("APP_SECRET_KEY must contain at least 32 characters")
            if not self.session_cookie_secure:
                raise ValueError("SESSION_COOKIE_SECURE must be enabled in production")
        return self

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
