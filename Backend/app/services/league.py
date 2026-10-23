from decimal import Decimal, ROUND_HALF_UP
from math import sqrt


CENT = Decimal("0.01")


def calculate_post_pt(
    *,
    valid_views: int,
    likes: int,
    saves: int,
    reposts: int,
) -> Decimal:
    if min(valid_views, likes, saves, reposts) < 0:
        raise ValueError("Scoring metrics cannot be negative")
    if valid_views == 0:
        return Decimal("0.00")

    views = Decimal(valid_views)
    like_rate = Decimal(likes) / views * 100
    save_rate = Decimal(saves) / views * 100
    repost_rate = Decimal(reposts) / views * 100
    weighted_engagement = like_rate + save_rate * 5 + repost_rate * 5
    confidence = sqrt(valid_views) / (sqrt(valid_views) + sqrt(1000))
    score = weighted_engagement * Decimal(str(confidence)) * Decimal("0.01")
    return score.quantize(CENT, rounding=ROUND_HALF_UP)
