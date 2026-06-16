"""PhysicsLab backend API tests"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s

@pytest.fixture(scope="module")
def auth_session():
    """Session with logged-in user (use admin which is guaranteed to work)"""
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    resp = s.post(f"{BASE_URL}/api/auth/login", json={"email": "admin@physicslab.com", "password": "admin123"})
    assert resp.status_code == 200, f"Admin login failed: {resp.text}"
    return s

# ─── Auth Tests ───
class TestAuth:
    """Auth endpoint tests"""

    def test_register_new_user(self, session):
        import time
        email = f"new_user_{int(time.time())}@test.com"
        resp = session.post(f"{BASE_URL}/api/auth/register", json={"email": email, "password": "pass1234", "name": "New User"})
        assert resp.status_code == 200
        data = resp.json()
        assert "email" in data
        assert data["email"] == email

    def test_register_duplicate_email(self):
        """Test duplicate email returns 400"""
        import time
        s = requests.Session()
        s.headers.update({"Content-Type": "application/json"})
        email = f"dup_{int(time.time())}@test.com"
        # First registration should succeed
        r1 = s.post(f"{BASE_URL}/api/auth/register", json={"email": email, "password": "pass1234", "name": "Dup"})
        assert r1.status_code == 200
        # Second registration with same email should fail
        r2 = s.post(f"{BASE_URL}/api/auth/register", json={"email": email, "password": "pass1234", "name": "Dup"})
        assert r2.status_code == 400, f"Expected 400 for duplicate, got {r2.status_code}: {r2.text}"

    def test_login_success(self, session):
        resp = session.post(f"{BASE_URL}/api/auth/login", json={"email": "admin@physicslab.com", "password": "admin123"})
        assert resp.status_code == 200
        data = resp.json()
        assert "email" in data
        assert data["email"] == "admin@physicslab.com"

    def test_login_wrong_password(self, session):
        resp = session.post(f"{BASE_URL}/api/auth/login", json={"email": "admin@physicslab.com", "password": "wrong"})
        assert resp.status_code == 401

    def test_me_authenticated(self, auth_session):
        resp = auth_session.get(f"{BASE_URL}/api/auth/me")
        assert resp.status_code == 200
        data = resp.json()
        assert "email" in data

    def test_me_unauthenticated(self):
        s = requests.Session()
        resp = s.get(f"{BASE_URL}/api/auth/me")
        assert resp.status_code == 401

# ─── Course Tests ───
class TestCourses:
    """Course endpoint tests"""

    def test_get_courses(self, session):
        resp = session.get(f"{BASE_URL}/api/courses")
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, list)
        assert len(data) == 9, f"Expected 6 school courses + 3 exam courses, got {len(data)}"
        paths = {course.get("path") for course in data}
        assert {"school", "exam"}.issubset(paths)

    def test_course_fields(self, session):
        resp = session.get(f"{BASE_URL}/api/courses")
        courses = resp.json()
        for c in courses:
            assert "title" in c
            assert "_id" in c

    def test_get_course_detail(self, session):
        courses = session.get(f"{BASE_URL}/api/courses").json()
        mechanic = next((c for c in courses if "Механика" in c["title"]), None)
        assert mechanic is not None
        resp = session.get(f"{BASE_URL}/api/courses/{mechanic['_id']}")
        assert resp.status_code == 200
        data = resp.json()
        assert "course" in data
        assert "chapters" in data
        assert len(data["chapters"]) >= 3

    def test_course_not_found(self, session):
        resp = session.get(f"{BASE_URL}/api/courses/000000000000000000000000")
        assert resp.status_code == 404

# ─── Chapter Tests ───
class TestChapters:
    """Chapter endpoint tests"""

    @pytest.fixture(scope="class")
    def mechanics_chapter_id(self, session):
        courses = session.get(f"{BASE_URL}/api/courses").json()
        mech = next((c for c in courses if "Механика" in c["title"]), None)
        detail = session.get(f"{BASE_URL}/api/courses/{mech['_id']}").json()
        return detail["chapters"][0]["_id"]

    def test_get_chapter(self, session, mechanics_chapter_id):
        resp = session.get(f"{BASE_URL}/api/chapters/{mechanics_chapter_id}")
        assert resp.status_code == 200
        data = resp.json()
        assert "chapter" in data
        assert "quiz" in data
        chapter = data["chapter"]
        assert "title" in chapter
        assert "theory" in chapter
        assert "formulas" in chapter

    def test_chapter_has_quiz(self, session, mechanics_chapter_id):
        resp = session.get(f"{BASE_URL}/api/chapters/{mechanics_chapter_id}")
        data = resp.json()
        assert data["quiz"] is not None
        quiz = data["quiz"]
        assert "questions" in quiz
        assert len(quiz["questions"]) >= 1

# ─── Quiz Tests ───
class TestQuiz:
    """Quiz submission tests"""

    def test_submit_quiz_requires_auth(self, auth_session):
        """Get valid quiz ID and try without auth"""
        courses = auth_session.get(f"{BASE_URL}/api/courses").json()
        mech = next((c for c in courses if "Механика" in c["title"]), None)
        detail = auth_session.get(f"{BASE_URL}/api/courses/{mech['_id']}").json()
        chapter_id = detail["chapters"][0]["_id"]
        chapter_data = auth_session.get(f"{BASE_URL}/api/chapters/{chapter_id}").json()
        quiz_id = chapter_data["quiz"]["_id"]
        # Now try without auth
        s = requests.Session()
        resp = s.post(f"{BASE_URL}/api/quizzes/{quiz_id}/submit", json={"answers": [0]})
        assert resp.status_code == 401

    def test_submit_quiz_authenticated(self, auth_session):
        # Get a quiz id
        courses = auth_session.get(f"{BASE_URL}/api/courses").json()
        mech = next((c for c in courses if "Механика" in c["title"]), None)
        detail = auth_session.get(f"{BASE_URL}/api/courses/{mech['_id']}").json()
        chapter_id = detail["chapters"][0]["_id"]
        chapter_data = auth_session.get(f"{BASE_URL}/api/chapters/{chapter_id}").json()
        quiz = chapter_data["quiz"]
        quiz_id = quiz["_id"]
        num_questions = len(quiz["questions"])
        answers = [0] * num_questions
        resp = auth_session.post(f"{BASE_URL}/api/quizzes/{quiz_id}/submit", json={"answers": answers})
        assert resp.status_code == 200
        data = resp.json()
        assert "score" in data
        assert "total" in data
        assert "xp_earned" in data
        assert "results" in data

# ─── Progress & Leaderboard ───
class TestProgress:
    def test_get_progress_authenticated(self, auth_session):
        resp = auth_session.get(f"{BASE_URL}/api/progress")
        assert resp.status_code == 200
        data = resp.json()
        assert "xp" in data
        assert "level" in data
        assert "progress" in data

    def test_get_progress_unauthenticated(self):
        s = requests.Session()
        resp = s.get(f"{BASE_URL}/api/progress")
        assert resp.status_code == 401

    def test_get_leaderboard(self, session):
        resp = session.get(f"{BASE_URL}/api/leaderboard")
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, list)
