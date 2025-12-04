# backend/streax/engine.py
from typing import List, Tuple
from .models import Task, UserState
from datetime import date
import math

def compute_day_xp(tasks: List[Task], streak_days: int, full_day: bool) -> int:
    base = sum(t.base_xp for t in tasks)
    mult = 1.0 + min(0.05 * max(0, streak_days), 1.0)
    full_bonus = 0.10 if full_day else 0.0
    total = base * mult * (1.0 + full_bonus)
    return int(round(total))

def process_day(user_state: UserState, completed_tasks: List[Task], today_iso: str, daily_target_count: int = 0) -> Tuple[UserState, dict]:
    # minimal, deterministic processing (safe for initial testing)
    if daily_target_count > 0:
        req_tasks = [t for t in completed_tasks if t.required_daily]
        full_day = len(req_tasks) >= daily_target_count
    else:
        full_day = len(completed_tasks) > 0

    day_xp = compute_day_xp(completed_tasks, user_state.streak_days, full_day)
    user_state.total_xp += day_xp

    if len(completed_tasks) > 0:
        user_state.consecutive_misses = 0
        user_state.streak_days += 1
    else:
        user_state.consecutive_misses += 1
        user_state.streak_days = 0

    # simple level relation for now (we'll replace with your L^1.5 later)
    user_state.current_level = user_state.total_xp // 100

    user_state.last_active_date = today_iso

    event = {
        "date": today_iso,
        "day_xp": day_xp,
        "total_xp": user_state.total_xp,
        "streak_days": user_state.streak_days,
        "consecutive_misses": user_state.consecutive_misses,
        "current_level": user_state.current_level,
    }
    return user_state, event
