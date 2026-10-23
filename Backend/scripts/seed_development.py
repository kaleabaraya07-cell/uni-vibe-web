from sqlalchemy import select

from app.db.session import SessionLocal
from app.models import University


DEVELOPMENT_UNIVERSITIES = (
    {
        "id": "uni2",
        "name": "Addis Ababa University",
        "short_name": "AAU",
        "location": "Addis Ababa, Ethiopia",
        "description": "Ethiopia's oldest and largest university.",
        "website": "https://aau.edu.et",
    },
    {
        "id": "uni3",
        "name": "Jimma University",
        "short_name": "JU",
        "location": "Jimma, Ethiopia",
        "description": "A research-intensive university known for health sciences and agriculture.",
        "website": "https://ju.edu.et",
    },
    {
        "id": "uni4",
        "name": "Hawassa University",
        "short_name": "HU",
        "location": "Hawassa, Ethiopia",
        "description": "Lakeside campus with a vibrant student community.",
        "website": "https://hu.edu.et",
    },
    {
        "id": "uni5",
        "name": "Bahir Dar University",
        "short_name": "BDU",
        "location": "Bahir Dar, Ethiopia",
        "description": "One of the top universities near the source of the Blue Nile.",
        "website": "https://bdu.edu.et",
    },
    {
        "id": "uni6",
        "name": "Mekelle University",
        "short_name": "MU",
        "location": "Mekelle, Ethiopia",
        "description": "A prominent university in Northern Ethiopia.",
        "website": "https://mu.edu.et",
    },
    {
        "id": "uni7",
        "name": "Adama Science and Technology University",
        "short_name": "ASTU",
        "location": "Adama, Ethiopia",
        "description": "Focused on engineering and technology.",
        "website": "https://astu.edu.et",
    },
)


def main() -> None:
    with SessionLocal.begin() as db:
        existing = list(db.scalars(select(University)))
        existing_ids = {university.id for university in existing}
        existing_names = {university.name for university in existing}
        existing_short_names = {university.short_name for university in existing}
        for values in DEVELOPMENT_UNIVERSITIES:
            if (
                values["id"] not in existing_ids
                and values["name"] not in existing_names
                and values["short_name"] not in existing_short_names
            ):
                db.add(University(**values))
    print("Development university directory seeded without modifying existing records.")


if __name__ == "__main__":
    main()
