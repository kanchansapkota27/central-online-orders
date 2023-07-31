from dataclasses import dataclass, asdict
from typing import Optional, List
from datetime import date, time, datetime


@dataclass
class OrderItem:
    quantity: int
    name: str
    price: float
    qty_x_price: float

    def to_dict(self):
        return asdict(self)


@dataclass
class Order:
    order_no: str
    order_type: str
    order_datetime: datetime
    pickup_date: date
    pickup_time: time
    payment_paid: bool
    payment_method: str
    transaction_id: str
    transaction_amount: float
    client_name: str
    client_address: str
    client_phone: str
    client_email: str
    order_sub_total: float
    order_tax: float
    order_tip: float
    order_total: float
    order_items: List[OrderItem]
    payment_remarks: Optional[str] = None

    def to_dict(self):
        return asdict(self)

    def orders_dict_only(self):
        all_dict = asdict(self)
        all_dict.pop("order_items")
        return all_dict
