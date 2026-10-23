from decimal import Decimal

import pytest

from app.services.league import calculate_post_pt


def test_zero_valid_views_have_zero_points():
    assert calculate_post_pt(valid_views=0, likes=200, saves=50, reposts=10) == Decimal("0.00")


def test_formula_applies_like_save_and_repost_weights():
    assert calculate_post_pt(valid_views=1000, likes=10, saves=2, reposts=1) == Decimal("0.01")


def test_high_engagement_score_is_deterministically_rounded():
    score = calculate_post_pt(valid_views=10000, likes=1000, saves=200, reposts=100)
    assert score == Decimal("0.19")
    assert score.as_tuple().exponent == -2


@pytest.mark.parametrize(
    "metrics",
    [
        {"valid_views": -1, "likes": 0, "saves": 0, "reposts": 0},
        {"valid_views": 1, "likes": -1, "saves": 0, "reposts": 0},
        {"valid_views": 1, "likes": 0, "saves": 0, "reposts": -1},
    ],
)
def test_negative_metrics_are_rejected(metrics):
    with pytest.raises(ValueError):
        calculate_post_pt(**metrics)
