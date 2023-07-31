from django.db import models


class OrderStatus(models.TextChoices):
    PENDING = ("P", "Pending")
    ADDED = ("A", "Added")


# Create your models here.
class Order(models.Model):
    class OrderType(models.TextChoices):
        ASAP = ("A", "ASAP")
        FUTURE = ("F", "Future")

    order_status = models.CharField(
        max_length=2, default=OrderStatus.PENDING, choices=OrderStatus.choices
    )
    order_no = models.CharField(max_length=20)
    order_type = models.CharField(max_length=2, choices=OrderType.choices)
    order_datetime = models.DateTimeField(auto_now_add=True)
    pickup_date = models.DateField()
    pickup_time = models.TimeField()
    payment_paid = models.BooleanField(default=True)
    payment_method = models.CharField(max_length=120)
    transaction_id = models.CharField(max_length=50)
    transaction_amount = models.DecimalField(max_digits=10, decimal_places=2)
    client_name = models.CharField(max_length=255)
    client_address = models.CharField(max_length=300)
    client_phone = models.CharField(max_length=20)
    client_email = models.CharField(max_length=120)
    order_sub_total = models.DecimalField(max_digits=10, decimal_places=2)
    order_tax = models.DecimalField(max_digits=10, decimal_places=2)
    order_tip = models.DecimalField(max_digits=10, decimal_places=2)
    order_total = models.DecimalField(max_digits=10, decimal_places=2)
    payment_remarks = models.CharField(max_length=200, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.client_name} for {self.pickup_date}-{self.pickup_time}"


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order, related_name="order_items", on_delete=models.CASCADE
    )
    quantity = models.CharField(max_length=300)
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    qty_x_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.order}- Item"
