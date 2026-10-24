from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class ErrorDetail(BaseModel):
    code: str
    message: str


class ErrorResponse(BaseModel):
    error: ErrorDetail


class UserCreate(BaseModel):
    email: EmailStr
    username: str = Field(min_length=3, max_length=32, pattern=r"^[A-Za-z0-9_.]+$")
    display_name: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=12, max_length=128)
    is_student: bool = False
    university_id: str | None = None
    department: str | None = Field(default=None, max_length=120)

    @field_validator("display_name", "username")
    @classmethod
    def reject_blank_text(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Field cannot be blank")
        return cleaned


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)
    remember_me: bool = True


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: EmailStr
    username: str
    display_name: str
    is_student: bool
    verification_status: str
    role: str
    university_id: str | None
    department: str | None
    bio: str
    created_at: datetime


class PublicUserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    username: str
    display_name: str
    is_student: bool
    verification_status: str
    university_id: str | None
    department: str | None
    bio: str
    created_at: datetime


class UniversityRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    short_name: str
    location: str
    description: str
    website: str | None


class UniversityRequestCreate(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    location: str = Field(default="", max_length=200)
    website: str | None = Field(default=None, max_length=255)
    applicant_email: EmailStr

    @field_validator("name")
    @classmethod
    def clean_name(cls, value: str) -> str:
        return value.strip()


class UniversityRequestRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    location: str
    website: str | None
    status: str
    submitted_at: datetime


class PostAuthorRead(BaseModel):
    id: str
    username: str
    display_name: str
    university_id: str | None
    is_student: bool
    verification_status: str


class PostRead(BaseModel):
    id: str
    caption: str
    media_type: str
    media_url: str | None
    category: str
    hashtags: list[str]
    university_id: str
    season_year: int
    created_at: datetime
    author: PostAuthorRead
    likes: int
    saves: int
    reposts: int
    comments: int
    views: int
    liked_by_me: bool = False
    saved_by_me: bool = False
    reposted_by_me: bool = False


class PostPage(BaseModel):
    data: list[PostRead]
    page: int
    limit: int


class SearchResults(BaseModel):
    vibes: list[PostRead]
    people: list[PublicUserRead]
    universities: list[UniversityRead]


class CommentCreate(BaseModel):
    body: str = Field(min_length=1, max_length=2000)

    @field_validator("body")
    @classmethod
    def clean_body(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Comment cannot be blank")
        return cleaned


class CommentAuthorRead(BaseModel):
    id: str
    username: str
    display_name: str


class CommentRead(BaseModel):
    id: str
    post_id: str
    user_id: str
    body: str
    created_at: datetime
    author: CommentAuthorRead


class ReactionResult(BaseModel):
    active: bool
    count: int


class ViewStarted(BaseModel):
    view_session_id: str


class ViewCompleted(BaseModel):
    watched_seconds: int = Field(ge=4, le=3600)


class RankingEntry(BaseModel):
    university_id: str
    name: str
    season_year: int
    points: str


class StudentLeagueRead(BaseModel):
    user_id: str
    season_year: int
    points: str
    rank: int | None
    university_id: str | None
    university_rank: int | None
    university_points: str


class VerificationRequestCreate(BaseModel):
    university_email: EmailStr
    note: str = Field(default="", max_length=500)


class VerificationRequestRead(BaseModel):
    id: str
    user_id: str
    university_id: str
    university_email: EmailStr
    note: str
    status: str
    submitted_at: datetime


class VerificationDecision(BaseModel):
    decision: str = Field(pattern="^(approved|rejected)$")
    note: str = Field(default="", max_length=500)


class UserProfileUpdate(BaseModel):
    display_name: str = Field(min_length=1, max_length=100)
    bio: str = Field(default="", max_length=500)
    department: str | None = Field(default=None, max_length=120)

    @field_validator("display_name")
    @classmethod
    def trim_display_name(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Display name cannot be blank")
        return cleaned

    @field_validator("bio")
    @classmethod
    def trim_bio(cls, value: str) -> str:
        return value.strip()
