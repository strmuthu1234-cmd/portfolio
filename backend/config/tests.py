"""End-to-end API checks: permissions, JWT flow, CRUD and validation."""
from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import override_settings
from rest_framework.test import APITestCase

EMP = {
    "name": "Test User", "email": "test.user@example.com", "department": "IT",
    "designation": "Developer", "status": "active", "join_date": "2024-01-01",
}


@override_settings(ALLOWED_HOSTS=["testserver"], EMPLOYEE_DEMO_PUBLIC=True)
class ApiTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("seed_data", verbosity=0)

    def login(self):
        r = self.client.post(
            "/api/auth/login/", {"username": "admin", "password": "ChangeMe123!"}, format="json"
        )
        self.assertEqual(r.status_code, 200, r.data)
        return r.data

    def auth(self, token):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    def test_public_reads(self):
        for url in ["/api/projects/", "/api/skills/", "/api/experience/", "/api/employees/"]:
            r = self.client.get(url)
            self.assertEqual(r.status_code, 200, url)
            self.assertGreater(r.data["count"], 0, url)
        r = self.client.get("/api/projects/human-resource-management-system/")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(len(r.data["architecture"]), 2)

    def test_anonymous_cannot_write(self):
        self.assertEqual(self.client.post("/api/projects/", {"title": "x"}, format="json").status_code, 401)
        self.assertEqual(self.client.get("/api/contact/").status_code, 401)
        self.assertEqual(self.client.get("/api/media/").status_code, 401)

    def test_non_staff_login_rejected(self):
        get_user_model().objects.create_user("bob", password="pass12345!")
        r = self.client.post("/api/auth/login/", {"username": "bob", "password": "pass12345!"}, format="json")
        self.assertEqual(r.status_code, 400)

    def test_jwt_refresh_and_admin_crud(self):
        tokens = self.login()
        r = self.client.post("/api/auth/refresh/", {"refresh": tokens["refresh"]}, format="json")
        self.assertEqual(r.status_code, 200)
        self.assertIn("access", r.data)
        self.auth(tokens["access"])
        r = self.client.post(
            "/api/projects/",
            {"title": "New Project", "short_description": "d", "tech_stack": ["Django"]},
            format="json",
        )
        self.assertEqual(r.status_code, 201, r.data)
        slug = r.data["slug"]
        self.assertEqual(self.client.patch(f"/api/projects/{slug}/", {"featured": True}, format="json").status_code, 200)
        self.assertEqual(self.client.delete(f"/api/projects/{slug}/").status_code, 204)
        self.assertEqual(self.client.get("/api/auth/me/").status_code, 200)

    def test_contact_flow(self):
        bad = self.client.post("/api/contact/", {"name": "a"}, format="json")
        self.assertEqual(bad.status_code, 400)
        self.assertIn("error", bad.data)
        ok = self.client.post(
            "/api/contact/",
            {"name": "A", "email": "a@b.com", "subject": "Hi", "message": "Hello there, nice portfolio"},
            format="json",
        )
        self.assertEqual(ok.status_code, 201, ok.data)
        self.auth(self.login()["access"])
        r = self.client.patch(f"/api/contact/{ok.data['id']}/", {"is_read": True}, format="json")
        self.assertTrue(r.data["is_read"])

    def test_employee_crud_and_validation(self):
        r = self.client.post("/api/employees/", EMP, format="json")
        self.assertEqual(r.status_code, 201, r.data)
        eid = r.data["id"]
        self.assertEqual(self.client.post("/api/employees/", EMP, format="json").status_code, 400)
        self.assertEqual(self.client.patch(f"/api/employees/{eid}/", {"status": "on_leave"}, format="json").status_code, 200)
        self.assertEqual(self.client.get("/api/employees/?status=on_leave").data["count"], 2)
        self.assertEqual(self.client.delete(f"/api/employees/{eid}/").status_code, 204)

    def test_employee_requires_auth_when_not_public(self):
        with override_settings(EMPLOYEE_DEMO_PUBLIC=False):
            self.assertEqual(self.client.get("/api/employees/").status_code, 401)

    def test_docs(self):
        self.assertEqual(self.client.get("/api/schema/").status_code, 200)
        self.assertEqual(self.client.get("/api/docs/").status_code, 200)
