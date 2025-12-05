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

# -------------------------
# New listing helpers
# -------------------------
def list_tasks_for_user(db: Session, user_id: int, limit: int = 100, offset: int = 0):
    q = db.query(ORMTask).filter(ORMTask.user_id == user_id).order_by(ORMTask.id.asc()).limit(limit).offset(offset)
    return q.all()

def list_logs_for_user(db: Session, user_id: int, limit: int = 100, offset: int = 0):
    q = db.query(TaskLog).filter(TaskLog.user_id == user_id).order_by(TaskLog.id.desc()).limit(limit).offset(offset)
    return q.all()

def get_user_stats(db: Session, user_id: int):
    """
    Return a simple stats dict: total_xp, current_level, streak_days, last_active_date, xp_to_next_level
    xp_to_next_level uses simple formula: next_level_threshold = (current_level + 1) * 100
    """
    u = db.get(ORMUser, user_id)
    if not u:
        return None
    next_threshold = (u.current_level + 1) * 100
    xp_to_next = max(0, next_threshold - u.total_xp)
    return {
        "id": u.id,
        "username": u.username,
        "total_xp": u.total_xp,
        "current_level": u.current_level,
        "streak_days": u.streak_days,
        "last_active_date": u.last_active_date,
        "consecutive_misses": u.consecutive_misses,
        "xp_to_next_level": xp_to_next,
        "next_level_threshold": next_threshold
    }

# -------------------------
# Task CRUD helpers
# -------------------------
def get_task(db: Session, task_id: int):
    return db.get(ORMTask, task_id)

def create_task(db: Session, user_id: int, name: str, type_: str, base_xp: int, required_daily: bool = False):
    t = ORMTask(user_id=user_id, name=name, type=type_, base_xp=base_xp, required_daily=required_daily)
    db.add(t)
    db.commit()
    db.refresh(t)
    return t

def update_task(db: Session, task_id: int, **fields):
    t = db.get(ORMTask, task_id)
    if not t:
        return None
    for k, v in fields.items():
        if hasattr(t, k):
            setattr(t, k, v)
    db.add(t)
    db.commit()
    db.refresh(t)
    return t

def delete_task(db: Session, task_id: int):
    t = db.get(ORMTask, task_id)
    if not t:
        return False
    db.delete(t)
    db.commit()
    return True
