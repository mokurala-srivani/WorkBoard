from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
import uuid
import random

app = FastAPI(title="JobBoard API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Models ──────────────────────────────────────────────────────────────────

class Job(BaseModel):
    id: str = ""
    title: str
    company: str
    location: str
    type: str          # full-time | part-time | contract | remote
    category: str
    salary_min: int
    salary_max: int
    description: str
    requirements: List[str]
    posted_at: str = ""
    logo_color: str = ""
    featured: bool = False

class JobCreate(BaseModel):
    title: str
    company: str
    location: str
    type: str
    category: str
    salary_min: int
    salary_max: int
    description: str
    requirements: List[str]
    featured: bool = False

class Application(BaseModel):
    id: str = ""
    job_id: str
    name: str
    email: str
    cover_letter: str
    applied_at: str = ""

# ── Seed Data ────────────────────────────────────────────────────────────────

COLORS = ["#6366f1","#ec4899","#f59e0b","#10b981","#3b82f6","#8b5cf6","#ef4444","#14b8a6"]

SEED_JOBS = [
    {"title":"Senior Full-Stack Engineer","company":"Stripe","location":"San Francisco, CA","type":"full-time","category":"Engineering","salary_min":160000,"salary_max":220000,"description":"Build the financial infrastructure of the internet. Work on payments, fraud detection, and developer tools used by millions.","requirements":["5+ years React/Node.js","PostgreSQL expertise","REST & GraphQL APIs","System design experience"],"featured":True},
    {"title":"Product Designer","company":"Figma","location":"Remote","type":"remote","category":"Design","salary_min":130000,"salary_max":175000,"description":"Shape the future of collaborative design tools. Own end-to-end design for core product features.","requirements":["4+ years product design","Proficiency in Figma","Strong portfolio","User research skills"],"featured":True},
    {"title":"ML Engineer","company":"OpenAI","location":"San Francisco, CA","type":"full-time","category":"Engineering","salary_min":200000,"salary_max":300000,"description":"Train and deploy large language models. Work on cutting-edge research at the intersection of ML and product.","requirements":["PyTorch/JAX mastery","PhD or equivalent","Published research a plus","Distributed training experience"],"featured":True},
    {"title":"DevOps Engineer","company":"Vercel","location":"Remote","type":"remote","category":"Engineering","salary_min":120000,"salary_max":165000,"description":"Scale infrastructure that serves millions of deployments daily. Own CI/CD, Kubernetes clusters, and edge network.","requirements":["Kubernetes & Terraform","AWS/GCP/Azure","CI/CD pipelines","Go or Rust a plus"],"featured":False},
    {"title":"Growth Marketing Manager","company":"Linear","location":"Remote","type":"remote","category":"Marketing","salary_min":100000,"salary_max":140000,"description":"Drive user acquisition and retention for the project management tool developers love.","requirements":["5+ years B2B SaaS marketing","Data-driven mindset","SEO & content strategy","Paid acquisition experience"],"featured":False},
    {"title":"Data Scientist","company":"Airbnb","location":"New York, NY","type":"full-time","category":"Data","salary_min":145000,"salary_max":190000,"description":"Unlock insights from billions of stays, searches, and host interactions to improve the Airbnb marketplace.","requirements":["Python & SQL mastery","Causal inference","A/B testing","Spark/Databricks"],"featured":False},
    {"title":"iOS Engineer","company":"Notion","location":"New York, NY","type":"full-time","category":"Engineering","salary_min":140000,"salary_max":190000,"description":"Build the mobile experience for millions of knowledge workers. Own the iOS app from architecture to pixel.","requirements":["Swift & SwiftUI","5+ years iOS","Offline-first experience","Core Data / CloudKit"],"featured":False},
    {"title":"Backend Engineer","company":"Supabase","location":"Remote","type":"remote","category":"Engineering","salary_min":115000,"salary_max":160000,"description":"Build the open-source Firebase alternative. Work on Postgres extensions, realtime subscriptions, and auth.","requirements":["Rust or Go","PostgreSQL internals","Open-source contributor","Distributed systems"],"featured":False},
    {"title":"UX Researcher","company":"Spotify","location":"Stockholm, Sweden","type":"full-time","category":"Design","salary_min":90000,"salary_max":125000,"description":"Understand how 600M listeners interact with music, podcasts, and audiobooks to shape future product directions.","requirements":["Mixed-methods research","Survey design","Stakeholder communication","Music/audio domain a plus"],"featured":False},
    {"title":"Technical Writer","company":"Cloudflare","location":"Remote","type":"contract","category":"Content","salary_min":80000,"salary_max":110000,"description":"Write clear, accurate documentation for one of the world's largest networks. Make complex distributed systems understandable.","requirements":["API documentation experience","Markdown & OpenAPI","Developer empathy","Networking fundamentals"],"featured":False},
    {"title":"Security Engineer","company":"GitHub","location":"Remote","type":"full-time","category":"Engineering","salary_min":155000,"salary_max":205000,"description":"Protect the world's software supply chain. Work on code scanning, secret detection, and vulnerability management.","requirements":["AppSec background","SAST/DAST tooling","Python & Go","Bug bounty experience a plus"],"featured":False},
    {"title":"Finance Manager","company":"Ramp","location":"New York, NY","type":"full-time","category":"Finance","salary_min":120000,"salary_max":160000,"description":"Own financial planning, reporting, and analysis for a fast-growing fintech. Partner with leadership on strategy.","requirements":["CPA or MBA","5+ years FP&A","SQL for self-serve data","SaaS metrics expertise"],"featured":False},
]

# In-memory store
jobs_db: dict[str, dict] = {}
applications_db: dict[str, dict] = {}

def _seed():
    for i, j in enumerate(SEED_JOBS):
        jid = str(uuid.uuid4())
        days_ago = random.randint(0, 14)
        jobs_db[jid] = {
            **j,
            "id": jid,
            "posted_at": (datetime.utcnow() - timedelta(days=days_ago)).isoformat(),
            "logo_color": COLORS[i % len(COLORS)],
        }

_seed()

# ── Routes ───────────────────────────────────────────────────────────────────

@app.get("/api/jobs")
def list_jobs(
    search: Optional[str] = None,
    category: Optional[str] = None,
    type: Optional[str] = None,
    location: Optional[str] = None,
    featured: Optional[bool] = None,
    min_salary: Optional[int] = None,
    page: int = 1,
    limit: int = 9,
):
    results = list(jobs_db.values())

    if search:
        q = search.lower()
        results = [j for j in results if q in j["title"].lower() or q in j["company"].lower() or q in j["description"].lower()]
    if category and category != "All":
        results = [j for j in results if j["category"] == category]
    if type and type != "All":
        results = [j for j in results if j["type"] == type]
    if location and location != "All":
        results = [j for j in results if location.lower() in j["location"].lower()]
    if featured is not None:
        results = [j for j in results if j["featured"] == featured]
    if min_salary:
        results = [j for j in results if j["salary_max"] >= min_salary]

    results.sort(key=lambda x: (not x["featured"], x["posted_at"]), reverse=False)
    results.sort(key=lambda x: x["featured"], reverse=True)

    total = len(results)
    start = (page - 1) * limit
    return {"jobs": results[start:start+limit], "total": total, "page": page, "pages": (total + limit - 1) // limit}

@app.get("/api/jobs/{job_id}")
def get_job(job_id: str):
    job = jobs_db.get(job_id)
    if not job:
        raise HTTPException(404, "Job not found")
    return job

@app.post("/api/jobs", status_code=201)
def create_job(job: JobCreate):
    jid = str(uuid.uuid4())
    new_job = {
        **job.dict(),
        "id": jid,
        "posted_at": datetime.utcnow().isoformat(),
        "logo_color": random.choice(COLORS),
    }
    jobs_db[jid] = new_job
    return new_job

@app.delete("/api/jobs/{job_id}")
def delete_job(job_id: str):
    if job_id not in jobs_db:
        raise HTTPException(404, "Job not found")
    del jobs_db[job_id]
    return {"message": "Deleted"}

@app.get("/api/categories")
def get_categories():
    cats = sorted(set(j["category"] for j in jobs_db.values()))
    return cats

@app.get("/api/stats")
def get_stats():
    jobs = list(jobs_db.values())
    return {
        "total_jobs": len(jobs),
        "companies": len(set(j["company"] for j in jobs)),
        "remote_jobs": len([j for j in jobs if j["type"] == "remote"]),
        "categories": len(set(j["category"] for j in jobs)),
    }

@app.post("/api/jobs/{job_id}/apply", status_code=201)
def apply_job(job_id: str, application: Application):
    if job_id not in jobs_db:
        raise HTTPException(404, "Job not found")
    aid = str(uuid.uuid4())
    app_data = {
        **application.dict(),
        "id": aid,
        "job_id": job_id,
        "applied_at": datetime.utcnow().isoformat(),
    }
    applications_db[aid] = app_data
    return {"message": "Application submitted", "id": aid}

@app.get("/api/jobs/{job_id}/applications")
def get_applications(job_id: str):
    return [a for a in applications_db.values() if a["job_id"] == job_id]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
