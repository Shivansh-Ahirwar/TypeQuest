import os
import sqlite3

from fastapi import APIRouter, Header, HTTPException
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from pydantic import BaseModel, Field

from app.database import get_connection
from app.security import (
    create_token,
    decode_token,
    hash_password,
    verify_password,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


class RegisterIn(BaseModel):
    name: str = Field(min_length=1, max_length=50)
    email: str = Field(min_length=3, max_length=120)
    password: str = Field(min_length=6, max_length=128)


class LoginIn(BaseModel):
    email: str
    password: str


class GoogleIn(BaseModel):
    credential: str


def public_user(row):
    return {"id": row["id"], "name": row["name"], "email": row["email"]}


def create_progress(conn, user_id):
    conn.execute("INSERT OR IGNORE INTO progress (user_id) VALUES (?)", (user_id,))


@router.post("/register")
def register(data: RegisterIn):
    email = data.email.strip().lower()
    conn = get_connection()
    try:
        cur = conn.execute(
            "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
            (data.name.strip(), email, hash_password(data.password)),
        )
        user_id = cur.lastrowid
        create_progress(conn, user_id)
        conn.commit()
        row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        return {"token": create_token(user_id), "user": public_user(row)}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=409, detail="Email already registered")
    finally:
        conn.close()


@router.post("/login")
def login(data: LoginIn):
    email = data.email.strip().lower()
    conn = get_connection()
    try:
        row = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    finally:
        conn.close()
    if not row or not row["password_hash"]:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not verify_password(data.password, row["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"token": create_token(row["id"]), "user": public_user(row)}


@router.post("/google")
def google_login(data: GoogleIn):
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    try:
        info = id_token.verify_oauth2_token(
            data.credential, google_requests.Request(), client_id
        )
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Google token")

    if not info.get("email_verified"):
        raise HTTPException(status_code=401, detail="Google email not verified")

    google_id = info["sub"]
    email = info["email"].lower()
    name = info.get("name") or email.split("@")[0]

    conn = get_connection()
    try:
        row = conn.execute(
            "SELECT * FROM users WHERE google_id = ? OR email = ?",
            (google_id, email),
        ).fetchone()
        if row:
            if not row["google_id"]:
                conn.execute(
                    "UPDATE users SET google_id = ? WHERE id = ?",
                    (google_id, row["id"]),
                )
            user_id = row["id"]
        else:
            cur = conn.execute(
                "INSERT INTO users (name, email, google_id) VALUES (?, ?, ?)",
                (name, email, google_id),
            )
            user_id = cur.lastrowid
        create_progress(conn, user_id)
        conn.commit()
        row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        return {"token": create_token(user_id), "user": public_user(row)}
    finally:
        conn.close()


@router.get("/me")
def me(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not logged in")
    user_id = decode_token(authorization.split(" ", 1)[1])
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    conn = get_connection()
    try:
        row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    finally:
        conn.close()
    if not row:
        raise HTTPException(status_code=401, detail="User not found")
    return public_user(row)
