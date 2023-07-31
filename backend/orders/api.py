from ninja import Router
from imap_tools import MailBox, AND, AND
from datetime import datetime, timedelta
from django.conf import settings
from utils.mailParser import parse_mail_html
from .models import Order, OrderItem
from ninja_jwt.authentication import JWTAuth
from django.db.models import Sum, Count,F
from typing import List
from .schemas import OrderSchema, UpdateOrderStatusIn, UpdateOrderStatusOut,DashboardSchema,Status
from ninja_jwt.authentication import JWTAuth
from ninja.pagination import paginate
from utils.pagination import CustomPagination

router = Router(auth=JWTAuth())

def get_diff_percent(yesterday_value, today_value):
    """Helper to calculate diff percentage"""
    if yesterday_value == 0 and today_value == 0:
        return 0

    if yesterday_value <= 0 and today_value > 0:
        return round(100 * today_value, 2)
      
    return round((abs(today_value - yesterday_value) / yesterday_value) * 100, 2)


@router.get('/sum_analysis',response=DashboardSchema)
def sales_summary(request):
    """Return sales summary"""
    
    # Calculate dates
    today = datetime.now().date() 
    yesterday = today - timedelta(days=1)

    # Get totals
    total_orders = Order.objects.count()
    total_sales = Order.objects.aggregate(total=Sum("order_total"))["total"]
    total_sales=round(total_sales,2)
    
    # Get yesterday totals
    yesterday_orders = Order.objects.filter(pickup_date=yesterday)
    yesterday_orders_count = yesterday_orders.count()
    yesterday_sales = yesterday_orders.aggregate(total=Sum("order_total"))["total"] or 0
    yesterday_sales=round(yesterday_sales,2)

    # Get today totals
    today_orders = Order.objects.filter(pickup_date=today)
    today_orders_count = today_orders.count()
    today_sales = today_orders.aggregate(total=Sum("order_total"))["total"] or 0
    today_sales=round(today_sales,2)

    # Calculate differences
    orders_diff = today_orders_count - yesterday_orders_count
    sales_diff = today_sales - yesterday_sales

    orders_diff_percent = get_diff_percent(yesterday_orders_count, today_orders_count)
    sales_diff_percent = get_diff_percent(yesterday_sales, today_sales)

    top_customers = (
    Order.objects.values('client_name')
    .annotate(
        client_email=F('client_email'),
        client_phone=F('client_phone'),
    )
    .annotate(total=Count('id'))
    .order_by('-total')
    )[:5]



    return {
        "total_orders": total_orders,
        "total_sales": total_sales,
        "yesterday": {
            "orders": yesterday_orders_count,
            "sales": yesterday_sales
        },
        "today": {
            "orders": today_orders_count,
            "sales": today_sales
        },
        "diff": {
            "orders": {
                "status":Status.UP if orders_diff >=0 else Status.DOWN,
                "value": orders_diff,
                "percent": orders_diff_percent
            },
            "sales": {
                "status":Status.UP if sales_diff >=0 else Status.DOWN,
                "value": sales_diff,
                "percent": sales_diff_percent
            }
        },
        "top_customers": list(top_customers)
    }



@router.get("/today", response=List[OrderSchema])  # auth=JWTAuth())
def get_today_orders(request):
    datetoday = datetime.today().date()
    orders = Order.objects.filter(pickup_date=datetoday).prefetch_related("order_items")
    return orders.all().order_by("-order_datetime", "-updated_at")


@router.get("/all", response=List[OrderSchema])  # auth=JWTAuth())
@paginate(CustomPagination)
def get_all_orders(request):
    orders = Order.objects.all().order_by("-order_datetime", "-updated_at")
    return orders


@router.post("/update-order", response=UpdateOrderStatusOut)
def update_order_status(request, payload: UpdateOrderStatusIn):
    order = Order.objects.filter(order_no=payload.order_no)
    if order.exists():
        one_order = order.first()
        order.update(order_status=payload.order_status)
        return UpdateOrderStatusOut(
            status_ok=True,
            order_no=one_order.order_no,
            updated_status=one_order.order_status,
            message="Updated",
        )
    return UpdateOrderStatusOut(
        status_ok=False, order_no="", updated_status="P", message="Order not found"
    )


@router.get("/live", response=List[OrderSchema])  # auth=JWTAuth())
def get_live_orders(request):
    datetoday = datetime.today().date()
    with MailBox(settings.ORDERS_IMAP_SERVER).login(
        settings.ORDERS_EMAIL_ID, settings.ORDERS_EMAIL_PASSWORD
    ) as mailbox:
        all_orders_today = []
        for msg in mailbox.fetch(AND(subject="Bill Invoice"), reverse=True):
            orders = parse_mail_html(msg.html)
            order_obj, _ = Order.objects.update_or_create(
                order_no=orders.order_no,
                defaults={
                    "order_type": orders.order_type,
                    "order_datetime": orders.order_datetime,
                    "pickup_date": orders.pickup_date,
                    "pickup_time": orders.pickup_time,
                    "payment_paid": orders.payment_paid,
                    "payment_method": orders.payment_method,
                    "transaction_id": orders.transaction_id,
                    "transaction_amount": orders.transaction_amount,
                    "client_name": orders.client_name,
                    "client_address": orders.client_address,
                    "client_phone": orders.client_phone,
                    "client_email": orders.client_email,
                    "order_sub_total": orders.order_sub_total,
                    "order_tax": orders.order_tax,
                    "order_tip": orders.order_tip,
                    "order_total": orders.order_total,
                    "payment_remarks": orders.payment_remarks,
                },
            )
            order_items = orders.order_items
            for item in order_items:
                order_item = OrderItem.objects.update_or_create(
                    order=order_obj,
                    name=item.name,
                    qty_x_price=item.qty_x_price,
                    defaults={
                        "quantity": item.quantity,
                        "name": item.name,
                        "price": item.price,
                        "qty_x_price": item.qty_x_price,
                    },
                )
            all_orders_today.append(orders.to_dict())
    orders = Order.objects.filter(pickup_date=datetoday).prefetch_related("order_items")
    return orders.all()
