from django.core.management.base import BaseCommand
from django.conf import settings
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = "Closes the specified poll for voting"

    def handle(self, *args, **options):
        username = settings.DJANGO_SU_USERNAME
        email = settings.DJANGO_SU_EMAIL
        password = settings.DJANGO_SU_PASSWORD

        if not User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.NOTICE(
                    f'Creating admin with username "{str(username).upper()}" and email "{str(email).upper()}"'
                )
            )
            admin = User.objects.create_superuser(
                email=email, username=username, password=password
            )
            self.stdout.write(
                self.style.SUCCESS(f"Successfully created an admin user.")
            )

        else:
            self.stdout.write(
                self.style.ERROR("Admin account has already been initialized.")
            )
