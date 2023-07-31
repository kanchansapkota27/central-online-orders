from huey import crontab
from huey.contrib.djhuey import periodic_task, task, db_periodic_task

from django.core.management import call_command


# @huey.db_task()
# def load_orders():
#     ...


@db_periodic_task(crontab(minute="*/2"))
def read_mail_orders():
    print("Huey calling to read orders from email")
    call_command("readorders")
