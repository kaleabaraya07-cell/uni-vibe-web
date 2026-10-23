from fastapi import APIRouter

from app.api.routes import auth, health, posts, rankings, search, universities, users, verification


api_router = APIRouter(prefix="/api/v1")
api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(universities.router, prefix="/universities", tags=["universities"])
api_router.include_router(posts.router, tags=["posts"])
api_router.include_router(rankings.router, prefix="/rankings", tags=["rankings"])
api_router.include_router(verification.router, prefix="/verification", tags=["verification"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(search.router, prefix="/search", tags=["search"])
