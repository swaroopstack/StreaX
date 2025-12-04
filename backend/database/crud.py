# backend/database/crud.py
from sqlalchemy.orm import Session
from database.models import User as ORMUser, Task as ORMTask, TaskLog
from datetime import datetime
from typing import List, Dict

def create_user(db: Session, username: str, user_id: int = None) -> ORMUser:
    """Create a user row. If user_id provided and exists, return it instead."""
    if user_id is not None:
        u = db.get(ORMUser, user_id)
        if u:
            return u
    user = ORMUser(username=username)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user(db: Session, user_id: int):
    return db.get(ORMUser, user_id)

def get_user_by_username(db: Session, username: str):
    return db.query(ORMUser).filter(ORMUser.username == username).first()

def ensure_task(db: Session, user_id: int, name: str, type_: str, base_xp: int, required_daily: bool):
    """Ensure a task exists for the user; create if missing. Return ORMTask."""
    t = db.query(ORMTask).filter(ORMTask.user_id == user_id, ORMTask.name == name).first()
    if t:
        return t
    t = ORMTask(user_id=user_id, name=name, type=type_, base_xp=base_xp, required_daily=required_daily)
    db.add(t)
    db.commit()
    db.refresh(t)
    return t

def create_task_logs(db: Session, user_id: int, task_awards: List[Dict]):
    """
    task_awards: list of dicts with keys: task_id, xp_awarded, streak_at_time, is_full_day, date
    """
    logs = []
    for a in task_awards:
        log = TaskLog(
            task_id=a["task_id"],
            user_id=user_id,
            date=a.get("date"),
            xp_awarded=a.get("xp_awarded", 0),
            streak_at_time=a.get("streak_at_time", 0),
            is_full_day=a.get("is_full_day", False)
        )
        db.add(log)
        logs.append(log)
    db.commit()
    # refresh logs
    for l in logs:
        db.refresh(l)
    return logs

def update_user_after_event(db: Session, user: ORMUser, event: dict):
    """
    event contains keys: total_xp, streak_days, consecutive_misses, current_level, date
    """
    user.total_xp = event.get("total_xp", user.total_xp)
    user.current_level = event.get("current_level", user.current_level)
    user.streak_days = event.get("streak_days", user.streak_days)
    user.consecutive_misses = event.get("consecutive_misses", user.consecutive_misses)
    user.last_active_date = event.get("date", user.last_active_date)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
