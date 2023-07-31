from django.contrib import admin

from .models import Order, OrderItem

# Register your models here.


@admin.register(Order)
class OrdersAdmin(admin.ModelAdmin):
    ...


@admin.register(OrderItem)
class OrdersItemAdmin(admin.ModelAdmin):
    ...
