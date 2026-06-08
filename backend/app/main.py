from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from datetime import datetime
import os
import psycopg2
from psycopg2.extras import RealDictCursor

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv('FRONTEND_URL', '*')],
    allow_methods=['*'],
    allow_headers=['*'],
)

def get_db():
    return psycopg2.connect(os.getenv('DATABASE_URL'), cursor_factory=RealDictCursor)

def init_db():
    conn = get_db()
    cur = conn.cursor()
    cur.execute('''CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200),
        email VARCHAR(200),
        phone VARCHAR(50),
        business_type VARCHAR(100),
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
    )''')
    conn.commit()
    cur.close()
    conn.close()

@app.on_event('startup')
def startup():
    init_db()

@app.get('/health')
def health():
    return {'status': 'healthy'}

class ContactForm(BaseModel):
    name: str
    email: str = ''
    phone: str = ''
    business_type: str = ''
    message: str = ''

@app.post('/contact', status_code=201)
def submit_contact(form: ContactForm):
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            'INSERT INTO contacts (name,email,phone,business_type,message) VALUES (%s,%s,%s,%s,%s) RETURNING id,name,email,created_at',
            (form.name, form.email, form.phone, form.business_type, form.message)
        )
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        return row
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get('/contacts')
def list_contacts():
    conn = get_db()
    cur = conn.cursor()
    cur.execute('SELECT * FROM contacts ORDER BY created_at DESC LIMIT 100')
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows
