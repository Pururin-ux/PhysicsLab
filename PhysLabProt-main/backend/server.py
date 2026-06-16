from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from pydantic import BaseModel, Field, ConfigDict, BeforeValidator
from typing import List, Optional, Annotated, Union
import os, logging, bcrypt, jwt, copy
from datetime import datetime, timezone, timedelta
from learning_seed import seed_learning_methodology

def _oid(v):
    return str(v) if isinstance(v, ObjectId) else str(v) if v else v

PyObjectId = Annotated[str, BeforeValidator(_oid)]

class BaseDocument(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    @classmethod
    def from_mongo(cls, doc):
        return cls(**doc) if doc else None
    def to_mongo(self):
        d = self.model_dump(by_alias=True, exclude_none=True)
        d.pop("_id", None)
        return d

class InMemoryInsertResult:
    def __init__(self, inserted_id):
        self.inserted_id = inserted_id

class InMemoryCursor:
    def __init__(self, docs, projection=None):
        self.docs = [self._project(copy.deepcopy(doc), projection) for doc in docs]

    @staticmethod
    def _project(doc, projection):
        if not projection:
            return doc
        for key, value in projection.items():
            if value == 0:
                doc.pop(key, None)
        return doc

    def sort(self, key, direction=1):
        self.docs.sort(key=lambda doc: doc.get(key, 0), reverse=direction < 0)
        return self

    async def to_list(self, limit):
        return self.docs[:limit] if limit else self.docs

class InMemoryCollection:
    def __init__(self):
        self.docs = []

    async def create_index(self, *args, **kwargs):
        return None

    @staticmethod
    def _matches(doc, query):
        return all(doc.get(key) == value for key, value in (query or {}).items())

    async def find_one(self, query, projection=None):
        for doc in self.docs:
            if self._matches(doc, query):
                return InMemoryCursor._project(copy.deepcopy(doc), projection)
        return None

    def find(self, query=None, projection=None):
        return InMemoryCursor([doc for doc in self.docs if self._matches(doc, query)], projection)

    async def count_documents(self, query):
        return sum(1 for doc in self.docs if self._matches(doc, query))

    async def insert_one(self, doc):
        stored = copy.deepcopy(doc)
        stored["_id"] = stored.get("_id") or ObjectId()
        self.docs.append(stored)
        return InMemoryInsertResult(stored["_id"])

    async def update_one(self, query, update, upsert=False):
        target = None
        for doc in self.docs:
            if self._matches(doc, query):
                target = doc
                break
        if target is None and upsert:
            target = copy.deepcopy(query)
            target["_id"] = target.get("_id") or ObjectId()
            self.docs.append(target)
        if target is None:
            return None
        for key, value in update.get("$set", {}).items():
            target[key] = value
        for key, value in update.get("$inc", {}).items():
            target[key] = target.get(key, 0) + value
        return None

    async def delete_one(self, query):
        for i, doc in enumerate(self.docs):
            if self._matches(doc, query):
                self.docs.pop(i)
                return None
        return None

    async def delete_many(self, query):
        self.docs = [doc for doc in self.docs if not self._matches(doc, query)]
        return None

class InMemoryDatabase:
    def __init__(self):
        self._collections = {}

    def __getattr__(self, name):
        return self[name]

    def __getitem__(self, name):
        if name not in self._collections:
            self._collections[name] = InMemoryCollection()
        return self._collections[name]

class InMemoryMongoClient:
    def __getitem__(self, name):
        if not hasattr(self, "_db"):
            self._db = InMemoryDatabase()
        return self._db

    def close(self):
        return None

mongo_url = os.environ.get("MONGO_URL", "memory://local")
db_name = os.environ.get("DB_NAME", "physicslab")
if mongo_url.startswith("memory://"):
    client = InMemoryMongoClient()
else:
    client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

app = FastAPI()
api_router = APIRouter(prefix="/api")

JWT_ALGORITHM = "HS256"
def get_jwt_secret(): return os.environ.get("JWT_SECRET", "dev-only-physicslab-secret")
def hash_password(pw): return bcrypt.hashpw(pw.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
def verify_password(plain, hashed): return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

def create_access_token(uid, email):
    return jwt.encode({"sub": uid, "email": email, "exp": datetime.now(timezone.utc) + timedelta(minutes=60), "type": "access"}, get_jwt_secret(), algorithm=JWT_ALGORITHM)
def create_refresh_token(uid):
    return jwt.encode({"sub": uid, "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "refresh"}, get_jwt_secret(), algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "): token = auth[7:]
    if not token: raise HTTPException(401, "Not authenticated")
    try:
        p = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if p.get("type") != "access": raise HTTPException(401, "Invalid token")
        user = await db.users.find_one({"_id": ObjectId(p["sub"])})
        if not user: raise HTTPException(401, "User not found")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError: raise HTTPException(401, "Token expired")
    except jwt.InvalidTokenError: raise HTTPException(401, "Invalid token")

# ── Models ──
class UserRegister(BaseModel):
    email: str; password: str; name: str

class UserLogin(BaseModel):
    email: str; password: str

class QuizSubmission(BaseModel):
    answers: List[Union[int, float, str, None]]

def normalize_answer(value):
    if value is None:
        return ""
    if isinstance(value, float) and value.is_integer():
        value = int(value)
    return str(value).strip().lower().replace(" ", "").replace(",", ".")

def is_correct_answer(question, user_answer):
    if question.get("answer_type") == "numeric" or "correct_answer" in question:
        expected = [normalize_answer(question.get("correct_answer"))]
        expected.extend(normalize_answer(item) for item in question.get("accepted_answers", []))
        return normalize_answer(user_answer) in {item for item in expected if item}
    try:
        return int(user_answer) == question["correct_index"]
    except (TypeError, ValueError, KeyError):
        return False

# ── Auth ──
@api_router.post("/auth/register")
async def register(data: UserRegister, response: Response):
    email = data.email.lower().strip()
    if await db.users.find_one({"email": email}): raise HTTPException(400, "Email already registered")
    doc = {"email": email, "password_hash": hash_password(data.password), "name": data.name, "role": "student", "xp": 0, "level": 1, "streak": 0, "last_activity": datetime.now(timezone.utc).isoformat(), "created_at": datetime.now(timezone.utc).isoformat()}
    r = await db.users.insert_one(doc)
    uid = str(r.inserted_id)
    at = create_access_token(uid, email); rt = create_refresh_token(uid)
    response.set_cookie("access_token", at, httponly=True, secure=False, samesite="lax", max_age=3600, path="/")
    response.set_cookie("refresh_token", rt, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    return {"id": uid, "email": email, "name": data.name, "role": "student", "xp": 0, "level": 1, "streak": 0}

@api_router.post("/auth/login")
async def login(data: UserLogin, request: Request, response: Response):
    email = data.email.lower().strip()
    ip = request.client.host if request.client else "unknown"
    ident = f"{ip}:{email}"
    attempt = await db.login_attempts.find_one({"identifier": ident})
    if attempt and attempt.get("count", 0) >= 5:
        lu = attempt.get("locked_until")
        if lu and datetime.now(timezone.utc).isoformat() < lu: raise HTTPException(429, "Too many attempts. Try in 15 min.")
        else: await db.login_attempts.delete_one({"identifier": ident})
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(data.password, user["password_hash"]):
        if attempt:
            nc = attempt.get("count",0)+1; upd = {"$set":{"count":nc}}
            if nc >= 5: upd["$set"]["locked_until"] = (datetime.now(timezone.utc)+timedelta(minutes=15)).isoformat()
            await db.login_attempts.update_one({"identifier":ident}, upd)
        else: await db.login_attempts.insert_one({"identifier":ident,"count":1})
        raise HTTPException(401, "Invalid email or password")
    await db.login_attempts.delete_many({"identifier": ident})
    uid = str(user["_id"]); at = create_access_token(uid, email); rt = create_refresh_token(uid)
    response.set_cookie("access_token", at, httponly=True, secure=False, samesite="lax", max_age=3600, path="/")
    response.set_cookie("refresh_token", rt, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    return {"id": uid, "email": user["email"], "name": user.get("name",""), "role": user.get("role","student"), "xp": user.get("xp",0), "level": user.get("level",1), "streak": user.get("streak",0)}

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/"); response.delete_cookie("refresh_token", path="/")
    return {"message": "Logged out"}

@api_router.get("/auth/me")
async def get_me(user=Depends(get_current_user)): return user

@api_router.post("/auth/refresh")
async def refresh_token(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token: raise HTTPException(401, "No refresh token")
    try:
        p = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if p.get("type") != "refresh": raise HTTPException(401, "Invalid")
        user = await db.users.find_one({"_id": ObjectId(p["sub"])})
        if not user: raise HTTPException(401, "User not found")
        at = create_access_token(str(user["_id"]), user["email"])
        response.set_cookie("access_token", at, httponly=True, secure=False, samesite="lax", max_age=3600, path="/")
        return {"message": "Refreshed"}
    except jwt.ExpiredSignatureError: raise HTTPException(401, "Refresh expired")
    except jwt.InvalidTokenError: raise HTTPException(401, "Invalid")

# ── Courses ──
@api_router.get("/courses")
async def get_courses(path: Optional[str] = None):
    query = {}
    if path: query["path"] = path
    courses = await db.courses.find(query).sort("order", 1).to_list(100)
    for c in courses: c["_id"] = str(c["_id"])
    return courses

@api_router.get("/learning-paths")
async def get_learning_paths():
    paths = await db.learning_paths.find().sort("slug", 1).to_list(10)
    for p in paths:
        p["_id"] = str(p["_id"])
    return paths

@api_router.get("/courses/{course_id}")
async def get_course(course_id: str):
    course = await db.courses.find_one({"_id": ObjectId(course_id)})
    if not course: raise HTTPException(404, "Not found")
    course["_id"] = str(course["_id"])
    chapters = await db.chapters.find({"course_id": course_id}).sort("order", 1).to_list(100)
    for ch in chapters: ch["_id"] = str(ch["_id"])
    return {"course": course, "chapters": chapters}

@api_router.get("/chapters/{chapter_id}")
async def get_chapter(chapter_id: str):
    ch = await db.chapters.find_one({"_id": ObjectId(chapter_id)})
    if not ch: raise HTTPException(404, "Not found")
    ch["_id"] = str(ch["_id"])
    quiz = await db.quizzes.find_one({"chapter_id": chapter_id})
    if quiz: quiz["_id"] = str(quiz["_id"])
    return {"chapter": ch, "quiz": quiz}

# ── Exam Trainer ──
@api_router.get("/exam-variants")
async def get_exam_variants():
    variants = await db.exam_variants.find().sort("order", 1).to_list(100)
    for v in variants: v["_id"] = str(v["_id"])
    return variants

@api_router.get("/exam-variants/{variant_id}")
async def get_exam_variant(variant_id: str):
    v = await db.exam_variants.find_one({"_id": ObjectId(variant_id)})
    if not v: raise HTTPException(404, "Not found")
    v["_id"] = str(v["_id"])
    return v

@api_router.post("/exam-variants/{variant_id}/submit")
async def submit_exam(variant_id: str, submission: QuizSubmission, user=Depends(get_current_user)):
    v = await db.exam_variants.find_one({"_id": ObjectId(variant_id)})
    if not v: raise HTTPException(404, "Not found")
    questions = v.get("questions", [])
    correct = 0; results = []
    for i, q in enumerate(questions):
        ua = submission.answers[i] if i < len(submission.answers) else -1
        ic = is_correct_answer(q, ua)
        if ic: correct += 1
        results.append({
            "question": q["question"],
            "user_answer": ua,
            "correct_index": q.get("correct_index"),
            "correct_answer": q.get("correct_answer"),
            "answer_type": q.get("answer_type", "choice"),
            "is_correct": ic,
            "explanation": q.get("explanation",""),
            "topic": q.get("topic",""),
            "part": q.get("part",""),
            "blueprint": q.get("blueprint",""),
        })
    total = len(questions); xp = correct * 15
    uid = user["_id"]
    await db.users.update_one({"_id": ObjectId(uid)}, {"$inc": {"xp": xp}, "$set": {"last_activity": datetime.now(timezone.utc).isoformat()}})
    ud = await db.users.find_one({"_id": ObjectId(uid)})
    nl = 1 + ud.get("xp",0) // 100
    if nl != ud.get("level",1): await db.users.update_one({"_id": ObjectId(uid)}, {"$set": {"level": nl}})
    await db.exam_results.insert_one({"user_id": uid, "variant_id": variant_id, "score": correct, "total": total, "xp_earned": xp, "results": results, "completed_at": datetime.now(timezone.utc).isoformat()})
    return {"score": correct, "total": total, "xp_earned": xp, "results": results, "new_xp": ud.get("xp",0), "new_level": nl}

# ── Quizzes ──
@api_router.post("/quizzes/{quiz_id}/submit")
async def submit_quiz(quiz_id: str, submission: QuizSubmission, user=Depends(get_current_user)):
    quiz = await db.quizzes.find_one({"_id": ObjectId(quiz_id)})
    if not quiz: raise HTTPException(404, "Not found")
    questions = quiz.get("questions", [])
    correct = 0; results = []
    for i, q in enumerate(questions):
        ua = submission.answers[i] if i < len(submission.answers) else -1
        ic = is_correct_answer(q, ua)
        if ic: correct += 1
        results.append({
            "question": q["question"],
            "user_answer": ua,
            "correct_index": q.get("correct_index"),
            "correct_answer": q.get("correct_answer"),
            "answer_type": q.get("answer_type", "choice"),
            "is_correct": ic,
            "explanation": q.get("explanation",""),
        })
    total = len(questions); xp = correct * 10
    uid = user["_id"]
    await db.users.update_one({"_id": ObjectId(uid)}, {"$inc": {"xp": xp}, "$set": {"last_activity": datetime.now(timezone.utc).isoformat()}})
    ud = await db.users.find_one({"_id": ObjectId(uid)})
    nl = 1 + ud.get("xp",0) // 100
    if nl != ud.get("level",1): await db.users.update_one({"_id": ObjectId(uid)}, {"$set": {"level": nl}})
    ch_id = quiz.get("chapter_id")
    await db.user_progress.update_one(
        {"user_id": uid, "chapter_id": ch_id},
        {"$set": {"user_id": uid, "course_id": quiz.get("course_id",""), "chapter_id": ch_id, "completed": correct >= total*0.6, "quiz_score": correct, "quiz_total": total, "xp_earned": xp, "completed_at": datetime.now(timezone.utc).isoformat()}},
        upsert=True)
    return {"score": correct, "total": total, "xp_earned": xp, "results": results, "new_xp": ud.get("xp",0), "new_level": nl}

# ── Progress ──
@api_router.get("/progress")
async def get_progress(user=Depends(get_current_user)):
    prog = await db.user_progress.find({"user_id": user["_id"]}).to_list(1000)
    for p in prog: p["_id"] = str(p["_id"])
    ud = await db.users.find_one({"_id": ObjectId(user["_id"])})
    exam_results = await db.exam_results.find({"user_id": user["_id"]}).sort("completed_at", -1).to_list(10)
    for e in exam_results: e["_id"] = str(e["_id"])
    return {"progress": prog, "xp": ud.get("xp",0), "level": ud.get("level",1), "streak": ud.get("streak",0), "exam_results": exam_results}

@api_router.get("/leaderboard")
async def get_leaderboard():
    users = await db.users.find({"role":"student"}, {"password_hash":0}).sort("xp",-1).to_list(20)
    for u in users: u["_id"] = str(u["_id"])
    return users

# ── Seed ──
async def seed_admin():
    ae = os.environ.get("ADMIN_EMAIL","admin@physicslab.com")
    ap = os.environ.get("ADMIN_PASSWORD","admin123")
    ex = await db.users.find_one({"email": ae})
    if not ex:
        await db.users.insert_one({"email": ae, "password_hash": hash_password(ap), "name": "Admin", "role": "admin", "xp": 0, "level": 1, "streak": 0, "created_at": datetime.now(timezone.utc).isoformat()})
    elif not verify_password(ap, ex["password_hash"]):
        await db.users.update_one({"email": ae}, {"$set": {"password_hash": hash_password(ap)}})

async def seed_courses():
    count = await db.courses.count_documents({})
    if count > 0: return

    # === SCHOOL PATH ===
    school_courses = [
        {"title": "Механика", "description": "Кинематика, динамика, законы сохранения — основа физики", "icon": "Rocket", "color": "#FFD700", "order": 1, "path": "school", "grade": "9-10", "chapters_count": 3},
        {"title": "Молекулярная физика и термодинамика", "description": "МКТ, газовые законы, тепловые процессы", "icon": "Thermometer", "color": "#00E5FF", "order": 2, "path": "school", "grade": "10", "chapters_count": 2},
        {"title": "Электродинамика", "description": "Электростатика, постоянный ток, магнетизм", "icon": "Zap", "color": "#39FF14", "order": 3, "path": "school", "grade": "10-11", "chapters_count": 2},
        {"title": "Колебания и волны", "description": "Механические и электромагнитные колебания, звук", "icon": "Activity", "color": "#FF6B6B", "order": 4, "path": "school", "grade": "11", "chapters_count": 1},
        {"title": "Оптика", "description": "Геометрическая и волновая оптика, линзы", "icon": "Eye", "color": "#FFB300", "order": 5, "path": "school", "grade": "11", "chapters_count": 1},
        {"title": "Квантовая и ядерная физика", "description": "Фотоэффект, атом Бора, ядерные реакции", "icon": "Atom", "color": "#C084FC", "order": 6, "path": "school", "grade": "11", "chapters_count": 1},
    ]
    # === EXAM PATH ===
    exam_courses = [
        {"title": "Часть А: Концептуальные вопросы", "description": "10 вопросов с выбором ответа — тренировка по формату ЦТ/ЦЭ", "icon": "ClipboardCheck", "color": "#FFD700", "order": 1, "path": "exam", "chapters_count": 3},
        {"title": "Часть Б: Расчётные задачи", "description": "20 задач с числовым ответом — ключ к высоким баллам", "icon": "Calculator", "color": "#00E5FF", "order": 2, "path": "exam", "chapters_count": 3},
        {"title": "Тренажёр ЦТ/ЦЭ", "description": "Полные варианты в формате экзамена — 30 заданий за 210 минут", "icon": "Timer", "color": "#39FF14", "order": 3, "path": "exam", "chapters_count": 0},
    ]

    all_courses = school_courses + exam_courses
    course_ids = {}
    for c in all_courses:
        r = await db.courses.insert_one(c)
        course_ids[c["title"]] = str(r.inserted_id)

    # ── SCHOOL: Механика chapters ──
    mech_id = course_ids["Механика"]
    mech_chapters = [
        {
            "course_id": mech_id, "title": "Равномерное и равноускоренное движение", "order": 1,
            "theory": "**Равномерное движение** — движение с постоянной скоростью (a = 0).\n\n**Основные формулы:**\n- Координата: x = x₀ + v·t\n- Путь: S = |v|·t\n\n**Равноускоренное движение** — движение с постоянным ускорением.\n\n**Основные формулы:**\n- Скорость: v = v₀ + a·t\n- Координата: x = x₀ + v₀·t + a·t²/2\n- Без времени: v² = v₀² + 2·a·Δx\n\n**Свободное падение** — частный случай (a = g ≈ 9,8 м/с²).\n\n**Важно для ЦТ:** Умей читать графики x(t) и v(t). Наклон на графике x(t) — скорость. Площадь под v(t) — перемещение.",
            "theory_visuals": [
                {"type": "diagram", "title": "Графики равномерного движения", "description": "x(t) — прямая, v(t) — горизонталь, a(t) = 0"},
                {"type": "diagram", "title": "Графики равноускоренного движения", "description": "x(t) — парабола, v(t) — прямая, a(t) — горизонталь"},
                {"type": "tip", "text": "На ЦТ часто просят определить путь по графику v(t) — это площадь фигуры под графиком!"}
            ],
            "formulas": [
                {"name": "Координата (равномерное)", "formula": "x = x₀ + v·t", "variables": "x₀ — начальная координата, v — скорость, t — время", "units": "м, м/с, с"},
                {"name": "Скорость (равноускоренное)", "formula": "v = v₀ + a·t", "variables": "v₀ — начальная скорость, a — ускорение", "units": "м/с, м/с²"},
                {"name": "Координата (равноускоренное)", "formula": "x = x₀ + v₀t + at²/2", "variables": "a — ускорение", "units": "м"},
                {"name": "Без времени", "formula": "v² = v₀² + 2a·Δx", "variables": "Δx — перемещение", "units": "м²/с²"},
                {"name": "Свободное падение", "formula": "h = g·t²/2", "variables": "g ≈ 9,8 м/с² (в задачах ЦТ часто 10)", "units": "м"}
            ],
            "key_concepts": ["Траектория", "Перемещение vs Путь", "Мгновенная скорость", "Среднее ускорение", "Графики движения"]
        },
        {
            "course_id": mech_id, "title": "Законы Ньютона и силы", "order": 2,
            "theory": "**Первый закон Ньютона** (закон инерции): тело сохраняет состояние покоя или равномерного прямолинейного движения, если результирующая сила равна нулю.\n\n**Второй закон:** F⃗ = m·a⃗ — ускорение прямо пропорционально силе.\n\n**Третий закон:** Тела действуют друг на друга с силами, равными по модулю и противоположными по направлению.\n\n**Основные силы:**\n- Сила тяжести: F = mg\n- Сила упругости: F = kΔl (закон Гука)\n- Сила трения: F = μN\n- Вес тела: P = mg (в покое), P = m(g ± a) (в лифте)\n\n**АЛГОРИТМ РЕШЕНИЯ ЗАДАЧИ НА ДИНАМИКУ:**\n1. Сделай кинематический рисунок с расстановкой всех действующих сил с силами\n2. Выбери оси координат\n3. Запиши 2-й закон в проекциях\n4. Реши систему уравнений",
            "theory_visuals": [
                {"type": "diagram", "title": "Тело на наклонной плоскости", "description": "Разложение mg на составляющие: mg·sinα вдоль, mg·cosα перпендикулярно"},
                {"type": "tip", "text": "На ЦТ часто дают тело на наклонной плоскости с трением. Всегда проецируй силы на оси вдоль и перпендикулярно плоскости!"}
            ],
            "formulas": [
                {"name": "Второй закон Ньютона", "formula": "F = m·a", "variables": "F — равнодействующая, m — масса, a — ускорение", "units": "Н, кг, м/с²"},
                {"name": "Сила тяжести", "formula": "F = m·g", "variables": "g ≈ 9,8 м/с²", "units": "Н"},
                {"name": "Закон Гука", "formula": "F = k·Δl", "variables": "k — жёсткость, Δl — удлинение", "units": "Н, Н/м, м"},
                {"name": "Сила трения", "formula": "Fтр = μ·N", "variables": "μ — коэффициент, N — реакция опоры", "units": "Н"}
            ],
            "key_concepts": ["Инерциальная СО", "Равнодействующая", "Нормальная реакция", "Невесомость", "Перегрузка"]
        },
        {
            "course_id": mech_id, "title": "Энергия, работа и законы сохранения", "order": 3,
            "theory": "**Работа силы:** A = F·S·cosα\n\n**Кинетическая энергия:** Eк = mv²/2\n**Потенциальная энергия:** Eп = mgh (гравитационная), Eп = kx²/2 (упругая)\n\n**Теорема о кинетической энергии:** A = ΔEк = mv₂²/2 - mv₁²/2\n\n**Закон сохранения энергии:** В замкнутой системе Eк + Eп = const (если нет трения).\n\n**Закон сохранения импульса:** В замкнутой системе p⃗₁ + p⃗₂ = const.\n\n**Импульс:** p⃗ = m·v⃗\n**Импульс силы:** F·Δt = Δp⃗\n\n**Мощность:** P = A/t = F·v",
            "theory_visuals": [
                {"type": "diagram", "title": "Превращения энергии", "description": "При падении: Eп → Eк. При подъёме: Eк → Eп. С трением: часть → Q"},
                {"type": "tip", "text": "Задачи на ЗСИ в ЦТ: столкновения, выстрелы, распады. Всегда проецируй на одну ось!"}
            ],
            "formulas": [
                {"name": "Работа", "formula": "A = F·S·cosα", "variables": "α — угол между F и S", "units": "Дж"},
                {"name": "Кинетическая энергия", "formula": "Eк = mv²/2", "variables": "m — масса, v — скорость", "units": "Дж"},
                {"name": "Потенциальная энергия", "formula": "Eп = mgh", "variables": "h — высота", "units": "Дж"},
                {"name": "Импульс", "formula": "p = m·v", "variables": "m — масса, v — скорость", "units": "кг·м/с"},
                {"name": "Мощность", "formula": "P = A/t = F·v", "variables": "t — время", "units": "Вт"}
            ],
            "key_concepts": ["Работа", "Мощность", "КПД", "Упругий удар", "Неупругий удар", "Реактивное движение"]
        }
    ]

    ch_ids_mech = []
    for ch in mech_chapters:
        r = await db.chapters.insert_one(ch)
        ch_ids_mech.append(str(r.inserted_id))

    # ── Quizzes for Mechanics (original questions) ──
    quizzes = [
        {
            "chapter_id": ch_ids_mech[0], "course_id": mech_id,
            "title": "Тест: Кинематика",
            "questions": [
                {"question": "Велосипедист проехал первую половину пути со скоростью 12 км/ч, а вторую — со скоростью 20 км/ч. Какова средняя скорость на всём пути?", "options": ["15 км/ч", "16 км/ч", "15,5 км/ч", "14 км/ч"], "correct_index": 0, "explanation": "vср = 2v₁v₂/(v₁+v₂) = 2·12·20/(12+20) = 480/32 = 15 км/ч. Средняя скорость НЕ равна среднему арифметическому!", "topic": "kinematics", "hint": "Средняя скорость при одинаковых расстояниях — гармоническое среднее"},
                {"question": "На графике v(t) прямая линия начинается в точке (0; 4 м/с) и заканчивается в точке (6 с; 10 м/с). Чему равно перемещение тела?", "options": ["24 м", "42 м", "60 м", "30 м"], "correct_index": 1, "explanation": "Перемещение = площадь трапеции: S = (v₁+v₂)·t/2 = (4+10)·6/2 = 42 м", "topic": "kinematics", "hint": "Площадь под графиком v(t) — это перемещение"},
                {"question": "Камень брошен вертикально вверх с начальной скоростью 30 м/с. Через какое время он окажется на высоте 40 м? (g = 10 м/с²)", "options": ["1 с и 5 с", "2 с и 4 с", "3 с", "2 с и 3 с"], "correct_index": 1, "explanation": "h = v₀t - gt²/2 → 40 = 30t - 5t² → t² - 6t + 8 = 0 → t = 2 c и t = 4 с. Дважды: при подъёме и при спуске!", "topic": "kinematics", "hint": "Получится квадратное уравнение — два корня = два момента времени"},
                {"question": "Автомобиль, двигаясь равноускоренно из состояния покоя, за первые 4 секунды прошёл 16 м. Какой путь он пройдёт за следующие 4 секунды?", "options": ["16 м", "32 м", "48 м", "64 м"], "correct_index": 2, "explanation": "a = 2S/t² = 2·16/16 = 2 м/с². За 8 с: S₈ = a·64/2 = 64 м. За следующие 4 с: 64 - 16 = 48 м", "topic": "kinematics", "hint": "Для равноускоренного из покоя пути за равные интервалы относятся как 1:3:5:7"},
                {"question": "Тело движется по закону x = 5 + 3t - 2t². Чему равна начальная скорость и ускорение?", "options": ["v₀ = 3 м/с, a = -4 м/с²", "v₀ = 5 м/с, a = -2 м/с²", "v₀ = 3 м/с, a = -2 м/с²", "v₀ = 3 м/с, a = 2 м/с²"], "correct_index": 0, "explanation": "Сравниваем x = x₀ + v₀t + at²/2 с x = 5 + 3t - 2t². Значит v₀ = 3 м/с, a/2 = -2, a = -4 м/с²", "topic": "kinematics", "hint": "Сравни с общим видом x = x₀ + v₀t + at²/2"}
            ]
        },
        {
            "chapter_id": ch_ids_mech[1], "course_id": mech_id,
            "title": "Тест: Динамика",
            "questions": [
                {"question": "Тело массой 3 кг тянут по горизонтальной поверхности силой 15 Н, направленной под углом 60° к горизонту. Коэффициент трения μ = 0,2. Чему равно ускорение? (g = 10 м/с²)", "options": ["≈ 0,8 м/с²", "≈ 1,2 м/с²", "≈ 0,2 м/с²", "≈ 2,0 м/с²"], "correct_index": 0, "explanation": "Fх = 15·cos60° = 7,5 Н. N = mg - F·sin60° = 30 - 13 = 17 Н. Fтр = 0,2·17 = 3,4 Н. a = (7,5 - 3,4)/3 ≈ 1,4 Н / 3 ≈ 0,8 м/с² (при точном расчёте с g=10)", "topic": "dynamics", "hint": "Разложи силу на горизонтальную и вертикальную составляющие"},
                {"question": "В лифте, движущемся вверх с ускорением 2 м/с², стоит человек массой 70 кг. Каков его вес? (g = 10 м/с²)", "options": ["700 Н", "560 Н", "840 Н", "140 Н"], "correct_index": 2, "explanation": "P = m(g + a) = 70·(10 + 2) = 840 Н. При движении вверх с ускорением вес увеличивается (перегрузка).", "topic": "dynamics", "hint": "При ускорении вверх: P = m(g + a)"},
                {"question": "Два тела массами 2 кг и 3 кг связаны нитью через блок. Каково ускорение системы? (g = 10 м/с², трением пренебречь)", "options": ["2 м/с²", "4 м/с²", "6 м/с²", "10 м/с²"], "correct_index": 0, "explanation": "a = (m₂ - m₁)g/(m₁ + m₂) = (3-2)·10/(3+2) = 10/5 = 2 м/с²", "topic": "dynamics", "hint": "Для машины Атвуда: a = Δm·g / Σm"},
                {"question": "Тело покоится на наклонной плоскости с углом 30°. Каков коэффициент трения, если тело на грани скольжения?", "options": ["0,58", "0,50", "0,71", "0,87"], "correct_index": 0, "explanation": "На грани: mg·sin30° = μ·mg·cos30° → μ = tg30° = 1/√3 ≈ 0,58", "topic": "dynamics", "hint": "На грани скольжения: μ = tg(α)"}
            ]
        },
        {
            "chapter_id": ch_ids_mech[2], "course_id": mech_id,
            "title": "Тест: Энергия и импульс",
            "questions": [
                {"question": "Мяч массой 0,5 кг летит горизонтально со скоростью 10 м/с и ударяется о стену, отскакивая с той же скоростью. Чему равен импульс силы, действовавшей на мяч?", "options": ["0 кг·м/с", "5 кг·м/с", "10 кг·м/с", "2,5 кг·м/с"], "correct_index": 2, "explanation": "Δp = m·v₂ - m·v₁ = 0,5·10 - 0,5·(-10) = 5 + 5 = 10 кг·м/с. Импульс изменился на 10 кг·м/с, т.к. направление изменилось!", "topic": "energy", "hint": "При отскоке от стены скорость меняет знак!"},
                {"question": "Снаряд массой 4 кг, летящий со скоростью 200 м/с, разрывается на два осколка. Первый (1 кг) полетел назад со скоростью 100 м/с. Какова скорость второго?", "options": ["300 м/с", "100 м/с", "400 м/с", "≈ 300 м/с"], "correct_index": 0, "explanation": "ЗСИ: 4·200 = 1·(-100) + 3·v₂ → 800 = -100 + 3v₂ → v₂ = 900/3 = 300 м/с", "topic": "energy", "hint": "Закон сохранения импульса: p₀ = p₁ + p₂"},
                {"question": "Шарик массой 200 г падает с высоты 5 м. Какова его кинетическая энергия в момент удара о землю? (g = 10 м/с²)", "options": ["1 Дж", "10 Дж", "5 Дж", "100 Дж"], "correct_index": 1, "explanation": "Eк = mgh = 0,2·10·5 = 10 Дж. По закону сохранения энергии вся потенциальная энергия перешла в кинетическую.", "topic": "energy", "hint": "ЗСЭ: mgh = mv²/2"},
                {"question": "Насос поднимает 500 кг воды на высоту 20 м за 50 секунд. КПД насоса 80%. Какова мощность двигателя? (g = 10 м/с²)", "options": ["2000 Вт", "2500 Вт", "1600 Вт", "4000 Вт"], "correct_index": 1, "explanation": "Полезная работа: A = mgh = 500·10·20 = 100000 Дж. Полная: A/η = 100000/0,8 = 125000 Дж. P = 125000/50 = 2500 Вт", "topic": "energy", "hint": "КПД = полезная работа / затраченная работа"}
            ]
        }
    ]
    for q in quizzes: await db.quizzes.insert_one(q)

    # ── MKT/Thermo chapters ──
    mkt_id = course_ids["Молекулярная физика и термодинамика"]
    mkt_chs = [
        {
            "course_id": mkt_id, "title": "Основные положения МКТ и газовые законы", "order": 1,
            "theory": "**МКТ — три положения:**\n1. Все вещества состоят из частиц\n2. Частицы непрерывно хаотически движутся\n3. Частицы взаимодействуют\n\n**Идеальный газ:** частицы — точки, взаимодействуют только при столкновениях.\n\n**Уравнение состояния:** pV = νRT = (m/M)RT\n\n**Газовые законы (изопроцессы):**\n- Изотерма (T = const): pV = const\n- Изобара (p = const): V/T = const\n- Изохора (V = const): p/T = const",
            "formulas": [
                {"name": "Уравнение Менделеева-Клапейрона", "formula": "pV = νRT", "variables": "ν = m/M, R = 8,314 Дж/(моль·К)", "units": "Па, м³, К"},
                {"name": "Закон Бойля-Мариотта", "formula": "p₁V₁ = p₂V₂", "variables": "T = const", "units": "Па, м³"},
                {"name": "Закон Гей-Люссака", "formula": "V₁/T₁ = V₂/T₂", "variables": "p = const", "units": "м³, К"},
                {"name": "Закон Шарля", "formula": "p₁/T₁ = p₂/T₂", "variables": "V = const", "units": "Па, К"}
            ],
            "key_concepts": ["Диффузия", "Броуновское движение", "Моль", "Число Авогадро", "Изопроцесс"]
        },
        {
            "course_id": mkt_id, "title": "Термодинамика", "order": 2,
            "theory": "**Внутренняя энергия идеального одноатомного газа:** U = 3/2 · νRT\n\n**Первый закон термодинамики:** Q = ΔU + A\n- Q — количество теплоты\n- ΔU — изменение внутренней энергии\n- A — работа газа\n\n**Количество теплоты:**\n- Нагревание: Q = cmΔT\n- Плавление: Q = λm\n- Парообразование: Q = Lm\n\n**КПД теплового двигателя:** η = A/Q₁ = (Q₁ - Q₂)/Q₁\n\n**КПД цикла Карно:** η = 1 - T₂/T₁",
            "formulas": [
                {"name": "Первый закон термодинамики", "formula": "Q = ΔU + A", "variables": "Q — теплота, ΔU — изменение внутр. энергии, A — работа", "units": "Дж"},
                {"name": "Количество теплоты", "formula": "Q = c·m·ΔT", "variables": "c — удельная теплоёмкость, m — масса", "units": "Дж"},
                {"name": "КПД", "formula": "η = A/Q₁ = 1 - Q₂/Q₁", "variables": "Q₁ — от нагревателя, Q₂ — к холодильнику", "units": "безразмерная"}
            ],
            "key_concepts": ["Адиабатный процесс", "Работа газа", "Цикл Карно", "Тепловой двигатель"]
        }
    ]
    for ch in mkt_chs: await db.chapters.insert_one(ch)
    await db.courses.update_one({"_id": ObjectId(mkt_id)}, {"$set": {"chapters_count": 2}})

    # ── Electro chapters ──
    elec_id = course_ids["Электродинамика"]
    elec_chs = [
        {
            "course_id": elec_id, "title": "Электростатика и закон Кулона", "order": 1,
            "theory": "**Электрический заряд** — физическая величина, определяющая электромагнитное взаимодействие.\n\n**Закон Кулона:** F = k·|q₁|·|q₂|/r² (k = 9·10⁹ Н·м²/Кл²)\n\n**Напряжённость поля:** E = F/q = kQ/r²\n\n**Потенциал:** φ = kQ/r\n\n**Работа электрического поля:** A = q(φ₁ - φ₂) = qU\n\n**Конденсатор:** C = q/U, C = ε₀εS/d\nЭнергия: W = CU²/2 = q²/(2C)",
            "formulas": [
                {"name": "Закон Кулона", "formula": "F = k·|q₁|·|q₂|/r²", "variables": "k = 9·10⁹ Н·м²/Кл²", "units": "Н"},
                {"name": "Напряжённость", "formula": "E = kQ/r²", "variables": "Q — заряд, r — расстояние", "units": "В/м"},
                {"name": "Ёмкость конденсатора", "formula": "C = ε₀εS/d", "variables": "S — площадь, d — расстояние", "units": "Ф"}
            ],
            "key_concepts": ["Заряд", "Проводник", "Диэлектрик", "Суперпозиция полей"]
        },
        {
            "course_id": elec_id, "title": "Постоянный ток и электрические цепи", "order": 2,
            "theory": "**Закон Ома для участка:** I = U/R\n**Закон Ома для полной цепи:** I = ε/(R + r)\n\n**Последовательное соединение:** R = R₁ + R₂, I = const, U = U₁ + U₂\n**Параллельное:** 1/R = 1/R₁ + 1/R₂, U = const, I = I₁ + I₂\n\n**Мощность:** P = UI = I²R = U²/R\n**Работа тока:** A = UIt = I²Rt\n\n**Закон Джоуля-Ленца:** Q = I²Rt",
            "formulas": [
                {"name": "Закон Ома (участок)", "formula": "I = U/R", "variables": "U — напряжение, R — сопротивление", "units": "А, В, Ом"},
                {"name": "Закон Ома (полная цепь)", "formula": "I = ε/(R + r)", "variables": "ε — ЭДС, r — внутреннее сопротивление", "units": "А"},
                {"name": "Мощность", "formula": "P = U·I = I²R", "variables": "", "units": "Вт"}
            ],
            "key_concepts": ["ЭДС", "Внутреннее сопротивление", "КЗ", "Удельное сопротивление"]
        }
    ]
    for ch in elec_chs: await db.chapters.insert_one(ch)
    await db.courses.update_one({"_id": ObjectId(elec_id)}, {"$set": {"chapters_count": 2}})

    # ── EXAM VARIANTS (original, based on ЦТ/ЦЭ structure) ──
    exam_v1 = {
        "title": "Пробный вариант ЦТ №1",
        "description": "30 заданий в формате ЦТ: 10 часть А + 20 часть Б",
        "time_limit": 210,
        "order": 1,
        "questions": [
            # Part A (10 questions)
            {"question": "Проекция вектора перемещения тела на ось Ox равна -8 м, а на ось Oy равна 6 м. Модуль перемещения равен:", "options": ["2 м", "14 м", "10 м", "48 м", "100 м"], "correct_index": 2, "explanation": "|S| = √(8² + 6²) = √(64+36) = √100 = 10 м", "topic": "Кинематика", "part": "A"},
            {"question": "На рисунке изображён график зависимости координаты тела от времени. Скорость тела в момент t = 3 с равна:", "options": ["0 м/с", "2 м/с", "4 м/с", "6 м/с", "-2 м/с"], "correct_index": 1, "explanation": "Скорость определяется наклоном графика x(t). На участке 2-4 с: v = Δx/Δt = (8-4)/(4-2) = 2 м/с", "topic": "Кинематика", "part": "A"},
            {"question": "Тело массой 2 кг движется по горизонтальной поверхности под действием силы 10 Н, направленной горизонтально. Коэффициент трения 0,3. Ускорение тела равно (g = 10 м/с²):", "options": ["2 м/с²", "5 м/с²", "3 м/с²", "8 м/с²", "1 м/с²"], "correct_index": 0, "explanation": "a = (F - μmg)/m = (10 - 0,3·2·10)/2 = (10-6)/2 = 2 м/с²", "topic": "Динамика", "part": "A"},
            {"question": "Для нагревания 2 кг воды от 20°C до 70°C требуется количество теплоты (с = 4200 Дж/(кг·°C)):", "options": ["420 кДж", "84 кДж", "588 кДж", "168 кДж", "210 кДж"], "correct_index": 0, "explanation": "Q = cmΔT = 4200·2·50 = 420000 Дж = 420 кДж", "topic": "Термодинамика", "part": "A"},
            {"question": "Идеальный газ находится при температуре 300 К и давлении 2 атм. Если объём уменьшить вдвое, а температуру увеличить до 600 К, давление станет:", "options": ["2 атм", "4 атм", "8 атм", "1 атм", "6 атм"], "correct_index": 2, "explanation": "pV/T = const → p₂ = p₁·(V₁/V₂)·(T₂/T₁) = 2·2·2 = 8 атм", "topic": "МКТ", "part": "A"},
            {"question": "Единица измерения электрической ёмкости в СИ:", "options": ["Генри", "Тесла", "Фарад", "Вебер", "Ом"], "correct_index": 2, "explanation": "Электрическая ёмкость измеряется в фарадах (Ф)", "topic": "Электростатика", "part": "A"},
            {"question": "Два резистора R₁ = 6 Ом и R₂ = 3 Ом соединены параллельно. Общее сопротивление равно:", "options": ["9 Ом", "2 Ом", "3 Ом", "18 Ом", "0,5 Ом"], "correct_index": 1, "explanation": "1/R = 1/6 + 1/3 = 1/6 + 2/6 = 3/6 = 1/2 → R = 2 Ом", "topic": "Электрические цепи", "part": "A"},
            {"question": "Прямолинейный проводник с током создаёт магнитное поле. При удвоении силы тока и удвоении расстояния от проводника индукция магнитного поля:", "options": ["не изменится", "увеличится в 2 раза", "уменьшится в 2 раза", "увеличится в 4 раза", "уменьшится в 4 раза"], "correct_index": 0, "explanation": "B = μ₀I/(2πr). При I→2I, r→2r: B' = μ₀·2I/(2π·2r) = μ₀I/(2πr) = B. Не изменится.", "topic": "Магнетизм", "part": "A"},
            {"question": "Дифракция света на щели наблюдается, когда размер щели:", "options": ["много больше длины волны", "сопоставим с длиной волны", "равен нулю", "не зависит от длины волны", "больше 1 мм"], "correct_index": 1, "explanation": "Дифракция наблюдается, когда размер препятствия сопоставим с длиной волны.", "topic": "Оптика", "part": "A"},
            {"question": "Ядро изотопа ¹⁴₆C содержит:", "options": ["6 протонов и 6 нейтронов", "6 протонов и 8 нейтронов", "14 протонов и 6 нейтронов", "8 протонов и 6 нейтронов", "6 протонов и 14 нейтронов"], "correct_index": 1, "explanation": "Z = 6 (протоны), N = A - Z = 14 - 6 = 8 (нейтроны)", "topic": "Ядерная физика", "part": "A"},
        ]
    }
    await db.exam_variants.insert_one(exam_v1)

    logger.info("Seeded school + exam paths, chapters, quizzes, and exam variants")

@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await seed_admin()
    await seed_courses()
    await seed_learning_methodology(db)
    memory_dir = ROOT_DIR.parent / "memory"
    memory_dir.mkdir(exist_ok=True)
    with open(memory_dir / "test_credentials.md", "w", encoding="utf-8") as f:
        f.write("# Test Credentials\n\n## Admin\n- Email: admin@physicslab.com\n- Password: admin123\n- Role: admin\n\n## Test Student\n- Email: student@test.com\n- Password: student123\n\n## Auth Endpoints\n- POST /api/auth/register\n- POST /api/auth/login\n- POST /api/auth/logout\n- GET /api/auth/me\n")
    logger.info("PhysicsLab backend started")

@app.on_event("shutdown")
async def shutdown(): client.close()

app.include_router(api_router)
frontend_origins = {
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    os.environ.get("FRONTEND_URL", "http://localhost:3000"),
}
app.add_middleware(
    CORSMiddleware,
    allow_origins=sorted(frontend_origins),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
