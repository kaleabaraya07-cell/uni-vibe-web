import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.db.session import get_db
from app.main import create_app
from app.models import University


@pytest.fixture
def client():
    engine = create_engine(
        "sqlite+pysqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSession = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
    Base.metadata.create_all(engine)
    session = TestingSession()
    session.add(
        University(
            id="uni-test",
            name="Example University",
            short_name="EXU",
            location="Test City",
            description="Development test fixture",
        )
    )
    session.commit()

    def override_get_db():
        try:
            yield session
        finally:
            pass

    app = create_app()
    app.state.test_session = session
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    session.close()
    Base.metadata.drop_all(engine)
    engine.dispose()
