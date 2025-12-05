# backend/app/main.py
import sys
from pathlib import Path

# Ensure backend folder is on sys.path so imports resolve when running from backend/
here = Path(__file__).resolve().parents[1]
if str(here) not in sys.path:
    sys.path.insert(0, str(here))

from fastapi import FastAPI, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from streax.models import Task as DataTask, UserState as DataUserState
from streax.engine import process_day
from datetime import date
from fastapi.middleware.cors import CORSMiddleware

# DB imports
from database.connection import SessionLocal
from database import crud

app = FastAPI(title="StreaX Engine API - Dev (DB)")

# Allow frontend dev origin (adjust later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for API
class TaskIn(BaseModel):
    id: int
    name: str
    type: str
    base_xp: int
    required_daily: bool = False

class UserStateIn(BaseModel):
    user_id: Optional[int] = None
    username: Optional[str] = None
    total_xp: int = 0
    current_level: int = 0
    streak_days: int = 0
    last_active_date: str = ""
    consecutive_misses: int = 0

class ProcessDayRequest(BaseModel):
    user: UserStateIn
    tasks: List[TaskIn]

# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"ok": True, "msg": "StreaX Engine API (dev) with DB"}

@app.post("/users", summary="Create a user (if username provided)")
def api_create_user(payload: UserStateIn, db = Depends(get_db)):
    username = payload.username or f"user_{payload.user_id or 'anon'}"
    if payload.user_id:
        u = crud.get_user(db, payload.user_id)
        if u:
            return {"user": {
                "id": u.id,
                "username": u.username,
                "total_xp": u.total_xp,
                "current_level": u.current_level
            }}
    u = crud.create_user(db, username, user_id=payload.user_id)
    return {"user": {
        "id": u.id,
        "username": u.username,
        "total_xp": u.total_xp,
        "current_level": u.current_level
    }}

@app.get("/users/{user_id}", summary="Get user by id")
def api_get_user(user_id: int, db = Depends(get_db)):
    u = crud.get_user(db, user_id)
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": u.id,
        "username": u.username,
        "total_xp": u.total_xp,
        "current_level": u.current_level,
        "streak_days": u.streak_days,
        "last_active_date": u.last_active_date,
        "consecutive_misses": u.consecutive_misses,
    }

@app.get("/tasks", summary="List tasks for a user")
def api_list_tasks(user_id: int = Query(..., description="user id"), limit: int = 100, offset: int = 0, db = Depends(get_db)):
    tasks = crud.list_tasks_for_user(db, user_id=user_id, limit=limit, offset=offset)
    result = []
    for t in tasks:
        result.append({
            "id": t.id,
            "user_id": t.user_id,
            "name": t.name,
            "type": t.type,
            "base_xp": t.base_xp,
            "required_daily": bool(t.required_daily),
            "created_at": t.created_at.isoformat() if t.created_at else None
        })
    return {"tasks": result, "count": len(result)}

@app.get("/task-logs", summary="List task logs for a user")
def api_list_logs(user_id: int = Query(..., description="user id"), limit: int = 100, offset: int = 0, db = Depends(get_db)):
    logs = crud.list_logs_for_user(db, user_id=user_id, limit=limit, offset=offset)
    out = []
    for l in logs:
        out.append({
            "id": l.id,
            "task_id": l.task_id,
            "user_id": l.user_id,
            "date": l.date,
            "xp_awarded": l.xp_awarded,
            "streak_at_time": l.streak_at_time,
            "is_full_day": bool(l.is_full_day),
            "created_at": l.created_at.isoformat() if l.created_at else None
        })
    return {"logs": out, "count": len(out)}

@app.get("/users/{user_id}/stats", summary="Get simple stats for a user")
def api_user_stats(user_id: int, db = Depends(get_db)):
    stats = crud.get_user_stats(db, user_id)
    if not stats:
        raise HTTPException(status_code=404, detail="User not found")
    return {"stats": stats}

@app.post("/process-day", summary="Process day, persist logs and update user")
def api_process_day(payload: ProcessDayRequest, db = Depends(get_db)):
    user = payload.user
    tasks = payload.tasks

    # find or create user
    orm_user = None
    if user.user_id:
        orm_user = crud.get_user(db, user.user_id)

    if not orm_user:
        uname = user.username or f"user_{user.user_id or 'anon'}"
        orm_user = crud.create_user(db, uname, user_id=user.user_id)

    # Convert incoming pydantic TaskIn to data Task objects (engine expects streax.models.Task)
    data_tasks = [DataTask(t.id, t.name, t.type, t.base_xp, t.required_daily) for t in tasks]

    # create a lightweight UserState object for engine from DB or payload
    data_user = DataUserState(
        user_id=orm_user.id,
        total_xp=orm_user.total_xp,
        current_level=orm_user.current_level,
        streak_days=orm_user.streak_days,
        last_active_date=orm_user.last_active_date or "",
        consecutive_misses=orm_user.consecutive_misses
    )

    today_iso = date.today().isoformat()
    updated_user_state, event = process_day(data_user, data_tasks, today_iso, daily_target_count=2)

    # Persist: ensure tasks exist and create TaskLog rows
    total_base = sum(t.base_xp for t in data_tasks) or 1
    task_awards = []
    for t in data_tasks:
        orm_task = crud.ensure_task(db, orm_user.id, t.name, t.type, t.base_xp, t.required_daily)
        xp_awarded = int(round(event["day_xp"] * (t.base_xp / total_base)))
        task_awards.append({
            "task_id": orm_task.id,
            "xp_awarded": xp_awarded,
            "streak_at_time": updated_user_state.streak_days,
            "is_full_day": False,
            "date": today_iso
        })

    crud.create_task_logs(db, orm_user.id, task_awards)

    # Update user row with engine results
    orm_user = crud.update_user_after_event(db, orm_user, {
        "total_xp": updated_user_state.total_xp,
        "current_level": updated_user_state.current_level,
        "streak_days": updated_user_state.streak_days,
        "consecutive_misses": updated_user_state.consecutive_misses,
        "date": today_iso
    })

    # Return the event and user (as a simple dict)
    return {
        "event": event,
        "user": {
            "id": orm_user.id,
            "username": orm_user.username,
            "total_xp": orm_user.total_xp,
            "current_level": orm_user.current_level,
            "streak_days": orm_user.streak_days,
            "last_active_date": orm_user.last_active_date,
            "consecutive_misses": orm_user.consecutive_misses
        }
    }
