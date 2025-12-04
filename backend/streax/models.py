# backend/streax/models.py
from dataclasses import dataclass

@dataclass
class Task:
    id: int
    name: str
    type: str
    base_xp: int
    required_daily: bool = False

@dataclass
class UserState:
    user_id: int
    total_xp: int = 0
    current_level: int = 0
    streak_days: int = 0
    last_active_date: str = ""
    consecutive_misses: int = 0
