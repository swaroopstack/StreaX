# backend/database/connection.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()  # loads from backend/.env by default

DATABASE_URL = os.getenv("MYSQL_URL")
if not DATABASE_URL:
    raise RuntimeError("Please set MYSQL_URL in backend/.env")

# echo=True prints SQL for debugging (turn off in production)
engine = create_engine(DATABASE_URL, echo=False, future=True)

# Use expire_on_commit=False so objects remain usable after commit (handy)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False, future=True)

Base = declarative_base()
