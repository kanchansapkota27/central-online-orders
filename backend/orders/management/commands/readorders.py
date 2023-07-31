from django.core.management.base import BaseCommand
from orders.models import Order, OrderItem
from utils.mailParser import parse_mail_html
from imap_tools import MailBox, AND, AND
from datetime import datetime
from django.conf import settings


class Command(BaseCommand):
    help = "Closes the specified poll for voting"

    def add_arguments(self, parser):
        default_date = datetime.today().date().strftime("%Y-%m-%d")
        parser.add_argument("date", type=str, nargs="?", default=default_date)

    def handle(self, *args, **options):
        args_date = options.get("date")
        datetoday = datetime.today().date()
        if args_date:
            datetoday = datetime.strptime(args_date, "%Y-%m-%d").date()

        with MailBox(settings.ORDERS_IMAP_SERVER).login(
            settings.ORDERS_EMAIL_ID, settings.ORDERS_EMAIL_PASSWORD
        ) as mailbox:
            all_orders_today = []
            for msg in mailbox.fetch(
                AND(subject="Bill Invoice", date=datetoday), reverse=True
            ):
                orders = parse_mail_html(msg.html)
                order_obj, created = Order.objects.update_or_create(
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
                if created:
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
            # return all_orders_today
            self.stdout.write(
                self.style.SUCCESS(f"Successfully gathered orders for {datetoday}")
            )
            self.stdout.write(
                self.style.SUCCESS(f"Found  {len(all_orders_today)} orders")
            )
