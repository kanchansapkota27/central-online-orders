# Generated by Django 4.2 on 2023-04-29 15:28

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("orders", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="orderitem",
            name="name",
            field=models.CharField(max_length=200),
        ),
    ]
