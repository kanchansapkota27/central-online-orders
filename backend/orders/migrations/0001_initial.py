# Generated by Django 4.2 on 2023-04-29 15:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Order",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "order_status",
                    models.CharField(
                        choices=[("P", "Pending"), ("A", "Added"), ("D", "Picked Up")],
                        default="P",
                        max_length=2,
                    ),
                ),
                ("order_no", models.CharField(max_length=20)),
                (
                    "order_type",
                    models.CharField(
                        choices=[("A", "ASAP"), ("F", "Future")], max_length=2
                    ),
                ),
                ("order_datetime", models.DateTimeField(auto_now_add=True)),
                ("pickup_date", models.DateField()),
                ("pickup_time", models.TimeField()),
                ("payment_paid", models.BooleanField(default=True)),
                ("payment_method", models.CharField(max_length=120)),
                ("transaction_id", models.CharField(max_length=50)),
                (
                    "transaction_amount",
                    models.DecimalField(decimal_places=2, max_digits=10),
                ),
                ("client_name", models.CharField(max_length=255)),
                ("client_address", models.CharField(max_length=300)),
                ("client_phone", models.CharField(max_length=20)),
                ("client_email", models.CharField(max_length=120)),
                (
                    "order_sub_total",
                    models.DecimalField(decimal_places=2, max_digits=10),
                ),
                ("order_tax", models.DecimalField(decimal_places=2, max_digits=10)),
                ("order_tip", models.DecimalField(decimal_places=2, max_digits=10)),
                ("order_total", models.DecimalField(decimal_places=2, max_digits=10)),
                (
                    "payment_remarks",
                    models.CharField(blank=True, max_length=200, null=True),
                ),
            ],
        ),
        migrations.CreateModel(
            name="OrderItem",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("quantity", models.CharField(max_length=300)),
                ("name", models.IntegerField()),
                ("price", models.DecimalField(decimal_places=2, max_digits=10)),
                ("qty_x_price", models.DecimalField(decimal_places=2, max_digits=10)),
                (
                    "order",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="ordered_items",
                        to="orders.order",
                    ),
                ),
            ],
        ),
    ]
