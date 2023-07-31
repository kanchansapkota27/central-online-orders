from parsel import Selector
import re
from functools import lru_cache
from datetime import datetime, timedelta


from .orderClasses import Order, OrderItem


EMAIL_REGEX = re.compile(
    r"^[a-zA-Z0-9.!#$%&’*+=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"
)


@lru_cache(maxsize=16)
def normalize_amount(string: str):
    return float(re.sub("[^0-9.]", "", str(string)))


def filter_user_data(data):
    clean_d = data.replace(":", "").strip().lower()
    if len(clean_d) < 2:
        return False
    if clean_d in ["phone", "email"]:
        return False
    return True


@lru_cache(maxsize=16)
def parse_mail_html(html_content: str):
    parselhtml = Selector(html_content)
    all_tables = parselhtml.css("table")

    order_type_table = all_tables[2]
    order_type_tables_content = order_type_table.css("span ::text").get()
    order_type = (
        order_type_tables_content.strip("[").strip("]")
        if order_type_tables_content
        else ""
    )

    details_table = all_tables[3]
    user_table = details_table.css("tr")[1]
    details_table_data = details_table.css("tr ::text").getall()

    # print(details_table_data[1].get(),details_table_data[0].get(),details_table_data[2].get())
    user_info_tr = user_table.css("td *::text").getall()
    # emails=list(filter(EMAIL_REGEX.match,user_info_tr))
    user_data = list(filter(filter_user_data, user_info_tr))

    client_name = user_data[0]
    client_address = ",".join(user_data[1:-2])
    client_phone = user_data[-2]
    client_email = user_data[-1]

    if "future" in order_type.lower().strip():
        # print("Is Future Order")
        # print(details_table_data)
        order_type = "F"
        pickup_date_raw = details_table_data[1]
        pickup_date = datetime.strptime(pickup_date_raw, "%m/%d/%Y").date()
        pickup_time_raw = details_table_data[3]
        pickup_time = datetime.strptime(pickup_time_raw, "%I:%M %p").time()
        payment_raw = details_table_data[5]
        payment_paid = True if payment_raw.strip().lower() == "paid" else False
        order_no = details_table_data[7]
        order_date_raw = details_table_data[8].split(":", maxsplit=1)[-1].strip()
        order_date = datetime.strptime(order_date_raw, "%A, %B %d, %Y %I:%M %p")
        payment_method = details_table_data[9].split(":")[-1].strip()
        transaction_id = details_table_data[11]
        transaction_amount_raw = details_table_data[12].split(":")[-1].strip()
        transaction_amount = float(normalize_amount(transaction_amount_raw))
    else:
        # print("Is ASAP Order:")
        # print(details_table_data)
        order_type = "A"
        order_date_raw = details_table_data[4].split(":", maxsplit=1)[-1].strip()
        order_date = datetime.strptime(order_date_raw, "%A, %B %d, %Y %I:%M %p")
        pickup_date = order_date.date()
        pickup_time = (order_date + timedelta(minutes=20)).time()
        payment_raw = details_table_data[1]
        payment_paid = True if payment_raw.strip().lower() == "paid" else False
        order_no = details_table_data[3]
        payment_method = details_table_data[5].split(":")[-1].strip()
        transaction_id = details_table_data[7]
        transaction_amount_raw = details_table_data[8].split(":")[-1].strip()
        transaction_amount = float(normalize_amount(transaction_amount_raw))

    orders_list_table = all_tables[4]
    all_order_items = []
    sub_total = None
    tax = None
    tip = None
    total = None

    order_items = orders_list_table.css("tr")
    order_items_only, calculated_items = order_items[1:-4], order_items[-4:]
    for order_item in order_items_only:
        order_item_cols = order_item.css("td  *::text").getall()
        # print(order_item_cols)
        if len(order_item_cols) > 5:
            order_item_cols[1:-3] = [",".join(order_item_cols[1:-3])]
        _, name, raw_price, qty, raw_qty_x_price = order_item_cols
        price = normalize_amount(raw_price)
        qty_x_price = normalize_amount(raw_qty_x_price)
        order_item_obj = OrderItem(
            quantity=int(qty),
            name=name,
            price=float(price),
            qty_x_price=float(qty_x_price),
        )
        all_order_items.append(order_item_obj)

    sub_total = calculated_items[0].css("td ::text").getall()[-1]
    sub_total = normalize_amount(sub_total)
    tax = calculated_items[1].css("td ::text").getall()[-1]
    tax = normalize_amount(tax)
    tip = calculated_items[2].css("td span ::text").get()
    tip = normalize_amount(tip) if tip else 0
    total = calculated_items[3].css("td ::text").getall()[-1]
    total = normalize_amount(total)

    payments_table = all_tables[-1]
    payment_remarks = payments_table.css("tr td ::text").re(r"Payment Info:\s*(.*)")[0]
    # print(payment_remarks)

    order_obj = Order(
        order_no=order_no,
        order_type=order_type,
        order_datetime=order_date,
        pickup_date=pickup_date,
        pickup_time=pickup_time,
        payment_paid=payment_paid,
        payment_method=payment_method,
        transaction_id=transaction_id,
        transaction_amount=transaction_amount,
        client_name=client_name,
        client_address=client_address,
        client_phone=client_phone,
        client_email=client_email,
        order_sub_total=sub_total,
        order_tax=tax,
        order_tip=tip,
        order_total=total,
        order_items=all_order_items,
        payment_remarks=payment_remarks,
    )

    return order_obj
