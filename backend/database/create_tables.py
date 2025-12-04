# backend/database/create_tables.py
import os
from urllib.parse import urlparse, unquote
from dotenv import load_dotenv
import pymysql
from pathlib import Path
import sys

# Ensure backend folder is on sys.path so absolute imports work
# (when running `python database/create_tables.py` from backend/)
here = Path(__file__).resolve().parents[1]
if str(here) not in sys.path:
    sys.path.insert(0, str(here))

# load .env from backend folder reliably
env_path = here / ".env"
load_dotenv(env_path)

mysql_url = os.getenv("MYSQL_URL")
if not mysql_url:
    raise RuntimeError("Set MYSQL_URL in backend/.env")

# Parse the URL to extract credentials and DB name
# Expect format: mysql+pymysql://user:pass@host:port/dbname
parsed = urlparse(mysql_url)
db_name = parsed.path.lstrip("/")

# URL-decode username and password (so %40 => @, etc.)
user = unquote(parsed.username) if parsed.username else None
password = unquote(parsed.password) if parsed.password else None
host = parsed.hostname or "127.0.0.1"
port = parsed.port or 3306

print(f"Connecting to MySQL at {host}:{port} as {user}, target DB: {db_name}")

# Connect to server (no specific DB) to create DB if missing
conn = pymysql.connect(host=host, user=user, password=password, port=port)
conn.autocommit(True)
try:
    with conn.cursor() as cur:
        cur.execute(f"CREATE DATABASE IF NOT EXISTS `{db_name}` DEFAULT CHARACTER SET 'utf8mb4'")
        print(f"Ensured database `{db_name}` exists.")
finally:
    conn.close()

# Now create tables using SQLAlchemy
# Use absolute imports (backend is on sys.path)
from database.connection import engine, Base
from database.models import User, Task, TaskLog, Achievement

print("Creating tables (if not exist)...")
Base.metadata.create_all(bind=engine)
print("Tables created.")
