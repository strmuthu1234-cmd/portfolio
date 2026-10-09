from datetime import date

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from employees.models import Employee
from portfolio.models import Experience, Skill
from projects.models import Project

SKILLS = {
    "frontend": ["React.js", "JavaScript", "HTML5", "CSS3"],
    "backend": ["Python", "Django", "Django REST Framework", "Flask", "REST APIs", "JWT"],
    "database": ["PostgreSQL", "MySQL"],
    "cloud_tools": ["AWS S3", "Git", "GitHub", "GitLab", "Postman", "FileZilla"],
    "automation_ai": ["n8n", "Claude", "Google Gemini", "OpenClaw", "NotebookLM"],
    "core": ["Authentication", "Authorization", "CRUD Operations", "API Integration",
             "Workflow Automation", "RBAC"],
}

EXPERIENCE = {
    "company": "Beeyoond Gaming (Sportstech GmbH, Germany)",
    "role": "Junior Backend & Python Developer (Full Stack)",
    "start_date": date(2025, 7, 1),
    "is_current": True,
    "description": "\n".join([
        "Developed full-stack applications using Python, Django, DRF, React.js, and REST APIs",
        "Built and maintained HRM modules",
        "Integrated biometric attendance devices",
        "Developed email templates and newsletter systems",
        "Worked on interactive 3D product visualization",
        "Supported React-based web applications",
    ]),
}

PROJECTS = [
    {
        "title": "Human Resource Management System",
        "slug": "human-resource-management-system",
        "short_description": "Full-stack HRM platform with JWT auth, RBAC, biometric attendance and payslip logic.",
        "full_description": (
            "Full-stack HRM application built using Django, Django REST Framework, React.js, "
            "PostgreSQL, JWT Authentication, RBAC, and Postman. Covers the employee lifecycle "
            "from onboarding and attendance to leave, assets and salary slips, with biometric "
            "devices feeding attendance directly into the backend."
        ),
        "tech_stack": ["Django", "DRF", "React.js", "PostgreSQL", "JWT", "RBAC", "Postman"],
        "features": [
            "Employee Management", "Attendance", "Leave Management", "Asset Management",
            "Payslip", "Configuration", "JWT Login", "RBAC", "Biometric Integration",
            "Late-coming automation", "Salary slip logic",
        ],
        "architecture": [
            {"title": "System architecture",
             "steps": ["React.js", "REST API", "Django REST Framework", "PostgreSQL"]},
            {"title": "Biometric flow",
             "steps": ["Biometric Device", "IP Connection", "Python / Django",
                       "Employee ID Mapping", "Attendance Processing", "PostgreSQL"]},
        ],
        "featured": True, "order": 1,
    },
    {
        "title": "Newsletter Email Template System",
        "slug": "newsletter-email-template-system",
        "short_description": "Responsive HTML/CSS email templates tested across Gmail, Outlook and mobile clients.",
        "full_description": (
            "Responsive email template system built using HTML and CSS for Gmail, Outlook, "
            "and mobile email clients."
        ),
        "tech_stack": ["HTML", "CSS"],
        "features": ["Responsive email templates", "Cross-client compatibility",
                     "Reusable branding", "Bulk campaign support", "Mobile optimization"],
        "architecture": [], "featured": False, "order": 2,
    },
    {
        "title": "Email Automation R&D",
        "slug": "email-automation-rnd",
        "short_description": "Automated newsletter generation workflow using n8n and Python.",
        "full_description": "Automated newsletter generation workflow using n8n and Python.",
        "tech_stack": ["n8n", "Python", "HTML"],
        "features": ["Automated newsletter generation", "Workflow automation",
                     "Reduced manual work", "Reusable automation steps"],
        "architecture": [{"title": "Automation flow",
                          "steps": ["Content Input", "n8n Workflow", "Template Processing",
                                    "HTML Email", "Campaign Output"]}],
        "featured": False, "order": 3,
    },
    {
        "title": "360-Degree Product Viewer",
        "slug": "360-degree-product-viewer",
        "short_description": "Interactive 3D panoramic product viewer with 12+ animation states.",
        "full_description": (
            "Interactive 3D panoramic product viewer using JavaScript, HTML, and CSS."
        ),
        "tech_stack": ["JavaScript", "HTML", "CSS", "WebGL"],
        "features": ["360-degree product interaction", "12+ animation states",
                     "Click-to-animate controls", "Interactive buttons",
                     "WebGL optimization", "Product visualization"],
        "architecture": [], "featured": False, "order": 4,
    },
    {
        "title": "Interactive 3D Room Planner",
        "slug": "interactive-3d-room-planner",
        "short_description": "React-based room planning tool with drag-and-position product placement.",
        "full_description": "React-based interactive room planning tool.",
        "tech_stack": ["React.js", "JavaScript"],
        "features": ["Add products to room", "Drag / position products", "Product placement",
                     "Interactive layout editing", "React-based UI", "Real-time visual planning"],
        "architecture": [], "featured": False, "order": 5,
    },
]

EMPLOYEES = [
    ("Aarav Sharma", "Engineering", "Backend Developer", "active", date(2023, 2, 14)),
    ("Priya Nair", "Engineering", "Frontend Developer", "active", date(2023, 6, 1)),
    ("Karthik Raja", "Engineering", "QA Engineer", "on_leave", date(2024, 1, 8)),
    ("Meera Iyer", "Human Resources", "HR Executive", "active", date(2022, 9, 19)),
    ("Rohan Verma", "Human Resources", "Recruiter", "active", date(2024, 3, 11)),
    ("Sneha Patel", "Finance", "Payroll Analyst", "active", date(2022, 11, 7)),
    ("Vikram Singh", "Operations", "Operations Manager", "active", date(2021, 5, 24)),
    ("Divya Menon", "Design", "UI/UX Designer", "active", date(2023, 8, 30)),
    ("Arjun Das", "Marketing", "Campaign Specialist", "inactive", date(2022, 4, 4)),
    ("Lakshmi Narayan", "Support", "Support Lead", "active", date(2021, 12, 13)),
]


class Command(BaseCommand):
    help = "Seed sample portfolio content and the admin user (idempotent)."

    def handle(self, *args, **options):
        User = get_user_model()
        admin, created = User.objects.get_or_create(
            username=settings.SEED_ADMIN_USERNAME,
            defaults={"email": settings.SEED_ADMIN_EMAIL, "is_staff": True, "is_superuser": True},
        )
        if created:
            admin.set_password(settings.SEED_ADMIN_PASSWORD)
            admin.save()
        self.stdout.write(f"Admin user '{admin.username}' {'created' if created else 'exists'}.")

        for category, names in SKILLS.items():
            for i, name in enumerate(names):
                Skill.objects.get_or_create(
                    name=name, category=category,
                    defaults={"proficiency": max(60, 90 - i * 4), "icon": name.lower()},
                )

        Experience.objects.get_or_create(
            company=EXPERIENCE["company"], role=EXPERIENCE["role"], defaults=EXPERIENCE
        )

        for data in PROJECTS:
            Project.objects.update_or_create(slug=data["slug"], defaults=data)

        for name, dept, desig, status, joined in EMPLOYEES:
            email = name.lower().replace(" ", ".") + "@example.com"
            Employee.objects.get_or_create(
                email=email,
                defaults={"name": name, "department": dept, "designation": desig,
                          "status": status, "join_date": joined},
            )

        self.stdout.write(self.style.SUCCESS("Seed data loaded."))
